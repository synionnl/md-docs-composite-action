# Build

```
- name: Build
  uses: synionnl/md-docs-actions/build@v1
  with:
    theme: ${{ inputs.theme }}
    github_token: ${{ secrets.GITHUB_TOKEN }}
    azure_credentials: ${{ secrets.AZURE_CREDENTIALS }}
    azure_storage_account: synionstorage
    azure_execution_storage_container: test-executions
```