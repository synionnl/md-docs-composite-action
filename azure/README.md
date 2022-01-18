# Build and Deploy to Azure

```
- name: Build and Deploy
  uses: synionnl/md-docs-actions/azure@v1
  with:
    azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
    azure_resource-group: synion
    azure_storage_account: synionstorage
    azure_storage_container: docs-synion-nl
    azure_execution_storage_container: test-executions
    azure_storage_bucket: products
    azure_cdn_profile: synion-cdn
    azure_cdn_endpoint: docs-synion-www

```