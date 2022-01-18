require('dotenv').config();

const core = require('@actions/core');
const glob = require('@actions/glob');

const PATTERN = core.getInput('PATTERN');
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
const AZURE_CREDENTIALS = core.getInput('AZURE_CREDENTIALS');
const AZURE_STORAGE_ACCOUNT = core.getInput('AZURE_STORAGE_ACCOUNT');
const AZURE_STORAGE_CONTAINER = core.getInput('AZURE_STORAGE_CONTAINER');

const githubClient = require('./github').getClient(GITHUB_TOKEN);
const azureClient = require('./azure').getClient(AZURE_CREDENTIALS, AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_CONTAINER);
const ldClient = require('./living-documentation').getClient(githubClient);

async function run() {
  try {
    const globber = await glob.create(PATTERN);
    const files = await globber.glob();

    const executions = await getTestExecutions(files);

    const buckets = executions.map(e => e.bucket);
    await removeBuckets(buckets);

    await uploadTestExecutionFiles(executions);

    const repositories = executions
      .map(e => ({
        owner: e.git.owner,
        repo: e.git.repo
      }))
      
    await triggerLivingDocumentationWorkflows(repositories);
  }
  catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
}

async function getTestExecutions(files) {
  core.startGroup('Get test executions');
  
  if (files.length === 0)
    throw Error('No living documentation files found.');

  core.debug(`${files.length} living documentation files found.`);

  const promisess = files
    .map(async (file) => {
      const ld = await ldClient.parseFile(file);
      core.debug(`${file} contains a reference to test execution file ${ld.execution.file}.`);

      if (ld.branches == undefined || ld.branches.length === 0)
        core.warning(`No branches found in repository ${ld.owner}/${ld.repo} for commit ${ld.commit} or release ${ld.release}`);

      return ld.branches
        .map(branch => ({
          file: ld.execution.file,
          bucket: `${ld.owner}/${ld.repo}/${branch}`,
          git: {
            owner: ld.owner,
            repo: ld.repo,
            branch: branch
          }
        }));
    });

  const executions = (await Promise.all(promisess)).flat();

  core.info(`${executions.length} test execution files found.`);

  core.endGroup();

  return executions;
}

async function removeBuckets(buckets) {
  core.startGroup('Remove buckets');

  buckets = [...new Map(buckets.map(item => [`${item.bucket}`, item])).values()];

  await Promise.all(buckets.map(bucket => azureClient.removeBucket(bucket)));

  core.info(`${buckets.length} storage buckets removed.`);

  core.endGroup();
}

async function uploadTestExecutionFiles(executions) {
  core.startGroup('Upload files');

  if (executions.length === 0)
    throw Error('No test executions found.');

  await Promise.all(executions.map(execution => azureClient.upload(execution.bucket, execution.file)));

  core.info(`${executions.length} test execution files uploaded.`);

  core.endGroup();
}

async function triggerLivingDocumentationWorkflows(repositories) {
  core.startGroup('Trigger workflows');

  repositories = [...new Map(repositories.map(item => [`${item.owner}|${item.repo}`, item])).values()];

  await Promise.all(repositories.map(repository => githubClient.dispatchEvent(repository.owner, repository.repo, 'test-execution-changed')));

  core.info(`${repositories.length} living documentation workflows triggered.`);

  core.endGroup();
}

run();
