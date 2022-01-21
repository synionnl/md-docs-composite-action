require('dotenv').config();

const core = require('@actions/core');
const io = require('@actions/io');

const REPOSITORY = core.getInput('REPOSITORY');
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
const CREDENTIALS = core.getInput('CREDENTIALS');
const STORAGE_ACCOUNT = core.getInput('STORAGE_ACCOUNT');
const STORAGE_CONTAINER = core.getInput('STORAGE_CONTAINER');

const githubClient = GITHUB_TOKEN != '' ? require('./github').getClient(GITHUB_TOKEN) : null;
const azureClient = require('./azure').getClient(CREDENTIALS, STORAGE_ACCOUNT, STORAGE_CONTAINER);

async function run() {
  try {
    core.startGroup('Init');

    const dst = '.temp/executions';

    core.info(`Recreating destination ${dst}.`);

    await io.rmRF(dst);
    await io.mkdirP(dst);

    core.endGroup();

    if (githubClient != null) {
      const owner = REPOSITORY.split('/')[0];
      const repo = REPOSITORY.split('/')[1];    
      
      core.startGroup('Purge');

      await purgeDeletedBranches(owner, repo, REPOSITORY);

      core.endGroup();
    }
 
    core.startGroup('Download');

    await azureClient.download(REPOSITORY, dst);

    core.endGroup();
  }
  catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
}

async function purgeDeletedBranches(owner, repo, bucket) {
  const branches = await githubClient.branches(owner, repo);
  await azureClient.purge(bucket, branches);
}

run();
