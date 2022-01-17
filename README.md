# md-docs composite action

This action install [md-docs cli] and generates for a website website based on the docs directory and for every branch.

The result, which is located in the dist directory is deployed to [GitHub pages].

```yaml
- name: Build and Deploy
  uses: synionnl/md-docs-composite-action@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    destination_directory: ./documentation
    theme: /theme.css
```

## Inputs

* destination_directory: you may optional specify a path to where the generated site must be deployed within the [GitHub pages] repository. Defaults to the root.
* theme: you may optionally specify a css file location which contains theme variables which override the default theme.
