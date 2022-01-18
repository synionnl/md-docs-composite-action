require('dotenv').config();

const core = require('@actions/core');
const io = require('@actions/io');

const BUCKET = core.getInput('BUCKET');
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
const AZURE_CREDENTIALS = core.getInput('AZURE_CREDENTIALS');
const AZURE_STORAGE_ACCOUNT = core.getInput('AZURE_STORAGE_ACCOUNT');
const AZURE_STORAGE_CONTAINER = core.getInput('AZURE_STORAGE_CONTAINER');

const githubClient = GITHUB_TOKEN != '' ? require('./github').getClient(GITHUB_TOKEN, BUCKET) : null;
const azureClient = require('./azure').getClient(AZURE_CREDENTIALS, AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_CONTAINER);

async function run() {
  try {
    core.startGroup('Init');

    const owner = BUCKET.split('/')[0];
    const repo = BUCKET.split('/')[1];    
    const dst = '.temp/executions';

    core.info(`Recreating destination ${dst}.`)

    await io.rmRF(dst);
    await io.mkdirP(dst);

    core.endGroup();

    if (githubClient != null) {
      core.startGroup('Purge');

      await purgeDeletedBranches(owner, repo, BUCKET);

      core.endGroup();
    }
 
    core.startGroup('Download');

    await azureClient.download(BUCKET, dst);

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
