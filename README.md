# dev-summit-europe-2022-template
Berlin Equal Street Names Template to use for the tutorial (starting point).

## Deploy to [GitHub Pages](https://pages.github.com/)

### Create `gh-pages` branch

You can skip this part if you used the template by copying all branches, which includs the `gh-pages` branch that is part of this project.

If you only copied the `main` branch, follow these steps to create an orphan `gh-pages` branch (meaning it does not share any history with `main`):

```
rm -rf dist
git checkout --orphan gh-pages
git rm -rf .
git commit --allow-empty -m "Init empty branch"
git push origin gh-pages
```

Return to `main` branch:

```
git checkout main
```

### Checkout `gh-pages` branch in `dist/` folder

The following will create a `dist` folder (fails if it already exists) and make it point to the root of the `gh-pages` branch:

```
git worktree add dist gh-pages
```

### Deploy new version on `gh-pages` branch

Once the previous steps have been completed, you can repeat the following every time you want to deploy a new version of your local code:

```
npm run build
cd dist/
git add .
git commit -am '🎉'
git push origin gh-pages
cd ../
```