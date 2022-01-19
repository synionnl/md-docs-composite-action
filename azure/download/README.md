# Download test results action

Github action to download test results from Azure. This action also optionally purges stale bucket files when supplying a github_token.

## Use

```
- name: Download test results
  uses: synionnl/md-docs-actions/azure/download@v1
  with:
    repository: ${{ github.repository }}
    credentials: ${{ secrets.AZURE_CREDENTIALS }}
    storage_account: synionstorage
    storage_container: test-excecutions
    github_token: ${{ github.token }}
```

## Run

```
npm run exec
```

In order to run this action locally you need to register environment variables. [dotenv](https://www.npmjs.com/package/dotenv) is included in the package. With [dotenv](https://www.npmjs.com/package/dotenv) environment vraiables are automaticly loaded from an **.env** file.

```
INPUT_GITHUB_TOKEN=
INPUT_REPOSITORY=
INPUT_CREDENTIALS=
INPUT_STORAGE_ACCOUNT=
INPUT_STORAGE_CONTAINER=
```

You can use the [Azure CLI](https://github.com/Azure/login#configure-deployment-credentials) to create Azure credentials. Be sure to specify the right [scope](https://docs.microsoft.com/nl-nl/azure/role-based-access-control/scope-overview).

```
az login

az ad sp create-for-rbac --name "md-docs-actions" --role "Storage Blob Data Contributor" --scopes /subscriptions/{subscription}/resourceGroups/{resource-group}/providers/Microsoft.Storage/storageAccounts/{storage-account}/blobServices/containers/{container}
```