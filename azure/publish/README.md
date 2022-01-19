# Publish test results action

Github action to publish test results to Azure and trigger GitHub living documentation workflow.

## Use

```
- name: Publish test results
  if: always()
  uses: synionnl/md-docs-actions/azure/publish@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    credentials: ${{ secrets.AZURE_CREDENTIALS }}
    storage_account: synionstorage
    storage_container: test-executions
    pattern: ./**/living-documentation.yml
```

## Run

```
npm run exec
```

In order to run this action locally you need to register environment variables. [dotenv](https://www.npmjs.com/package/dotenv) is included in the package. With [dotenv](https://www.npmjs.com/package/dotenv) environment vraiables are automaticly loaded from an **.env** file.

```
INPUT_GITHUB_TOKEN=
INPUT_CREDENTIALS=
INPUT_STORAGE_ACCOUNT=
INPUT_STORGAE_CONTAINER=
INPUT_PATTERN=
```

See [GitHub documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for creating a personal access token with **public_repo** or **repo** scope for the living documentation repositories.

You can use the [Azure CLI](https://github.com/Azure/login#configure-deployment-credentials) to create Azure credentials. Be sure to specify the right [scope](https://docs.microsoft.com/nl-nl/azure/role-based-access-control/scope-overview).

```
az login

az ad sp create-for-rbac --name "md-docs-actions" --role "Storage Blob Data Contributor" --scopes /subscriptions/{subscription}/resourceGroups/{resource-group}/providers/Microsoft.Storage/storageAccounts/{storage-account}/blobServices/containers/{container}
```


