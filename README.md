# Base MK & AK devstack

JS devstack based on `gulp`, `express`, `react`, `flux`, `redux` ...

## Create App

```shell
git clone git@github.com:BariMK/jsdevstack.git
cd jsdevstack
npm install
```

## Start Development

- run `gulp`
- point your browser to [localhost:3000](http://localhost:3000)
- build something beautiful ;)

## Dev Tasks

- `gulp` run web app in development mode
- `gulp test` run jest tests with eslint
- `gulp eslint` eslint
- `gulp eslint --fix` fix fixable eslint issues

## Production Tasks

- `gulp build -p` build app for production
- `node src/server` start app, remember to set NODE_ENV

## Customize App

- set name in `package.json`
- set locales etc. in `src/server/config.js`