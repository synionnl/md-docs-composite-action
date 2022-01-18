# Download test executions action

Github action to download test execution files from Azure.

## Use

```
- name: Download test results
  uses: synionnl/md-docs-actions/download@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    bucket: ${{ github.repository }}
    azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
    azure_storage_account: synionstorage
    azure_storage_container: test-excecutions
```

## Run

```
npm run exec
```

In order to run this action locally you need to register environment variables. [dotenv](https://www.npmjs.com/package/dotenv) is included in the package. With [dotenv](https://www.npmjs.com/package/dotenv) environment vraiables are automaticly loaded from an **.env** file.

```
INPUT_REPOSITORY=
INPUT_AZURE_CREDENTIALS=
INPUT_AZURE_STORAGE_ACCOUNT=
INPUT_AZURE_STORGAE_CONTAINER=
```

You can use the [Azure CLI](https://github.com/Azure/login#configure-deployment-credentials) to create Azure credentials:

```
az login

az ad sp create-for-rbac --name "md-docs-actions/publish" --role "Storage Blob Data Contributor" --scopes /subscriptions/f041be18-2519-415a-8141-cadf8856161e/resourceGroups/synion
```


