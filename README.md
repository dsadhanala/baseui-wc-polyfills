# Base UI: Web component polyfills bundle
[![npm](https://img.shields.io/npm/v/baseui-wc-polyfills.svg)](https://www.npmjs.com/package/baseui-wc-polyfills)
[![license](https://img.shields.io/npm/l/baseui-wc-polyfills.svg)](https://opensource.org/licenses/MIT)
[![gzip size](http://img.badgesize.io/https://unpkg.com/baseui-wc-polyfills/dist/baseui-wc-polyfills.min.js?compression=gzip&label=baseUIWcPolyfills)](https://unpkg.com/baseui-wc-polyfills/dist/baseui-wc-polyfills.min.js)

This bundle loads web component polyfills on to the page, adds CSS class 'wc-polyfilled' to the html element and returns promise. Refer the demo folder for demo WC element.

Note: you need to trigger initiating polyfills by calling `baseuiWcPolyfills.ready()` otherwise dependencies just load but never get patched.

Refer below examples.
- [custom element with shadowDOM](https://codepen.io/dsadhanala/pen/qRRXWp)
- [custom element with extend](https://codepen.io/dsadhanala/pen/dNOqYg)

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
optionally you can pass config object to choose, whether some of the polyfills needs to be patched or not, by default all set to true.

Available options:
```
{ builtInClassShim = false, wcPlatform: false, shadowDOM: false, customElements: false }
```

To get what polyfills loaded you can check the return value from promise object like below.
```
document.addEventListener('DOMContentLoaded', pageReady);
async function pageReady() {
    const polyfilled = await baseuiWcPolyfills.ready({ shadowDOM: false });
}
```

or

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

#### To run unit tests
```
npm test
```
