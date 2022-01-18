# Build and Deploy to GitHub pages

```
- name: Build and Deploy
  uses: synionnl/md-docs-actions/github-pages@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    destination_directory: products
```