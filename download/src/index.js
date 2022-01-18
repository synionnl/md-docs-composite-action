require('dotenv').config();

const core = require('@actions/core');
const io = require('@actions/io');

const REPOSITORY = core.getInput('REPOSITORY');
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
const AZURE_CREDENTIALS = core.getInput('AZURE_CREDENTIALS');
const AZURE_STORAGE_ACCOUNT = core.getInput('AZURE_STORAGE_ACCOUNT');
const AZURE_STORAGE_CONTAINER = core.getInput('AZURE_STORAGE_CONTAINER');

const githubClient = require('./github').getClient(GITHUB_TOKEN, REPOSITORY);
const azureClient = require('./azure').getClient(AZURE_CREDENTIALS, AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_CONTAINER);

async function run() {
  try {
    core.startGroup('Init');
    
    const dst = '.temp/executions';

    core.info(`Recreating destination ${dst}.`)

    await io.rmRF(dst);
    await io.mkdirP(dst);

    core.endGroup();

    core.startGroup('Purge');

    await purgeDeletedBranches(REPOSITORY);

    core.endGroup();
 
    core.startGroup('Download');

    await azureClient.download(REPOSITORY, dst);

    core.endGroup();
  }
  catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
}

async function purgeDeletedBranches(bucket) {
  const branches = await githubClient.branches();
  await azureClient.purge(bucket, branches);
}

run();
