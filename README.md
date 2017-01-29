# Base UI: Web component polyfills bundle

This bundle loads web component polyfills on to the page, adds CSS class 'wc-polyfilled' to the html element and returns promise.

#### Installing

##### NPM
```
npm install baseui-wc-polyfills
```

Since it is a UMD package can be imported as ES6, CJS, AMD.
```
import baseuiWcPolyfills from 'baseui-wc-polyfills';
```

or

```
const baseuiWcPolyfills = require('baseui-wc-polyfills');
```

or

```
require(['baseui-wc-polyfills'], function (baseuiWcPolyfills) {});
```

##### browser
```
<script src="https://unpkg.com/baseui-wc-polyfills/dist/baseui-wc-polyfills.min.js"></script>
```

#### Usage guide
```
baseuiWcPolyfills.ready()
.then(successCallback)
.catch((reason) => console.error(`Failed due to ${reason}`));
```

#### Dependencies
- Node v6+
- Yarn (optional)

#### To run local dev server (http://localhost:1818/demo/)
```
npm start
```

1. Install dependencies
1. Clean build folder
1. lint JS files
1. starts webpack dev server
1. auto update browser window/tab using Hot Module Replacement (HMR)

#### To bundle for production (UMD)
```
npm run release
```
