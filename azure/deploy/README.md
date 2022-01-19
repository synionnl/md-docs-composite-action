# Deploy

```
- name: Deploy
  uses: synionnl/md-docs-actions/azure/deploy@v1
  with:
    credentials: ${{ secrets.AZURE_CREDENTIALS }}
    storage_account: synionstorage
    storage_container: docs-synion-nl
    storage_bucket: products        
    cdn_resource_group: synion
    cdn_profile: synion-cdn
    cdn_endpoint: docs-synion-www
```


## Run

You can use the [Azure CLI](https://github.com/Azure/login#configure-deployment-credentials) to create Azure credentials. Be sure to specify the right [scope](https://docs.microsoft.com/nl-nl/azure/role-based-access-control/scope-overview).

```
az login

az ad sp create-for-rbac --name "md-docs-actions-azure" --role "Contributer" --scopes /subscriptions/{subscription}/resourceGroups/{resource-group} --sdk-auth
```

