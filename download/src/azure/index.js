const core = require('@actions/core');
const io = require('@actions/io');
const path = require('path');

const { ClientSecretCredential } = require('@azure/identity');
const { BlobServiceClient } = require('@azure/storage-blob');

exports.getClient = function (credentials, account, container) {
    if (typeof credentials === 'string')
        credentials = JSON.parse(credentials);

    const blobServiceClient = new BlobServiceClient(
        `https://${account}.blob.core.windows.net`,
        new ClientSecretCredential(credentials.tenantId, credentials.clientId, credentials.clientSecret)
    );

    return {        
        async download(bucket, dst) {
            core.info(`Downloading files from bucket ${bucket}.`);

            const containerClient = blobServiceClient.getContainerClient(container);
            if (await containerClient.exists() === false) {
                core.info(`Container ${container} does not exist.`);
                return;
            }

            const files = [];
            for await (const blob of containerClient.listBlobsFlat({ prefix: bucket })) {
                files.push(blob.name);
            }
            
            if (files.length == 0) {
                core.info(`Bucket ${bucket} does not exist.`);
                return;
            }

            for (const file of files) {
                const dstFile = path.resolve(dst, path.relative(bucket, file));
                
                core.debug(`Downloading ${file} to ${dstFile}.`);
                
                await io.mkdirP(path.dirname(dstFile));
                await containerClient.getBlobClient(file).downloadToFile(dstFile);
            }

            core.info(`Downloaded ${files.length} files.`);
        },

        async purge(bucket, skip) {
            core.info(`Purging blobs for bucket ${bucket}.`);

            const containerClient = blobServiceClient.getContainerClient(container);
            if (await containerClient.exists() === false) {
                core.info(`Container ${container} does not exist.`);
                return;
            }

            const files = [];
            for await (const blob of containerClient.listBlobsFlat({ prefix: bucket })) {
                if (!skip.some(item => blob.name.startsWith(`${bucket}/${item}`)))
                    files.push(blob.name);
            }
            
            if (files.length == 0) {
                core.info(`No stale blobs found for ${bucket}.`);
                return;
            }

            core.info(`Deleting ${files.length} blobs from ${bucket}.`);

            const batchClient = containerClient.getBlobBatchClient();
            await batchClient.deleteBlobs(files.map(file => containerClient.getBlobClient(file)));
        }
    };
}