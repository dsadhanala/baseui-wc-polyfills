# Base UI: Web component polyfills

This bundle loads web component polyfills on to the page, adds CSS class 'wc-polyfilled' to the html element and returns promise.

#### Usage guide
```
baseuiWcPolyfills.ready()
.then(successCallback())
.catch((reason) => console.error(`Failed due to ${reason}`));
```

#### Dependencies
- Node v6+
- Yarn (optional, only if you want to reduce packages install time)

#### To run local dev server (http://localhost:1818/demo/)
```
npm start
```

1. Install dependencies
1. Clean build folder
1. lint JS files
1. starts webpack dev server
1. auto update browser window/tab using Hot Module Replacement (HMR)

#### To bundle for production
```
npm run release
```
1. This will perform first 3 steps from above and tree shake and minify for production
