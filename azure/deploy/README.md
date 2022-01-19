# Deploy

```
- name: Deploy
  uses: synionnl/md-docs-actions/azure/deploy@v1
  with:
    credentials: ${{ secrets.AZURE_CREDENTIALS }}
    storage_account: synionstorage
    storage_container: docs-synion-nl
    storage_bucket: products        
    cdn_resource-group: synion
    cdn_profile: synion-cdn
    cdn_endpoint: docs-synion-www
```