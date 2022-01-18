# Publish test executions action

Github action to publish test execution files to Azure and trigger living documentation workflows.

## Use

```
- name: Build and Deploy
  if: always()
  uses: synionnl/md-docs-actions/publish@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
    azure_storage_account: synionstorage
    azure_storage_container: test-excecutions
    pattern: ./**/living-documentation.yml
```

## Run

```bash
npm run build && node dist/index.js
```

In order to run this action locally you need to register environment variables. [dotenv](https://www.npmjs.com/package/dotenv) is included in the package. With [dotenv](https://www.npmjs.com/package/dotenv) environment vraiables are automaticly loaded from an **.env** file.

```bash
INPUT_GITHUB_TOKEN=
INPUT_AZURE_CREDENTIALS=
INPUT_AZURE_STORAGE_ACCOUNT=
INPUT_AZURE_STORGAE_CONTAINER=
INPUT_PATTERN=
```

You can use the [Azure CLI](https://github.com/Azure/login#configure-deployment-credentials) to create Azure credentials:

```
az login

az ad sp create-for-rbac --name "md-docs-actions/publish" --role "Storage Blob Data Contributor" --scopes /subscriptions/f041be18-2519-415a-8141-cadf8856161e/resourceGroups/synion
```


