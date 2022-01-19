require('dotenv').config();

const core = require('@actions/core');
const glob = require('@actions/glob');

const PATTERN = core.getInput('PATTERN');
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
const CREDENTIALS = core.getInput('CREDENTIALS');
const STORAGE_ACCOUNT = core.getInput('STORAGE_ACCOUNT');
const STORAGE_CONTAINER = core.getInput('STORAGE_CONTAINER');

const githubClient = require('./github').getClient(GITHUB_TOKEN);
const azureClient = require('./azure').getClient(CREDENTIALS, STORAGE_ACCOUNT, STORAGE_CONTAINER);
const ldClient = require('./living-documentation').getClient(githubClient);

async function run() {
  try {
    const globber = await glob.create(PATTERN);
    const files = await globber.glob();

    const results = await getTestResults(files);

    const buckets = results.map(result => result.bucket);
    await removeBuckets(buckets);

    await uploadTestResults(results);

    const repositories = results
      .map(execution => ({
        owner: execution.git.owner,
        repo: execution.git.repo
      }))

    await triggerLivingDocumentationWorkflows(repositories);
  }
  catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
}

async function getTestResults(files) {
  core.startGroup('Get test results');

  if (files.length === 0) {
    core.warning('No living documentation files found.');
    return;
  }

  core.debug(`${files.length} living documentation files found.`);

  const results = [];

  for (const file of files) {
    const ld = await ldClient.parseFile(file);
    
    if (ld.results == undefined || ld.results.file == undefined)
      continue;

    core.debug(`${file} contains a reference to test result file ${ld.results.file}.`);

    if (ld.branches == undefined || ld.branches.length === 0)
      core.warning(`No branches found in repository ${ld.owner}/${ld.repo} for commit ${ld.commit} or release ${ld.release}`);

    for (const branch of ld.branches) {
      core.debug(`Adding test result ${ld.owner}/${ld.repo}/${branch}/${ld.results.type}.`);

      results.push({
        type: ld.results.type,
        file: ld.results.file,
        bucket: `${ld.owner}/${ld.repo}/${branch}`,
        git: {
          owner: ld.owner,
          repo: ld.repo,
          branch: branch
        }
      });
    };
  };

  core.info(`${results.length} test results found.`);

  core.endGroup();

  return results;
}

async function removeBuckets(buckets) {
  core.startGroup('Remove buckets');

  buckets = [...new Map(buckets.map(item => [`${item.bucket}`, item])).values()];

  for (const bucket of buckets) {
    await azureClient.removeBucket(bucket);
  };

  core.info(`${buckets.length} storage buckets removed.`);

  core.endGroup();
}

async function uploadTestResults(results) {
  core.startGroup('Upload test results');

  if (results.length === 0)
    core.warning('No test results found.');

  for (const result of results) {
    await azureClient.upload(`${result.bucket}/${result.type}`, result.file);
  };

  core.info(`${results.length} test results uploaded.`);

  core.endGroup();
}

async function triggerLivingDocumentationWorkflows(repositories) {
  core.startGroup('Trigger workflows');

  repositories = [...new Map(repositories.map(item => [`${item.owner}|${item.repo}`, item])).values()];

  for (const repository of repositories) {
    await githubClient.dispatchEvent(repository.owner, repository.repo, 'test-execution-changed');
  };

  core.info(`${repositories.length} living documentation workflows triggered.`);

  core.endGroup();
}

run();
