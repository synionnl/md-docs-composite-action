# Build and Deploy to Azure

```
- name: Build and Deploy
        uses: synionnl/md-docs-actions/azure@v1
        with:
          azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
          resource-group: synion
          storage_account: synionstorage
          storage_container: docs-synion-nl
          storage_bucket: products
          cdn_profile: synion-cdn
          cdn_endpoint: docs-synion-www

```