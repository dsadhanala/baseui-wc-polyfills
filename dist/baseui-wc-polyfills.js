(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("baseuiWcPolyfills", [], factory);
	else if(typeof exports === 'object')
		exports["baseuiWcPolyfills"] = factory();
	else
		root["baseuiWcPolyfills"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 33);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utilities_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CustomElementState_js__ = __webpack_require__(12);



class CustomElementInternals {
  constructor() {
    /** @type {!Map<string, !CustomElementDefinition>} */
    this._localNameToDefinition = new Map();

    /** @type {!Map<!Function, !CustomElementDefinition>} */
    this._constructorToDefinition = new Map();

    /** @type {!Array<!function(!Node)>} */
    this._patches = [];

    /** @type {boolean} */
    this._hasPatches = false;
  }

  /**
   * @param {string} localName
   * @param {!CustomElementDefinition} definition
   */
  setDefinition(localName, definition) {
    this._localNameToDefinition.set(localName, definition);
    this._constructorToDefinition.set(definition.constructor, definition);
  }

  /**
   * @param {string} localName
   * @return {!CustomElementDefinition|undefined}
   */
  localNameToDefinition(localName) {
    return this._localNameToDefinition.get(localName);
  }

  /**
   * @param {!Function} constructor
   * @return {!CustomElementDefinition|undefined}
   */
  constructorToDefinition(constructor) {
    return this._constructorToDefinition.get(constructor);
  }

  /**
   * @param {!function(!Node)} listener
   */
  addPatch(listener) {
    this._hasPatches = true;
    this._patches.push(listener);
  }

  /**
   * @param {!Node} node
   */
  patchTree(node) {
    if (!this._hasPatches) return;

    __WEBPACK_IMPORTED_MODULE_0__Utilities_js__["d" /* walkDeepDescendantElements */](node, element => this.patch(element));
  }

  /**
   * @param {!Node} node
   */
  patch(node) {
    if (!this._hasPatches) return;

    if (node.__CE_patched) return;
    node.__CE_patched = true;

    for (let i = 0; i < this._patches.length; i++) {
      this._patches[i](node);
    }
  }

  /**
   * @param {!Node} root
   */
  connectTree(root) {
    const elements = [];

    __WEBPACK_IMPORTED_MODULE_0__Utilities_js__["d" /* walkDeepDescendantElements */](root, element => elements.push(element));

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.__CE_state === __WEBPACK_IMPORTED_MODULE_1__CustomElementState_js__["a" /* default */].custom) {
        this.connectedCallback(element);
      } else {
        this.upgradeElement(element);
      }
    }
  }

  /**
   * @param {!Node} root
   */
  disconnectTree(root) {
    const elements = [];

    __WEBPACK_IMPORTED_MODULE_0__Utilities_js__["d" /* walkDeepDescendantElements */](root, element => elements.push(element));

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.__CE_state === __WEBPACK_IMPORTED_MODULE_1__CustomElementState_js__["a" /* default */].custom) {
        this.disconnectedCallback(element);
      }
    }
  }

  /**
   * Upgrades all uncustomized custom elements at and below a root node for
   * which there is a definition. When custom element reaction callbacks are
   * assumed to be called synchronously (which, by the current DOM / HTML spec
   * definitions, they are *not*), callbacks for both elements customized
   * synchronously by the parser and elements being upgraded occur in the same
   * relative order.
   *
   * NOTE: This function, when used to simulate the construction of a tree that
   * is already created but not customized (i.e. by the parser), does *not*
   * prevent the element from reading the 'final' (true) state of the tree. For
   * example, the element, during truly synchronous parsing / construction would
   * see that it contains no children as they have not yet been inserted.
   * However, this function does not modify the tree, the element will
   * (incorrectly) have children. Additionally, self-modification restrictions
   * for custom element constructors imposed by the DOM spec are *not* enforced.
   *
   *
   * The following nested list shows the steps extending down from the HTML
   * spec's parsing section that cause elements to be synchronously created and
   * upgraded:
   *
   * The "in body" insertion mode:
   * https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
   * - Switch on token:
   *   .. other cases ..
   *   -> Any other start tag
   *      - [Insert an HTML element](below) for the token.
   *
   * Insert an HTML element:
   * https://html.spec.whatwg.org/multipage/syntax.html#insert-an-html-element
   * - Insert a foreign element for the token in the HTML namespace:
   *   https://html.spec.whatwg.org/multipage/syntax.html#insert-a-foreign-element
   *   - Create an element for a token:
   *     https://html.spec.whatwg.org/multipage/syntax.html#create-an-element-for-the-token
   *     - Will execute script flag is true?
   *       - (Element queue pushed to the custom element reactions stack.)
   *     - Create an element:
   *       https://dom.spec.whatwg.org/#concept-create-element
   *       - Sync CE flag is true?
   *         - Constructor called.
   *         - Self-modification restrictions enforced.
   *       - Sync CE flag is false?
   *         - (Upgrade reaction enqueued.)
   *     - Attributes appended to element.
   *       (`attributeChangedCallback` reactions enqueued.)
   *     - Will execute script flag is true?
   *       - (Element queue popped from the custom element reactions stack.
   *         Reactions in the popped stack are invoked.)
   *   - (Element queue pushed to the custom element reactions stack.)
   *   - Insert the element:
   *     https://dom.spec.whatwg.org/#concept-node-insert
   *     - Shadow-including descendants are connected. During parsing
   *       construction, there are no shadow-*excluding* descendants.
   *       However, the constructor may have validly attached a shadow
   *       tree to itself and added descendants to that shadow tree.
   *       (`connectedCallback` reactions enqueued.)
   *   - (Element queue popped from the custom element reactions stack.
   *     Reactions in the popped stack are invoked.)
   *
   * @param {!Node} root
   * @param {{
   *   visitedImports: (!Set<!Node>|undefined),
   *   upgrade: (!function(!Element)|undefined),
   * }=} options
   */
  patchAndUpgradeTree(root, options = {}) {
    const visitedImports = options.visitedImports || new Set();
    const upgrade = options.upgrade || (element => this.upgradeElement(element));

    const elements = [];

    const gatherElements = element => {
      if (element.localName === 'link' && element.getAttribute('rel') === 'import') {
        // The HTML Imports polyfill sets a descendant element of the link to
        // the `import` property, specifically this is *not* a Document.
        const importNode = /** @type {?Node} */ (element.import);

        if (importNode instanceof Node && importNode.readyState === 'complete') {
          importNode.__CE_isImportDocument = true;

          // Connected links are associated with the registry.
          importNode.__CE_hasRegistry = true;
        } else {
          // If this link's import root is not available, its contents can't be
          // walked. Wait for 'load' and walk it when it's ready.
          element.addEventListener('load', () => {
            const importNode = /** @type {!Node} */ (element.import);

            if (importNode.__CE_documentLoadHandled) return;
            importNode.__CE_documentLoadHandled = true;

            importNode.__CE_isImportDocument = true;

            // Connected links are associated with the registry.
            importNode.__CE_hasRegistry = true;

            // Clone the `visitedImports` set that was populated sync during
            // the `patchAndUpgradeTree` call that caused this 'load' handler to
            // be added. Then, remove *this* link's import node so that we can
            // walk that import again, even if it was partially walked later
            // during the same `patchAndUpgradeTree` call.
            const clonedVisitedImports = new Set(visitedImports);
            visitedImports.delete(importNode);

            this.patchAndUpgradeTree(importNode, {visitedImports, upgrade});
          });
        }
      } else {
        elements.push(element);
      }
    };

    // `walkDeepDescendantElements` populates (and internally checks against)
    // `visitedImports` when traversing a loaded import.
    __WEBPACK_IMPORTED_MODULE_0__Utilities_js__["d" /* walkDeepDescendantElements */](root, gatherElements, visitedImports);

    if (this._hasPatches) {
      for (let i = 0; i < elements.length; i++) {
        this.patch(elements[i]);
      }
    }

    for (let i = 0; i < elements.length; i++) {
      upgrade(elements[i]);
    }
  }

  /**
   * @param {!Element} element
   */
  upgradeElement(element) {
    const currentState = element.__CE_state;
    if (currentState !== undefined) return;

    const definition = this.localNameToDefinition(element.localName);
    if (!definition) return;

    definition.constructionStack.push(element);

    const constructor = definition.constructor;
    try {
      try {
        let result = new (constructor)();
        if (result !== element) {
          throw new Error('The custom element constructor did not produce the element being upgraded.');
        }
      } finally {
        definition.constructionStack.pop();
      }
    } catch (e) {
      element.__CE_state = __WEBPACK_IMPORTED_MODULE_1__CustomElementState_js__["a" /* default */].failed;
      throw e;
    }

    element.__CE_state = __WEBPACK_IMPORTED_MODULE_1__CustomElementState_js__["a" /* default */].custom;
    element.__CE_definition = definition;

    if (definition.attributeChangedCallback) {
      const observedAttributes = definition.observedAttributes;
      for (let i = 0; i < observedAttributes.length; i++) {
        const name = observedAttributes[i];
        const value = element.getAttribute(name);
        if (value !== null) {
          this.attributeChangedCallback(element, name, null, value, null);
        }
      }
    }

    if (__WEBPACK_IMPORTED_MODULE_0__Utilities_js__["a" /* isConnected */](element)) {
      this.connectedCallback(element);
    }
  }

  /**
   * @param {!Element} element
   */
  connectedCallback(element) {
    const definition = element.__CE_definition;
    if (definition.connectedCallback) {
      definition.connectedCallback.call(element);
    }
  }

  /**
   * @param {!Element} element
   */
  disconnectedCallback(element) {
    const definition = element.__CE_definition;
    if (definition.disconnectedCallback) {
      definition.disconnectedCallback.call(element);
    }
  }

  /**
   * @param {!Element} element
   * @param {string} name
   * @param {?string} oldValue
   * @param {?string} newValue
   * @param {?string} namespace
   */
  attributeChangedCallback(element, name, oldValue, newValue, namespace) {
    const definition = element.__CE_definition;
    if (
      definition.attributeChangedCallback &&
      definition.observedAttributes.indexOf(name) > -1
    ) {
      definition.attributeChangedCallback.call(element, name, oldValue, newValue, namespace);
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CustomElementInternals;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return settings; });
/* harmony export (immutable) */ __webpack_exports__["d"] = isTrackingLogicalChildNodes;
/* harmony export (immutable) */ __webpack_exports__["c"] = isShadyRoot;
/* harmony export (immutable) */ __webpack_exports__["h"] = ownerShadyRootForNode;
/* harmony export (immutable) */ __webpack_exports__["e"] = matchesSelector;
/* harmony export (immutable) */ __webpack_exports__["a"] = extend;
/* harmony export (immutable) */ __webpack_exports__["b"] = extendAll;
/* harmony export (immutable) */ __webpack_exports__["g"] = mixin;
/* harmony export (immutable) */ __webpack_exports__["i"] = patchPrototype;
/* harmony export (immutable) */ __webpack_exports__["f"] = microtask;
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

let settings = window['ShadyDOM'] || {};

settings.hasNativeShadowDOM = Boolean(Element.prototype.attachShadow && Node.prototype.getRootNode);

let desc = Object.getOwnPropertyDescriptor(Node.prototype, 'firstChild');

settings.hasDescriptors = Boolean(desc && desc.configurable && desc.get);
settings.inUse = settings['force'] || !settings.hasNativeShadowDOM;

function isTrackingLogicalChildNodes(node) {
  return (node.__shady && node.__shady.firstChild !== undefined);
}

function isShadyRoot(obj) {
  return Boolean(obj.__localName === 'ShadyRoot');
}

function ownerShadyRootForNode(node) {
  let root = node.getRootNode();
  if (isShadyRoot(root)) {
    return root;
  }
}

let p = Element.prototype;
let matches = p.matches || p.matchesSelector ||
  p.mozMatchesSelector || p.msMatchesSelector ||
  p.oMatchesSelector || p.webkitMatchesSelector;

function matchesSelector(element, selector) {
  return matches.call(element, selector);
}

function copyOwnProperty(name, source, target) {
  let pd = Object.getOwnPropertyDescriptor(source, name);
  if (pd) {
    Object.defineProperty(target, name, pd);
  }
}

function extend(target, source) {
  if (target && source) {
    let n$ = Object.getOwnPropertyNames(source);
    for (let i=0, n; (i<n$.length) && (n=n$[i]); i++) {
      copyOwnProperty(n, source, target);
    }
  }
  return target || source;
}

function extendAll(target, ...sources) {
  for (let i=0; i < sources.length; i++) {
    extend(target, sources[i]);
  }
  return target;
}

function mixin(target, source) {
  for (var i in source) {
    target[i] = source[i];
  }
  return target;
}

function patchPrototype(obj, mixin) {
  let proto = Object.getPrototypeOf(obj);
  if (!proto.hasOwnProperty('__patchProto')) {
    let patchProto = Object.create(proto);
    patchProto.__sourceProto = proto;
    extend(patchProto, mixin);
    proto['__patchProto'] = patchProto;
  }
  // old browsers don't have setPrototypeOf
  obj.__proto__ = proto['__patchProto'];
}


let twiddle = document.createTextNode('');
let content = 0;
let queue = [];
new MutationObserver(() => {
  while (queue.length) {
    // catch errors in user code...
    try {
      queue.shift()();
    } catch(e) {
      // enqueue another record and throw
      twiddle.textContent = content++;
      throw(e);
    }
  }
}).observe(twiddle, {characterData: true});

// use MutationObserver to get microtask async timing.
function microtask(callback) {
  queue.push(callback);
  twiddle.textContent = content++;
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = isValidCustomElementName;
/* harmony export (immutable) */ __webpack_exports__["a"] = isConnected;
/* harmony export (immutable) */ __webpack_exports__["d"] = walkDeepDescendantElements;
/* harmony export (immutable) */ __webpack_exports__["c"] = setPropertyUnchecked;
const reservedTagList = new Set([
  'annotation-xml',
  'color-profile',
  'font-face',
  'font-face-src',
  'font-face-uri',
  'font-face-format',
  'font-face-name',
  'missing-glyph',
]);

/**
 * @param {string} localName
 * @returns {boolean}
 */
function isValidCustomElementName(localName) {
  const reserved = reservedTagList.has(localName);
  const validForm = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(localName);
  return !reserved && validForm;
}

/**
 * @private
 * @param {!Node} node
 * @return {boolean}
 */
function isConnected(node) {
  // Use `Node#isConnected`, if defined.
  const nativeValue = node.isConnected;
  if (nativeValue !== undefined) {
    return nativeValue;
  }

  /** @type {?Node|undefined} */
  let current = node;
  while (current && !(current.__CE_isImportDocument || current instanceof Document)) {
    current = current.parentNode || (window.ShadowRoot && current instanceof ShadowRoot ? current.host : undefined);
  }
  return !!(current && (current.__CE_isImportDocument || current instanceof Document));
}

/**
 * @param {!Node} root
 * @param {!Node} start
 * @return {?Node}
 */
function nextSiblingOrAncestorSibling(root, start) {
  let node = start;
  while (node && node !== root && !node.nextSibling) {
    node = node.parentNode;
  }
  return (!node || node === root) ? null : node.nextSibling;
}

/**
 * @param {!Node} root
 * @param {!Node} start
 * @return {?Node}
 */
function nextNode(root, start) {
  return start.firstChild ? start.firstChild : nextSiblingOrAncestorSibling(root, start);
}

/**
 * @param {!Node} root
 * @param {!function(!Element)} callback
 * @param {!Set<Node>=} visitedImports
 */
function walkDeepDescendantElements(root, callback, visitedImports = new Set()) {
  let node = root;
  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = /** @type {!Element} */(node);

      callback(element);

      const localName = element.localName;
      if (localName === 'link' && element.getAttribute('rel') === 'import') {
        // If this import (polyfilled or not) has it's root node available,
        // walk it.
        const importNode = /** @type {!Node} */ (element.import);
        if (importNode instanceof Node && !visitedImports.has(importNode)) {
          // Prevent multiple walks of the same import root.
          visitedImports.add(importNode);

          for (let child = importNode.firstChild; child; child = child.nextSibling) {
            walkDeepDescendantElements(child, callback, visitedImports);
          }
        }

        // Ignore descendants of import links to prevent attempting to walk the
        // elements created by the HTML Imports polyfill that we just walked
        // above.
        node = nextSiblingOrAncestorSibling(root, element);
        continue;
      } else if (localName === 'template') {
        // Ignore descendants of templates. There shouldn't be any descendants
        // because they will be moved into `.content` during construction in
        // browsers that support template but, in case they exist and are still
        // waiting to be moved by a polyfill, they will be ignored.
        node = nextSiblingOrAncestorSibling(root, element);
        continue;
      }

      // Walk shadow roots.
      const shadowRoot = element.__CE_shadowRoot;
      if (shadowRoot) {
        for (let child = shadowRoot.firstChild; child; child = child.nextSibling) {
          walkDeepDescendantElements(child, callback, visitedImports);
        }
      }
    }

    node = nextNode(root, node);
  }
}

/**
 * Used to suppress Closure's "Modifying the prototype is only allowed if the
 * constructor is in the same scope" warning without using
 * `@suppress {newCheckTypes, duplicate}` because `newCheckTypes` is too broad.
 *
 * @param {!Object} destination
 * @param {string} name
 * @param {*} value
 */
function setPropertyUnchecked(destination, name, value) {
  destination[name] = value;
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return nativeShadow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return nativeCssVariables; });
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



let nativeShadow = !(window['ShadyDOM'] && window['ShadyDOM']['inUse']);
let nativeCssVariables;

/**
 * @param {(ShadyCSSOptions | ShadyCSSInterface)=} settings
 */
function calcCssVariables(settings) {
  if (settings && settings['shimcssproperties']) {
    nativeCssVariables = false;
  } else {
    // chrome 49 has semi-working css vars, check if box-shadow works
    // safari 9.1 has a recalc bug: https://bugs.webkit.org/show_bug.cgi?id=155782
    // However, shim css custom properties are only supported with ShadyDOM enabled,
    // so fall back on native if we do not detect ShadyDOM
    // Edge 15: custom properties used in ::before and ::after will also be used in the parent element
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12414257/
    nativeCssVariables = nativeShadow || Boolean(!navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/) &&
      window.CSS && CSS.supports && CSS.supports('box-shadow', '0 0 0 var(--foo)'));
  }
}

if (window.ShadyCSS && window.ShadyCSS.nativeCss !== undefined) {
  nativeCssVariables = window.ShadyCSS.nativeCss;
} else if (window.ShadyCSS) {
  calcCssVariables(window.ShadyCSS);
  // reset window variable to let ShadyCSS API take its place
  window.ShadyCSS = undefined;
} else {
  calcCssVariables(window['WebComponents'] && window['WebComponents']['flags']);
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StyleNode; });
/* harmony export (immutable) */ __webpack_exports__["b"] = parse;
/* harmony export (immutable) */ __webpack_exports__["d"] = stringify;
/* harmony export (immutable) */ __webpack_exports__["c"] = removeCustomPropAssignment;
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/*
Extremely simple css parser. Intended to be not more than what we need
and definitely not necessarily correct =).
*/



/** @unrestricted */
class StyleNode {
  constructor() {
    /** @type {number} */
    this['start'] = 0;
    /** @type {number} */
    this['end'] = 0;
    /** @type {StyleNode} */
    this['previous'] = null;
    /** @type {StyleNode} */
    this['parent'] = null;
    /** @type {Array<StyleNode>} */
    this['rules'] = null;
    /** @type {string} */
    this['parsedCssText'] = '';
    /** @type {string} */
    this['cssText'] = '';
    /** @type {boolean} */
    this['atRule'] = false;
    /** @type {number} */
    this['type'] = 0;
    /** @type {string} */
    this['keyframesName'] = '';
    /** @type {string} */
    this['selector'] = '';
    /** @type {string} */
    this['parsedSelector'] = '';
  }
}



// given a string of css, return a simple rule tree
/**
 * @param {string} text
 * @return {StyleNode}
 */
function parse(text) {
  text = clean(text);
  return parseCss(lex(text), text);
}

// remove stuff we don't care about that may hinder parsing
/**
 * @param {string} cssText
 * @return {string}
 */
function clean(cssText) {
  return cssText.replace(RX.comments, '').replace(RX.port, '');
}

// super simple {...} lexer that returns a node tree
/**
 * @param {string} text
 * @return {StyleNode}
 */
function lex(text) {
  let root = new StyleNode();
  root['start'] = 0;
  root['end'] = text.length
  let n = root;
  for (let i = 0, l = text.length; i < l; i++) {
    if (text[i] === OPEN_BRACE) {
      if (!n['rules']) {
        n['rules'] = [];
      }
      let p = n;
      let previous = p['rules'][p['rules'].length - 1] || null;
      n = new StyleNode();
      n['start'] = i + 1;
      n['parent'] = p;
      n['previous'] = previous;
      p['rules'].push(n);
    } else if (text[i] === CLOSE_BRACE) {
      n['end'] = i + 1;
      n = n['parent'] || root;
    }
  }
  return root;
}

// add selectors/cssText to node tree
/**
 * @param {StyleNode} node
 * @param {string} text
 * @return {StyleNode}
 */
function parseCss(node, text) {
  let t = text.substring(node['start'], node['end'] - 1);
  node['parsedCssText'] = node['cssText'] = t.trim();
  if (node['parent']) {
    let ss = node['previous'] ? node['previous']['end'] : node['parent']['start'];
    t = text.substring(ss, node['start'] - 1);
    t = _expandUnicodeEscapes(t);
    t = t.replace(RX.multipleSpaces, ' ');
    // TODO(sorvell): ad hoc; make selector include only after last ;
    // helps with mixin syntax
    t = t.substring(t.lastIndexOf(';') + 1);
    let s = node['parsedSelector'] = node['selector'] = t.trim();
    node['atRule'] = (s.indexOf(AT_START) === 0);
    // note, support a subset of rule types...
    if (node['atRule']) {
      if (s.indexOf(MEDIA_START) === 0) {
        node['type'] = types.MEDIA_RULE;
      } else if (s.match(RX.keyframesRule)) {
        node['type'] = types.KEYFRAMES_RULE;
        node['keyframesName'] =
          node['selector'].split(RX.multipleSpaces).pop();
      }
    } else {
      if (s.indexOf(VAR_START) === 0) {
        node['type'] = types.MIXIN_RULE;
      } else {
        node['type'] = types.STYLE_RULE;
      }
    }
  }
  let r$ = node['rules'];
  if (r$) {
    for (let i = 0, l = r$.length, r;
      (i < l) && (r = r$[i]); i++) {
      parseCss(r, text);
    }
  }
  return node;
}

/**
 * conversion of sort unicode escapes with spaces like `\33 ` (and longer) into
 * expanded form that doesn't require trailing space `\000033`
 * @param {string} s
 * @return {string}
 */
function _expandUnicodeEscapes(s) {
  return s.replace(/\\([0-9a-f]{1,6})\s/gi, function() {
    let code = arguments[1],
      repeat = 6 - code.length;
    while (repeat--) {
      code = '0' + code;
    }
    return '\\' + code;
  });
}

/**
 * stringify parsed css.
 * @param {StyleNode} node
 * @param {boolean=} preserveProperties
 * @param {string=} text
 * @return {string}
 */
function stringify(node, preserveProperties, text = '') {
  // calc rule cssText
  let cssText = '';
  if (node['cssText'] || node['rules']) {
    let r$ = node['rules'];
    if (r$ && !_hasMixinRules(r$)) {
      for (let i = 0, l = r$.length, r;
        (i < l) && (r = r$[i]); i++) {
        cssText = stringify(r, preserveProperties, cssText);
      }
    } else {
      cssText = preserveProperties ? node['cssText'] :
        removeCustomProps(node['cssText']);
      cssText = cssText.trim();
      if (cssText) {
        cssText = '  ' + cssText + '\n';
      }
    }
  }
  // emit rule if there is cssText
  if (cssText) {
    if (node['selector']) {
      text += node['selector'] + ' ' + OPEN_BRACE + '\n';
    }
    text += cssText;
    if (node['selector']) {
      text += CLOSE_BRACE + '\n\n';
    }
  }
  return text;
}

/**
 * @param {Array<StyleNode>} rules
 * @return {boolean}
 */
function _hasMixinRules(rules) {
  let r = rules[0];
  return Boolean(r) && Boolean(r['selector']) && r['selector'].indexOf(VAR_START) === 0;
}

/**
 * @param {string} cssText
 * @return {string}
 */
function removeCustomProps(cssText) {
  cssText = removeCustomPropAssignment(cssText);
  return removeCustomPropApply(cssText);
}

/**
 * @param {string} cssText
 * @return {string}
 */
function removeCustomPropAssignment(cssText) {
  return cssText
    .replace(RX.customProp, '')
    .replace(RX.mixinProp, '');
}

/**
 * @param {string} cssText
 * @return {string}
 */
function removeCustomPropApply(cssText) {
  return cssText
    .replace(RX.mixinApply, '')
    .replace(RX.varApply, '');
}

/** @enum {number} */
const types = {
  STYLE_RULE: 1,
  KEYFRAMES_RULE: 7,
  MEDIA_RULE: 4,
  MIXIN_RULE: 1000
}
/* harmony export (immutable) */ __webpack_exports__["e"] = types;


const OPEN_BRACE = '{';
const CLOSE_BRACE = '}';

// helper regexp's
const RX = {
  comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
  port: /@import[^;]*;/gim,
  customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
  mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
  mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
  varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
  keyframesRule: /^@[^\s]*keyframes/,
  multipleSpaces: /\s+/g
}

const VAR_START = '--';
const MEDIA_START = '@media';
const AT_START = '@';


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return nextId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return makePromise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getThen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return noop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return resolve; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return reject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return fulfill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return subscribe; });
/* unused harmony export publish */
/* unused harmony export publishRejection */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return initializePromise; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return invokeCallback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return handleMaybeThenable; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__asap__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__then__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__promise_resolve__ = __webpack_require__(19);







const PROMISE_ID = Math.random().toString(36).substring(16);
/* harmony export (immutable) */ __webpack_exports__["c"] = PROMISE_ID;


function noop() {}

const PENDING   = void 0;
const FULFILLED = 1;
const REJECTED  = 2;

const GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch(error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch(e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
   Object(__WEBPACK_IMPORTED_MODULE_1__asap__["a" /* asap */])(promise => {
    var sealed = false;
    var error = tryThen(then, thenable, value => {
      if (sealed) { return; }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, reason => {
      if (sealed) { return; }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, value  => resolve(promise, value),
                                   reason => reject(promise, reason))
  }
}

function handleMaybeThenable(promise, maybeThenable, then) {
  if (maybeThenable.constructor === promise.constructor &&
      then === __WEBPACK_IMPORTED_MODULE_2__then__["a" /* default */] &&
      maybeThenable.constructor.resolve === __WEBPACK_IMPORTED_MODULE_3__promise_resolve__["a" /* default */]) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then === GET_THEN_ERROR) {
      reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then === undefined) {
      fulfill(promise, maybeThenable);
    } else if (Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* isFunction */])(then)) {
      handleForeignThenable(promise, maybeThenable, then);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* objectOrFunction */])(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) { return; }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    Object(__WEBPACK_IMPORTED_MODULE_1__asap__["a" /* asap */])(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) { return; }
  promise._state = REJECTED;
  promise._result = reason;

  Object(__WEBPACK_IMPORTED_MODULE_1__asap__["a" /* asap */])(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  let { _subscribers } = parent;
  let { length } = _subscribers;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED]  = onRejection;

  if (length === 0 && parent._state) {
    Object(__WEBPACK_IMPORTED_MODULE_1__asap__["a" /* asap */])(publish, parent);
  }
}

function publish(promise) {
  let subscribers = promise._subscribers;
  let settled = promise._state;

  if (subscribers.length === 0) { return; }

  let child, callback, detail = promise._result;

  for (let i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

const TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch(e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  let hasCallback = Object(__WEBPACK_IMPORTED_MODULE_0__utils__["b" /* isFunction */])(callback),
      value, error, succeeded, failed;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }

  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value){
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch(e) {
    reject(promise, e);
  }
}

let id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}




/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "appendChild", function() { return appendChild; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "insertBefore", function() { return insertBefore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeChild", function() { return removeChild; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setAttribute", function() { return setAttribute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeAttribute", function() { return removeAttribute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneNode", function() { return cloneNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importNode", function() { return importNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addEventListener", function() { return addEventListener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeEventListener", function() { return removeEventListener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "windowAddEventListener", function() { return windowAddEventListener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "windowRemoveEventListener", function() { return windowRemoveEventListener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dispatchEvent", function() { return dispatchEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "querySelector", function() { return querySelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "querySelectorAll", function() { return querySelectorAll; });
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

let appendChild = Element.prototype.appendChild;
let insertBefore = Element.prototype.insertBefore;
let removeChild = Element.prototype.removeChild;
let setAttribute = Element.prototype.setAttribute;
let removeAttribute = Element.prototype.removeAttribute;
let cloneNode = Element.prototype.cloneNode;
let importNode = Document.prototype.importNode;
let addEventListener = Element.prototype.addEventListener;
let removeEventListener = Element.prototype.removeEventListener;
let windowAddEventListener = Window.prototype.addEventListener;
let windowRemoveEventListener = Window.prototype.removeEventListener;
let dispatchEvent = Element.prototype.dispatchEvent;
let querySelector = Element.prototype.querySelector;
let querySelectorAll = Element.prototype.querySelectorAll;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["parentNode"] = parentNode;
/* harmony export (immutable) */ __webpack_exports__["firstChild"] = firstChild;
/* harmony export (immutable) */ __webpack_exports__["lastChild"] = lastChild;
/* harmony export (immutable) */ __webpack_exports__["previousSibling"] = previousSibling;
/* harmony export (immutable) */ __webpack_exports__["nextSibling"] = nextSibling;
/* harmony export (immutable) */ __webpack_exports__["childNodes"] = childNodes;
/* harmony export (immutable) */ __webpack_exports__["parentElement"] = parentElement;
/* harmony export (immutable) */ __webpack_exports__["firstElementChild"] = firstElementChild;
/* harmony export (immutable) */ __webpack_exports__["lastElementChild"] = lastElementChild;
/* harmony export (immutable) */ __webpack_exports__["previousElementSibling"] = previousElementSibling;
/* harmony export (immutable) */ __webpack_exports__["nextElementSibling"] = nextElementSibling;
/* harmony export (immutable) */ __webpack_exports__["children"] = children;
/* harmony export (immutable) */ __webpack_exports__["innerHTML"] = innerHTML;
/* harmony export (immutable) */ __webpack_exports__["textContent"] = textContent;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__innerHTML_js__ = __webpack_require__(24);
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



let nodeWalker = document.createTreeWalker(document, NodeFilter.SHOW_ALL,
  null, false);

let elementWalker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT,
  null, false);

function parentNode(node) {
  nodeWalker.currentNode = node;
  return nodeWalker.parentNode();
}

function firstChild(node) {
  nodeWalker.currentNode = node;
  return nodeWalker.firstChild();
}

function lastChild(node) {
  nodeWalker.currentNode = node;
  return nodeWalker.lastChild();
}

function previousSibling(node) {
  nodeWalker.currentNode = node;
  return nodeWalker.previousSibling();
}

function nextSibling(node) {
  nodeWalker.currentNode = node;
  return nodeWalker.nextSibling();
}

function childNodes(node) {
  let nodes = [];
  nodeWalker.currentNode = node;
  let n = nodeWalker.firstChild();
  while (n) {
    nodes.push(n);
    n = nodeWalker.nextSibling();
  }
  return nodes;
}

function parentElement(node) {
  elementWalker.currentNode = node;
  return elementWalker.parentNode();
}

function firstElementChild(node) {
  elementWalker.currentNode = node;
  return elementWalker.firstChild();
}

function lastElementChild(node) {
  elementWalker.currentNode = node;
  return elementWalker.lastChild();
}

function previousElementSibling(node) {
  elementWalker.currentNode = node;
  return elementWalker.previousSibling();
}

function nextElementSibling(node) {
  elementWalker.currentNode = node;
  return elementWalker.nextSibling();
}

function children(node) {
  let nodes = [];
  elementWalker.currentNode = node;
  let n = elementWalker.firstChild();
  while (n) {
    nodes.push(n);
    n = elementWalker.nextSibling();
  }
  return nodes;
}

function innerHTML(node) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__innerHTML_js__["a" /* getInnerHTML */])(node, (n) => childNodes(n));
}

function textContent(node) {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
    case Node.DOCUMENT_FRAGMENT_NODE:
      let textWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT,
        null, false);
      let content = '', n;
      while ( (n = textWalker.nextNode()) ) {
        // TODO(sorvell): can't use textContent since we patch it on Node.prototype!
        // However, should probably patch it only on element.
        content += n.nodeValue;
      }
      return content;
    default:
      return node.nodeValue;
  }
}


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["j"] = toCssText;
/* harmony export (immutable) */ __webpack_exports__["h"] = rulesForStyle;
/* harmony export (immutable) */ __webpack_exports__["f"] = isKeyframesSelector;
/* harmony export (immutable) */ __webpack_exports__["d"] = forEachRule;
/* harmony export (immutable) */ __webpack_exports__["a"] = applyCss;
/* unused harmony export createScopeStyle */
/* harmony export (immutable) */ __webpack_exports__["c"] = applyStylePlaceHolder;
/* harmony export (immutable) */ __webpack_exports__["b"] = applyStyle;
/* unused harmony export isTargetedBuild */
/* unused harmony export getCssBuildType */
/* harmony export (immutable) */ __webpack_exports__["g"] = processVariableAndFallback;
/* harmony export (immutable) */ __webpack_exports__["i"] = setElementClassRaw;
/* harmony export (immutable) */ __webpack_exports__["e"] = getIsExtends;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_settings_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_parse_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_regex_js__ = __webpack_require__(16);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/




 // eslint-disable-line no-unused-vars


/**
 * @param {string|StyleNode} rules
 * @param {function(StyleNode)=} callback
 * @return {string}
 */
function toCssText (rules, callback) {
  if (!rules) {
    return '';
  }
  if (typeof rules === 'string') {
    rules = Object(__WEBPACK_IMPORTED_MODULE_1__css_parse_js__["b" /* parse */])(rules);
  }
  if (callback) {
    forEachRule(rules, callback);
  }
  return Object(__WEBPACK_IMPORTED_MODULE_1__css_parse_js__["d" /* stringify */])(rules, __WEBPACK_IMPORTED_MODULE_0__style_settings_js__["a" /* nativeCssVariables */]);
}

/**
 * @param {HTMLStyleElement} style
 * @return {StyleNode}
 */
function rulesForStyle(style) {
  if (!style['__cssRules'] && style.textContent) {
    style['__cssRules'] = Object(__WEBPACK_IMPORTED_MODULE_1__css_parse_js__["b" /* parse */])(style.textContent);
  }
  return style['__cssRules'] || null;
}

// Tests if a rule is a keyframes selector, which looks almost exactly
// like a normal selector but is not (it has nothing to do with scoping
// for example).
/**
 * @param {StyleNode} rule
 * @return {boolean}
 */
function isKeyframesSelector(rule) {
  return Boolean(rule['parent']) &&
  rule['parent']['type'] === __WEBPACK_IMPORTED_MODULE_1__css_parse_js__["e" /* types */].KEYFRAMES_RULE;
}

/**
 * @param {StyleNode} node
 * @param {Function=} styleRuleCallback
 * @param {Function=} keyframesRuleCallback
 * @param {boolean=} onlyActiveRules
 */
function forEachRule(node, styleRuleCallback, keyframesRuleCallback, onlyActiveRules) {
  if (!node) {
    return;
  }
  let skipRules = false;
  let type = node['type'];
  if (onlyActiveRules) {
    if (type === __WEBPACK_IMPORTED_MODULE_1__css_parse_js__["e" /* types */].MEDIA_RULE) {
      let matchMedia = node['selector'].match(__WEBPACK_IMPORTED_MODULE_2__common_regex_js__["e" /* MEDIA_MATCH */]);
      if (matchMedia) {
        // if rule is a non matching @media rule, skip subrules
        if (!window.matchMedia(matchMedia[1]).matches) {
          skipRules = true;
        }
      }
    }
  }
  if (type === __WEBPACK_IMPORTED_MODULE_1__css_parse_js__["e" /* types */].STYLE_RULE) {
    styleRuleCallback(node);
  } else if (keyframesRuleCallback &&
    type === __WEBPACK_IMPORTED_MODULE_1__css_parse_js__["e" /* types */].KEYFRAMES_RULE) {
    keyframesRuleCallback(node);
  } else if (type === __WEBPACK_IMPORTED_MODULE_1__css_parse_js__["e" /* types */].MIXIN_RULE) {
    skipRules = true;
  }
  let r$ = node['rules'];
  if (r$ && !skipRules) {
    for (let i=0, l=r$.length, r; (i<l) && (r=r$[i]); i++) {
      forEachRule(r, styleRuleCallback, keyframesRuleCallback, onlyActiveRules);
    }
  }
}

// add a string of cssText to the document.
/**
 * @param {string} cssText
 * @param {string} moniker
 * @param {Node} target
 * @param {Node} contextNode
 * @return {HTMLStyleElement}
 */
function applyCss(cssText, moniker, target, contextNode) {
  let style = createScopeStyle(cssText, moniker);
  applyStyle(style, target, contextNode);
  return style;
}

/**
 * @param {string} cssText
 * @param {string} moniker
 * @return {HTMLStyleElement}
 */
function createScopeStyle(cssText, moniker) {
  let style = /** @type {HTMLStyleElement} */(document.createElement('style'));
  if (moniker) {
    style.setAttribute('scope', moniker);
  }
  style.textContent = cssText;
  return style;
}

/**
 * Track the position of the last added style for placing placeholders
 * @type {Node}
 */
let lastHeadApplyNode = null;

// insert a comment node as a styling position placeholder.
/**
 * @param {string} moniker
 * @return {!Comment}
 */
function applyStylePlaceHolder(moniker) {
  let placeHolder = document.createComment(' Shady DOM styles for ' +
    moniker + ' ');
  let after = lastHeadApplyNode ?
    lastHeadApplyNode['nextSibling'] : null;
  let scope = document.head;
  scope.insertBefore(placeHolder, after || scope.firstChild);
  lastHeadApplyNode = placeHolder;
  return placeHolder;
}

/**
 * @param {HTMLStyleElement} style
 * @param {?Node} target
 * @param {?Node} contextNode
 */
function applyStyle(style, target, contextNode) {
  target = target || document.head;
  let after = (contextNode && contextNode.nextSibling) ||
    target.firstChild;
  target.insertBefore(style, after);
  if (!lastHeadApplyNode) {
    lastHeadApplyNode = style;
  } else {
    // only update lastHeadApplyNode if the new style is inserted after the old lastHeadApplyNode
    let position = style.compareDocumentPosition(lastHeadApplyNode);
    if (position === Node.DOCUMENT_POSITION_PRECEDING) {
      lastHeadApplyNode = style;
    }
  }
}

/**
 * @param {string} buildType
 * @return {boolean}
 */
function isTargetedBuild(buildType) {
  return __WEBPACK_IMPORTED_MODULE_0__style_settings_js__["b" /* nativeShadow */] ? buildType === 'shadow' : buildType === 'shady';
}

/**
 * @param {Element} element
 * @return {?string}
 */
function getCssBuildType(element) {
  return element.getAttribute('css-build');
}

/**
 * Walk from text[start] matching parens and
 * returns position of the outer end paren
 * @param {string} text
 * @param {number} start
 * @return {number}
 */
function findMatchingParen(text, start) {
  let level = 0;
  for (let i=start, l=text.length; i < l; i++) {
    if (text[i] === '(') {
      level++;
    } else if (text[i] === ')') {
      if (--level === 0) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * @param {string} str
 * @param {function(string, string, string, string)} callback
 */
function processVariableAndFallback(str, callback) {
  // find 'var('
  let start = str.indexOf('var(');
  if (start === -1) {
    // no var?, everything is prefix
    return callback(str, '', '', '');
  }
  //${prefix}var(${inner})${suffix}
  let end = findMatchingParen(str, start + 3);
  let inner = str.substring(start + 4, end);
  let prefix = str.substring(0, start);
  // suffix may have other variables
  let suffix = processVariableAndFallback(str.substring(end + 1), callback);
  let comma = inner.indexOf(',');
  // value and fallback args should be trimmed to match in property lookup
  if (comma === -1) {
    // variable, no fallback
    return callback(prefix, inner.trim(), '', suffix);
  }
  // var(${value},${fallback})
  let value = inner.substring(0, comma).trim();
  let fallback = inner.substring(comma + 1).trim();
  return callback(prefix, value, fallback, suffix);
}

/**
 * @param {Element} element
 * @param {string} value
 */
function setElementClassRaw(element, value) {
  // use native setAttribute provided by ShadyDOM when setAttribute is patched
  if (__WEBPACK_IMPORTED_MODULE_0__style_settings_js__["b" /* nativeShadow */]) {
    element.setAttribute('class', value);
  } else {
    window['ShadyDOM']['nativeMethods']['setAttribute'].call(element, 'class', value);
  }
}

/**
 * @param {Element | {is: string, extends: string}} element
 * @return {{is: string, typeExtension: string}}
 */
function getIsExtends(element) {
  let localName = element['localName'];
  let is = '', typeExtension = '';
  /*
  NOTE: technically, this can be wrong for certain svg elements
  with `-` in the name like `<font-face>`
  */
  if (localName) {
    if (localName.indexOf('-') > -1) {
      is = localName;
    } else {
      typeExtension = localName;
      is = (element.getAttribute && element.getAttribute('is')) || '';
    }
  } else {
    is = /** @type {?} */(element).is;
    typeExtension = /** @type {?} */(element).extends;
  }
  return {is, typeExtension};
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  Document_createElement: window.Document.prototype.createElement,
  Document_createElementNS: window.Document.prototype.createElementNS,
  Document_importNode: window.Document.prototype.importNode,
  Document_prepend: window.Document.prototype['prepend'],
  Document_append: window.Document.prototype['append'],
  Node_cloneNode: window.Node.prototype.cloneNode,
  Node_appendChild: window.Node.prototype.appendChild,
  Node_insertBefore: window.Node.prototype.insertBefore,
  Node_removeChild: window.Node.prototype.removeChild,
  Node_replaceChild: window.Node.prototype.replaceChild,
  Node_textContent: Object.getOwnPropertyDescriptor(window.Node.prototype, 'textContent'),
  Element_attachShadow: window.Element.prototype['attachShadow'],
  Element_innerHTML: Object.getOwnPropertyDescriptor(window.Element.prototype, 'innerHTML'),
  Element_getAttribute: window.Element.prototype.getAttribute,
  Element_setAttribute: window.Element.prototype.setAttribute,
  Element_removeAttribute: window.Element.prototype.removeAttribute,
  Element_getAttributeNS: window.Element.prototype.getAttributeNS,
  Element_setAttributeNS: window.Element.prototype.setAttributeNS,
  Element_removeAttributeNS: window.Element.prototype.removeAttributeNS,
  Element_insertAdjacentElement: window.Element.prototype['insertAdjacentElement'],
  Element_prepend: window.Element.prototype['prepend'],
  Element_append: window.Element.prototype['append'],
  Element_before: window.Element.prototype['before'],
  Element_after: window.Element.prototype['after'],
  Element_replaceWith: window.Element.prototype['replaceWith'],
  Element_remove: window.Element.prototype['remove'],
  HTMLElement: window.HTMLElement,
  HTMLElement_innerHTML: Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML'),
  HTMLElement_insertAdjacentElement: window.HTMLElement.prototype['insertAdjacentElement'],
});


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = objectOrFunction;
/* harmony export (immutable) */ __webpack_exports__["b"] = isFunction;
/* unused harmony export isMaybeThenable */
function objectOrFunction(x) {
  let type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}

function isMaybeThenable(x) {
  return x !== null && typeof x === 'object';
}

let _isArray;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = x => Object.prototype.toString.call(x) === '[object Array]';
}

const isArray = _isArray;
/* harmony export (immutable) */ __webpack_exports__["a"] = isArray;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = then;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__asap__ = __webpack_require__(18);




function then(onFulfillment, onRejection) {
  const parent = this;

  const child = new this.constructor(__WEBPACK_IMPORTED_MODULE_0__internal__["l" /* noop */]);

  if (child[__WEBPACK_IMPORTED_MODULE_0__internal__["c" /* PROMISE_ID */]] === undefined) {
    Object(__WEBPACK_IMPORTED_MODULE_0__internal__["j" /* makePromise */])(child);
  }

  const { _state } = parent;

  if (_state) {
    const callback = arguments[_state - 1];
    Object(__WEBPACK_IMPORTED_MODULE_1__asap__["a" /* asap */])(() => Object(__WEBPACK_IMPORTED_MODULE_0__internal__["i" /* invokeCallback */])(_state, child, callback, parent._result));
  } else {
    Object(__WEBPACK_IMPORTED_MODULE_0__internal__["o" /* subscribe */])(parent, child, onFulfillment, onRejection);
  }

  return child;
}


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @enum {number}
 */
const CustomElementState = {
  custom: 1,
  failed: 2,
};

/* harmony default export */ __webpack_exports__["a"] = (CustomElementState);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = enqueue;
/* harmony export (immutable) */ __webpack_exports__["b"] = flush;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_js__ = __webpack_require__(1);
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



// render enqueuer/flusher
let flushList = [];
let scheduled;
function enqueue(callback) {
  if (!scheduled) {
    scheduled = true;
    __WEBPACK_IMPORTED_MODULE_0__utils_js__["f" /* microtask */](flush);
  }
  flushList.push(callback);
}

function flush() {
  scheduled = false;
  let didFlush = Boolean(flushList.length);
  while (flushList.length) {
    flushList.shift()();
  }
  return didFlush;
}

flush['list'] = flushList;


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ShadowRootAccessor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActiveElementAccessor; });
/* harmony export (immutable) */ __webpack_exports__["c"] = patchAccessors;
/* harmony export (immutable) */ __webpack_exports__["f"] = patchShadowRootAccessors;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return patchOutsideElementAccessors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return patchInsideElementAccessors; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__innerHTML_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__native_tree_js__ = __webpack_require__(7);
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/





function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

const nativeInnerHTMLDesc = /** @type {ObjectPropertyDescriptor} */(
  Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML') ||
  Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerHTML'));

const inertDoc = document.implementation.createHTMLDocument('inert');
const htmlContainer = inertDoc.createElement('div');

const nativeActiveElementDescriptor =
  /** @type {ObjectPropertyDescriptor} */(
    Object.getOwnPropertyDescriptor(Document.prototype, 'activeElement')
  );
function getDocumentActiveElement() {
  if (nativeActiveElementDescriptor && nativeActiveElementDescriptor.get) {
    return nativeActiveElementDescriptor.get.call(document);
  } else if (!__WEBPACK_IMPORTED_MODULE_0__utils_js__["j" /* settings */].hasDescriptors) {
    return document.activeElement;
  }
}

function activeElementForNode(node) {
  let active = getDocumentActiveElement();
  // In IE11, activeElement might be an empty object if the document is
  // contained in an iframe.
  // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10998788/
  if (!active || !active.nodeType) {
    return null;
  }
  let isShadyRoot = !!(__WEBPACK_IMPORTED_MODULE_0__utils_js__["c" /* isShadyRoot */](node));
  if (node !== document) {
    // If this node isn't a document or shady root, then it doesn't have
    // an active element.
    if (!isShadyRoot) {
      return null;
    }
    // If this shady root's host is the active element or the active
    // element is not a descendant of the host (in the composed tree),
    // then it doesn't have an active element.
    if (node.host === active ||
        !node.host.contains(active)) {
      return null;
    }
  }
  // This node is either the document or a shady root of which the active
  // element is a (composed) descendant of its host; iterate upwards to
  // find the active element's most shallow host within it.
  let activeRoot = __WEBPACK_IMPORTED_MODULE_0__utils_js__["h" /* ownerShadyRootForNode */](active);
  while (activeRoot && activeRoot !== node) {
    active = activeRoot.host;
    activeRoot = __WEBPACK_IMPORTED_MODULE_0__utils_js__["h" /* ownerShadyRootForNode */](active);
  }
  if (node === document) {
    // This node is the document, so activeRoot should be null.
    return activeRoot ? null : active;
  } else {
    // This node is a non-document shady root, and it should be
    // activeRoot.
    return activeRoot === node ? active : null;
  }
}

let OutsideAccessors = {

  parentElement: {
    /** @this {Node} */
    get() {
      let l = this.__shady && this.__shady.parentNode;
      if (l && l.nodeType !== Node.ELEMENT_NODE) {
        l = null;
      }
      return l !== undefined ? l : __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["parentElement"](this);
    },
    configurable: true
  },

  parentNode: {
    /** @this {Node} */
    get() {
      let l = this.__shady && this.__shady.parentNode;
      return l !== undefined ? l : __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["parentNode"](this);
    },
    configurable: true
  },

  nextSibling: {
    /** @this {Node} */
    get() {
      let l = this.__shady && this.__shady.nextSibling;
      return l !== undefined ? l : __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["nextSibling"](this);
    },
    configurable: true
  },

  previousSibling: {
    /** @this {Node} */
    get() {
      let l = this.__shady && this.__shady.previousSibling;
      return l !== undefined ? l : __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["previousSibling"](this);
    },
    configurable: true
  },

  className: {
    /**
     * @this {HTMLElement}
     */
    get() {
      return this.getAttribute('class') || '';
    },
    /**
     * @this {HTMLElement}
     */
    set(value) {
      this.setAttribute('class', value);
    },
    configurable: true
  },

  // fragment, element, document
  nextElementSibling: {
    /**
     * @this {HTMLElement}
     */
    get() {
      if (this.__shady && this.__shady.nextSibling !== undefined) {
        let n = this.nextSibling;
        while (n && n.nodeType !== Node.ELEMENT_NODE) {
          n = n.nextSibling;
        }
        return n;
      } else {
        return __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["nextElementSibling"](this);
      }
    },
    configurable: true
  },

  previousElementSibling: {
    /**
     * @this {HTMLElement}
     */
    get() {
      if (this.__shady && this.__shady.previousSibling !== undefined) {
        let n = this.previousSibling;
        while (n && n.nodeType !== Node.ELEMENT_NODE) {
          n = n.previousSibling;
        }
        return n;
      } else {
        return __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["previousElementSibling"](this);
      }
    },
    configurable: true
  }

};

let InsideAccessors = {

  childNodes: {
    /**
     * @this {HTMLElement}
     */
    get() {
      let childNodes;
      if (__WEBPACK_IMPORTED_MODULE_0__utils_js__["d" /* isTrackingLogicalChildNodes */](this)) {
        if (!this.__shady.childNodes) {
          this.__shady.childNodes = [];
          for (let n=this.firstChild; n; n=n.nextSibling) {
            this.__shady.childNodes.push(n);
          }
        }
        childNodes = this.__shady.childNodes;
      } else {
        childNodes = __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["childNodes"](this);
      }
      childNodes.item = function(index) {
        return childNodes[index];
      }
      return childNodes;
    },
    configurable: true
  },

  childElementCount: {
    /** @this {HTMLElement} */
    get() {
      return this.children.length;
    },
    configurable: true
  },

  firstChild: {
    /** @this {HTMLElement} */
    get() {
      let l = this.__shady && this.__shady.firstChild;
      return l !== undefined ? l : __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["firstChild"](this);
    },
    configurable: true
  },

  lastChild: {
  /** @this {HTMLElement} */
    get() {
      let l = this.__shady && this.__shady.lastChild;
      return l !== undefined ? l : __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["lastChild"](this);
    },
    configurable: true
  },

  textContent: {
    /**
     * @this {HTMLElement}
     */
    get() {
      if (__WEBPACK_IMPORTED_MODULE_0__utils_js__["d" /* isTrackingLogicalChildNodes */](this)) {
        let tc = [];
        for (let i = 0, cn = this.childNodes, c; (c = cn[i]); i++) {
          if (c.nodeType !== Node.COMMENT_NODE) {
            tc.push(c.textContent);
          }
        }
        return tc.join('');
      } else {
        return __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["textContent"](this);
      }
    },
    /**
     * @this {HTMLElement}
     * @param {string} text
     */
    set(text) {
      switch (this.nodeType) {
        case Node.ELEMENT_NODE:
        case Node.DOCUMENT_FRAGMENT_NODE:
          clearNode(this);
          // Document fragments must have no childnodes if setting a blank string
          if (text.length > 0 || this.nodeType === Node.ELEMENT_NODE) {
            this.appendChild(document.createTextNode(text));
          }
          break;
        default:
          // TODO(sorvell): can't do this if patch nodeValue.
          this.nodeValue = text;
          break;
      }
    },
    configurable: true
  },

  // fragment, element, document
  firstElementChild: {
    /**
     * @this {HTMLElement}
     */
    get() {
      if (this.__shady && this.__shady.firstChild !== undefined) {
        let n = this.firstChild;
        while (n && n.nodeType !== Node.ELEMENT_NODE) {
          n = n.nextSibling;
        }
        return n;
      } else {
        return __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["firstElementChild"](this);
      }
    },
    configurable: true
  },

  lastElementChild: {
    /**
     * @this {HTMLElement}
     */
    get() {
      if (this.__shady && this.__shady.lastChild !== undefined) {
        let n = this.lastChild;
        while (n && n.nodeType !== Node.ELEMENT_NODE) {
          n = n.previousSibling;
        }
        return n;
      } else {
        return __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["lastElementChild"](this);
      }
    },
    configurable: true
  },

  children: {
    /**
     * @this {HTMLElement}
     */
    get() {
      let children;
      if (__WEBPACK_IMPORTED_MODULE_0__utils_js__["d" /* isTrackingLogicalChildNodes */](this)) {
        children = Array.prototype.filter.call(this.childNodes, function(n) {
          return (n.nodeType === Node.ELEMENT_NODE);
        });
      } else {
        children = __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["children"](this);
      }
      children.item = function(index) {
        return children[index];
      }
      return children;
    },
    configurable: true
  },

  // element (HTMLElement on IE11)
  innerHTML: {
    /**
     * @this {HTMLElement}
     */
    get() {
      let content = this.localName === 'template' ?
        /** @type {HTMLTemplateElement} */(this).content : this;
      if (__WEBPACK_IMPORTED_MODULE_0__utils_js__["d" /* isTrackingLogicalChildNodes */](this)) {
        return Object(__WEBPACK_IMPORTED_MODULE_1__innerHTML_js__["a" /* getInnerHTML */])(content);
      } else {
        return __WEBPACK_IMPORTED_MODULE_2__native_tree_js__["innerHTML"](content);
      }
    },
    /**
     * @this {HTMLElement}
     */
    set(text) {
      let content = this.localName === 'template' ?
        /** @type {HTMLTemplateElement} */(this).content : this;
      clearNode(content);
      if (nativeInnerHTMLDesc && nativeInnerHTMLDesc.set) {
        nativeInnerHTMLDesc.set.call(htmlContainer, text);
      } else {
        htmlContainer.innerHTML = text;
      }
      while (htmlContainer.firstChild) {
        content.appendChild(htmlContainer.firstChild);
      }
    },
    configurable: true
  }

};

// Note: Can be patched on element prototype on all browsers.
// Must be patched on instance on browsers that support native Shadow DOM
// but do not have builtin accessors (old Chrome).
let ShadowRootAccessor = {

  shadowRoot: {
    /**
     * @this {HTMLElement}
     */
    get() {
      return this.__shady && this.__shady.publicRoot || null;
    },
    configurable: true
  }
};

// Note: Can be patched on document prototype on browsers with builtin accessors.
// Must be patched separately on simulated ShadowRoot.
// Must be patched as `_activeElement` on browsers without builtin accessors.
let ActiveElementAccessor = {

  activeElement: {
    /**
     * @this {HTMLElement}
     */
    get() {
      return activeElementForNode(this);
    },
    /**
     * @this {HTMLElement}
     */
    set() {},
    configurable: true
  }

};

// patch a group of descriptors on an object only if it exists or if the `force`
// argument is true.
/**
 * @param {!Object} obj
 * @param {!Object} descriptors
 * @param {boolean=} force
 */
function patchAccessorGroup(obj, descriptors, force) {
  for (let p in descriptors) {
    let objDesc = Object.getOwnPropertyDescriptor(obj, p);
    if ((objDesc && objDesc.configurable) ||
      (!objDesc && force)) {
      Object.defineProperty(obj, p, descriptors[p]);
    } else if (force) {
      console.warn('Could not define', p, 'on', obj);
    }
  }
}

// patch dom accessors on proto where they exist
function patchAccessors(proto) {
  patchAccessorGroup(proto, OutsideAccessors);
  patchAccessorGroup(proto, InsideAccessors);
  patchAccessorGroup(proto, ActiveElementAccessor);
}

// ensure element descriptors (IE/Edge don't have em)
function patchShadowRootAccessors(proto) {
  patchAccessorGroup(proto, InsideAccessors, true);
  patchAccessorGroup(proto, ActiveElementAccessor, true);
}

// ensure an element has patched "outside" accessors; no-op when not needed
let patchOutsideElementAccessors = __WEBPACK_IMPORTED_MODULE_0__utils_js__["j" /* settings */].hasDescriptors ?
  function() {} : function(element) {
    if (!(element.__shady && element.__shady.__outsideAccessors)) {
      element.__shady = element.__shady || {};
      element.__shady.__outsideAccessors = true;
      patchAccessorGroup(element, OutsideAccessors, true);
    }
  }

// ensure an element has patched "inside" accessors; no-op when not needed
let patchInsideElementAccessors = __WEBPACK_IMPORTED_MODULE_0__utils_js__["j" /* settings */].hasDescriptors ?
  function() {} : function(element) {
    if (!(element.__shady && element.__shady.__insideAccessors)) {
      element.__shady = element.__shady || {};
      element.__shady.__insideAccessors = true;
      patchAccessorGroup(element, InsideAccessors, true);
      patchAccessorGroup(element, ShadowRootAccessor, true);
    }
  }


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_parse_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style_util_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style_settings_js__ = __webpack_require__(3);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



 // eslint-disable-line no-unused-vars



/* Transforms ShadowDOM styling into ShadyDOM styling

* scoping:

  * elements in scope get scoping selector class="x-foo-scope"
  * selectors re-written as follows:

    div button -> div.x-foo-scope button.x-foo-scope

* :host -> scopeName

* :host(...) -> scopeName...

* ::slotted(...) -> scopeName > ...

* ...:dir(ltr|rtl) -> [dir="ltr|rtl"] ..., ...[dir="ltr|rtl"]

* :host(:dir[rtl]) -> scopeName:dir(rtl) -> [dir="rtl"] scopeName, scopeName[dir="rtl"]

*/
const SCOPE_NAME = 'style-scope';

class StyleTransformer {
  get SCOPE_NAME() {
    return SCOPE_NAME;
  }
  // Given a node and scope name, add a scoping class to each node
  // in the tree. This facilitates transforming css into scoped rules.
  dom(node, scope, shouldRemoveScope) {
    // one time optimization to skip scoping...
    if (node['__styleScoped']) {
      node['__styleScoped'] = null;
    } else {
      this._transformDom(node, scope || '', shouldRemoveScope);
    }
  }

  _transformDom(node, selector, shouldRemoveScope) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      this.element(node, selector, shouldRemoveScope);
    }
    let c$ = (node.localName === 'template') ?
      (node.content || node._content).childNodes :
      node.children || node.childNodes;
    if (c$) {
      for (let i=0; i<c$.length; i++) {
        this._transformDom(c$[i], selector, shouldRemoveScope);
      }
    }
  }

  element(element, scope, shouldRemoveScope) {
    // note: if using classes, we add both the general 'style-scope' class
    // as well as the specific scope. This enables easy filtering of all
    // `style-scope` elements
    if (scope) {
      // note: svg on IE does not have classList so fallback to class
      if (element.classList) {
        if (shouldRemoveScope) {
          element.classList.remove(SCOPE_NAME);
          element.classList.remove(scope);
        } else {
          element.classList.add(SCOPE_NAME);
          element.classList.add(scope);
        }
      } else if (element.getAttribute) {
        let c = element.getAttribute(CLASS);
        if (shouldRemoveScope) {
          if (c) {
            let newValue = c.replace(SCOPE_NAME, '').replace(scope, '');
            __WEBPACK_IMPORTED_MODULE_1__style_util_js__["i" /* setElementClassRaw */](element, newValue);
          }
        } else {
          let newValue = (c ? c + ' ' : '') + SCOPE_NAME + ' ' + scope;
          __WEBPACK_IMPORTED_MODULE_1__style_util_js__["i" /* setElementClassRaw */](element, newValue);
        }
      }
    }
  }

  elementStyles(element, styleRules, callback) {
    let cssBuildType = element['__cssBuild'];
    // no need to shim selectors if settings.useNativeShadow, also
    // a shady css build will already have transformed selectors
    // NOTE: This method may be called as part of static or property shimming.
    // When there is a targeted build it will not be called for static shimming,
    // but when the property shim is used it is called and should opt out of
    // static shimming work when a proper build exists.
    let cssText = '';
    if (__WEBPACK_IMPORTED_MODULE_2__style_settings_js__["b" /* nativeShadow */] || cssBuildType === 'shady') {
      cssText = __WEBPACK_IMPORTED_MODULE_1__style_util_js__["j" /* toCssText */](styleRules, callback);
    } else {
      let {is, typeExtension} = __WEBPACK_IMPORTED_MODULE_1__style_util_js__["e" /* getIsExtends */](element);
      cssText = this.css(styleRules, is, typeExtension, callback) + '\n\n';
    }
    return cssText.trim();
  }

  // Given a string of cssText and a scoping string (scope), returns
  // a string of scoped css where each selector is transformed to include
  // a class created from the scope. ShadowDOM selectors are also transformed
  // (e.g. :host) to use the scoping selector.
  css(rules, scope, ext, callback) {
    let hostScope = this._calcHostScope(scope, ext);
    scope = this._calcElementScope(scope);
    let self = this;
    return __WEBPACK_IMPORTED_MODULE_1__style_util_js__["j" /* toCssText */](rules, function(/** StyleNode */rule) {
      if (!rule.isScoped) {
        self.rule(rule, scope, hostScope);
        rule.isScoped = true;
      }
      if (callback) {
        callback(rule, scope, hostScope);
      }
    });
  }

  _calcElementScope(scope) {
    if (scope) {
      return CSS_CLASS_PREFIX + scope;
    } else {
      return '';
    }
  }

  _calcHostScope(scope, ext) {
    return ext ? `[is=${scope}]` : scope;
  }

  rule(rule, scope, hostScope) {
    this._transformRule(rule, this._transformComplexSelector,
      scope, hostScope);
  }

  /**
   * transforms a css rule to a scoped rule.
   *
   * @param {StyleNode} rule
   * @param {Function} transformer
   * @param {string=} scope
   * @param {string=} hostScope
   */
  _transformRule(rule, transformer, scope, hostScope) {
    // NOTE: save transformedSelector for subsequent matching of elements
    // against selectors (e.g. when calculating style properties)
    rule['selector'] = rule.transformedSelector =
      this._transformRuleCss(rule, transformer, scope, hostScope);
  }

  /**
   * @param {StyleNode} rule
   * @param {Function} transformer
   * @param {string=} scope
   * @param {string=} hostScope
   */
  _transformRuleCss(rule, transformer, scope, hostScope) {
    let p$ = rule['selector'].split(COMPLEX_SELECTOR_SEP);
    // we want to skip transformation of rules that appear in keyframes,
    // because they are keyframe selectors, not element selectors.
    if (!__WEBPACK_IMPORTED_MODULE_1__style_util_js__["f" /* isKeyframesSelector */](rule)) {
      for (let i=0, l=p$.length, p; (i<l) && (p=p$[i]); i++) {
        p$[i] = transformer.call(this, p, scope, hostScope);
      }
    }
    return p$.join(COMPLEX_SELECTOR_SEP);
  }

  /**
   * @param {string} selector
   * @return {string}
   */
  _twiddleNthPlus(selector) {
    return selector.replace(NTH, (m, type, inside) => {
      if (inside.indexOf('+') > -1) {
        inside = inside.replace(/\+/g, '___');
      } else if (inside.indexOf('___') > -1) {
        inside = inside.replace(/___/g, '+');
      }
      return `:${type}(${inside})`;
    });
  }

/**
 * @param {string} selector
 * @param {string} scope
 * @param {string=} hostScope
 */
  _transformComplexSelector(selector, scope, hostScope) {
    let stop = false;
    selector = selector.trim();
    // Remove spaces inside of selectors like `:nth-of-type` because it confuses SIMPLE_SELECTOR_SEP
    let isNth = NTH.test(selector);
    if (isNth) {
      selector = selector.replace(NTH, (m, type, inner) => `:${type}(${inner.replace(/\s/g, '')})`)
      selector = this._twiddleNthPlus(selector);
    }
    selector = selector.replace(SLOTTED_START, `${HOST} $1`);
    selector = selector.replace(SIMPLE_SELECTOR_SEP, (m, c, s) => {
      if (!stop) {
        let info = this._transformCompoundSelector(s, c, scope, hostScope);
        stop = stop || info.stop;
        c = info.combinator;
        s = info.value;
      }
      return c + s;
    });
    if (isNth) {
      selector = this._twiddleNthPlus(selector);
    }
    return selector;
  }

  _transformCompoundSelector(selector, combinator, scope, hostScope) {
    // replace :host with host scoping class
    let slottedIndex = selector.indexOf(SLOTTED);
    if (selector.indexOf(HOST) >= 0) {
      selector = this._transformHostSelector(selector, hostScope);
    // replace other selectors with scoping class
    } else if (slottedIndex !== 0) {
      selector = scope ? this._transformSimpleSelector(selector, scope) :
        selector;
    }
    // mark ::slotted() scope jump to replace with descendant selector + arg
    // also ignore left-side combinator
    let slotted = false;
    if (slottedIndex >= 0) {
      combinator = '';
      slotted = true;
    }
    // process scope jumping selectors up to the scope jump and then stop
    let stop;
    if (slotted) {
      stop = true;
      if (slotted) {
        // .zonk ::slotted(.foo) -> .zonk.scope > .foo
        selector = selector.replace(SLOTTED_PAREN, (m, paren) => ` > ${paren}`);
      }
    }
    selector = selector.replace(DIR_PAREN, (m, before, dir) =>
      `[dir="${dir}"] ${before}, ${before}[dir="${dir}"]`);
    return {value: selector, combinator, stop};
  }

  _transformSimpleSelector(selector, scope) {
    let p$ = selector.split(PSEUDO_PREFIX);
    p$[0] += scope;
    return p$.join(PSEUDO_PREFIX);
  }

  // :host(...) -> scopeName...
  _transformHostSelector(selector, hostScope) {
    let m = selector.match(HOST_PAREN);
    let paren = m && m[2].trim() || '';
    if (paren) {
      if (!paren[0].match(SIMPLE_SELECTOR_PREFIX)) {
        // paren starts with a type selector
        let typeSelector = paren.split(SIMPLE_SELECTOR_PREFIX)[0];
        // if the type selector is our hostScope then avoid pre-pending it
        if (typeSelector === hostScope) {
          return paren;
        // otherwise, this selector should not match in this scope so
        // output a bogus selector.
        } else {
          return SELECTOR_NO_MATCH;
        }
      } else {
        // make sure to do a replace here to catch selectors like:
        // `:host(.foo)::before`
        return selector.replace(HOST_PAREN, function(m, host, paren) {
          return hostScope + paren;
        });
      }
    // if no paren, do a straight :host replacement.
    // TODO(sorvell): this should not strictly be necessary but
    // it's needed to maintain support for `:host[foo]` type selectors
    // which have been improperly used under Shady DOM. This should be
    // deprecated.
    } else {
      return selector.replace(HOST, hostScope);
    }
  }

  /**
   * @param {StyleNode} rule
   */
  documentRule(rule) {
    // reset selector in case this is redone.
    rule['selector'] = rule['parsedSelector'];
    this.normalizeRootSelector(rule);
    this._transformRule(rule, this._transformDocumentSelector);
  }

  /**
   * @param {StyleNode} rule
   */
  normalizeRootSelector(rule) {
    if (rule['selector'] === ROOT) {
      rule['selector'] = 'html';
    }
  }

/**
 * @param {string} selector
 */
  _transformDocumentSelector(selector) {
    return selector.match(SLOTTED) ?
      this._transformComplexSelector(selector, SCOPE_DOC_SELECTOR) :
      this._transformSimpleSelector(selector.trim(), SCOPE_DOC_SELECTOR);
  }
}

let NTH = /:(nth[-\w]+)\(([^)]+)\)/;
let SCOPE_DOC_SELECTOR = `:not(.${SCOPE_NAME})`;
let COMPLEX_SELECTOR_SEP = ',';
let SIMPLE_SELECTOR_SEP = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g;
let SIMPLE_SELECTOR_PREFIX = /[[.:#*]/;
let HOST = ':host';
let ROOT = ':root';
let SLOTTED = '::slotted';
let SLOTTED_START = new RegExp(`^(${SLOTTED})`);
// NOTE: this supports 1 nested () pair for things like
// :host(:not([selected]), more general support requires
// parsing which seems like overkill
let HOST_PAREN = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
// similar to HOST_PAREN
let SLOTTED_PAREN = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/;
let DIR_PAREN = /(.*):dir\((?:(ltr|rtl))\)/;
let CSS_CLASS_PREFIX = '.';
let PSEUDO_PREFIX = ':';
let CLASS = 'class';
let SELECTOR_NO_MATCH = 'should_not_match';

/* harmony default export */ __webpack_exports__["a"] = (new StyleTransformer());

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const VAR_ASSIGN = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi;
/* harmony export (immutable) */ __webpack_exports__["g"] = VAR_ASSIGN;

const MIXIN_MATCH = /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi;
/* harmony export (immutable) */ __webpack_exports__["f"] = MIXIN_MATCH;

const VAR_CONSUMED = /(--[\w-]+)\s*([:,;)]|$)/gi;
/* harmony export (immutable) */ __webpack_exports__["h"] = VAR_CONSUMED;

const ANIMATION_MATCH = /(animation\s*:)|(animation-name\s*:)/;
/* harmony export (immutable) */ __webpack_exports__["a"] = ANIMATION_MATCH;

const MEDIA_MATCH = /@media\s(.*)/;
/* harmony export (immutable) */ __webpack_exports__["e"] = MEDIA_MATCH;

const IS_VAR = /^--/;
/* unused harmony export IS_VAR */

const BRACKETED = /\{[^}]*\}/g;
/* harmony export (immutable) */ __webpack_exports__["b"] = BRACKETED;

const HOST_PREFIX = '(?:^|[^.#[:])';
/* harmony export (immutable) */ __webpack_exports__["c"] = HOST_PREFIX;

const HOST_SUFFIX = '($|[.:[\\s>+~])';
/* harmony export (immutable) */ __webpack_exports__["d"] = HOST_SUFFIX;



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Promise;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__internal__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__asap__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__promise_all__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__promise_race__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__promise_resolve__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__promise_reject__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__then__ = __webpack_require__(11);













function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[__WEBPACK_IMPORTED_MODULE_1__internal__["c" /* PROMISE_ID */]] = Object(__WEBPACK_IMPORTED_MODULE_1__internal__["k" /* nextId */])();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (__WEBPACK_IMPORTED_MODULE_1__internal__["l" /* noop */] !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? Object(__WEBPACK_IMPORTED_MODULE_1__internal__["h" /* initializePromise */])(this, resolver) : needsNew();
  }
}

Promise.all = __WEBPACK_IMPORTED_MODULE_3__promise_all__["a" /* default */];
Promise.race = __WEBPACK_IMPORTED_MODULE_4__promise_race__["a" /* default */];
Promise.resolve = __WEBPACK_IMPORTED_MODULE_5__promise_resolve__["a" /* default */];
Promise.reject = __WEBPACK_IMPORTED_MODULE_6__promise_reject__["a" /* default */];
Promise._setScheduler = __WEBPACK_IMPORTED_MODULE_2__asap__["c" /* setScheduler */];
Promise._setAsap = __WEBPACK_IMPORTED_MODULE_2__asap__["b" /* setAsap */];
Promise._asap = __WEBPACK_IMPORTED_MODULE_2__asap__["a" /* asap */];

Promise.prototype = {
  constructor: Promise,

/**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.

  ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```

  Chaining
  --------

  The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.

  ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });

  findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

  ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```

  Assimilation
  ------------

  Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.

  ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```

  If the assimliated promise rejects, then the downstream promise will also reject.

  ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```

  Simple Example
  --------------

  Synchronous Example

  ```javascript
  let result;

  try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```

  Errback Example

  ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```

  Promise Example;

  ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```

  Advanced Example
  --------------

  Synchronous Example

  ```javascript
  let author, books;

  try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```

  Errback Example

  ```js

  function foundBooks(books) {

  }

  function failure(reason) {

  }

  findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```

  Promise Example;

  ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```

  @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
*/
  then: __WEBPACK_IMPORTED_MODULE_7__then__["a" /* default */],

/**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.

  ```js
  function findAuthor(){
    throw new Error('couldn't find that author');
  }

  // synchronous
  try {
    findAuthor();
  } catch(reason) {
    // something went wrong
  }

  // async with promises
  findAuthor().catch(function(reason){
    // something went wrong
  });
  ```

  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
*/
  catch(onRejection) {
    return this.then(null, onRejection);
  }
};


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return asap; });
/* harmony export (immutable) */ __webpack_exports__["c"] = setScheduler;
/* harmony export (immutable) */ __webpack_exports__["b"] = setAsap;
var require;let len = 0;
let vertxNext;
let customSchedulerFn;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
}

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

const browserWindow = (typeof window !== 'undefined') ? window : undefined;
const browserGlobal = browserWindow || {};
const BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
const isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
const isWorker = typeof Uint8ClampedArray !== 'undefined' &&
  typeof importScripts !== 'undefined' &&
  typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return () => process.nextTick(flush);
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function() {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  let iterations = 0;
  const observer = new BrowserMutationObserver(flush);
  const node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return () => {
    node.data = (iterations = ++iterations % 2);
  };
}

// web worker
function useMessageChannel() {
  const channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return () => channel.port2.postMessage(0);
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  const globalSetTimeout = setTimeout;
  return () => globalSetTimeout(flush, 1);
}

const queue = new Array(1000);
function flush() {
  for (let i = 0; i < len; i+=2) {
    let callback = queue[i];
    let arg = queue[i+1];

    callback(arg);

    queue[i] = undefined;
    queue[i+1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    const r = require;
    const vertx = __webpack_require__(65);
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch(e) {
    return useSetTimeout();
  }
}

let scheduleFlush;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(64)))

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = resolve;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal__ = __webpack_require__(5);


/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  let Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  let promise = new Constructor(__WEBPACK_IMPORTED_MODULE_0__internal__["l" /* noop */]);
  Object(__WEBPACK_IMPORTED_MODULE_0__internal__["n" /* resolve */])(promise, object);
  return promise;
}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/* eslint-disable */
/**
 * ES5-style custom element classes will not work with native Custom Elements
 * because ES5-style classes cannot properly extend ES6 classes, like HTMLElement
 * and babel transpilation to ES5 using call and apply instead of Reflect.construct makes custom elements not usable in chrome
 * below shim helps resolve this issue until babel core fixes
 */
eval("\n    (function () {\n        'use strict';\n\n        (()=>{'use strict';if(!window.customElements)return;const a=window.HTMLElement,b=window.customElements.define,c=window.customElements.get,d=new Map,e=new Map;let f=!1,g=!1;window.HTMLElement=function(){if(!f){const a=d.get(this.constructor),b=c.call(window.customElements,a);g=!0;const e=new b;return e}f=!1;},window.HTMLElement.prototype=a.prototype;Object.defineProperty(window,'customElements',{value:window.customElements,configurable:!0,writable:!0}),Object.defineProperty(window.customElements,'define',{value:(c,h)=>{const i=h.prototype,j=class extends a{constructor(){super(),Object.setPrototypeOf(this,i),g||(f=!0,h.call(this)),g=!1;}},k=j.prototype;j.observedAttributes=h.observedAttributes,k.connectedCallback=i.connectedCallback,k.disconnectedCallback=i.disconnectedCallback,k.attributeChangedCallback=i.attributeChangedCallback,k.adoptedCallback=i.adoptedCallback,d.set(h,c),e.set(c,h),b.call(window.customElements,c,j);},configurable:!0,writable:!0}),Object.defineProperty(window.customElements,'get',{value:(a)=>e.get(a),configurable:!0,writable:!0});})();\n\n        /**\n        @license\n        Copyright (c) 2017 The Polymer Project Authors. All rights reserved.\n        This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt\n        The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt\n        The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt\n        Code distributed by Google as part of the polymer project is also\n        subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt\n        */\n    }());\n");

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webcomponents_custom_elements_src_custom_elements__ = __webpack_require__(37);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CustomElementInternals_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utilities_js__ = __webpack_require__(2);



/**
 * @typedef {{
 *   prepend: !function(...(!Node|string)),
  *  append: !function(...(!Node|string)),
 * }}
 */
let ParentNodeNativeMethods;

/**
 * @param {!CustomElementInternals} internals
 * @param {!Object} destination
 * @param {!ParentNodeNativeMethods} builtIn
 */
/* harmony default export */ __webpack_exports__["a"] = (function(internals, destination, builtIn) {
  /**
   * @param {...(!Node|string)} nodes
   */
  destination['prepend'] = function(...nodes) {
    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    const connectedBefore = /** @type {!Array<!Node>} */ (nodes.filter(node => {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["a" /* isConnected */](node);
    }));

    builtIn.prepend.apply(this, nodes);

    for (let i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (__WEBPACK_IMPORTED_MODULE_1__Utilities_js__["a" /* isConnected */](this)) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['append'] = function(...nodes) {
    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    const connectedBefore = /** @type {!Array<!Node>} */ (nodes.filter(node => {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["a" /* isConnected */](node);
    }));

    builtIn.append.apply(this, nodes);

    for (let i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (__WEBPACK_IMPORTED_MODULE_1__Utilities_js__["a" /* isConnected */](this)) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };
});;


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webcomponents_shadydom_src_shadydom__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__webcomponents_shadycss_entrypoints_scoping_shim__ = __webpack_require__(51);



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getOuterHTML */
/* harmony export (immutable) */ __webpack_exports__["a"] = getInnerHTML;
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// Cribbed from ShadowDOM polyfill
// https://github.com/webcomponents/webcomponentsjs/blob/master/src/ShadowDOM/wrappers/HTMLElement.js#L28
/////////////////////////////////////////////////////////////////////////////
// innerHTML and outerHTML

// http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#escapingString
let escapeAttrRegExp = /[&\u00A0"]/g;
let escapeDataRegExp = /[&\u00A0<>]/g;

function escapeReplace(c) {
  switch (c) {
    case '&':
      return '&amp;';
    case '<':
      return '&lt;';
    case '>':
      return '&gt;';
    case '"':
      return '&quot;';
    case '\u00A0':
      return '&nbsp;';
  }
}

function escapeAttr(s) {
  return s.replace(escapeAttrRegExp, escapeReplace);
}

function escapeData(s) {
  return s.replace(escapeDataRegExp, escapeReplace);
}

function makeSet(arr) {
  let set = {};
  for (let i = 0; i < arr.length; i++) {
    set[arr[i]] = true;
  }
  return set;
}

// http://www.whatwg.org/specs/web-apps/current-work/#void-elements
let voidElements = makeSet([
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]);

let plaintextParents = makeSet([
  'style',
  'script',
  'xmp',
  'iframe',
  'noembed',
  'noframes',
  'plaintext',
  'noscript'
]);

/**
 * @param {Node} node
 * @param {Node} parentNode
 * @param {Function=} callback
 */
function getOuterHTML(node, parentNode, callback) {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE: {
      let tagName = node.localName;
      let s = '<' + tagName;
      let attrs = node.attributes;
      for (let i = 0, attr; (attr = attrs[i]); i++) {
        s += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
      }
      s += '>';
      if (voidElements[tagName]) {
        return s;
      }
      return s + getInnerHTML(node, callback) + '</' + tagName + '>';
    }
    case Node.TEXT_NODE: {
      let data = /** @type {Text} */ (node).data;
      if (parentNode && plaintextParents[parentNode.localName]) {
        return data;
      }
      return escapeData(data);
    }
    case Node.COMMENT_NODE: {
      return '<!--' + /** @type {Comment} */ (node).data + '-->';
    }
    default: {
      window.console.error(node);
      throw new Error('not implemented');
    }
  }
}

/**
 * @param {Node} node
 * @param {Function=} callback
 */
function getInnerHTML(node, callback) {
  if (node.localName === 'template') {
    node =  /** @type {HTMLTemplateElement} */ (node).content;
  }
  let s = '';
  let c$ = callback ? callback(node) : node.childNodes;
  for (let i=0, l=c$.length, child; (i<l) && (child=c$[i]); i++) {
    s += getOuterHTML(child, node, callback);
  }
  return s;
}


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = insertBefore;
/* harmony export (immutable) */ __webpack_exports__["g"] = removeChild;
/* harmony export (immutable) */ __webpack_exports__["b"] = getRootNode;
/* harmony export (immutable) */ __webpack_exports__["e"] = query;
/* harmony export (immutable) */ __webpack_exports__["h"] = renderRootNode;
/* harmony export (immutable) */ __webpack_exports__["i"] = setAttribute;
/* harmony export (immutable) */ __webpack_exports__["f"] = removeAttribute;
/* harmony export (immutable) */ __webpack_exports__["a"] = cloneNode;
/* harmony export (immutable) */ __webpack_exports__["c"] = importNode;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__logical_tree_js__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__native_methods_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__native_tree_js__ = __webpack_require__(7);
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/






// Patched `insertBefore`. Note that all mutations that add nodes are routed
// here. When a <slot> is added or a node is added to a host with a shadowRoot
// with a slot, a standard dom `insert` call is aborted and `_asyncRender`
// is called on the relevant shadowRoot. In all other cases, a standard dom
// `insert` can be made, but the location and ref_node may need to be changed.
/**
 * @param {Node} parent
 * @param {Node} node
 * @param {Node=} ref_node
 */
function insertBefore(parent, node, ref_node) {
  if (node === parent) {
    throw Error(`Failed to execute 'appendChild' on 'Node': The new child element contains the parent.`);
  }
  if (ref_node) {
    let p = ref_node.__shady && ref_node.__shady.parentNode;
    if ((p !== undefined && p !== parent) ||
      (p === undefined && Object(__WEBPACK_IMPORTED_MODULE_3__native_tree_js__["parentNode"])(ref_node) !== parent)) {
      throw Error(`Failed to execute 'insertBefore' on 'Node': The node ` +
       `before which the new node is to be inserted is not a child of this node.`);
    }
  }
  if (ref_node === node) {
    return node;
  }
  // remove from existing location
  if (node.parentNode) {
    // NOTE: avoid node.removeChild as this *can* trigger another patched
    // method (e.g. custom elements) and we want only the shady method to run.
    removeChild(node.parentNode, node);
  }
  // add to new parent
  let preventNativeInsert;
  let ownerRoot = __WEBPACK_IMPORTED_MODULE_0__utils_js__["h" /* ownerShadyRootForNode */](parent);
  // if a slot is added, must render containing root.
  let slotsAdded = ownerRoot && findContainedSlots(node);
  if (ownerRoot && (parent.localName === 'slot' || slotsAdded)) {
    ownerRoot._asyncRender();
  }
  if (__WEBPACK_IMPORTED_MODULE_0__utils_js__["d" /* isTrackingLogicalChildNodes */](parent)) {
    __WEBPACK_IMPORTED_MODULE_1__logical_tree_js__["b" /* recordInsertBefore */](node, parent, ref_node);
    // when inserting into a host with a shadowRoot with slot, use
    // `shadowRoot._asyncRender()` via `attach-shadow` module
    if (hasShadowRootWithSlot(parent)) {
      parent.__shady.root._asyncRender();
      preventNativeInsert = true;
    // when inserting into a host with shadowRoot with NO slot, do nothing
    // as the node should not be added to composed dome anywhere.
    } else if (parent.__shady.root) {
      preventNativeInsert = true;
    }
  }
  if (!preventNativeInsert) {
    // if adding to a shadyRoot, add to host instead
    let container = __WEBPACK_IMPORTED_MODULE_0__utils_js__["c" /* isShadyRoot */](parent) ?
      /** @type {ShadowRoot} */(parent).host : parent;
    // if ref_node, get the ref_node that's actually in composed dom.
    if (ref_node) {
      ref_node = firstComposedNode(ref_node);
      __WEBPACK_IMPORTED_MODULE_2__native_methods_js__["insertBefore"].call(container, node, ref_node);
    } else {
      __WEBPACK_IMPORTED_MODULE_2__native_methods_js__["appendChild"].call(container, node);
    }
  }
  scheduleObserver(parent, node);
  // with insertion complete, can safely update insertion points.
  if (slotsAdded) {
    ownerRoot._addSlots(slotsAdded);
  }
  return node;
}

function findContainedSlots(node) {
  if (!node['__noInsertionPoint']) {
    let slots;
    if (node.localName === 'slot') {
      slots = [node];
    } else if (node.querySelectorAll) {
      slots = node.querySelectorAll('slot');
    }
    if (slots && slots.length) {
      return slots;
    }
  }
}

/**
 * Patched `removeChild`. Note that all dom "removals" are routed here.
 * Removes the given `node` from the element's `children`.
 * This method also performs dom composition.
 * @param {Node} parent
 * @param {Node} node
*/
function removeChild(parent, node) {
  if (node.parentNode !== parent) {
    throw Error('The node to be removed is not a child of this node: ' +
      node);
  }
  let preventNativeRemove;
  let ownerRoot = __WEBPACK_IMPORTED_MODULE_0__utils_js__["h" /* ownerShadyRootForNode */](node);
  let removingInsertionPoint;
  if (__WEBPACK_IMPORTED_MODULE_0__utils_js__["d" /* isTrackingLogicalChildNodes */](parent)) {
    __WEBPACK_IMPORTED_MODULE_1__logical_tree_js__["c" /* recordRemoveChild */](node, parent);
    if (hasShadowRootWithSlot(parent)) {
      parent.__shady.root._asyncRender();
      preventNativeRemove = true;
    }
  }
  removeOwnerShadyRoot(node);
  // if removing slot, must render containing root
  if (ownerRoot) {
    let changeSlotContent = parent && parent.localName === 'slot';
    if (changeSlotContent) {
      preventNativeRemove = true;
    }
    removingInsertionPoint = ownerRoot._removeContainedSlots(node);
    if (removingInsertionPoint || changeSlotContent) {
      ownerRoot._asyncRender();
    }
  }
  if (!preventNativeRemove) {
    // if removing from a shadyRoot, remove form host instead
    let container = __WEBPACK_IMPORTED_MODULE_0__utils_js__["c" /* isShadyRoot */](parent) ?
      /** @type {ShadowRoot} */(parent).host :
      parent;
    // not guaranteed to physically be in container; e.g.
    // (1) if parent has a shadyRoot, element may or may not at distributed
    // location (could be undistributed)
    // (2) if parent is a slot, element may not ben in composed dom
    if (!(parent.__shady.root || node.localName === 'slot') ||
      (container === Object(__WEBPACK_IMPORTED_MODULE_3__native_tree_js__["parentNode"])(node))) {
      __WEBPACK_IMPORTED_MODULE_2__native_methods_js__["removeChild"].call(container, node);
    }
  }
  scheduleObserver(parent, null, node);
  return node;
}

function removeOwnerShadyRoot(node) {
  // optimization: only reset the tree if node is actually in a root
  if (hasCachedOwnerRoot(node)) {
    let c$ = node.childNodes;
    for (let i=0, l=c$.length, n; (i<l) && (n=c$[i]); i++) {
      removeOwnerShadyRoot(n);
    }
  }
  if (node.__shady) {
    node.__shady.ownerShadyRoot = undefined;
  }
}

function hasCachedOwnerRoot(node) {
  return Boolean(node.__shady && node.__shady.ownerShadyRoot !== undefined);
}

/**
 * Finds the first flattened node that is composed in the node's parent.
 * If the given node is a slot, then the first flattened node is returned
 * if it exists, otherwise advance to the node's nextSibling.
 * @param {Node} node within which to find first composed node
 * @returns {Node} first composed node
 */
function firstComposedNode(node) {
  let composed = node;
  if (node && node.localName === 'slot') {
    let flattened = node.__shady && node.__shady.flattenedNodes;
    composed = flattened && flattened.length ? flattened[0] :
      firstComposedNode(node.nextSibling);
  }
  return composed;
}

function hasShadowRootWithSlot(node) {
  let root = node && node.__shady && node.__shady.root;
  return (root && root._hasInsertionPoint());
}

/**
 * Should be called whenever an attribute changes. If the `slot` attribute
 * changes, provokes rendering if necessary. If a `<slot>` element's `name`
 * attribute changes, updates the root's slot map and renders.
 * @param {Node} node
 * @param {string} name
 */
function distributeAttributeChange(node, name) {
  if (name === 'slot') {
    const parent = node.parentNode;
    if (hasShadowRootWithSlot(parent)) {
      parent.__shady.root._asyncRender();
    }
  } else if (node.localName === 'slot' && name === 'name') {
    let root = __WEBPACK_IMPORTED_MODULE_0__utils_js__["h" /* ownerShadyRootForNode */](node);
    if (root) {
      root._updateSlotName(node);
      root._asyncRender();
    }
  }
}

/**
 * @param {Node} node
 * @param {Node=} addedNode
 * @param {Node=} removedNode
 */
function scheduleObserver(node, addedNode, removedNode) {
  let observer = node.__shady && node.__shady.observer;
  if (observer) {
    if (addedNode) {
      observer.addedNodes.push(addedNode);
    }
    if (removedNode) {
      observer.removedNodes.push(removedNode);
    }
    observer.schedule();
  }
}

/**
 * @param {Node} node
 * @param {Object=} options
 */
function getRootNode(node, options) { // eslint-disable-line no-unused-vars
  if (!node || !node.nodeType) {
    return;
  }
  node.__shady = node.__shady || {};
  let root = node.__shady.ownerShadyRoot;
  if (root === undefined) {
    if (__WEBPACK_IMPORTED_MODULE_0__utils_js__["c" /* isShadyRoot */](node)) {
      root = node;
    } else {
      let parent = node.parentNode;
      root = parent ? getRootNode(parent) : node;
    }
    // memo-ize result for performance but only memo-ize
    // result if node is in the document. This avoids a problem where a root
    // can be cached while an element is inside a fragment.
    // If this happens and we cache the result, the value can become stale
    // because for perf we avoid processing the subtree of added fragments.
    if (document.documentElement.contains(node)) {
      node.__shady.ownerShadyRoot = root;
    }
  }
  return root;
}

// NOTE: `query` is used primarily for ShadyDOM's querySelector impl,
// but it's also generally useful to recurse through the element tree
// and is used by Polymer's styling system.
/**
 * @param {Node} node
 * @param {Function} matcher
 * @param {Function=} halter
 */
function query(node, matcher, halter) {
  let list = [];
  queryElements(node.childNodes, matcher,
    halter, list);
  return list;
}

function queryElements(elements, matcher, halter, list) {
  for (let i=0, l=elements.length, c; (i<l) && (c=elements[i]); i++) {
    if (c.nodeType === Node.ELEMENT_NODE &&
        queryElement(c, matcher, halter, list)) {
      return true;
    }
  }
}

function queryElement(node, matcher, halter, list) {
  let result = matcher(node);
  if (result) {
    list.push(node);
  }
  if (halter && halter(result)) {
    return result;
  }
  queryElements(node.childNodes, matcher,
    halter, list);
}

function renderRootNode(element) {
  var root = element.getRootNode();
  if (__WEBPACK_IMPORTED_MODULE_0__utils_js__["c" /* isShadyRoot */](root)) {
    root._render();
  }
}

let scopingShim = null;

function setAttribute(node, attr, value) {
  if (!scopingShim) {
    scopingShim = window['ShadyCSS'] && window['ShadyCSS']['ScopingShim'];
  }
  if (scopingShim && attr === 'class') {
    scopingShim['setElementClass'](node, value);
  } else {
    __WEBPACK_IMPORTED_MODULE_2__native_methods_js__["setAttribute"].call(node, attr, value);
    distributeAttributeChange(node, attr);
  }
}

function removeAttribute(node, attr) {
  __WEBPACK_IMPORTED_MODULE_2__native_methods_js__["removeAttribute"].call(node, attr);
  distributeAttributeChange(node, attr);
}

function cloneNode(node, deep) {
  if (node.localName == 'template') {
    return __WEBPACK_IMPORTED_MODULE_2__native_methods_js__["cloneNode"].call(node, deep);
  } else {
    let n = __WEBPACK_IMPORTED_MODULE_2__native_methods_js__["cloneNode"].call(node, false);
    if (deep) {
      let c$ = node.childNodes;
      for (let i=0, nc; i < c$.length; i++) {
        nc = c$[i].cloneNode(true);
        n.appendChild(nc);
      }
    }
    return n;
  }
}

// note: Though not technically correct, we fast path `importNode`
// when called on a node not owned by the main document.
// This allows, for example, elements that cannot
// contain custom elements and are therefore not likely to contain shadowRoots
// to cloned natively. This is a fairly significant performance win.
function importNode(node, deep) {
  if (node.ownerDocument !== document) {
    return __WEBPACK_IMPORTED_MODULE_2__native_methods_js__["importNode"].call(document, node, deep);
  }
  let n = __WEBPACK_IMPORTED_MODULE_2__native_methods_js__["importNode"].call(document, node, false);
  if (deep) {
    let c$ = node.childNodes;
    for (let i=0, nc; i < c$.length; i++) {
      nc = importNode(c$[i], true);
      n.appendChild(nc);
    }
  }
  return n;
}

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = recordInsertBefore;
/* harmony export (immutable) */ __webpack_exports__["c"] = recordRemoveChild;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return recordChildNodes; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__patch_accessors_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__native_tree_js__ = __webpack_require__(7);
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/




function recordInsertBefore(node, container, ref_node) {
  Object(__WEBPACK_IMPORTED_MODULE_0__patch_accessors_js__["d" /* patchInsideElementAccessors */])(container);
  container.__shady = container.__shady || {};
  if (container.__shady.firstChild !== undefined) {
    container.__shady.childNodes = null;
  }
  // handle document fragments
  if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    let c$ = node.childNodes;
    for (let i=0; i < c$.length; i++) {
      linkNode(c$[i], container, ref_node);
    }
    // cleanup logical dom in doc fragment.
    node.__shady = node.__shady || {};
    let resetTo = (node.__shady.firstChild !== undefined) ? null : undefined;
    node.__shady.firstChild = node.__shady.lastChild = resetTo;
    node.__shady.childNodes = resetTo;
  } else {
    linkNode(node, container, ref_node);
  }
}

function linkNode(node, container, ref_node) {
  Object(__WEBPACK_IMPORTED_MODULE_0__patch_accessors_js__["e" /* patchOutsideElementAccessors */])(node);
  ref_node = ref_node || null;
  node.__shady = node.__shady || {};
  container.__shady = container.__shady || {};
  if (ref_node) {
    ref_node.__shady = ref_node.__shady || {};
  }
  // update ref_node.previousSibling <-> node
  node.__shady.previousSibling = ref_node ? ref_node.__shady.previousSibling :
    container.lastChild;
  let ps = node.__shady.previousSibling;
  if (ps && ps.__shady) {
    ps.__shady.nextSibling = node;
  }
  // update node <-> ref_node
  let ns = node.__shady.nextSibling = ref_node;
  if (ns && ns.__shady) {
    ns.__shady.previousSibling = node;
  }
  // update node <-> container
  node.__shady.parentNode = container;
  if (ref_node) {
    if (ref_node === container.__shady.firstChild) {
      container.__shady.firstChild = node;
    }
  } else {
    container.__shady.lastChild = node;
    if (!container.__shady.firstChild) {
      container.__shady.firstChild = node;
    }
  }
  // remove caching of childNodes
  container.__shady.childNodes = null;
}

function recordRemoveChild(node, container) {
  node.__shady = node.__shady || {};
  container.__shady = container.__shady || {};
  if (node === container.__shady.firstChild) {
    container.__shady.firstChild = node.__shady.nextSibling;
  }
  if (node === container.__shady.lastChild) {
    container.__shady.lastChild = node.__shady.previousSibling;
  }
  let p = node.__shady.previousSibling;
  let n = node.__shady.nextSibling;
  if (p) {
    p.__shady = p.__shady || {};
    p.__shady.nextSibling = n;
  }
  if (n) {
    n.__shady = n.__shady || {};
    n.__shady.previousSibling = p;
  }
  // When an element is removed, logical data is no longer tracked.
  // Explicitly set `undefined` here to indicate this. This is disginguished
  // from `null` which is set if info is null.
  node.__shady.parentNode = node.__shady.previousSibling =
    node.__shady.nextSibling = undefined;
  if (container.__shady.childNodes !== undefined) {
    // remove caching of childNodes
    container.__shady.childNodes = null;
  }
}

let recordChildNodes = function(node) {
  if (!node.__shady || node.__shady.firstChild === undefined) {
    node.__shady = node.__shady || {};
    node.__shady.firstChild = Object(__WEBPACK_IMPORTED_MODULE_1__native_tree_js__["firstChild"])(node);
    node.__shady.lastChild = Object(__WEBPACK_IMPORTED_MODULE_1__native_tree_js__["lastChild"])(node);
    Object(__WEBPACK_IMPORTED_MODULE_0__patch_accessors_js__["d" /* patchInsideElementAccessors */])(node);
    let c$ = node.__shady.childNodes = Object(__WEBPACK_IMPORTED_MODULE_1__native_tree_js__["childNodes"])(node);
    for (let i=0, n; (i<c$.length) && (n=c$[i]); i++) {
      n.__shady = n.__shady || {};
      n.__shady.parentNode = node;
      n.__shady.nextSibling = c$[i+1] || null;
      n.__shady.previousSibling = c$[i-1] || null;
      Object(__WEBPACK_IMPORTED_MODULE_0__patch_accessors_js__["e" /* patchOutsideElementAccessors */])(n);
    }
  }
}


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export findListener */
/* harmony export (immutable) */ __webpack_exports__["a"] = addEventListener;
/* harmony export (immutable) */ __webpack_exports__["c"] = removeEventListener;
/* harmony export (immutable) */ __webpack_exports__["b"] = patchEvents;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__native_methods_js__ = __webpack_require__(6);
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/




/*
Make this name unique so it is unlikely to conflict with properties on objects passed to `addEventListener`
https://github.com/webcomponents/shadydom/issues/173
*/
const /** string */ eventWrappersName = `__eventWrappers${Date.now()}`;

// https://github.com/w3c/webcomponents/issues/513#issuecomment-224183937
let alwaysComposed = {
  'blur': true,
  'focus': true,
  'focusin': true,
  'focusout': true,
  'click': true,
  'dblclick': true,
  'mousedown': true,
  'mouseenter': true,
  'mouseleave': true,
  'mousemove': true,
  'mouseout': true,
  'mouseover': true,
  'mouseup': true,
  'wheel': true,
  'beforeinput': true,
  'input': true,
  'keydown': true,
  'keyup': true,
  'compositionstart': true,
  'compositionupdate': true,
  'compositionend': true,
  'touchstart': true,
  'touchend': true,
  'touchmove': true,
  'touchcancel': true,
  'pointerover': true,
  'pointerenter': true,
  'pointerdown': true,
  'pointermove': true,
  'pointerup': true,
  'pointercancel': true,
  'pointerout': true,
  'pointerleave': true,
  'gotpointercapture': true,
  'lostpointercapture': true,
  'dragstart': true,
  'drag': true,
  'dragenter': true,
  'dragleave': true,
  'dragover': true,
  'drop': true,
  'dragend': true,
  'DOMActivate': true,
  'DOMFocusIn': true,
  'DOMFocusOut': true,
  'keypress': true
};

function pathComposer(startNode, composed) {
  let composedPath = [];
  let current = startNode;
  let startRoot = startNode === window ? window : startNode.getRootNode();
  while (current) {
    composedPath.push(current);
    if (current.assignedSlot) {
      current = current.assignedSlot;
    } else if (current.nodeType === Node.DOCUMENT_FRAGMENT_NODE && current.host && (composed || current !== startRoot)) {
      current = current.host;
    } else {
      current = current.parentNode;
    }
  }
  // event composedPath includes window when startNode's ownerRoot is document
  if (composedPath[composedPath.length - 1] === document) {
    composedPath.push(window);
  }
  return composedPath;
}

function retarget(refNode, path) {
  if (!__WEBPACK_IMPORTED_MODULE_0__utils_js__["c" /* isShadyRoot */]) {
    return refNode;
  }
  // If ANCESTOR's root is not a shadow root or ANCESTOR's root is BASE's
  // shadow-including inclusive ancestor, return ANCESTOR.
  let refNodePath = pathComposer(refNode, true);
  let p$ = path;
  for (let i=0, ancestor, lastRoot, root, rootIdx; i < p$.length; i++) {
    ancestor = p$[i];
    root = ancestor === window ? window : ancestor.getRootNode();
    if (root !== lastRoot) {
      rootIdx = refNodePath.indexOf(root);
      lastRoot = root;
    }
    if (!__WEBPACK_IMPORTED_MODULE_0__utils_js__["c" /* isShadyRoot */](root) || rootIdx > -1) {
      return ancestor;
    }
  }
}

let eventMixin = {

  /**
   * @this {Event}
   */
  get composed() {
    // isTrusted may not exist in this browser, so just check if isTrusted is explicitly false
    if (this.isTrusted !== false && this.__composed === undefined) {
      this.__composed = alwaysComposed[this.type];
    }
    return this.__composed || false;
  },

  /**
   * @this {Event}
   */
  composedPath() {
    if (!this.__composedPath) {
      this.__composedPath = pathComposer(this['__target'], this.composed);
    }
    return this.__composedPath;
  },

  /**
   * @this {Event}
   */
  get target() {
    return retarget(this.currentTarget, this.composedPath());
  },

  // http://w3c.github.io/webcomponents/spec/shadow/#event-relatedtarget-retargeting
  /**
   * @this {Event}
   */
  get relatedTarget() {
    if (!this.__relatedTarget) {
      return null;
    }
    if (!this.__relatedTargetComposedPath) {
      this.__relatedTargetComposedPath = pathComposer(this.__relatedTarget, true);
    }
    // find the deepest node in relatedTarget composed path that is in the same root with the currentTarget
    return retarget(this.currentTarget, this.__relatedTargetComposedPath);
  },
  /**
   * @this {Event}
   */
  stopPropagation() {
    Event.prototype.stopPropagation.call(this);
    this.__propagationStopped = true;
  },
  /**
   * @this {Event}
   */
  stopImmediatePropagation() {
    Event.prototype.stopImmediatePropagation.call(this);
    this.__immediatePropagationStopped = true;
    this.__propagationStopped = true;
  }

};

function mixinComposedFlag(Base) {
  // NOTE: avoiding use of `class` here so that transpiled output does not
  // try to do `Base.call` with a dom construtor.
  let klazz = function(type, options) {
    let event = new Base(type, options);
    event.__composed = options && Boolean(options['composed']);
    return event;
  }
  // put constructor properties on subclass
  __WEBPACK_IMPORTED_MODULE_0__utils_js__["g" /* mixin */](klazz, Base);
  klazz.prototype = Base.prototype;
  return klazz;
}

let nonBubblingEventsToRetarget = {
  'focus': true,
  'blur': true
};


function fireHandlers(event, node, phase) {
  let hs = node.__handlers && node.__handlers[event.type] &&
    node.__handlers[event.type][phase];
  if (hs) {
    for (let i = 0, fn; (fn = hs[i]); i++) {
      if (event.target === event.relatedTarget) {
        return;
      }
      fn.call(node, event);
      if (event.__immediatePropagationStopped) {
        return;
      }
    }
  }
}

function retargetNonBubblingEvent(e) {
  let path = e.composedPath();
  let node;
  // override `currentTarget` to let patched `target` calculate correctly
  Object.defineProperty(e, 'currentTarget', {
    get: function() {
      return node;
    },
    configurable: true
  });
  for (let i = path.length - 1; i >= 0; i--) {
    node = path[i];
    // capture phase fires all capture handlers
    fireHandlers(e, node, 'capture');
    if (e.__propagationStopped) {
      return;
    }
  }

  // set the event phase to `AT_TARGET` as in spec
  Object.defineProperty(e, 'eventPhase', {get() { return Event.AT_TARGET }});

  // the event only needs to be fired when owner roots change when iterating the event path
  // keep track of the last seen owner root
  let lastFiredRoot;
  for (let i = 0; i < path.length; i++) {
    node = path[i];
    const root = node.__shady && node.__shady.root;
    if (i === 0 || (root && root === lastFiredRoot)) {
      fireHandlers(e, node, 'bubble');
      // don't bother with window, it doesn't have `getRootNode` and will be last in the path anyway
      if (node !== window) {
        lastFiredRoot = node.getRootNode();
      }
      if (e.__propagationStopped) {
        return;
      }
    }
  }
}

function listenerSettingsEqual(savedListener, node, type, capture, once, passive) {
  let {
    node: savedNode,
    type: savedType,
    capture: savedCapture,
    once: savedOnce,
    passive: savedPassive
  } = savedListener;
  return node === savedNode &&
    type === savedType &&
    capture === savedCapture &&
    once === savedOnce &&
    passive === savedPassive;
}

function findListener(wrappers, node, type, capture, once, passive) {
  for (let i = 0; i < wrappers.length; i++) {
    if (listenerSettingsEqual(wrappers[i], node, type, capture, once, passive)) {
      return i;
    }
  }
  return -1;
}

/**
 * Firefox can throw on accessing eventWrappers inside of `removeEventListener` during a selenium run
 * Try/Catch accessing eventWrappers to work around
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1353074
 */
function getEventWrappers(eventLike) {
  let wrappers = null;
  try {
    wrappers = eventLike[eventWrappersName];
  } catch (e) {} // eslint-disable-line no-empty
  return wrappers;
}

/**
 * @this {Event}
 */
function addEventListener(type, fnOrObj, optionsOrCapture) {
  if (!fnOrObj) {
    return;
  }

  // The callback `fn` might be used for multiple nodes/events. Since we generate
  // a wrapper function, we need to keep track of it when we remove the listener.
  // It's more efficient to store the node/type/options information as Array in
  // `fn` itself rather than the node (we assume that the same callback is used
  // for few nodes at most, whereas a node will likely have many event listeners).
  // NOTE(valdrin) invoking external functions is costly, inline has better perf.
  let capture, once, passive;
  if (typeof optionsOrCapture === 'object') {
    capture = Boolean(optionsOrCapture.capture);
    once = Boolean(optionsOrCapture.once);
    passive = Boolean(optionsOrCapture.passive);
  } else {
    capture = Boolean(optionsOrCapture);
    once = false;
    passive = false;
  }
  // hack to let ShadyRoots have event listeners
  // event listener will be on host, but `currentTarget`
  // will be set to shadyroot for event listener
  let target = (optionsOrCapture && optionsOrCapture.__shadyTarget) || this;

  let wrappers = fnOrObj[eventWrappersName];
  if (wrappers) {
    // Stop if the wrapper function has already been created.
    if (findListener(wrappers, target, type, capture, once, passive) > -1) {
      return;
    }
  } else {
    fnOrObj[eventWrappersName] = [];
  }

  /**
   * @this {HTMLElement}
   */
  const wrapperFn = function(e) {
    // Support `once` option.
    if (once) {
      this.removeEventListener(type, fnOrObj, optionsOrCapture);
    }
    if (!e['__target']) {
      patchEvent(e);
    }
    let lastCurrentTargetDesc;
    if (target !== this) {
      // replace `currentTarget` to make `target` and `relatedTarget` correct for inside the shadowroot
      lastCurrentTargetDesc = Object.getOwnPropertyDescriptor(e, 'currentTarget');
      Object.defineProperty(e, 'currentTarget', {get() { return target }, configurable: true});
    }
    // There are two critera that should stop events from firing on this node
    // 1. the event is not composed and the current node is not in the same root as the target
    // 2. when bubbling, if after retargeting, relatedTarget and target point to the same node
    if (e.composed || e.composedPath().indexOf(target) > -1) {
      if (e.target === e.relatedTarget) {
        if (e.eventPhase === Event.BUBBLING_PHASE) {
          e.stopImmediatePropagation();
        }
        return;
      }
      // prevent non-bubbling events from triggering bubbling handlers on shadowroot, but only if not in capture phase
      if (e.eventPhase !== Event.CAPTURING_PHASE && !e.bubbles && e.target !== target) {
        return;
      }
      let ret = (typeof fnOrObj === 'object' && fnOrObj.handleEvent) ?
        fnOrObj.handleEvent(e) :
        fnOrObj.call(target, e);
      if (target !== this) {
        // replace the "correct" `currentTarget`
        if (lastCurrentTargetDesc) {
          Object.defineProperty(e, 'currentTarget', lastCurrentTargetDesc);
          lastCurrentTargetDesc = null;
        } else {
          delete e['currentTarget'];
        }
      }
      return ret;
    }
  };
  // Store the wrapper information.
  fnOrObj[eventWrappersName].push({
    node: this,
    type: type,
    capture: capture,
    once: once,
    passive: passive,
    wrapperFn: wrapperFn
  });

  if (nonBubblingEventsToRetarget[type]) {
    this.__handlers = this.__handlers || {};
    this.__handlers[type] = this.__handlers[type] ||
      {'capture': [], 'bubble': []};
    this.__handlers[type][capture ? 'capture' : 'bubble'].push(wrapperFn);
  } else {
    let ael = this instanceof Window ? __WEBPACK_IMPORTED_MODULE_1__native_methods_js__["windowAddEventListener"] :
      __WEBPACK_IMPORTED_MODULE_1__native_methods_js__["addEventListener"];
    ael.call(this, type, wrapperFn, optionsOrCapture);
  }
}

/**
 * @this {Event}
 */
function removeEventListener(type, fnOrObj, optionsOrCapture) {
  if (!fnOrObj) {
    return;
  }

  // NOTE(valdrin) invoking external functions is costly, inline has better perf.
  let capture, once, passive;
  if (typeof optionsOrCapture === 'object') {
    capture = Boolean(optionsOrCapture.capture);
    once = Boolean(optionsOrCapture.once);
    passive = Boolean(optionsOrCapture.passive);
  } else {
    capture = Boolean(optionsOrCapture);
    once = false;
    passive = false;
  }
  let target = (optionsOrCapture && optionsOrCapture.__shadyTarget) || this;
  // Search the wrapped function.
  let wrapperFn = undefined;
  let wrappers = getEventWrappers(fnOrObj);
  if (wrappers) {
    let idx = findListener(wrappers, target, type, capture, once, passive);
    if (idx > -1) {
      wrapperFn = wrappers.splice(idx, 1)[0].wrapperFn;
      // Cleanup.
      if (!wrappers.length) {
        fnOrObj[eventWrappersName] = undefined;
      }
    }
  }
  let rel = this instanceof Window ? __WEBPACK_IMPORTED_MODULE_1__native_methods_js__["windowRemoveEventListener"] :
    __WEBPACK_IMPORTED_MODULE_1__native_methods_js__["removeEventListener"];
  rel.call(this, type, wrapperFn || fnOrObj, optionsOrCapture);
  if (wrapperFn && nonBubblingEventsToRetarget[type] &&
      this.__handlers && this.__handlers[type]) {
    const arr = this.__handlers[type][capture ? 'capture' : 'bubble'];
    const idx = arr.indexOf(wrapperFn);
    if (idx > -1) {
      arr.splice(idx, 1);
    }
  }
}

function activateFocusEventOverrides() {
  for (let ev in nonBubblingEventsToRetarget) {
    window.addEventListener(ev, function(e) {
      if (!e['__target']) {
        patchEvent(e);
        retargetNonBubblingEvent(e);
      }
    }, true);
  }
}

function patchEvent(event) {
  event['__target'] = event.target;
  event.__relatedTarget = event.relatedTarget;
  // patch event prototype if we can
  if (__WEBPACK_IMPORTED_MODULE_0__utils_js__["j" /* settings */].hasDescriptors) {
    __WEBPACK_IMPORTED_MODULE_0__utils_js__["i" /* patchPrototype */](event, eventMixin);
  // and fallback to patching instance
  } else {
    __WEBPACK_IMPORTED_MODULE_0__utils_js__["a" /* extend */](event, eventMixin);
  }
}

let PatchedEvent = mixinComposedFlag(window.Event);
let PatchedCustomEvent = mixinComposedFlag(window.CustomEvent);
let PatchedMouseEvent = mixinComposedFlag(window.MouseEvent);

function patchEvents() {
  window.Event = PatchedEvent;
  window.CustomEvent = PatchedCustomEvent;
  window.MouseEvent = PatchedMouseEvent;
  activateFocusEventOverrides();
}


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShadyRoot; });
/* harmony export (immutable) */ __webpack_exports__["b"] = attachShadow;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__logical_mutation_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__array_splice_js__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__flush_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__logical_tree_js__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__native_methods_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__native_tree_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__patch_accessors_js__ = __webpack_require__(14);
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/










// Do not export this object. It must be passed as the first argument to the
// ShadyRoot constructor in `attachShadow` to prevent the constructor from
// throwing. This prevents the user from being able to manually construct a
// ShadyRoot (i.e. `new ShadowRoot()`).
const ShadyRootConstructionToken = {};

const CATCHALL_NAME = '__catchall';

/**
 * @constructor
 * @extends {ShadowRoot}
 */
let ShadyRoot = function(token, host, options) {
  if (token !== ShadyRootConstructionToken) {
    throw new TypeError('Illegal constructor');
  }
  // NOTE: this strange construction is necessary because
  // DocumentFragment cannot be subclassed on older browsers.
  let shadowRoot = document.createDocumentFragment();
  shadowRoot.__proto__ = ShadyRoot.prototype;
  /** @type {ShadyRoot} */ (shadowRoot)._init(host, options);
  return shadowRoot;
};

ShadyRoot.prototype = Object.create(DocumentFragment.prototype);

ShadyRoot.prototype._init = function(host, options) {
  // NOTE: set a fake local name so this element can be
  // distinguished from a DocumentFragment when patching.
  // FF doesn't allow this to be `localName`
  this.__localName = 'ShadyRoot';
  // logical dom setup
  Object(__WEBPACK_IMPORTED_MODULE_4__logical_tree_js__["a" /* recordChildNodes */])(host);
  Object(__WEBPACK_IMPORTED_MODULE_4__logical_tree_js__["a" /* recordChildNodes */])(this);
  // root <=> host
  this.host = host;
  this._mode = options && options.mode;
  host.__shady = host.__shady || {};
  host.__shady.root = this;
  host.__shady.publicRoot = this._mode !== 'closed' ? this : null;
  // state flags
  this._renderPending = false;
  this._hasRendered = false;
  this._slotList = [];
  this._slotMap = null;
  // fast path initial render: remove existing physical dom.
  let c$ = Object(__WEBPACK_IMPORTED_MODULE_6__native_tree_js__["childNodes"])(host);
  for (let i=0, l=c$.length; i < l; i++) {
    __WEBPACK_IMPORTED_MODULE_5__native_methods_js__["removeChild"].call(host, c$[i])
  }
}

// async render
ShadyRoot.prototype._asyncRender = function() {
  if (!this._renderPending) {
    this._renderPending = true;
    Object(__WEBPACK_IMPORTED_MODULE_3__flush_js__["a" /* enqueue */])(() => this._render());
  }
}

// returns the oldest renderPending ancestor root.
ShadyRoot.prototype._getRenderRoot = function() {
  let renderRoot = this;
  let root = this;
  while (root) {
    if (root._renderPending) {
      renderRoot = root;
    }
    root = root._rendererForHost();
  }
  return renderRoot;
}

// Returns the shadyRoot `this.host` if `this.host`
// has children that require distribution.
ShadyRoot.prototype._rendererForHost = function() {
  let root = this.host.getRootNode();
  if (__WEBPACK_IMPORTED_MODULE_2__utils_js__["c" /* isShadyRoot */](root)) {
    let c$ = this.host.childNodes;
    for (let i=0, c; i < c$.length; i++) {
      c = c$[i];
      if (this._isInsertionPoint(c)) {
        return root;
      }
    }
  }
}

ShadyRoot.prototype._render = function() {
  if (this._renderPending) {
    this._getRenderRoot()['_renderRoot']();
  }
}

// NOTE: avoid renaming to ease testability.
ShadyRoot.prototype['_renderRoot'] = function() {
  this._renderPending = false;
  this._distribute();
  this._compose();
  this._hasRendered = true;
}

ShadyRoot.prototype._distribute = function() {
  // capture # of previously assigned nodes to help determine if dirty.
  for (let i=0, slot; i < this._slotList.length; i++) {
    slot = this._slotList[i];
    this._clearSlotAssignedNodes(slot);
  }
  // distribute host children.
  for (let n=this.host.firstChild; n; n=n.nextSibling) {
    this._distributeNodeToSlot(n);
  }
  // fallback content, slotchange, and dirty roots
  for (let i=0, slot; i < this._slotList.length; i++) {
    slot = this._slotList[i];
    // distribute fallback content
    if (!slot.__shady.assignedNodes.length) {
      for (let n=slot.firstChild; n; n=n.nextSibling) {
        this._distributeNodeToSlot(n, slot);
      }
    }
    const slotParent = slot.parentNode;
    const slotParentRoot = slotParent.__shady && slotParent.__shady.root;
    if (slotParentRoot && slotParentRoot._hasInsertionPoint()) {
      slotParentRoot['_renderRoot']();
    }
    this._addAssignedToFlattenedNodes(slot.__shady.flattenedNodes,
      slot.__shady.assignedNodes);
    let prevAssignedNodes = slot.__shady._previouslyAssignedNodes;
    if (prevAssignedNodes) {
      for (let i=0; i < prevAssignedNodes.length; i++) {
        prevAssignedNodes[i].__shady._prevAssignedSlot = null;
      }
      slot.__shady._previouslyAssignedNodes = null;
      // dirty if previously less assigned nodes than previously assigned.
      if (prevAssignedNodes.length > slot.__shady.assignedNodes.length) {
        slot.__shady.dirty = true;
      }
    }
    /* Note: A slot is marked dirty whenever a node is newly assigned to it
    or a node is assigned to a different slot (done in `_distributeNodeToSlot`)
    or if the number of nodes assigned to the slot has decreased (done above);
     */
    if (slot.__shady.dirty) {
      slot.__shady.dirty = false;
      this._fireSlotChange(slot);
    }
  }
}

/**
 * Distributes given `node` to the appropriate slot based on its `slot`
 * attribute. If `forcedSlot` is given, then the node is distributed to the
 * `forcedSlot`.
 * Note: slot to which the node is assigned will be marked dirty for firing
 * `slotchange`.
 * @param {Node} node
 * @param {Node=} forcedSlot
 *
 */
ShadyRoot.prototype._distributeNodeToSlot = function(node, forcedSlot) {
  node.__shady = node.__shady || {};
  let oldSlot = node.__shady._prevAssignedSlot;
  node.__shady._prevAssignedSlot = null;
  let slot = forcedSlot;
  if (!slot) {
    let name = node.slot || CATCHALL_NAME;
    const list = this._slotMap[name];
    slot = list && list[0];
  }
  if (slot) {
    slot.__shady.assignedNodes.push(node);
    node.__shady.assignedSlot = slot;
  } else {
    node.__shady.assignedSlot = undefined;
  }
  if (oldSlot !== node.__shady.assignedSlot) {
    if (node.__shady.assignedSlot) {
      node.__shady.assignedSlot.__shady.dirty = true;
    }
  }
}

/**
 * Clears the assignedNodes tracking data for a given `slot`. Note, the current
 * assigned node data is tracked (via _previouslyAssignedNodes and
 * _prevAssignedSlot) to see if `slotchange` should fire. This data may be out
 *  of date at this time because the assigned nodes may have already been
 * distributed to another root. This is ok since this data is only used to
 * track changes.
 * @param {HTMLSlotElement} slot
 */
ShadyRoot.prototype._clearSlotAssignedNodes = function(slot) {
  let n$ = slot.__shady.assignedNodes;
  slot.__shady.assignedNodes = [];
  slot.__shady.flattenedNodes = [];
  slot.__shady._previouslyAssignedNodes = n$;
  if (n$) {
    for (let i=0; i < n$.length; i++) {
      let n = n$[i];
      n.__shady._prevAssignedSlot = n.__shady.assignedSlot;
      // only clear if it was previously set to this slot;
      // this helps ensure that if the node has otherwise been distributed
      // ignore it.
      if (n.__shady.assignedSlot === slot) {
        n.__shady.assignedSlot = null;
      }
    }
  }
}

ShadyRoot.prototype._addAssignedToFlattenedNodes = function(flattened, asssigned) {
  for (let i=0, n; (i<asssigned.length) && (n=asssigned[i]); i++) {
    if (n.localName == 'slot') {
      this._addAssignedToFlattenedNodes(flattened, n.__shady.assignedNodes);
    } else {
      flattened.push(asssigned[i]);
    }
  }
}

ShadyRoot.prototype._fireSlotChange = function(slot) {
  // NOTE: cannot bubble correctly here so not setting bubbles: true
  // Safari tech preview does not bubble but chrome does
  // Spec says it bubbles (https://dom.spec.whatwg.org/#mutation-observers)
  __WEBPACK_IMPORTED_MODULE_5__native_methods_js__["dispatchEvent"].call(slot, new Event('slotchange'));
  if (slot.__shady.assignedSlot) {
    this._fireSlotChange(slot.__shady.assignedSlot);
  }
}

// Reify dom such that it is at its correct rendering position
// based on logical distribution.
// NOTE: here we only compose parents of <slot> elements and not the
// shadowRoot into the host. The latter is performend via a fast path
// in the `logical-mutation`.insertBefore.
ShadyRoot.prototype._compose = function() {
  const slots = this._slotList;
  let composeList = [];
  for (let i=0; i < slots.length; i++) {
    const parent = slots[i].parentNode;
    /* compose node only if:
      (1) parent does not have a shadowRoot since shadowRoot has already
      composed into the host
      (2) we're not already composing it
      [consider (n^2) but rare better than Set]
    */
    if (!(parent.__shady && parent.__shady.root) &&
      composeList.indexOf(parent) < 0) {
      composeList.push(parent);
    }
  }
  for (let i=0; i < composeList.length; i++) {
    const node = composeList[i];
    const targetNode = node === this ? this.host : node;
    this._updateChildNodes(targetNode, this._composeNode(node));
  }
}

// Returns the list of nodes which should be rendered inside `node`.
ShadyRoot.prototype._composeNode = function(node) {
  let children = [];
  let c$ = node.childNodes;
  for (let i = 0; i < c$.length; i++) {
    let child = c$[i];
    // Note: if we see a slot here, the nodes are guaranteed to need to be
    // composed here. This is because if there is redistribution, it has
    // already been handled by this point.
    if (this._isInsertionPoint(child)) {
      let flattenedNodes = child.__shady.flattenedNodes;
      for (let j = 0; j < flattenedNodes.length; j++) {
        let distributedNode = flattenedNodes[j];
          children.push(distributedNode);
      }
    } else {
      children.push(child);
    }
  }
  return children;
}

ShadyRoot.prototype._isInsertionPoint = function(node) {
    return node.localName == 'slot';
  }

// Ensures that the rendered node list inside `container` is `children`.
ShadyRoot.prototype._updateChildNodes = function(container, children) {
  let composed = Object(__WEBPACK_IMPORTED_MODULE_6__native_tree_js__["childNodes"])(container);
  let splices = Object(__WEBPACK_IMPORTED_MODULE_1__array_splice_js__["a" /* calculateSplices */])(children, composed);
  // process removals
  for (let i=0, d=0, s; (i<splices.length) && (s=splices[i]); i++) {
    for (let j=0, n; (j < s.removed.length) && (n=s.removed[j]); j++) {
      // check if the node is still where we expect it is before trying
      // to remove it; this can happen if we move a node and
      // then schedule its previous host for distribution resulting in
      // the node being removed here.
      if (Object(__WEBPACK_IMPORTED_MODULE_6__native_tree_js__["parentNode"])(n) === container) {
        __WEBPACK_IMPORTED_MODULE_5__native_methods_js__["removeChild"].call(container, n);
      }
      composed.splice(s.index + d, 1);
    }
    d -= s.addedCount;
  }
  // process adds
  for (let i=0, s, next; (i<splices.length) && (s=splices[i]); i++) { //eslint-disable-line no-redeclare
    next = composed[s.index];
    for (let j=s.index, n; j < s.index + s.addedCount; j++) {
      n = children[j];
      __WEBPACK_IMPORTED_MODULE_5__native_methods_js__["insertBefore"].call(container, n, next);
      composed.splice(j, 0, n);
    }
  }
}

/**
 * Adds the given slots. Slots are maintained in an dom-ordered list.
 * In addition a map of name to slot is updated.
 */
ShadyRoot.prototype._addSlots = function(slots) {
  let slotNamesToSort;
  this._slotMap = this._slotMap || {};
  this._slotList = this._slotList || [];
  for (let i=0; i < slots.length; i++) {
    let slot = slots[i];
    // ensure insertionPoints's and their parents have logical dom info.
    // save logical tree info
    // a. for shadyRoot
    // b. for insertion points (fallback)
    // c. for parents of insertion points
    slot.__shady = slot.__shady || {};
    Object(__WEBPACK_IMPORTED_MODULE_4__logical_tree_js__["a" /* recordChildNodes */])(slot);
    Object(__WEBPACK_IMPORTED_MODULE_4__logical_tree_js__["a" /* recordChildNodes */])(slot.parentNode);
    let name = this._nameForSlot(slot);
    if (this._slotMap[name]) {
      slotNamesToSort = slotNamesToSort || {};
      slotNamesToSort[name] = true;
      this._slotMap[name].push(slot);
    } else {
      this._slotMap[name] = [slot];
    }
    this._slotList.push(slot);
  }
  if (slotNamesToSort) {
    for (let n in slotNamesToSort) {
      this._slotMap[n] = this._sortSlots(this._slotMap[n]);
    }
  }
}

ShadyRoot.prototype._nameForSlot = function(slot) {
  const name = slot['name'] || slot.getAttribute('name') || CATCHALL_NAME;
  slot.__slotName = name;
  return name;
}

/**
 * Slots are kept in an ordered list. Slots with the same name
 * are sorted here by tree order.
 */
ShadyRoot.prototype._sortSlots = function(slots) {
  // NOTE: Cannot use `compareDocumentPosition` because it's not polyfilled,
  // but the code here could be used to polyfill the preceeding/following info
  // in `compareDocumentPosition`.
  return slots.sort((a, b) => {
    let listA = ancestorList(a);
    let listB = ancestorList(b);
    for (var i=0; i < listA.length; i++) {
      let nA = listA[i];
      let nB = listB[i];
      if (nA !== nB) {
        let c$ = Array.from(nA.parentNode.childNodes);
        return c$.indexOf(nA) - c$.indexOf(nB);
      }
    }
  });
}

function ancestorList(node) {
  let ancestors = [];
  do {
    ancestors.unshift(node);
  } while ((node = node.parentNode));
  return ancestors;
}

// NOTE: could be used to help polyfill `document.contains`.
function contains(container, node) {
  while (node) {
    if (node == container) {
      return true;
    }
    node = node.parentNode;
  }
}

/**
 * Removes from tracked slot data any slots contained within `container` and
 * then updates the tracked data (_slotList and _slotMap).
 * Any removed slots also have their `assignedNodes` removed from comopsed dom.
 */
ShadyRoot.prototype._removeContainedSlots = function(container) {
  let didRemove;
  this._slotMap = this._slotMap || {};
  this._slotList = this._slotList || [];
  const map = this._slotMap;
  for (let n in map) {
    let slots = map[n];
    for (let i=0; i < slots.length; i++) {
      let slot = slots[i];
      if (contains(container, slot)) {
        slots.splice(i, 1);
        const x = this._slotList.indexOf(slot);
        if (x >= 0) {
          this._slotList.splice(x, 1);
        }
        i--;
        this._removeFlattenedNodes(slot);
        didRemove = true;
      }
    }
  }
  return didRemove;
}

ShadyRoot.prototype._updateSlotName = function(slot) {
  const oldName = slot.__slotName;
  const name = this._nameForSlot(slot);
  if (name === oldName) {
    return;
  }
  // remove from existing tracking
  let slots = this._slotMap[oldName];
  const i = slots.indexOf(slot);
  if (i >= 0) {
    slots.splice(i, 1);
  }
  // add to new location and sort if nedessary
  let list = this._slotMap[name] || (this._slotMap[name] = []);
  list.push(slot);
  if (list.length > 1) {
    this._slotMap[name] = this._sortSlots(list);
  }
}

ShadyRoot.prototype._removeFlattenedNodes = function(slot) {
  let n$ = slot.__shady.flattenedNodes;
  if (n$) {
    for (let i=0; i<n$.length; i++) {
      let node = n$[i];
      let parent = Object(__WEBPACK_IMPORTED_MODULE_6__native_tree_js__["parentNode"])(node);
      if (parent) {
        __WEBPACK_IMPORTED_MODULE_5__native_methods_js__["removeChild"].call(parent, node);
      }
    }
  }
}

ShadyRoot.prototype._hasInsertionPoint = function() {
  return Boolean(this._slotList.length);
}

ShadyRoot.prototype.addEventListener = function(type, fn, optionsOrCapture) {
  if (typeof optionsOrCapture !== 'object') {
    optionsOrCapture = {
      capture: Boolean(optionsOrCapture)
    }
  }
  optionsOrCapture.__shadyTarget = this;
  this.host.addEventListener(type, fn, optionsOrCapture);
}

ShadyRoot.prototype.removeEventListener = function(type, fn, optionsOrCapture) {
  if (typeof optionsOrCapture !== 'object') {
    optionsOrCapture = {
      capture: Boolean(optionsOrCapture)
    }
  }
  optionsOrCapture.__shadyTarget = this;
  this.host.removeEventListener(type, fn, optionsOrCapture);
}

ShadyRoot.prototype.getElementById = function(id) {
  let result = __WEBPACK_IMPORTED_MODULE_0__logical_mutation_js__["e" /* query */](this, function(n) {
    return n.id == id;
  }, function(n) {
    return Boolean(n);
  })[0];
  return result || null;
}

/**
  Implements a pared down version of ShadowDOM's scoping, which is easy to
  polyfill across browsers.
*/
function attachShadow(host, options) {
  if (!host) {
    throw 'Must provide a host.';
  }
  if (!options) {
    throw 'Not enough arguments.'
  }
  return new ShadyRoot(ShadyRootConstructionToken, host, options);
}

Object(__WEBPACK_IMPORTED_MODULE_7__patch_accessors_js__["f" /* patchShadowRootAccessors */])(ShadyRoot.prototype);

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_parse_js__ = __webpack_require__(4);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



 // eslint-disable-line no-unused-vars

/** @const {string} */
const infoKey = '__styleInfo';

class StyleInfo {
  /**
   * @param {Element} node
   * @return {StyleInfo}
   */
  static get(node) {
    if (node) {
      return node[infoKey];
    } else {
      return null;
    }
  }
  /**
   * @param {!Element} node
   * @param {StyleInfo} styleInfo
   * @return {StyleInfo}
   */
  static set(node, styleInfo) {
    node[infoKey] = styleInfo;
    return styleInfo;
  }
  /**
   * @param {StyleNode} ast
   * @param {Node=} placeholder
   * @param {Array<string>=} ownStylePropertyNames
   * @param {string=} elementName
   * @param {string=} typeExtension
   * @param {string=} cssBuild
   */
  constructor(ast, placeholder, ownStylePropertyNames, elementName, typeExtension, cssBuild) {
    /** @type {StyleNode} */
    this.styleRules = ast || null;
    /** @type {Node} */
    this.placeholder = placeholder || null;
    /** @type {!Array<string>} */
    this.ownStylePropertyNames = ownStylePropertyNames || [];
    /** @type {Array<Object>} */
    this.overrideStyleProperties = null;
    /** @type {string} */
    this.elementName = elementName || '';
    /** @type {string} */
    this.cssBuild = cssBuild || '';
    /** @type {string} */
    this.typeExtension = typeExtension || '';
    /** @type {Object<string, string>} */
    this.styleProperties = null;
    /** @type {?string} */
    this.scopeSelector = null;
    /** @type {HTMLStyleElement} */
    this.customStyle = null;
  }
  _getStyleRules() {
    return this.styleRules;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StyleInfo;


StyleInfo.prototype['_getStyleRules'] = StyleInfo.prototype._getStyleRules;

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



/**
 * @const {!Object<string, !HTMLTemplateElement>}
 */
const templateMap = {};
/* harmony default export */ __webpack_exports__["a"] = (templateMap);


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = documentWait;
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



/** @type {Promise<void>} */
let readyPromise = null;

/** @type {?function(?function())} */
let whenReady = window['HTMLImports'] && window['HTMLImports']['whenReady'] || null;

/** @type {function()} */
let resolveFn;

/**
 * @param {?function()} callback
 */
function documentWait(callback) {
  requestAnimationFrame(function() {
    if (whenReady) {
      whenReady(callback)
    } else {
      if (!readyPromise) {
        readyPromise = new Promise((resolve) => {resolveFn = resolve});
        if (document.readyState === 'complete') {
          resolveFn();
        } else {
          document.addEventListener('readystatechange', () => {
            if (document.readyState === 'complete') {
              resolveFn();
            }
          });
        }
      }
      readyPromise.then(function(){ callback && callback(); });
    }
  });
}


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webcomponents_webcomponents_platform_webcomponents_platform__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__webcomponents_webcomponents_platform_webcomponents_platform___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__webcomponents_webcomponents_platform_webcomponents_platform__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__webcomponents_template_template__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__webcomponents_template_template___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__webcomponents_template_template__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_es6_promise_lib_es6_promise_auto__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_whatwg_fetch_fetch__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_whatwg_fetch_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_whatwg_fetch_fetch__);





/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ready; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ready", function() { return ready; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(34);
/* eslint-disable import/no-dynamic-require, prefer-template, global-require  */


/**
 * This will check and polyfil features sent as a param
 * @param {array} polyfillFeatures list of features that needs to be polyfilled
 * @return {array} array of boolean/promise object which will trigger fulfilled/rejected state
 */
function loadPolyfills(polyfillFeatures) {
    return polyfillFeatures.map(function (item) {
        var filePath = item.filePath;

        return new Promise(function (resolve, reject) {
            /**
             *  this can be further optimized, to load as dynamic chunks
             *  but since HTTP2 support is not widely available
             *  bundling all into one file for now
             */
            try {
                __webpack_require__(36)("./" + filePath);
                resolve(filePath);
            } catch (e) {
                reject(e);
            }
        });
    });
}

/**
 * After pollyfilled, add ready class to html element
 * @param {Array} polyfilled list of features that are polyfilled
 * @return {Array} polyfilled
 */
function polyfillingComplete(polyfilled) {
    var rootEle = document.documentElement;
    rootEle.classList.add('wc-polyfilled');

    return polyfilled;
}

/**
 * Throw error with reason as message
 * @param {string} reason for the promise failed
 */
function rejectedMessage(reason) {
    throw new Error('Loading polyfills failed due to ' + reason + '.');
}

/**
 * This checks for native features support and initiates polyfills loading
 * once polyfills loaded then starts loading page assets from split chunks
 */
function ready(polyfillsList) {
    var nonSupportedPolyfills = Object(__WEBPACK_IMPORTED_MODULE_0__config__["a" /* default */])(polyfillsList);

    return Promise.all(loadPolyfills(nonSupportedPolyfills)).then(polyfillingComplete).catch(rejectedMessage);
}



/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__feature_detection__ = __webpack_require__(35);


/**
 * consumers of the polyfills can choose which one to load by sending config params
 * @param {Boolean} [builtInClassShim=true] shim to help extend built in class when babel transpile customElements as ES5
 * @param {Boolean} [wcPlatform=true] set of platform polyfills that are required for IE11
 * @param {Boolean} [shadowDOM=true] shadyDOM and shadyCSS polyfills
 * @param {Boolean} [customElements=true] customElements polyfill
 * @return {Array} list of polyfills
 */
function getPolyfills() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$builtInClassShim = _ref.builtInClassShim,
        builtInClassShim = _ref$builtInClassShim === undefined ? true : _ref$builtInClassShim,
        _ref$wcPlatform = _ref.wcPlatform,
        wcPlatform = _ref$wcPlatform === undefined ? true : _ref$wcPlatform,
        _ref$shadowDOM = _ref.shadowDOM,
        shadowDOM = _ref$shadowDOM === undefined ? true : _ref$shadowDOM,
        _ref$customElements = _ref.customElements,
        customElements = _ref$customElements === undefined ? true : _ref$customElements;

    var list = [{
        validate: builtInClassShim ? !Object(__WEBPACK_IMPORTED_MODULE_0__feature_detection__["a" /* isCustomElementsNative */])() : true,
        filePath: 'built-in-class-shim'
    }, {
        validate: wcPlatform ? Object(__WEBPACK_IMPORTED_MODULE_0__feature_detection__["b" /* isCustomEventNative */])() || Object(__WEBPACK_IMPORTED_MODULE_0__feature_detection__["c" /* isFetchNative */])() || Object(__WEBPACK_IMPORTED_MODULE_0__feature_detection__["e" /* isTemplateNative */])() : true,
        filePath: 'wc-platform-polyfills'
    }, {
        validate: shadowDOM ? Object(__WEBPACK_IMPORTED_MODULE_0__feature_detection__["d" /* isShadowDOMNative */])() : true,
        filePath: 'shadow-dom'
    }, {
        validate: customElements ? Object(__WEBPACK_IMPORTED_MODULE_0__feature_detection__["a" /* isCustomElementsNative */])() : true,
        filePath: 'custom-elements'
    }];

    return list.filter(function (item) {
        return !item.validate;
    });
}

/* harmony default export */ __webpack_exports__["a"] = (getPolyfills);

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["e"] = isTemplateNative;
/* harmony export (immutable) */ __webpack_exports__["a"] = isCustomElementsNative;
/* harmony export (immutable) */ __webpack_exports__["c"] = isFetchNative;
/* harmony export (immutable) */ __webpack_exports__["b"] = isCustomEventNative;
/* harmony export (immutable) */ __webpack_exports__["d"] = isShadowDOMNative;
/**
 * check for template element native support
 * @return {boolean} return feature available or not
 */
function isTemplateNative() {
  return 'content' in document.createElement('template');
}

/**
 * check for custom elements native support
 * @return {boolean} return feature available or not
 */
function isCustomElementsNative() {
  return 'customElements' in window;
}

/**
 * check for fetch native support
 * @return {boolean} return feature available or not
 */
function isFetchNative() {
  return 'fetch' in window;
}

/**
 * check for CustomEvent native support
 * @return {boolean} return feature available or not
 */
function isCustomEventNative() {
  return typeof window.CustomEvent === 'function';
}

/**
 * check for shadowDOM native support
 * @return {boolean} return feature available or not
 */
function isShadowDOMNative() {
  return !!HTMLElement.prototype.attachShadow;
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./built-in-class-shim": 20,
	"./built-in-class-shim.js": 20,
	"./custom-elements": 21,
	"./custom-elements.js": 21,
	"./shadow-dom": 23,
	"./shadow-dom.js": 23,
	"./wc-platform-polyfills": 32,
	"./wc-platform-polyfills.js": 32
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 36;

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CustomElementInternals_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CustomElementRegistry_js__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Patch_HTMLElement_js__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Patch_Document_js__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Patch_Node_js__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Patch_Element_js__ = __webpack_require__(45);
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */









const priorCustomElements = window['customElements'];

if (!priorCustomElements ||
     priorCustomElements['forcePolyfill'] ||
     (typeof priorCustomElements['define'] != 'function') ||
     (typeof priorCustomElements['get'] != 'function')) {
  /** @type {!CustomElementInternals} */
  const internals = new __WEBPACK_IMPORTED_MODULE_0__CustomElementInternals_js__["a" /* default */]();

  Object(__WEBPACK_IMPORTED_MODULE_2__Patch_HTMLElement_js__["a" /* default */])(internals);
  Object(__WEBPACK_IMPORTED_MODULE_3__Patch_Document_js__["a" /* default */])(internals);
  Object(__WEBPACK_IMPORTED_MODULE_4__Patch_Node_js__["a" /* default */])(internals);
  Object(__WEBPACK_IMPORTED_MODULE_5__Patch_Element_js__["a" /* default */])(internals);

  // The main document is always associated with the registry.
  document.__CE_hasRegistry = true;

  /** @type {!CustomElementRegistry} */
  const customElements = new __WEBPACK_IMPORTED_MODULE_1__CustomElementRegistry_js__["a" /* default */](internals);

  Object.defineProperty(window, 'customElements', {
    configurable: true,
    enumerable: true,
    value: customElements,
  });
}


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CustomElementInternals_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__DocumentConstructionObserver_js__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Deferred_js__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Utilities_js__ = __webpack_require__(2);





/**
 * @unrestricted
 */
class CustomElementRegistry {

  /**
   * @param {!CustomElementInternals} internals
   */
  constructor(internals) {
    /**
     * @private
     * @type {boolean}
     */
    this._elementDefinitionIsRunning = false;

    /**
     * @private
     * @type {!CustomElementInternals}
     */
    this._internals = internals;

    /**
     * @private
     * @type {!Map<string, !Deferred<undefined>>}
     */
    this._whenDefinedDeferred = new Map();

    /**
     * The default flush callback triggers the document walk synchronously.
     * @private
     * @type {!Function}
     */
    this._flushCallback = fn => fn();

    /**
     * @private
     * @type {boolean}
     */
    this._flushPending = false;

    /**
     * @private
     * @type {!Array<!CustomElementDefinition>}
     */
    this._pendingDefinitions = [];

    /**
     * @private
     * @type {!DocumentConstructionObserver}
     */
    this._documentConstructionObserver = new __WEBPACK_IMPORTED_MODULE_1__DocumentConstructionObserver_js__["a" /* default */](internals, document);
  }

  /**
   * @param {string} localName
   * @param {!Function} constructor
   */
  define(localName, constructor) {
    if (!(constructor instanceof Function)) {
      throw new TypeError('Custom element constructors must be functions.');
    }

    if (!__WEBPACK_IMPORTED_MODULE_3__Utilities_js__["b" /* isValidCustomElementName */](localName)) {
      throw new SyntaxError(`The element name '${localName}' is not valid.`);
    }

    if (this._internals.localNameToDefinition(localName)) {
      throw new Error(`A custom element with name '${localName}' has already been defined.`);
    }

    if (this._elementDefinitionIsRunning) {
      throw new Error('A custom element is already being defined.');
    }
    this._elementDefinitionIsRunning = true;

    let connectedCallback;
    let disconnectedCallback;
    let adoptedCallback;
    let attributeChangedCallback;
    let observedAttributes;
    try {
      /** @type {!Object} */
      const prototype = constructor.prototype;
      if (!(prototype instanceof Object)) {
        throw new TypeError('The custom element constructor\'s prototype is not an object.');
      }

      function getCallback(name) {
        const callbackValue = prototype[name];
        if (callbackValue !== undefined && !(callbackValue instanceof Function)) {
          throw new Error(`The '${name}' callback must be a function.`);
        }
        return callbackValue;
      }

      connectedCallback = getCallback('connectedCallback');
      disconnectedCallback = getCallback('disconnectedCallback');
      adoptedCallback = getCallback('adoptedCallback');
      attributeChangedCallback = getCallback('attributeChangedCallback');
      observedAttributes = constructor['observedAttributes'] || [];
    } catch (e) {
      return;
    } finally {
      this._elementDefinitionIsRunning = false;
    }

    const definition = {
      localName,
      constructor,
      connectedCallback,
      disconnectedCallback,
      adoptedCallback,
      attributeChangedCallback,
      observedAttributes,
      constructionStack: [],
    };

    this._internals.setDefinition(localName, definition);
    this._pendingDefinitions.push(definition);

    // If we've already called the flush callback and it hasn't called back yet,
    // don't call it again.
    if (!this._flushPending) {
      this._flushPending = true;
      this._flushCallback(() => this._flush());
    }
  }

  _flush() {
    // If no new definitions were defined, don't attempt to flush. This could
    // happen if a flush callback keeps the function it is given and calls it
    // multiple times.
    if (this._flushPending === false) return;
    this._flushPending = false;

    const pendingDefinitions = this._pendingDefinitions;

    /**
     * Unupgraded elements with definitions that were defined *before* the last
     * flush, in document order.
     * @type {!Array<!Element>}
     */
    const elementsWithStableDefinitions = [];

    /**
     * A map from `localName`s of definitions that were defined *after* the last
     * flush to unupgraded elements matching that definition, in document order.
     * @type {!Map<string, !Array<!Element>>}
     */
    const elementsWithPendingDefinitions = new Map();
    for (let i = 0; i < pendingDefinitions.length; i++) {
      elementsWithPendingDefinitions.set(pendingDefinitions[i].localName, []);
    }

    this._internals.patchAndUpgradeTree(document, {
      upgrade: element => {
        // Ignore the element if it has already upgraded or failed to upgrade.
        if (element.__CE_state !== undefined) return;

        const localName = element.localName;

        // If there is an applicable pending definition for the element, add the
        // element to the list of elements to be upgraded with that definition.
        const pendingElements = elementsWithPendingDefinitions.get(localName);
        if (pendingElements) {
          pendingElements.push(element);
        // If there is *any other* applicable definition for the element, add it
        // to the list of elements with stable definitions that need to be upgraded.
        } else if (this._internals.localNameToDefinition(localName)) {
          elementsWithStableDefinitions.push(element);
        }
      },
    });

    // Upgrade elements with 'stable' definitions first.
    for (let i = 0; i < elementsWithStableDefinitions.length; i++) {
      this._internals.upgradeElement(elementsWithStableDefinitions[i]);
    }

    // Upgrade elements with 'pending' definitions in the order they were defined.
    while (pendingDefinitions.length > 0) {
      const definition = pendingDefinitions.shift();
      const localName = definition.localName;

      // Attempt to upgrade all applicable elements.
      const pendingUpgradableElements = elementsWithPendingDefinitions.get(definition.localName);
      for (let i = 0; i < pendingUpgradableElements.length; i++) {
        this._internals.upgradeElement(pendingUpgradableElements[i]);
      }

      // Resolve any promises created by `whenDefined` for the definition.
      const deferred = this._whenDefinedDeferred.get(localName);
      if (deferred) {
        deferred.resolve(undefined);
      }
    }
  }

  /**
   * @param {string} localName
   * @return {Function|undefined}
   */
  get(localName) {
    const definition = this._internals.localNameToDefinition(localName);
    if (definition) {
      return definition.constructor;
    }

    return undefined;
  }

  /**
   * @param {string} localName
   * @return {!Promise<undefined>}
   */
  whenDefined(localName) {
    if (!__WEBPACK_IMPORTED_MODULE_3__Utilities_js__["b" /* isValidCustomElementName */](localName)) {
      return Promise.reject(new SyntaxError(`'${localName}' is not a valid custom element name.`));
    }

    const prior = this._whenDefinedDeferred.get(localName);
    if (prior) {
      return prior.toPromise();
    }

    const deferred = new __WEBPACK_IMPORTED_MODULE_2__Deferred_js__["a" /* default */]();
    this._whenDefinedDeferred.set(localName, deferred);

    const definition = this._internals.localNameToDefinition(localName);
    // Resolve immediately only if the given local name has a definition *and*
    // the full document walk to upgrade elements with that local name has
    // already happened.
    if (definition && !this._pendingDefinitions.some(d => d.localName === localName)) {
      deferred.resolve(undefined);
    }

    return deferred.toPromise();
  }

  polyfillWrapFlushCallback(outer) {
    this._documentConstructionObserver.disconnect();
    const inner = this._flushCallback;
    this._flushCallback = flush => outer(() => inner(flush));
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CustomElementRegistry;


// Closure compiler exports.
window['CustomElementRegistry'] = CustomElementRegistry;
CustomElementRegistry.prototype['define'] = CustomElementRegistry.prototype.define;
CustomElementRegistry.prototype['get'] = CustomElementRegistry.prototype.get;
CustomElementRegistry.prototype['whenDefined'] = CustomElementRegistry.prototype.whenDefined;
CustomElementRegistry.prototype['polyfillWrapFlushCallback'] = CustomElementRegistry.prototype.polyfillWrapFlushCallback;


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CustomElementInternals_js__ = __webpack_require__(0);


class DocumentConstructionObserver {
  constructor(internals, doc) {
    /**
     * @type {!CustomElementInternals}
     */
    this._internals = internals;

    /**
     * @type {!Document}
     */
    this._document = doc;

    /**
     * @type {MutationObserver|undefined}
     */
    this._observer = undefined;


    // Simulate tree construction for all currently accessible nodes in the
    // document.
    this._internals.patchAndUpgradeTree(this._document);

    if (this._document.readyState === 'loading') {
      this._observer = new MutationObserver(this._handleMutations.bind(this));

      // Nodes created by the parser are given to the observer *before* the next
      // task runs. Inline scripts are run in a new task. This means that the
      // observer will be able to handle the newly parsed nodes before the inline
      // script is run.
      this._observer.observe(this._document, {
        childList: true,
        subtree: true,
      });
    }
  }

  disconnect() {
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  /**
   * @param {!Array<!MutationRecord>} mutations
   */
  _handleMutations(mutations) {
    // Once the document's `readyState` is 'interactive' or 'complete', all new
    // nodes created within that document will be the result of script and
    // should be handled by patching.
    const readyState = this._document.readyState;
    if (readyState === 'interactive' || readyState === 'complete') {
      this.disconnect();
    }

    for (let i = 0; i < mutations.length; i++) {
      const addedNodes = mutations[i].addedNodes;
      for (let j = 0; j < addedNodes.length; j++) {
        const node = addedNodes[j];
        this._internals.patchAndUpgradeTree(node);
      }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DocumentConstructionObserver;



/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @template T
 */
class Deferred {
  constructor() {
    /**
     * @private
     * @type {T|undefined}
     */
    this._value = undefined;

    /**
     * @private
     * @type {Function|undefined}
     */
    this._resolve = undefined;

    /**
     * @private
     * @type {!Promise<T>}
     */
    this._promise = new Promise(resolve => {
      this._resolve = resolve;

      if (this._value) {
        resolve(this._value);
      }
    });
  }

  /**
   * @param {T} value
   */
  resolve(value) {
    if (this._value) {
      throw new Error('Already resolved.');
    }

    this._value = value;

    if (this._resolve) {
      this._resolve(value);
    }
  }

  /**
   * @return {!Promise<T>}
   */
  toPromise() {
    return this._promise;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Deferred;



/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Native_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CustomElementInternals_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__AlreadyConstructedMarker_js__ = __webpack_require__(42);





/**
 * @param {!CustomElementInternals} internals
 */
/* harmony default export */ __webpack_exports__["a"] = (function(internals) {
  window['HTMLElement'] = (function() {
    /**
     * @type {function(new: HTMLElement): !HTMLElement}
     */
    function HTMLElement() {
      // This should really be `new.target` but `new.target` can't be emulated
      // in ES5. Assuming the user keeps the default value of the constructor's
      // prototype's `constructor` property, this is equivalent.
      /** @type {!Function} */
      const constructor = this.constructor;

      const definition = internals.constructorToDefinition(constructor);
      if (!definition) {
        throw new Error('The custom element being constructed was not registered with `customElements`.');
      }

      const constructionStack = definition.constructionStack;

      if (constructionStack.length === 0) {
        const element = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_createElement.call(document, definition.localName);
        Object.setPrototypeOf(element, constructor.prototype);
        element.__CE_state = __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__["a" /* default */].custom;
        element.__CE_definition = definition;
        internals.patch(element);
        return element;
      }

      const lastIndex = constructionStack.length - 1;
      const element = constructionStack[lastIndex];
      if (element === __WEBPACK_IMPORTED_MODULE_3__AlreadyConstructedMarker_js__["a" /* default */]) {
        throw new Error('The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.');
      }
      constructionStack[lastIndex] = __WEBPACK_IMPORTED_MODULE_3__AlreadyConstructedMarker_js__["a" /* default */];

      Object.setPrototypeOf(element, constructor.prototype);
      internals.patch(/** @type {!HTMLElement} */ (element));

      return element;
    }

    HTMLElement.prototype = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].HTMLElement.prototype;

    return HTMLElement;
  })();
});;


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * This class exists only to work around Closure's lack of a way to describe
 * singletons. It represents the 'already constructed marker' used in custom
 * element construction stacks.
 *
 * https://html.spec.whatwg.org/#concept-already-constructed-marker
 */
class AlreadyConstructedMarker {}

/* harmony default export */ __webpack_exports__["a"] = (new AlreadyConstructedMarker());


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Native_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CustomElementInternals_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Utilities_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Interface_ParentNode_js__ = __webpack_require__(22);






/**
 * @param {!CustomElementInternals} internals
 */
/* harmony default export */ __webpack_exports__["a"] = (function(internals) {
  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* setPropertyUnchecked */](Document.prototype, 'createElement',
    /**
     * @this {Document}
     * @param {string} localName
     * @return {!Element}
     */
    function(localName) {
      // Only create custom elements if this document is associated with the registry.
      if (this.__CE_hasRegistry) {
        const definition = internals.localNameToDefinition(localName);
        if (definition) {
          return new (definition.constructor)();
        }
      }

      const result = /** @type {!Element} */
        (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_createElement.call(this, localName));
      internals.patch(result);
      return result;
    });

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* setPropertyUnchecked */](Document.prototype, 'importNode',
    /**
     * @this {Document}
     * @param {!Node} node
     * @param {boolean=} deep
     * @return {!Node}
     */
    function(node, deep) {
      const clone = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_importNode.call(this, node, deep);
      // Only create custom elements if this document is associated with the registry.
      if (!this.__CE_hasRegistry) {
        internals.patchTree(clone);
      } else {
        internals.patchAndUpgradeTree(clone);
      }
      return clone;
    });

  const NS_HTML = "http://www.w3.org/1999/xhtml";

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* setPropertyUnchecked */](Document.prototype, 'createElementNS',
    /**
     * @this {Document}
     * @param {?string} namespace
     * @param {string} localName
     * @return {!Element}
     */
    function(namespace, localName) {
      // Only create custom elements if this document is associated with the registry.
      if (this.__CE_hasRegistry && (namespace === null || namespace === NS_HTML)) {
        const definition = internals.localNameToDefinition(localName);
        if (definition) {
          return new (definition.constructor)();
        }
      }

      const result = /** @type {!Element} */
        (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_createElementNS.call(this, namespace, localName));
      internals.patch(result);
      return result;
    });

  Object(__WEBPACK_IMPORTED_MODULE_3__Interface_ParentNode_js__["a" /* default */])(internals, Document.prototype, {
    prepend: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_prepend,
    append: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_append,
  });
});;


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Native_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CustomElementInternals_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Utilities_js__ = __webpack_require__(2);




/**
 * @param {!CustomElementInternals} internals
 */
/* harmony default export */ __webpack_exports__["a"] = (function(internals) {
  // `Node#nodeValue` is implemented on `Attr`.
  // `Node#textContent` is implemented on `Attr`, `Element`.

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* setPropertyUnchecked */](Node.prototype, 'insertBefore',
    /**
     * @this {Node}
     * @param {!Node} node
     * @param {?Node} refNode
     * @return {!Node}
     */
    function(node, refNode) {
      if (node instanceof DocumentFragment) {
        const insertedNodes = Array.prototype.slice.apply(node.childNodes);
        const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_insertBefore.call(this, node, refNode);

        // DocumentFragments can't be connected, so `disconnectTree` will never
        // need to be called on a DocumentFragment's children after inserting it.

        if (__WEBPACK_IMPORTED_MODULE_2__Utilities_js__["a" /* isConnected */](this)) {
          for (let i = 0; i < insertedNodes.length; i++) {
            internals.connectTree(insertedNodes[i]);
          }
        }

        return nativeResult;
      }

      const nodeWasConnected = __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["a" /* isConnected */](node);
      const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_insertBefore.call(this, node, refNode);

      if (nodeWasConnected) {
        internals.disconnectTree(node);
      }

      if (__WEBPACK_IMPORTED_MODULE_2__Utilities_js__["a" /* isConnected */](this)) {
        internals.connectTree(node);
      }

      return nativeResult;
    });

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* setPropertyUnchecked */](Node.prototype, 'appendChild',
    /**
     * @this {Node}
     * @param {!Node} node
     * @return {!Node}
     */
    function(node) {
      if (node instanceof DocumentFragment) {
        const insertedNodes = Array.prototype.slice.apply(node.childNodes);
        const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_appendChild.call(this, node);

        // DocumentFragments can't be connected, so `disconnectTree` will never
        // need to be called on a DocumentFragment's children after inserting it.

        if (__WEBPACK_IMPORTED_MODULE_2__Utilities_js__["a" /* isConnected */](this)) {
          for (let i = 0; i < insertedNodes.length; i++) {
            internals.connectTree(insertedNodes[i]);
          }
        }

        return nativeResult;
      }

      const nodeWasConnected = __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["a" /* isConnected */](node);
      const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_appendChild.call(this, node);

      if (nodeWasConnected) {
        internals.disconnectTree(node);
      }

      if (__WEBPACK_IMPORTED_MODULE_2__Utilities_js__["a" /* isConnected */](this)) {
        internals.connectTree(node);
      }

      return nativeResult;
    });

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* setPropertyUnchecked */](Node.prototype, 'cloneNode',
    /**
     * @this {Node}
     * @param {boolean=} deep
     * @return {!Node}
     */
    function(deep) {
      const clone = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_cloneNode.call(this, deep);
      // Only create custom elements if this element's owner document is
      // associated with the registry.
      if (!this.ownerDocument.__CE_hasRegistry) {
        internals.patchTree(clone);
      } else {
        internals.patchAndUpgradeTree(clone);
      }
      return clone;
    });

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* setPropertyUnchecked */](Node.prototype, 'removeChild',
    /**
     * @this {Node}
     * @param {!Node} node
     * @return {!Node}
     */
    function(node) {
      const nodeWasConnected = __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["a" /* isConnected */](node);
      const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_removeChild.call(this, node);

      if (nodeWasConnected) {
        internals.disconnectTree(node);
      }

      return nativeResult;
    });

  __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["c" /* setPropertyUnchecked */](Node.prototype, 'replaceChild',
    /**
     * @this {Node}
     * @param {!Node} nodeToInsert
     * @param {!Node} nodeToRemove
     * @return {!Node}
     */
    function(nodeToInsert, nodeToRemove) {
      if (nodeToInsert instanceof DocumentFragment) {
        const insertedNodes = Array.prototype.slice.apply(nodeToInsert.childNodes);
        const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_replaceChild.call(this, nodeToInsert, nodeToRemove);

        // DocumentFragments can't be connected, so `disconnectTree` will never
        // need to be called on a DocumentFragment's children after inserting it.

        if (__WEBPACK_IMPORTED_MODULE_2__Utilities_js__["a" /* isConnected */](this)) {
          internals.disconnectTree(nodeToRemove);
          for (let i = 0; i < insertedNodes.length; i++) {
            internals.connectTree(insertedNodes[i]);
          }
        }

        return nativeResult;
      }

      const nodeToInsertWasConnected = __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["a" /* isConnected */](nodeToInsert);
      const nativeResult = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_replaceChild.call(this, nodeToInsert, nodeToRemove);
      const thisIsConnected = __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["a" /* isConnected */](this);

      if (thisIsConnected) {
        internals.disconnectTree(nodeToRemove);
      }

      if (nodeToInsertWasConnected) {
        internals.disconnectTree(nodeToInsert);
      }

      if (thisIsConnected) {
        internals.connectTree(nodeToInsert);
      }

      return nativeResult;
    });


  function patch_textContent(destination, baseDescriptor) {
    Object.defineProperty(destination, 'textContent', {
      enumerable: baseDescriptor.enumerable,
      configurable: true,
      get: baseDescriptor.get,
      set: /** @this {Node} */ function(assignedValue) {
        // If this is a text node then there are no nodes to disconnect.
        if (this.nodeType === Node.TEXT_NODE) {
          baseDescriptor.set.call(this, assignedValue);
          return;
        }

        let removedNodes = undefined;
        // Checking for `firstChild` is faster than reading `childNodes.length`
        // to compare with 0.
        if (this.firstChild) {
          // Using `childNodes` is faster than `children`, even though we only
          // care about elements.
          const childNodes = this.childNodes;
          const childNodesLength = childNodes.length;
          if (childNodesLength > 0 && __WEBPACK_IMPORTED_MODULE_2__Utilities_js__["a" /* isConnected */](this)) {
            // Copying an array by iterating is faster than using slice.
            removedNodes = new Array(childNodesLength);
            for (let i = 0; i < childNodesLength; i++) {
              removedNodes[i] = childNodes[i];
            }
          }
        }

        baseDescriptor.set.call(this, assignedValue);

        if (removedNodes) {
          for (let i = 0; i < removedNodes.length; i++) {
            internals.disconnectTree(removedNodes[i]);
          }
        }
      },
    });
  }

  if (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_textContent && __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_textContent.get) {
    patch_textContent(Node.prototype, __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_textContent);
  } else {
    internals.addPatch(function(element) {
      patch_textContent(element, {
        enumerable: true,
        configurable: true,
        // NOTE: This implementation of the `textContent` getter assumes that
        // text nodes' `textContent` getter will not be patched.
        get: /** @this {Node} */ function() {
          /** @type {!Array<string>} */
          const parts = [];

          for (let i = 0; i < this.childNodes.length; i++) {
            parts.push(this.childNodes[i].textContent);
          }

          return parts.join('');
        },
        set: /** @this {Node} */ function(assignedValue) {
          while (this.firstChild) {
            __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_removeChild.call(this, this.firstChild);
          }
          __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_appendChild.call(this, document.createTextNode(assignedValue));
        },
      });
    });
  }
});;


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Native_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CustomElementInternals_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Utilities_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Interface_ParentNode_js__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Interface_ChildNode_js__ = __webpack_require__(46);








/**
 * @param {!CustomElementInternals} internals
 */
/* harmony default export */ __webpack_exports__["a"] = (function(internals) {
  if (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_attachShadow) {
    __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["c" /* setPropertyUnchecked */](Element.prototype, 'attachShadow',
      /**
       * @this {Element}
       * @param {!{mode: string}} init
       * @return {ShadowRoot}
       */
      function(init) {
        const shadowRoot = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_attachShadow.call(this, init);
        this.__CE_shadowRoot = shadowRoot;
        return shadowRoot;
      });
  } else {
    console.warn('Custom Elements: `Element#attachShadow` was not patched.');
  }


  function patch_innerHTML(destination, baseDescriptor) {
    Object.defineProperty(destination, 'innerHTML', {
      enumerable: baseDescriptor.enumerable,
      configurable: true,
      get: baseDescriptor.get,
      set: /** @this {Element} */ function(htmlString) {
        const isConnected = __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["a" /* isConnected */](this);

        // NOTE: In IE11, when using the native `innerHTML` setter, all nodes
        // that were previously descendants of the context element have all of
        // their children removed as part of the set - the entire subtree is
        // 'disassembled'. This work around walks the subtree *before* using the
        // native setter.
        /** @type {!Array<!Element>|undefined} */
        let removedElements = undefined;
        if (isConnected) {
          removedElements = [];
          __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["d" /* walkDeepDescendantElements */](this, element => {
            if (element !== this) {
              removedElements.push(element);
            }
          });
        }

        baseDescriptor.set.call(this, htmlString);

        if (removedElements) {
          for (let i = 0; i < removedElements.length; i++) {
            const element = removedElements[i];
            if (element.__CE_state === __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__["a" /* default */].custom) {
              internals.disconnectedCallback(element);
            }
          }
        }

        // Only create custom elements if this element's owner document is
        // associated with the registry.
        if (!this.ownerDocument.__CE_hasRegistry) {
          internals.patchTree(this);
        } else {
          internals.patchAndUpgradeTree(this);
        }
        return htmlString;
      },
    });
  }

  if (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_innerHTML && __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_innerHTML.get) {
    patch_innerHTML(Element.prototype, __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_innerHTML);
  } else if (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].HTMLElement_innerHTML && __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].HTMLElement_innerHTML.get) {
    patch_innerHTML(HTMLElement.prototype, __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].HTMLElement_innerHTML);
  } else {

    /** @type {HTMLDivElement} */
    const rawDiv = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Document_createElement.call(document, 'div');

    internals.addPatch(function(element) {
      patch_innerHTML(element, {
        enumerable: true,
        configurable: true,
        // Implements getting `innerHTML` by performing an unpatched `cloneNode`
        // of the element and returning the resulting element's `innerHTML`.
        // TODO: Is this too expensive?
        get: /** @this {Element} */ function() {
          return __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_cloneNode.call(this, true).innerHTML;
        },
        // Implements setting `innerHTML` by creating an unpatched element,
        // setting `innerHTML` of that element and replacing the target
        // element's children with those of the unpatched element.
        set: /** @this {Element} */ function(assignedValue) {
          // NOTE: re-route to `content` for `template` elements.
          // We need to do this because `template.appendChild` does not
          // route into `template.content`.
          /** @type {!Node} */
          const content = this.localName === 'template' ? (/** @type {!HTMLTemplateElement} */ (this)).content : this;
          rawDiv.innerHTML = assignedValue;

          while (content.childNodes.length > 0) {
            __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_removeChild.call(content, content.childNodes[0]);
          }
          while (rawDiv.childNodes.length > 0) {
            __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Node_appendChild.call(content, rawDiv.childNodes[0]);
          }
        },
      });
    });
  }


  __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["c" /* setPropertyUnchecked */](Element.prototype, 'setAttribute',
    /**
     * @this {Element}
     * @param {string} name
     * @param {string} newValue
     */
    function(name, newValue) {
      // Fast path for non-custom elements.
      if (this.__CE_state !== __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__["a" /* default */].custom) {
        return __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_setAttribute.call(this, name, newValue);
      }

      const oldValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttribute.call(this, name);
      __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_setAttribute.call(this, name, newValue);
      newValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttribute.call(this, name);
      internals.attributeChangedCallback(this, name, oldValue, newValue, null);
    });

  __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["c" /* setPropertyUnchecked */](Element.prototype, 'setAttributeNS',
    /**
     * @this {Element}
     * @param {?string} namespace
     * @param {string} name
     * @param {string} newValue
     */
    function(namespace, name, newValue) {
      // Fast path for non-custom elements.
      if (this.__CE_state !== __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__["a" /* default */].custom) {
        return __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_setAttributeNS.call(this, namespace, name, newValue);
      }

      const oldValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttributeNS.call(this, namespace, name);
      __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_setAttributeNS.call(this, namespace, name, newValue);
      newValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttributeNS.call(this, namespace, name);
      internals.attributeChangedCallback(this, name, oldValue, newValue, namespace);
    });

  __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["c" /* setPropertyUnchecked */](Element.prototype, 'removeAttribute',
    /**
     * @this {Element}
     * @param {string} name
     */
    function(name) {
      // Fast path for non-custom elements.
      if (this.__CE_state !== __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__["a" /* default */].custom) {
        return __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_removeAttribute.call(this, name);
      }

      const oldValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttribute.call(this, name);
      __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_removeAttribute.call(this, name);
      if (oldValue !== null) {
        internals.attributeChangedCallback(this, name, oldValue, null, null);
      }
    });

  __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["c" /* setPropertyUnchecked */](Element.prototype, 'removeAttributeNS',
    /**
     * @this {Element}
     * @param {?string} namespace
     * @param {string} name
     */
    function(namespace, name) {
      // Fast path for non-custom elements.
      if (this.__CE_state !== __WEBPACK_IMPORTED_MODULE_2__CustomElementState_js__["a" /* default */].custom) {
        return __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_removeAttributeNS.call(this, namespace, name);
      }

      const oldValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttributeNS.call(this, namespace, name);
      __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_removeAttributeNS.call(this, namespace, name);
      // In older browsers, `Element#getAttributeNS` may return the empty string
      // instead of null if the attribute does not exist. For details, see;
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNS#Notes
      const newValue = __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_getAttributeNS.call(this, namespace, name);
      if (oldValue !== newValue) {
        internals.attributeChangedCallback(this, name, oldValue, newValue, namespace);
      }
    });


  function patch_insertAdjacentElement(destination, baseMethod) {
    __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["c" /* setPropertyUnchecked */](destination, 'insertAdjacentElement',
      /**
       * @this {Element}
       * @param {string} where
       * @param {!Element} element
       * @return {?Element}
       */
      function(where, element) {
        const wasConnected = __WEBPACK_IMPORTED_MODULE_3__Utilities_js__["a" /* isConnected */](element);
        const insertedElement = /** @type {!Element} */
          (baseMethod.call(this, where, element));

        if (wasConnected) {
          internals.disconnectTree(element);
        }

        if (__WEBPACK_IMPORTED_MODULE_3__Utilities_js__["a" /* isConnected */](insertedElement)) {
          internals.connectTree(element);
        }
        return insertedElement;
      });
  }

  if (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].HTMLElement_insertAdjacentElement) {
    patch_insertAdjacentElement(HTMLElement.prototype, __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].HTMLElement_insertAdjacentElement);
  } else if (__WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_insertAdjacentElement) {
    patch_insertAdjacentElement(Element.prototype, __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_insertAdjacentElement);
  } else {
    console.warn('Custom Elements: `Element#insertAdjacentElement` was not patched.');
  }


  Object(__WEBPACK_IMPORTED_MODULE_4__Interface_ParentNode_js__["a" /* default */])(internals, Element.prototype, {
    prepend: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_prepend,
    append: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_append,
  });

  Object(__WEBPACK_IMPORTED_MODULE_5__Interface_ChildNode_js__["a" /* default */])(internals, Element.prototype, {
    before: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_before,
    after: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_after,
    replaceWith: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_replaceWith,
    remove: __WEBPACK_IMPORTED_MODULE_0__Native_js__["a" /* default */].Element_remove,
  });
});;


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CustomElementInternals_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utilities_js__ = __webpack_require__(2);



/**
 * @typedef {{
 *   before: !function(...(!Node|string)),
 *   after: !function(...(!Node|string)),
 *   replaceWith: !function(...(!Node|string)),
 *   remove: !function(),
 * }}
 */
let ChildNodeNativeMethods;

/**
 * @param {!CustomElementInternals} internals
 * @param {!Object} destination
 * @param {!ChildNodeNativeMethods} builtIn
 */
/* harmony default export */ __webpack_exports__["a"] = (function(internals, destination, builtIn) {
  /**
   * @param {...(!Node|string)} nodes
   */
  destination['before'] = function(...nodes) {
    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    const connectedBefore = /** @type {!Array<!Node>} */ (nodes.filter(node => {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["a" /* isConnected */](node);
    }));

    builtIn.before.apply(this, nodes);

    for (let i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (__WEBPACK_IMPORTED_MODULE_1__Utilities_js__["a" /* isConnected */](this)) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['after'] = function(...nodes) {
    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    const connectedBefore = /** @type {!Array<!Node>} */ (nodes.filter(node => {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["a" /* isConnected */](node);
    }));

    builtIn.after.apply(this, nodes);

    for (let i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (__WEBPACK_IMPORTED_MODULE_1__Utilities_js__["a" /* isConnected */](this)) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  /**
   * @param {...(!Node|string)} nodes
   */
  destination['replaceWith'] = function(...nodes) {
    // TODO: Fix this for when one of `nodes` is a DocumentFragment!
    const connectedBefore = /** @type {!Array<!Node>} */ (nodes.filter(node => {
      // DocumentFragments are not connected and will not be added to the list.
      return node instanceof Node && __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["a" /* isConnected */](node);
    }));

    const wasConnected = __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["a" /* isConnected */](this);

    builtIn.replaceWith.apply(this, nodes);

    for (let i = 0; i < connectedBefore.length; i++) {
      internals.disconnectTree(connectedBefore[i]);
    }

    if (wasConnected) {
      internals.disconnectTree(this);
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node instanceof Element) {
          internals.connectTree(node);
        }
      }
    }
  };

  destination['remove'] = function() {
    const wasConnected = __WEBPACK_IMPORTED_MODULE_1__Utilities_js__["a" /* isConnected */](this);

    builtIn.remove.call(this);

    if (wasConnected) {
      internals.disconnectTree(this);
    }
  };
});;


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__flush_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__observe_changes_js__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__native_methods_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__native_tree_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__patch_builtins_js__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__patch_events_js__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__attach_shadow_js__ = __webpack_require__(28);
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
 * Patches elements that interacts with ShadyDOM
 * such that tree traversal and mutation apis act like they would under
 * ShadowDOM.
 *
 * This import enables seemless interaction with ShadyDOM powered
 * custom elements, enabling better interoperation with 3rd party code,
 * libraries, and frameworks that use DOM tree manipulation apis.
 */










if (__WEBPACK_IMPORTED_MODULE_0__utils_js__["j" /* settings */].inUse) {
  let ShadyDOM = {
    // TODO(sorvell): remove when Polymer does not depend on this.
    'inUse': __WEBPACK_IMPORTED_MODULE_0__utils_js__["j" /* settings */].inUse,
    // TODO(sorvell): remove when Polymer does not depend on this
    'patch': (node) => node,
    'isShadyRoot': __WEBPACK_IMPORTED_MODULE_0__utils_js__["c" /* isShadyRoot */],
    'enqueue': __WEBPACK_IMPORTED_MODULE_1__flush_js__["a" /* enqueue */],
    'flush': __WEBPACK_IMPORTED_MODULE_1__flush_js__["b" /* flush */],
    'settings': __WEBPACK_IMPORTED_MODULE_0__utils_js__["j" /* settings */],
    'filterMutations': __WEBPACK_IMPORTED_MODULE_2__observe_changes_js__["a" /* filterMutations */],
    'observeChildren': __WEBPACK_IMPORTED_MODULE_2__observe_changes_js__["b" /* observeChildren */],
    'unobserveChildren': __WEBPACK_IMPORTED_MODULE_2__observe_changes_js__["c" /* unobserveChildren */],
    'nativeMethods': __WEBPACK_IMPORTED_MODULE_3__native_methods_js__,
    'nativeTree': __WEBPACK_IMPORTED_MODULE_4__native_tree_js__
  };

  window['ShadyDOM'] = ShadyDOM;

  // Apply patches to events...
  Object(__WEBPACK_IMPORTED_MODULE_6__patch_events_js__["b" /* patchEvents */])();
  // Apply patches to builtins (e.g. Element.prototype) where applicable.
  Object(__WEBPACK_IMPORTED_MODULE_5__patch_builtins_js__["a" /* patchBuiltins */])();

  window.ShadowRoot = __WEBPACK_IMPORTED_MODULE_7__attach_shadow_js__["a" /* ShadyRoot */];
}


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return observeChildren; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return unobserveChildren; });
/* harmony export (immutable) */ __webpack_exports__["a"] = filterMutations;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_js__ = __webpack_require__(1);
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



class AsyncObserver {

  constructor() {
    this._scheduled = false;
    this.addedNodes = [];
    this.removedNodes = [];
    this.callbacks = new Set();
  }

  schedule() {
    if (!this._scheduled) {
      this._scheduled = true;
      __WEBPACK_IMPORTED_MODULE_0__utils_js__["f" /* microtask */](() => {
        this.flush();
      });
    }
  }

  flush() {
    if (this._scheduled) {
      this._scheduled = false;
      let mutations = this.takeRecords();
      if (mutations.length) {
        this.callbacks.forEach(function(cb) {
          cb(mutations);
        });
      }
    }
  }

  takeRecords() {
    if (this.addedNodes.length || this.removedNodes.length) {
      let mutations = [{
        addedNodes: this.addedNodes,
        removedNodes: this.removedNodes
      }];
      this.addedNodes = [];
      this.removedNodes = [];
      return mutations;
    }
    return [];
  }

}

// TODO(sorvell): consider instead polyfilling MutationObserver
// directly so that users do not have to fork their code.
// Supporting the entire api may be challenging: e.g. filtering out
// removed nodes in the wrong scope and seeing non-distributing
// subtree child mutations.
let observeChildren = function(node, callback) {
  node.__shady = node.__shady || {};
  if (!node.__shady.observer) {
    node.__shady.observer = new AsyncObserver();
  }
  node.__shady.observer.callbacks.add(callback);
  let observer = node.__shady.observer;
  return {
    _callback: callback,
    _observer: observer,
    _node: node,
    takeRecords() {
      return observer.takeRecords()
    }
  };
}

let unobserveChildren = function(handle) {
  let observer = handle && handle._observer;
  if (observer) {
    observer.callbacks.delete(handle._callback);
    if (!observer.callbacks.size) {
      handle._node.__shady.observer = null;
    }
  }
}

function filterMutations(mutations, target) {
  /** @const {Node} */
  const targetRootNode = target.getRootNode();
  return mutations.map(function(mutation) {
    /** @const {boolean} */
    const mutationInScope = (targetRootNode === mutation.target.getRootNode());
    if (mutationInScope && mutation.addedNodes) {
      let nodes = Array.from(mutation.addedNodes).filter(function(n) {
        return (targetRootNode === n.getRootNode());
      });
      if (nodes.length) {
        mutation = Object.create(mutation);
        Object.defineProperty(mutation, 'addedNodes', {
          value: nodes,
          configurable: true
        });
        return mutation;
      }
    } else if (mutationInScope) {
      return mutation;
    }
  }).filter(function(m) { return m});
}


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = patchBuiltins;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__flush_js__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__native_methods_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__patch_accessors_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__patch_events_js__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__attach_shadow_js__ = __webpack_require__(28);
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/









function getAssignedSlot(node) {
  __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["h" /* renderRootNode */](node);
  return node.__shady && node.__shady.assignedSlot || null;
}

let windowMixin = {

  // NOTE: ensure these methods are bound to `window` so that `this` is correct
  // when called directly from global context without a receiver; e.g.
  // `addEventListener(...)`.
  addEventListener: __WEBPACK_IMPORTED_MODULE_5__patch_events_js__["a" /* addEventListener */].bind(window),

  removeEventListener: __WEBPACK_IMPORTED_MODULE_5__patch_events_js__["c" /* removeEventListener */].bind(window)

};

let nodeMixin = {

  addEventListener: __WEBPACK_IMPORTED_MODULE_5__patch_events_js__["a" /* addEventListener */],

  removeEventListener: __WEBPACK_IMPORTED_MODULE_5__patch_events_js__["c" /* removeEventListener */],

  appendChild(node) {
    return __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["d" /* insertBefore */](this, node);
  },

  insertBefore(node, ref_node) {
    return __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["d" /* insertBefore */](this, node, ref_node);
  },

  removeChild(node) {
    return __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["g" /* removeChild */](this, node);
  },

  /**
   * @this {Node}
   */
  replaceChild(node, ref_node) {
    __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["d" /* insertBefore */](this, node, ref_node);
    __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["g" /* removeChild */](this, ref_node);
    return node;
  },

  /**
   * @this {Node}
   */
  cloneNode(deep) {
    return __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["a" /* cloneNode */](this, deep);
  },

  /**
   * @this {Node}
   */
  getRootNode(options) {
    return __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["b" /* getRootNode */](this, options);
  },

  /**
   * @this {Node}
   */
  get isConnected() {
    // Fast path for distributed nodes.
    const ownerDocument = this.ownerDocument;
    if (ownerDocument && ownerDocument.contains && ownerDocument.contains(this)) return true;
    const ownerDocumentElement = ownerDocument.documentElement;
    if (ownerDocumentElement && ownerDocumentElement.contains && ownerDocumentElement.contains(this)) return true;

    let node = this;
    while (node && !(node instanceof Document)) {
      node = node.parentNode || (node instanceof __WEBPACK_IMPORTED_MODULE_6__attach_shadow_js__["a" /* ShadyRoot */] ? /** @type {ShadowRoot} */(node).host : undefined);
    }
    return !!(node && node instanceof Document);
  },

  /**
   * @this {Node}
   */
  dispatchEvent(event) {
    Object(__WEBPACK_IMPORTED_MODULE_1__flush_js__["b" /* flush */])();
    return __WEBPACK_IMPORTED_MODULE_2__native_methods_js__["dispatchEvent"].call(this, event);
  }

};

// NOTE: For some reason 'Text' redefines 'assignedSlot'
let textMixin = {
  /**
   * @this {Text}
   */
  get assignedSlot() {
    return getAssignedSlot(this);
  }
};

let fragmentMixin = {

  // TODO(sorvell): consider doing native QSA and filtering results.
  /**
   * @this {DocumentFragment}
   */
  querySelector(selector) {
    // match selector and halt on first result.
    let result = __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["e" /* query */](this, function(n) {
      return __WEBPACK_IMPORTED_MODULE_0__utils_js__["e" /* matchesSelector */](n, selector);
    }, function(n) {
      return Boolean(n);
    })[0];
    return result || null;
  },

  /**
   * @this {DocumentFragment}
   */
  querySelectorAll(selector) {
    return __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["e" /* query */](this, function(n) {
      return __WEBPACK_IMPORTED_MODULE_0__utils_js__["e" /* matchesSelector */](n, selector);
    });
  }

};

let slotMixin = {

  /**
   * @this {HTMLSlotElement}
   */
  assignedNodes(options) {
    if (this.localName === 'slot') {
      __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["h" /* renderRootNode */](this);
      return this.__shady ?
        ((options && options.flatten ? this.__shady.flattenedNodes :
        this.__shady.assignedNodes) || []) :
        [];
    }
  }

};

let elementMixin = __WEBPACK_IMPORTED_MODULE_0__utils_js__["b" /* extendAll */]({

  /**
   * @this {HTMLElement}
   */
  setAttribute(name, value) {
    __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["i" /* setAttribute */](this, name, value);
  },

  /**
   * @this {HTMLElement}
   */
  removeAttribute(name) {
    __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["f" /* removeAttribute */](this, name);
  },

  /**
   * @this {HTMLElement}
   */
  attachShadow(options) {
    return Object(__WEBPACK_IMPORTED_MODULE_6__attach_shadow_js__["b" /* attachShadow */])(this, options);
  },

  /**
   * @this {HTMLElement}
   */
  get slot() {
    return this.getAttribute('slot');
  },

  /**
   * @this {HTMLElement}
   */
  set slot(value) {
    __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["i" /* setAttribute */](this, 'slot', value);
  },

  /**
   * @this {HTMLElement}
   */
  get assignedSlot() {
    return getAssignedSlot(this);
  }

}, fragmentMixin, slotMixin);

Object.defineProperties(elementMixin, __WEBPACK_IMPORTED_MODULE_4__patch_accessors_js__["b" /* ShadowRootAccessor */]);

let documentMixin = __WEBPACK_IMPORTED_MODULE_0__utils_js__["b" /* extendAll */]({
  /**
   * @this {Document}
   */
  importNode(node, deep) {
    return __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["c" /* importNode */](node, deep);
  },

  /**
   * @this {Document}
   */
  getElementById(id) {
    let result = __WEBPACK_IMPORTED_MODULE_3__logical_mutation_js__["e" /* query */](this, function(n) {
      return n.id == id;
    }, function(n) {
      return Boolean(n);
    })[0];
    return result || null;
  }

}, fragmentMixin);

Object.defineProperties(documentMixin, {
  '_activeElement': __WEBPACK_IMPORTED_MODULE_4__patch_accessors_js__["a" /* ActiveElementAccessor */].activeElement
});

let nativeBlur = HTMLElement.prototype.blur;

let htmlElementMixin = __WEBPACK_IMPORTED_MODULE_0__utils_js__["b" /* extendAll */]({
  /**
   * @this {HTMLElement}
   */
  blur() {
    let root = this.__shady && this.__shady.root;
    let shadowActive = root && root.activeElement;
    if (shadowActive) {
      shadowActive.blur();
    } else {
      nativeBlur.call(this);
    }
  }
})

function patchBuiltin(proto, obj) {
  let n$ = Object.getOwnPropertyNames(obj);
  for (let i=0; i < n$.length; i++) {
    let n = n$[i];
    let d = Object.getOwnPropertyDescriptor(obj, n);
    // NOTE: we prefer writing directly here because some browsers
    // have descriptors that are writable but not configurable (e.g.
    // `appendChild` on older browsers)
    if (d.value) {
      proto[n] = d.value;
    } else {
      Object.defineProperty(proto, n, d);
    }
  }
}


// Apply patches to builtins (e.g. Element.prototype). Some of these patches
// can be done unconditionally (mostly methods like
// `Element.prototype.appendChild`) and some can only be done when the browser
// has proper descriptors on the builtin prototype
// (e.g. `Element.prototype.firstChild`)`. When descriptors are not available,
// elements are individually patched when needed (see e.g.
// `patchInside/OutsideElementAccessors` in `patch-accessors.js`).
function patchBuiltins() {
  let nativeHTMLElement =
    (window['customElements'] && window['customElements']['nativeHTMLElement']) ||
    HTMLElement;
  // These patches can always be done, for all supported browsers.
  patchBuiltin(window.Node.prototype, nodeMixin);
  patchBuiltin(window.Window.prototype, windowMixin);
  patchBuiltin(window.Text.prototype, textMixin);
  patchBuiltin(window.DocumentFragment.prototype, fragmentMixin);
  patchBuiltin(window.Element.prototype, elementMixin);
  patchBuiltin(window.Document.prototype, documentMixin);
  if (window.HTMLSlotElement) {
    patchBuiltin(window.HTMLSlotElement.prototype, slotMixin);
  }
  patchBuiltin(nativeHTMLElement.prototype, htmlElementMixin);
  // These patches can *only* be done
  // on browsers that have proper property descriptors on builtin prototypes.
  // This includes: IE11, Edge, Chrome >= 4?; Safari >= 10, Firefox
  // On older browsers (Chrome <= 4?, Safari 9), a per element patching
  // strategy is used for patching accessors.
  if (__WEBPACK_IMPORTED_MODULE_0__utils_js__["j" /* settings */].hasDescriptors) {
    Object(__WEBPACK_IMPORTED_MODULE_4__patch_accessors_js__["c" /* patchAccessors */])(window.Node.prototype);
    Object(__WEBPACK_IMPORTED_MODULE_4__patch_accessors_js__["c" /* patchAccessors */])(window.Text.prototype);
    Object(__WEBPACK_IMPORTED_MODULE_4__patch_accessors_js__["c" /* patchAccessors */])(window.DocumentFragment.prototype);
    Object(__WEBPACK_IMPORTED_MODULE_4__patch_accessors_js__["c" /* patchAccessors */])(window.Element.prototype);
    Object(__WEBPACK_IMPORTED_MODULE_4__patch_accessors_js__["c" /* patchAccessors */])(nativeHTMLElement.prototype);
    Object(__WEBPACK_IMPORTED_MODULE_4__patch_accessors_js__["c" /* patchAccessors */])(window.Document.prototype);
    if (window.HTMLSlotElement) {
      Object(__WEBPACK_IMPORTED_MODULE_4__patch_accessors_js__["c" /* patchAccessors */])(window.HTMLSlotElement.prototype);
    }
  }
}


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = calculateSplices;
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

function newSplice(index, removed, addedCount) {
  return {
    index: index,
    removed: removed,
    addedCount: addedCount
  };
}

const EDIT_LEAVE = 0;
const EDIT_UPDATE = 1;
const EDIT_ADD = 2;
const EDIT_DELETE = 3;

// Note: This function is *based* on the computation of the Levenshtein
// "edit" distance. The one change is that "updates" are treated as two
// edits - not one. With Array splices, an update is really a delete
// followed by an add. By retaining this, we optimize for "keeping" the
// maximum array items in the original array. For example:
//
//   'xxxx123' -> '123yyyy'
//
// With 1-edit updates, the shortest path would be just to update all seven
// characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
// leaves the substring '123' intact.
function calcEditDistances(current, currentStart, currentEnd,
                            old, oldStart, oldEnd) {
  // "Deletion" columns
  let rowCount = oldEnd - oldStart + 1;
  let columnCount = currentEnd - currentStart + 1;
  let distances = new Array(rowCount);

  // "Addition" rows. Initialize null column.
  for (let i = 0; i < rowCount; i++) {
    distances[i] = new Array(columnCount);
    distances[i][0] = i;
  }

  // Initialize null row
  for (let j = 0; j < columnCount; j++)
    distances[0][j] = j;

  for (let i = 1; i < rowCount; i++) {
    for (let j = 1; j < columnCount; j++) {
      if (equals(current[currentStart + j - 1], old[oldStart + i - 1]))
        distances[i][j] = distances[i - 1][j - 1];
      else {
        let north = distances[i - 1][j] + 1;
        let west = distances[i][j - 1] + 1;
        distances[i][j] = north < west ? north : west;
      }
    }
  }

  return distances;
}

// This starts at the final weight, and walks "backward" by finding
// the minimum previous weight recursively until the origin of the weight
// matrix.
function spliceOperationsFromEditDistances(distances) {
  let i = distances.length - 1;
  let j = distances[0].length - 1;
  let current = distances[i][j];
  let edits = [];
  while (i > 0 || j > 0) {
    if (i == 0) {
      edits.push(EDIT_ADD);
      j--;
      continue;
    }
    if (j == 0) {
      edits.push(EDIT_DELETE);
      i--;
      continue;
    }
    let northWest = distances[i - 1][j - 1];
    let west = distances[i - 1][j];
    let north = distances[i][j - 1];

    let min;
    if (west < north)
      min = west < northWest ? west : northWest;
    else
      min = north < northWest ? north : northWest;

    if (min == northWest) {
      if (northWest == current) {
        edits.push(EDIT_LEAVE);
      } else {
        edits.push(EDIT_UPDATE);
        current = northWest;
      }
      i--;
      j--;
    } else if (min == west) {
      edits.push(EDIT_DELETE);
      i--;
      current = west;
    } else {
      edits.push(EDIT_ADD);
      j--;
      current = north;
    }
  }

  edits.reverse();
  return edits;
}

/**
 * Splice Projection functions:
 *
 * A splice map is a representation of how a previous array of items
 * was transformed into a new array of items. Conceptually it is a list of
 * tuples of
 *
 *   <index, removed, addedCount>
 *
 * which are kept in ascending index order of. The tuple represents that at
 * the |index|, |removed| sequence of items were removed, and counting forward
 * from |index|, |addedCount| items were added.
 */

/**
 * Lacking individual splice mutation information, the minimal set of
 * splices can be synthesized given the previous state and final state of an
 * array. The basic approach is to calculate the edit distance matrix and
 * choose the shortest path through it.
 *
 * Complexity: O(l * p)
 *   l: The length of the current array
 *   p: The length of the old array
 */
function calcSplices(current, currentStart, currentEnd,
                      old, oldStart, oldEnd) {
  let prefixCount = 0;
  let suffixCount = 0;
  let splice;

  let minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
  if (currentStart == 0 && oldStart == 0)
    prefixCount = sharedPrefix(current, old, minLength);

  if (currentEnd == current.length && oldEnd == old.length)
    suffixCount = sharedSuffix(current, old, minLength - prefixCount);

  currentStart += prefixCount;
  oldStart += prefixCount;
  currentEnd -= suffixCount;
  oldEnd -= suffixCount;

  if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
    return [];

  if (currentStart == currentEnd) {
    splice = newSplice(currentStart, [], 0);
    while (oldStart < oldEnd)
      splice.removed.push(old[oldStart++]);

    return [ splice ];
  } else if (oldStart == oldEnd)
    return [ newSplice(currentStart, [], currentEnd - currentStart) ];

  let ops = spliceOperationsFromEditDistances(
      calcEditDistances(current, currentStart, currentEnd,
                             old, oldStart, oldEnd));

  splice = undefined;
  let splices = [];
  let index = currentStart;
  let oldIndex = oldStart;
  for (let i = 0; i < ops.length; i++) {
    switch(ops[i]) {
      case EDIT_LEAVE:
        if (splice) {
          splices.push(splice);
          splice = undefined;
        }

        index++;
        oldIndex++;
        break;
      case EDIT_UPDATE:
        if (!splice)
          splice = newSplice(index, [], 0);

        splice.addedCount++;
        index++;

        splice.removed.push(old[oldIndex]);
        oldIndex++;
        break;
      case EDIT_ADD:
        if (!splice)
          splice = newSplice(index, [], 0);

        splice.addedCount++;
        index++;
        break;
      case EDIT_DELETE:
        if (!splice)
          splice = newSplice(index, [], 0);

        splice.removed.push(old[oldIndex]);
        oldIndex++;
        break;
    }
  }

  if (splice) {
    splices.push(splice);
  }
  return splices;
}

function sharedPrefix(current, old, searchLength) {
  for (let i = 0; i < searchLength; i++)
    if (!equals(current[i], old[i]))
      return i;
  return searchLength;
}

function sharedSuffix(current, old, searchLength) {
  let index1 = current.length;
  let index2 = old.length;
  let count = 0;
  while (count < searchLength && equals(current[--index1], old[--index2]))
    count++;

  return count;
}

function equals(currentValue, previousValue) {
  return currentValue === previousValue;
}

function calculateSplices(current, previous) {
  return calcSplices(current, 0, current.length, previous, 0,
                          previous.length);
}



/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_scoping_shim_js__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_style_settings_js__ = __webpack_require__(3);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/






/** @const {ScopingShim} */
const scopingShim = new __WEBPACK_IMPORTED_MODULE_0__src_scoping_shim_js__["a" /* default */]();

let ApplyShim, CustomStyleInterface;

if (window['ShadyCSS']) {
  ApplyShim = window['ShadyCSS']['ApplyShim'];
  CustomStyleInterface = window['ShadyCSS']['CustomStyleInterface'];
}

window.ShadyCSS = {
  ScopingShim: scopingShim,
  /**
   * @param {!HTMLTemplateElement} template
   * @param {string} elementName
   * @param {string=} elementExtends
   */
  prepareTemplate(template, elementName, elementExtends) {
    scopingShim.flushCustomStyles();
    scopingShim.prepareTemplate(template, elementName, elementExtends)
  },

  /**
   * @param {!HTMLElement} element
   * @param {Object=} properties
   */
  styleSubtree(element, properties) {
    scopingShim.flushCustomStyles();
    scopingShim.styleSubtree(element, properties);
  },

  /**
   * @param {!HTMLElement} element
   */
  styleElement(element) {
    scopingShim.flushCustomStyles();
    scopingShim.styleElement(element);
  },

  /**
   * @param {Object=} properties
   */
  styleDocument(properties) {
    scopingShim.flushCustomStyles();
    scopingShim.styleDocument(properties);
  },

  /**
   * @param {Element} element
   * @param {string} property
   * @return {string}
   */
  getComputedStyleValue(element, property) {
    return scopingShim.getComputedStyleValue(element, property);
  },

  nativeCss: __WEBPACK_IMPORTED_MODULE_1__src_style_settings_js__["a" /* nativeCssVariables */],

  nativeShadow: __WEBPACK_IMPORTED_MODULE_1__src_style_settings_js__["b" /* nativeShadow */]
};

if (ApplyShim) {
  window.ShadyCSS.ApplyShim = ApplyShim;
}

if (CustomStyleInterface) {
  window.ShadyCSS.CustomStyleInterface = CustomStyleInterface;
}

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_parse_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style_settings_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style_util_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__style_properties_js__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__style_placeholder_js__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__style_info_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__style_cache_js__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__document_watcher_js__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__template_map_js__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__apply_shim_utils_js__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__document_wait_js__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__common_utils_js__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__custom_style_interface_js__ = __webpack_require__(59);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
















 // eslint-disable-line no-unused-vars

/**
 * @const {StyleCache}
 */
const styleCache = new __WEBPACK_IMPORTED_MODULE_7__style_cache_js__["a" /* default */]();

class ScopingShim {
  constructor() {
    this._scopeCounter = {};
    this._documentOwner = document.documentElement;
    let ast = new __WEBPACK_IMPORTED_MODULE_0__css_parse_js__["a" /* StyleNode */]();
    ast['rules'] = [];
    this._documentOwnerStyleInfo = __WEBPACK_IMPORTED_MODULE_6__style_info_js__["a" /* default */].set(this._documentOwner, new __WEBPACK_IMPORTED_MODULE_6__style_info_js__["a" /* default */](ast));
    this._elementsHaveApplied = false;
    this._applyShim = null;
    /** @type {?CustomStyleInterfaceInterface} */
    this._customStyleInterface = null;
    Object(__WEBPACK_IMPORTED_MODULE_11__document_wait_js__["a" /* default */])(() => {
      this._ensure();
    });
  }
  flush() {
    Object(__WEBPACK_IMPORTED_MODULE_8__document_watcher_js__["a" /* flush */])();
  }
  _generateScopeSelector(name) {
    let id = this._scopeCounter[name] = (this._scopeCounter[name] || 0) + 1;
    return `${name}-${id}`;
  }
  getStyleAst(style) {
    return __WEBPACK_IMPORTED_MODULE_3__style_util_js__["h" /* rulesForStyle */](style);
  }
  styleAstToString(ast) {
    return __WEBPACK_IMPORTED_MODULE_3__style_util_js__["j" /* toCssText */](ast);
  }
  _gatherStyles(template) {
    let styles = template.content.querySelectorAll('style');
    let cssText = [];
    for (let i = 0; i < styles.length; i++) {
      let s = styles[i];
      cssText.push(s.textContent);
      s.parentNode.removeChild(s);
    }
    return cssText.join('').trim();
  }
  _getCssBuild(template) {
    let style = template.content.querySelector('style');
    if (!style) {
      return '';
    }
    return style.getAttribute('css-build') || '';
  }
  /**
   * Prepare the styling and template for the given element type
   *
   * @param {HTMLTemplateElement} template
   * @param {string} elementName
   * @param {string=} typeExtension
   */
  prepareTemplate(template, elementName, typeExtension) {
    if (template._prepared) {
      return;
    }
    template._prepared = true;
    template.name = elementName;
    template.extends = typeExtension;
    __WEBPACK_IMPORTED_MODULE_9__template_map_js__["a" /* default */][elementName] = template;
    let cssBuild = this._getCssBuild(template);
    let cssText = this._gatherStyles(template);
    let info = {
      is: elementName,
      extends: typeExtension,
      __cssBuild: cssBuild,
    };
    if (!__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["b" /* nativeShadow */]) {
      __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */].dom(template.content, elementName);
    }
    // check if the styling has mixin definitions or uses
    this._ensure();
    let hasMixins = Object(__WEBPACK_IMPORTED_MODULE_12__common_utils_js__["a" /* detectMixin */])(cssText)
    let ast = Object(__WEBPACK_IMPORTED_MODULE_0__css_parse_js__["b" /* parse */])(cssText);
    // only run the applyshim transforms if there is a mixin involved
    if (hasMixins && __WEBPACK_IMPORTED_MODULE_1__style_settings_js__["a" /* nativeCssVariables */] && this._applyShim) {
      this._applyShim['transformRules'](ast, elementName);
    }
    template['_styleAst'] = ast;
    template._cssBuild = cssBuild;

    let ownPropertyNames = [];
    if (!__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["a" /* nativeCssVariables */]) {
      ownPropertyNames = __WEBPACK_IMPORTED_MODULE_4__style_properties_js__["a" /* default */].decorateStyles(template['_styleAst'], info);
    }
    if (!ownPropertyNames.length || __WEBPACK_IMPORTED_MODULE_1__style_settings_js__["a" /* nativeCssVariables */]) {
      let root = __WEBPACK_IMPORTED_MODULE_1__style_settings_js__["b" /* nativeShadow */] ? template.content : null;
      let placeholder = __WEBPACK_IMPORTED_MODULE_5__style_placeholder_js__["a" /* default */][elementName];
      let style = this._generateStaticStyle(info, template['_styleAst'], root, placeholder);
      template._style = style;
    }
    template._ownPropertyNames = ownPropertyNames;
  }
  _generateStaticStyle(info, rules, shadowroot, placeholder) {
    let cssText = __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */].elementStyles(info, rules);
    if (cssText.length) {
      return __WEBPACK_IMPORTED_MODULE_3__style_util_js__["a" /* applyCss */](cssText, info.is, shadowroot, placeholder);
    }
  }
  _prepareHost(host) {
    let {is, typeExtension} = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["e" /* getIsExtends */](host);
    let placeholder = __WEBPACK_IMPORTED_MODULE_5__style_placeholder_js__["a" /* default */][is];
    let template = __WEBPACK_IMPORTED_MODULE_9__template_map_js__["a" /* default */][is];
    let ast;
    let ownStylePropertyNames;
    let cssBuild;
    if (template) {
      ast = template['_styleAst'];
      ownStylePropertyNames = template._ownPropertyNames;
      cssBuild = template._cssBuild;
    }
    return __WEBPACK_IMPORTED_MODULE_6__style_info_js__["a" /* default */].set(host,
      new __WEBPACK_IMPORTED_MODULE_6__style_info_js__["a" /* default */](
        ast,
        placeholder,
        ownStylePropertyNames,
        is,
        typeExtension,
        cssBuild
      )
    );
  }
  _ensureApplyShim() {
    if (this._applyShim) {
      return;
    } else if (window.ShadyCSS && window.ShadyCSS.ApplyShim) {
      this._applyShim = window.ShadyCSS.ApplyShim;
      this._applyShim['invalidCallback'] = __WEBPACK_IMPORTED_MODULE_10__apply_shim_utils_js__["a" /* invalidate */];
    }
  }
  _ensureCustomStyleInterface() {
    if (this._customStyleInterface) {
      return;
    } else if (window.ShadyCSS && window.ShadyCSS.CustomStyleInterface) {
      this._customStyleInterface = /** @type {!CustomStyleInterfaceInterface} */(window.ShadyCSS.CustomStyleInterface);
      /** @type {function(!HTMLStyleElement)} */
      this._customStyleInterface['transformCallback'] = (style) => {this.transformCustomStyleForDocument(style)};
      this._customStyleInterface['validateCallback'] = () => {
        requestAnimationFrame(() => {
          if (this._customStyleInterface['enqueued'] || this._elementsHaveApplied) {
            this.flushCustomStyles();
          }
        })
      };
    }
  }
  _ensure() {
    this._ensureApplyShim();
    this._ensureCustomStyleInterface();
  }
  /**
   * Flush and apply custom styles to document
   */
  flushCustomStyles() {
    this._ensure();
    if (!this._customStyleInterface) {
      return;
    }
    let customStyles = this._customStyleInterface['processStyles']();
    // early return if custom-styles don't need validation
    if (!this._customStyleInterface['enqueued']) {
      return;
    }
    if (!__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["a" /* nativeCssVariables */]) {
      this._updateProperties(this._documentOwner, this._documentOwnerStyleInfo);
      this._applyCustomStyles(customStyles);
    } else {
      this._revalidateCustomStyleApplyShim(customStyles);
    }
    this._customStyleInterface['enqueued'] = false;
    // if custom elements have upgraded and there are no native css variables, we must recalculate the whole tree
    if (this._elementsHaveApplied && !__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["a" /* nativeCssVariables */]) {
      this.styleDocument();
    }
  }
  /**
   * Apply styles for the given element
   *
   * @param {!HTMLElement} host
   * @param {Object=} overrideProps
   */
  styleElement(host, overrideProps) {
    let {is} = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["e" /* getIsExtends */](host);
    let styleInfo = __WEBPACK_IMPORTED_MODULE_6__style_info_js__["a" /* default */].get(host);
    if (!styleInfo) {
      styleInfo = this._prepareHost(host);
    }
    // Only trip the `elementsHaveApplied` flag if a node other that the root document has `applyStyle` called
    if (!this._isRootOwner(host)) {
      this._elementsHaveApplied = true;
    }
    if (overrideProps) {
      styleInfo.overrideStyleProperties =
        styleInfo.overrideStyleProperties || {};
      Object.assign(styleInfo.overrideStyleProperties, overrideProps);
    }
    if (!__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["a" /* nativeCssVariables */]) {
     this._updateProperties(host, styleInfo);
      if (styleInfo.ownStylePropertyNames && styleInfo.ownStylePropertyNames.length) {
        this._applyStyleProperties(host, styleInfo);
      }
    } else {
      if (styleInfo.overrideStyleProperties) {
        Object(__WEBPACK_IMPORTED_MODULE_12__common_utils_js__["b" /* updateNativeProperties */])(host, styleInfo.overrideStyleProperties);
      }
      let template = __WEBPACK_IMPORTED_MODULE_9__template_map_js__["a" /* default */][is];
      // bail early if there is no shadowroot for this element
      if (!template && !this._isRootOwner(host)) {
        return;
      }
      if (template && template._style && !__WEBPACK_IMPORTED_MODULE_10__apply_shim_utils_js__["c" /* templateIsValid */](template)) {
        // update template
        if (!__WEBPACK_IMPORTED_MODULE_10__apply_shim_utils_js__["d" /* templateIsValidating */](template)) {
          this._ensure();
          this._applyShim && this._applyShim['transformRules'](template['_styleAst'], is);
          template._style.textContent = __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */].elementStyles(host, styleInfo.styleRules);
          __WEBPACK_IMPORTED_MODULE_10__apply_shim_utils_js__["b" /* startValidatingTemplate */](template);
        }
        // update instance if native shadowdom
        if (__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["b" /* nativeShadow */]) {
          let root = host.shadowRoot;
          if (root) {
            let style = root.querySelector('style');
            style.textContent = __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */].elementStyles(host, styleInfo.styleRules);
          }
        }
        styleInfo.styleRules = template['_styleAst'];
      }
    }
  }
  _styleOwnerForNode(node) {
    let root = node.getRootNode();
    let host = root.host;
    if (host) {
      if (__WEBPACK_IMPORTED_MODULE_6__style_info_js__["a" /* default */].get(host)) {
        return host;
      } else {
        return this._styleOwnerForNode(host);
      }
    }
    return this._documentOwner;
  }
  _isRootOwner(node) {
    return (node === this._documentOwner);
  }
  _applyStyleProperties(host, styleInfo) {
    let is = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["e" /* getIsExtends */](host).is;
    let cacheEntry = styleCache.fetch(is, styleInfo.styleProperties, styleInfo.ownStylePropertyNames);
    let cachedScopeSelector = cacheEntry && cacheEntry.scopeSelector;
    let cachedStyle = cacheEntry ? cacheEntry.styleElement : null;
    let oldScopeSelector = styleInfo.scopeSelector;
    // only generate new scope if cached style is not found
    styleInfo.scopeSelector = cachedScopeSelector || this._generateScopeSelector(is);
    let style = __WEBPACK_IMPORTED_MODULE_4__style_properties_js__["a" /* default */].applyElementStyle(host, styleInfo.styleProperties, styleInfo.scopeSelector, cachedStyle);
    if (!__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["b" /* nativeShadow */]) {
      __WEBPACK_IMPORTED_MODULE_4__style_properties_js__["a" /* default */].applyElementScopeSelector(host, styleInfo.scopeSelector, oldScopeSelector);
    }
    if (!cacheEntry) {
      styleCache.store(is, styleInfo.styleProperties, style, styleInfo.scopeSelector);
    }
    return style;
  }
  _updateProperties(host, styleInfo) {
    let owner = this._styleOwnerForNode(host);
    let ownerStyleInfo = __WEBPACK_IMPORTED_MODULE_6__style_info_js__["a" /* default */].get(owner);
    let ownerProperties = ownerStyleInfo.styleProperties;
    let props = Object.create(ownerProperties || null);
    let hostAndRootProps = __WEBPACK_IMPORTED_MODULE_4__style_properties_js__["a" /* default */].hostAndRootPropertiesForScope(host, styleInfo.styleRules);
    let propertyData = __WEBPACK_IMPORTED_MODULE_4__style_properties_js__["a" /* default */].propertyDataFromStyles(ownerStyleInfo.styleRules, host);
    let propertiesMatchingHost = propertyData.properties
    Object.assign(
      props,
      hostAndRootProps.hostProps,
      propertiesMatchingHost,
      hostAndRootProps.rootProps
    );
    this._mixinOverrideStyles(props, styleInfo.overrideStyleProperties);
    __WEBPACK_IMPORTED_MODULE_4__style_properties_js__["a" /* default */].reify(props);
    styleInfo.styleProperties = props;
  }
  _mixinOverrideStyles(props, overrides) {
    for (let p in overrides) {
      let v = overrides[p];
      // skip override props if they are not truthy or 0
      // in order to fall back to inherited values
      if (v || v === 0) {
        props[p] = v;
      }
    }
  }
  /**
   * Update styles of the whole document
   *
   * @param {Object=} properties
   */
  styleDocument(properties) {
    this.styleSubtree(this._documentOwner, properties);
  }
  /**
   * Update styles of a subtree
   *
   * @param {!HTMLElement} host
   * @param {Object=} properties
   */
  styleSubtree(host, properties) {
    let root = host.shadowRoot;
    if (root || this._isRootOwner(host)) {
      this.styleElement(host, properties);
    }
    // process the shadowdom children of `host`
    let shadowChildren = root && (root.children || root.childNodes);
    if (shadowChildren) {
      for (let i = 0; i < shadowChildren.length; i++) {
        let c = /** @type {!HTMLElement} */(shadowChildren[i]);
        this.styleSubtree(c);
      }
    } else {
      // process the lightdom children of `host`
      let children = host.children || host.childNodes;
      if (children) {
        for (let i = 0; i < children.length; i++) {
          let c = /** @type {!HTMLElement} */(children[i]);
          this.styleSubtree(c);
        }
      }
    }
  }
  /* Custom Style operations */
  _revalidateCustomStyleApplyShim(customStyles) {
    for (let i = 0; i < customStyles.length; i++) {
      let c = customStyles[i];
      let s = this._customStyleInterface['getStyleForCustomStyle'](c);
      if (s) {
        this._revalidateApplyShim(s);
      }
    }
  }
  _applyCustomStyles(customStyles) {
    for (let i = 0; i < customStyles.length; i++) {
      let c = customStyles[i];
      let s = this._customStyleInterface['getStyleForCustomStyle'](c);
      if (s) {
        __WEBPACK_IMPORTED_MODULE_4__style_properties_js__["a" /* default */].applyCustomStyle(s, this._documentOwnerStyleInfo.styleProperties);
      }
    }
  }
  transformCustomStyleForDocument(style) {
    let ast = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["h" /* rulesForStyle */](style);
    __WEBPACK_IMPORTED_MODULE_3__style_util_js__["d" /* forEachRule */](ast, (rule) => {
      if (__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["b" /* nativeShadow */]) {
        __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */].normalizeRootSelector(rule);
      } else {
        __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */].documentRule(rule);
      }
      if (__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["a" /* nativeCssVariables */]) {
        this._ensure();
        this._applyShim && this._applyShim['transformRule'](rule);
      }
    });
    if (__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["a" /* nativeCssVariables */]) {
      style.textContent = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["j" /* toCssText */](ast);
    } else {
      this._documentOwnerStyleInfo.styleRules.rules.push(ast);
    }
  }
  _revalidateApplyShim(style) {
    if (__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["a" /* nativeCssVariables */] && this._applyShim) {
      let ast = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["h" /* rulesForStyle */](style);
      this._ensure();
      this._applyShim['transformRules'](ast);
      style.textContent = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["j" /* toCssText */](ast);
    }
  }
  getComputedStyleValue(element, property) {
    let value;
    if (!__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["a" /* nativeCssVariables */]) {
      // element is either a style host, or an ancestor of a style host
      let styleInfo = __WEBPACK_IMPORTED_MODULE_6__style_info_js__["a" /* default */].get(element) || __WEBPACK_IMPORTED_MODULE_6__style_info_js__["a" /* default */].get(this._styleOwnerForNode(element));
      value = styleInfo.styleProperties[property];
    }
    // fall back to the property value from the computed styling
    value = value || window.getComputedStyle(element).getPropertyValue(property);
    // trim whitespace that can come after the `:` in css
    // example: padding: 2px -> " 2px"
    return value ? value.trim() : '';
  }
  // given an element and a classString, replaces
  // the element's class with the provided classString and adds
  // any necessary ShadyCSS static and property based scoping selectors
  setElementClass(element, classString) {
    let root = element.getRootNode();
    let classes = classString ? classString.split(/\s/) : [];
    let scopeName = root.host && root.host.localName;
    // If no scope, try to discover scope name from existing class.
    // This can occur if, for example, a template stamped element that
    // has been scoped is manipulated when not in a root.
    if (!scopeName) {
      var classAttr = element.getAttribute('class');
      if (classAttr) {
        let k$ = classAttr.split(/\s/);
        for (let i=0; i < k$.length; i++) {
          if (k$[i] === __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */].SCOPE_NAME) {
            scopeName = k$[i+1];
            break;
          }
        }
      }
    }
    if (scopeName) {
      classes.push(__WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */].SCOPE_NAME, scopeName);
    }
    if (!__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["a" /* nativeCssVariables */]) {
      let styleInfo = __WEBPACK_IMPORTED_MODULE_6__style_info_js__["a" /* default */].get(element);
      if (styleInfo && styleInfo.scopeSelector) {
        classes.push(__WEBPACK_IMPORTED_MODULE_4__style_properties_js__["a" /* default */].XSCOPE_NAME, styleInfo.scopeSelector);
      }
    }
    __WEBPACK_IMPORTED_MODULE_3__style_util_js__["i" /* setElementClassRaw */](element, classes.join(' '));
  }
  _styleInfoForNode(node) {
    return __WEBPACK_IMPORTED_MODULE_6__style_info_js__["a" /* default */].get(node);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ScopingShim;


/* exports */
ScopingShim.prototype['flush'] = ScopingShim.prototype.flush;
ScopingShim.prototype['prepareTemplate'] = ScopingShim.prototype.prepareTemplate;
ScopingShim.prototype['styleElement'] = ScopingShim.prototype.styleElement;
ScopingShim.prototype['styleDocument'] = ScopingShim.prototype.styleDocument;
ScopingShim.prototype['styleSubtree'] = ScopingShim.prototype.styleSubtree;
ScopingShim.prototype['getComputedStyleValue'] = ScopingShim.prototype.getComputedStyleValue;
ScopingShim.prototype['setElementClass'] = ScopingShim.prototype.setElementClass;
ScopingShim.prototype['_styleInfoForNode'] = ScopingShim.prototype._styleInfoForNode;
ScopingShim.prototype['transformCustomStyleForDocument'] = ScopingShim.prototype.transformCustomStyleForDocument;
ScopingShim.prototype['getStyleAst'] = ScopingShim.prototype.getStyleAst;
ScopingShim.prototype['styleAstToString'] = ScopingShim.prototype.styleAstToString;
ScopingShim.prototype['flushCustomStyles'] = ScopingShim.prototype.flushCustomStyles;
Object.defineProperties(ScopingShim.prototype, {
  'nativeShadow': {
    get() {
      return __WEBPACK_IMPORTED_MODULE_1__style_settings_js__["b" /* nativeShadow */];
    }
  },
  'nativeCss': {
    get() {
      return __WEBPACK_IMPORTED_MODULE_1__style_settings_js__["a" /* nativeCssVariables */];
    }
  }
});

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_parse_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style_settings_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style_util_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_regex_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__style_info_js__ = __webpack_require__(29);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



 // eslint-disable-line no-unused-vars






// TODO: dedupe with shady
/**
 * @const {function(string):boolean}
 */
const matchesSelector = ((p) => p.matches || p.matchesSelector ||
  p.mozMatchesSelector || p.msMatchesSelector ||
p.oMatchesSelector || p.webkitMatchesSelector)(window.Element.prototype);

const IS_IE = navigator.userAgent.match('Trident');

const XSCOPE_NAME = 'x-scope';

class StyleProperties {
  get XSCOPE_NAME() {
    return XSCOPE_NAME;
  }
/**
 * decorates styles with rule info and returns an array of used style property names
 *
 * @param {StyleNode} rules
 * @return {Array<string>}
 */
  decorateStyles(rules) {
    let self = this, props = {}, keyframes = [], ruleIndex = 0;
    __WEBPACK_IMPORTED_MODULE_3__style_util_js__["d" /* forEachRule */](rules, function(rule) {
      self.decorateRule(rule);
      // mark in-order position of ast rule in styles block, used for cache key
      rule.index = ruleIndex++;
      self.collectPropertiesInCssText(rule.propertyInfo.cssText, props);
    }, function onKeyframesRule(rule) {
      keyframes.push(rule);
    });
    // Cache all found keyframes rules for later reference:
    rules._keyframes = keyframes;
    // return this list of property names *consumes* in these styles.
    let names = [];
    for (let i in props) {
      names.push(i);
    }
    return names;
  }

  // decorate a single rule with property info
  decorateRule(rule) {
    if (rule.propertyInfo) {
      return rule.propertyInfo;
    }
    let info = {}, properties = {};
    let hasProperties = this.collectProperties(rule, properties);
    if (hasProperties) {
      info.properties = properties;
      // TODO(sorvell): workaround parser seeing mixins as additional rules
      rule['rules'] = null;
    }
    info.cssText = this.collectCssText(rule);
    rule.propertyInfo = info;
    return info;
  }

  // collects the custom properties from a rule's cssText
  collectProperties(rule, properties) {
    let info = rule.propertyInfo;
    if (info) {
      if (info.properties) {
        Object.assign(properties, info.properties);
        return true;
      }
    } else {
      let m, rx = __WEBPACK_IMPORTED_MODULE_4__common_regex_js__["g" /* VAR_ASSIGN */];
      let cssText = rule['parsedCssText'];
      let value;
      let any;
      while ((m = rx.exec(cssText))) {
        // note: group 2 is var, 3 is mixin
        value = (m[2] || m[3]).trim();
        // value of 'inherit' or 'unset' is equivalent to not setting the property here
        if (value !== 'inherit' || value !== 'unset') {
          properties[m[1].trim()] = value;
        }
        any = true;
      }
      return any;
    }

  }

  // returns cssText of properties that consume variables/mixins
  collectCssText(rule) {
    return this.collectConsumingCssText(rule['parsedCssText']);
  }

  // NOTE: we support consumption inside mixin assignment
  // but not production, so strip out {...}
  collectConsumingCssText(cssText) {
    return cssText.replace(__WEBPACK_IMPORTED_MODULE_4__common_regex_js__["b" /* BRACKETED */], '')
      .replace(__WEBPACK_IMPORTED_MODULE_4__common_regex_js__["g" /* VAR_ASSIGN */], '');
  }

  collectPropertiesInCssText(cssText, props) {
    let m;
    while ((m = __WEBPACK_IMPORTED_MODULE_4__common_regex_js__["h" /* VAR_CONSUMED */].exec(cssText))) {
      let name = m[1];
      // This regex catches all variable names, and following non-whitespace char
      // If next char is not ':', then variable is a consumer
      if (m[2] !== ':') {
        props[name] = true;
      }
    }
  }

  // turns custom properties into realized values.
  reify(props) {
    // big perf optimization here: reify only *own* properties
    // since this object has __proto__ of the element's scope properties
    let names = Object.getOwnPropertyNames(props);
    for (let i=0, n; i < names.length; i++) {
      n = names[i];
      props[n] = this.valueForProperty(props[n], props);
    }
  }

  // given a property value, returns the reified value
  // a property value may be:
  // (1) a literal value like: red or 5px;
  // (2) a variable value like: var(--a), var(--a, red), or var(--a, --b) or
  // var(--a, var(--b));
  // (3) a literal mixin value like { properties }. Each of these properties
  // can have values that are: (a) literal, (b) variables, (c) @apply mixins.
  valueForProperty(property, props) {
    // case (1) default
    // case (3) defines a mixin and we have to reify the internals
    if (property) {
      if (property.indexOf(';') >=0) {
        property = this.valueForProperties(property, props);
      } else {
        // case (2) variable
        let self = this;
        let fn = function(prefix, value, fallback, suffix) {
          if (!value) {
            return prefix + suffix;
          }
          let propertyValue = self.valueForProperty(props[value], props);
          // if value is "initial", then the variable should be treated as unset
          if (!propertyValue || propertyValue === 'initial') {
            // fallback may be --a or var(--a) or literal
            propertyValue = self.valueForProperty(props[fallback] || fallback, props) ||
            fallback;
          } else if (propertyValue === 'apply-shim-inherit') {
            // CSS build will replace `inherit` with `apply-shim-inherit`
            // for use with native css variables.
            // Since we have full control, we can use `inherit` directly.
            propertyValue = 'inherit';
          }
          return prefix + (propertyValue || '') + suffix;
        };
        property = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["g" /* processVariableAndFallback */](property, fn);
      }
    }
    return property && property.trim() || '';
  }

  // note: we do not yet support mixin within mixin
  valueForProperties(property, props) {
    let parts = property.split(';');
    for (let i=0, p, m; i<parts.length; i++) {
      if ((p = parts[i])) {
        __WEBPACK_IMPORTED_MODULE_4__common_regex_js__["f" /* MIXIN_MATCH */].lastIndex = 0;
        m = __WEBPACK_IMPORTED_MODULE_4__common_regex_js__["f" /* MIXIN_MATCH */].exec(p);
        if (m) {
          p = this.valueForProperty(props[m[1]], props);
        } else {
          let colon = p.indexOf(':');
          if (colon !== -1) {
            let pp = p.substring(colon);
            pp = pp.trim();
            pp = this.valueForProperty(pp, props) || pp;
            p = p.substring(0, colon) + pp;
          }
        }
        parts[i] = (p && p.lastIndexOf(';') === p.length - 1) ?
          // strip trailing ;
          p.slice(0, -1) :
          p || '';
      }
    }
    return parts.join(';');
  }

  applyProperties(rule, props) {
    let output = '';
    // dynamically added sheets may not be decorated so ensure they are.
    if (!rule.propertyInfo) {
      this.decorateRule(rule);
    }
    if (rule.propertyInfo.cssText) {
      output = this.valueForProperties(rule.propertyInfo.cssText, props);
    }
    rule['cssText'] = output;
  }

  // Apply keyframe transformations to the cssText of a given rule. The
  // keyframeTransforms object is a map of keyframe names to transformer
  // functions which take in cssText and spit out transformed cssText.
  applyKeyframeTransforms(rule, keyframeTransforms) {
    let input = rule['cssText'];
    let output = rule['cssText'];
    if (rule.hasAnimations == null) {
      // Cache whether or not the rule has any animations to begin with:
      rule.hasAnimations = __WEBPACK_IMPORTED_MODULE_4__common_regex_js__["a" /* ANIMATION_MATCH */].test(input);
    }
    // If there are no animations referenced, we can skip transforms:
    if (rule.hasAnimations) {
      let transform;
      // If we haven't transformed this rule before, we iterate over all
      // transforms:
      if (rule.keyframeNamesToTransform == null) {
        rule.keyframeNamesToTransform = [];
        for (let keyframe in keyframeTransforms) {
          transform = keyframeTransforms[keyframe];
          output = transform(input);
          // If the transform actually changed the CSS text, we cache the
          // transform name for future use:
          if (input !== output) {
            input = output;
            rule.keyframeNamesToTransform.push(keyframe);
          }
        }
      } else {
        // If we already have a list of keyframe names that apply to this
        // rule, we apply only those keyframe name transforms:
        for (let i = 0; i < rule.keyframeNamesToTransform.length; ++i) {
          transform = keyframeTransforms[rule.keyframeNamesToTransform[i]];
          input = transform(input);
        }
        output = input;
      }
    }
    rule['cssText'] = output;
  }

  // Test if the rules in these styles matches the given `element` and if so,
  // collect any custom properties into `props`.
  /**
   * @param {StyleNode} rules
   * @param {Element} element
   */
  propertyDataFromStyles(rules, element) {
    let props = {}, self = this;
    // generates a unique key for these matches
    let o = [];
    // note: active rules excludes non-matching @media rules
    __WEBPACK_IMPORTED_MODULE_3__style_util_js__["d" /* forEachRule */](rules, function(rule) {
      // TODO(sorvell): we could trim the set of rules at declaration
      // time to only include ones that have properties
      if (!rule.propertyInfo) {
        self.decorateRule(rule);
      }
      // match element against transformedSelector: selector may contain
      // unwanted uniquification and parsedSelector does not directly match
      // for :host selectors.
      let selectorToMatch = rule.transformedSelector || rule['parsedSelector'];
      if (element && rule.propertyInfo.properties && selectorToMatch) {
        if (matchesSelector.call(element, selectorToMatch)) {
          self.collectProperties(rule, props);
          // produce numeric key for these matches for lookup
          addToBitMask(rule.index, o);
        }
      }
    }, null, true);
    return {properties: props, key: o};
  }

  /**
   * @param {Element} scope
   * @param {StyleNode} rule
   * @param {string|undefined} cssBuild
   * @param {function(Object)} callback
   */
  whenHostOrRootRule(scope, rule, cssBuild, callback) {
    if (!rule.propertyInfo) {
      this.decorateRule(rule);
    }
    if (!rule.propertyInfo.properties) {
      return;
    }
    let {is, typeExtension} = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["e" /* getIsExtends */](scope);
    let hostScope = is ?
      __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */]._calcHostScope(is, typeExtension) :
      'html';
    let parsedSelector = rule['parsedSelector'];
    let isRoot = (parsedSelector === ':host > *' || parsedSelector === 'html');
    let isHost = parsedSelector.indexOf(':host') === 0 && !isRoot;
    // build info is either in scope (when scope is an element) or in the style
    // when scope is the default scope; note: this allows default scope to have
    // mixed mode built and unbuilt styles.
    if (cssBuild === 'shady') {
      // :root -> x-foo > *.x-foo for elements and html for custom-style
      isRoot = parsedSelector === (hostScope + ' > *.' + hostScope) || parsedSelector.indexOf('html') !== -1;
      // :host -> x-foo for elements, but sub-rules have .x-foo in them
      isHost = !isRoot && parsedSelector.indexOf(hostScope) === 0;
    }
    if (cssBuild === 'shadow') {
      isRoot = parsedSelector === ':host > *' || parsedSelector === 'html';
      isHost = isHost && !isRoot;
    }
    if (!isRoot && !isHost) {
      return;
    }
    let selectorToMatch = hostScope;
    if (isHost) {
      // need to transform :host under ShadowDOM because `:host` does not work with `matches`
      if (__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["b" /* nativeShadow */] && !rule.transformedSelector) {
        // transform :host into a matchable selector
        rule.transformedSelector =
        __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */]._transformRuleCss(
          rule,
          __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */]._transformComplexSelector,
          __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */]._calcElementScope(is),
          hostScope
        );
      }
      selectorToMatch = rule.transformedSelector || hostScope;
    }
    callback({
      selector: selectorToMatch,
      isHost: isHost,
      isRoot: isRoot
    });
  }
/**
 * @param {Element} scope
 * @param {StyleNode} rules
 * @return {Object}
 */
  hostAndRootPropertiesForScope(scope, rules) {
    let hostProps = {}, rootProps = {}, self = this;
    // note: active rules excludes non-matching @media rules
    let cssBuild = rules && rules['__cssBuild'];
    __WEBPACK_IMPORTED_MODULE_3__style_util_js__["d" /* forEachRule */](rules, function(rule) {
      // if scope is StyleDefaults, use _element for matchesSelector
      self.whenHostOrRootRule(scope, rule, cssBuild, function(info) {
        let element = scope._element || scope;
        if (matchesSelector.call(element, info.selector)) {
          if (info.isHost) {
            self.collectProperties(rule, hostProps);
          } else {
            self.collectProperties(rule, rootProps);
          }
        }
      });
    }, null, true);
    return {rootProps: rootProps, hostProps: hostProps};
  }

  /**
   * @param {Element} element
   * @param {Object} properties
   * @param {string} scopeSelector
   */
  transformStyles(element, properties, scopeSelector) {
    let self = this;
    let {is, typeExtension} = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["e" /* getIsExtends */](element);
    let hostSelector = __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */]
      ._calcHostScope(is, typeExtension);
    let rxHostSelector = element.extends ?
      '\\' + hostSelector.slice(0, -1) + '\\]' :
      hostSelector;
    let hostRx = new RegExp(__WEBPACK_IMPORTED_MODULE_4__common_regex_js__["c" /* HOST_PREFIX */] + rxHostSelector +
      __WEBPACK_IMPORTED_MODULE_4__common_regex_js__["d" /* HOST_SUFFIX */]);
    let rules = __WEBPACK_IMPORTED_MODULE_5__style_info_js__["a" /* default */].get(element).styleRules;
    let keyframeTransforms =
      this._elementKeyframeTransforms(element, rules, scopeSelector);
    return __WEBPACK_IMPORTED_MODULE_2__style_transformer_js__["a" /* default */].elementStyles(element, rules, function(rule) {
      self.applyProperties(rule, properties);
      if (!__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["b" /* nativeShadow */] &&
          !__WEBPACK_IMPORTED_MODULE_3__style_util_js__["f" /* isKeyframesSelector */](rule) &&
          rule['cssText']) {
        // NOTE: keyframe transforms only scope munge animation names, so it
        // is not necessary to apply them in ShadowDOM.
        self.applyKeyframeTransforms(rule, keyframeTransforms);
        self._scopeSelector(rule, hostRx, hostSelector, scopeSelector);
      }
    });
  }

  /**
   * @param {Element} element
   * @param {StyleNode} rules
   * @param {string} scopeSelector
   * @return {Object}
   */
  _elementKeyframeTransforms(element, rules, scopeSelector) {
    let keyframesRules = rules._keyframes;
    let keyframeTransforms = {};
    if (!__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["b" /* nativeShadow */] && keyframesRules) {
      // For non-ShadowDOM, we transform all known keyframes rules in
      // advance for the current scope. This allows us to catch keyframes
      // rules that appear anywhere in the stylesheet:
      for (let i = 0, keyframesRule = keyframesRules[i];
           i < keyframesRules.length;
           keyframesRule = keyframesRules[++i]) {
        this._scopeKeyframes(keyframesRule, scopeSelector);
        keyframeTransforms[keyframesRule['keyframesName']] =
            this._keyframesRuleTransformer(keyframesRule);
      }
    }
    return keyframeTransforms;
  }

  // Generate a factory for transforming a chunk of CSS text to handle a
  // particular scoped keyframes rule.
  /**
   * @param {StyleNode} keyframesRule
   * @return {function(string):string}
   */
  _keyframesRuleTransformer(keyframesRule) {
    return function(cssText) {
      return cssText.replace(
          keyframesRule.keyframesNameRx,
          keyframesRule.transformedKeyframesName);
    };
  }

/**
 * Transforms `@keyframes` names to be unique for the current host.
 * Example: @keyframes foo-anim -> @keyframes foo-anim-x-foo-0
 *
 * @param {StyleNode} rule
 * @param {string} scopeId
 */
  _scopeKeyframes(rule, scopeId) {
    rule.keyframesNameRx = new RegExp(rule['keyframesName'], 'g');
    rule.transformedKeyframesName = rule['keyframesName'] + '-' + scopeId;
    rule.transformedSelector = rule.transformedSelector || rule['selector'];
    rule['selector'] = rule.transformedSelector.replace(
        rule['keyframesName'], rule.transformedKeyframesName);
  }

  // Strategy: x scope shim a selector e.g. to scope `.x-foo-42` (via classes):
  // non-host selector: .a.x-foo -> .x-foo-42 .a.x-foo
  // host selector: x-foo.wide -> .x-foo-42.wide
  // note: we use only the scope class (.x-foo-42) and not the hostSelector
  // (x-foo) to scope :host rules; this helps make property host rules
  // have low specificity. They are overrideable by class selectors but,
  // unfortunately, not by type selectors (e.g. overriding via
  // `.special` is ok, but not by `x-foo`).
  /**
   * @param {StyleNode} rule
   * @param {RegExp} hostRx
   * @param {string} hostSelector
   * @param {string} scopeId
   */
  _scopeSelector(rule, hostRx, hostSelector, scopeId) {
    rule.transformedSelector = rule.transformedSelector || rule['selector'];
    let selector = rule.transformedSelector;
    let scope = '.' + scopeId;
    let parts = selector.split(',');
    for (let i=0, l=parts.length, p; (i<l) && (p=parts[i]); i++) {
      parts[i] = p.match(hostRx) ?
        p.replace(hostSelector, scope) :
        scope + ' ' + p;
    }
    rule['selector'] = parts.join(',');
  }

  /**
   * @param {Element} element
   * @param {string} selector
   * @param {string} old
   */
  applyElementScopeSelector(element, selector, old) {
    let c = element.getAttribute('class') || '';
    let v = c;
    if (old) {
      v = c.replace(
        new RegExp('\\s*' + XSCOPE_NAME + '\\s*' + old + '\\s*', 'g'), ' ');
    }
    v += (v ? ' ' : '') + XSCOPE_NAME + ' ' + selector;
    if (c !== v) {
      __WEBPACK_IMPORTED_MODULE_3__style_util_js__["i" /* setElementClassRaw */](element, v);
    }
  }

  /**
   * @param {HTMLElement} element
   * @param {Object} properties
   * @param {string} selector
   * @param {HTMLStyleElement} style
   * @return {HTMLStyleElement}
   */
  applyElementStyle(element, properties, selector, style) {
    // calculate cssText to apply
    let cssText = style ? style.textContent || '' :
      this.transformStyles(element, properties, selector);
    // if shady and we have a cached style that is not style, decrement
    let styleInfo = __WEBPACK_IMPORTED_MODULE_5__style_info_js__["a" /* default */].get(element);
    let s = styleInfo.customStyle;
    if (s && !__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["b" /* nativeShadow */] && (s !== style)) {
      s['_useCount']--;
      if (s['_useCount'] <= 0 && s.parentNode) {
        s.parentNode.removeChild(s);
      }
    }
    // apply styling always under native or if we generated style
    // or the cached style is not in document(!)
    if (__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["b" /* nativeShadow */]) {
      // update existing style only under native
      if (styleInfo.customStyle) {
        styleInfo.customStyle.textContent = cssText;
        style = styleInfo.customStyle;
      // otherwise, if we have css to apply, do so
      } else if (cssText) {
        // apply css after the scope style of the element to help with
        // style precedence rules.
        style = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["a" /* applyCss */](cssText, selector, element.shadowRoot,
          styleInfo.placeholder);
      }
    } else {
      // shady and no cache hit
      if (!style) {
        // apply css after the scope style of the element to help with
        // style precedence rules.
        if (cssText) {
          style = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["a" /* applyCss */](cssText, selector, null,
            styleInfo.placeholder);
        }
      // shady and cache hit but not in document
      } else if (!style.parentNode) {
        if (IS_IE && cssText.indexOf('@media') > -1) {
            // @media rules may be stale in IE 10 and 11
            // refresh the text content of the style to revalidate them.
          style.textContent = cssText;
        }
        __WEBPACK_IMPORTED_MODULE_3__style_util_js__["b" /* applyStyle */](style, null, styleInfo.placeholder);
      }
    }
    // ensure this style is our custom style and increment its use count.
    if (style) {
      style['_useCount'] = style['_useCount'] || 0;
      // increment use count if we changed styles
      if (styleInfo.customStyle != style) {
        style['_useCount']++;
      }
      styleInfo.customStyle = style;
    }
    return style;
  }

  /**
   * @param {Element} style
   * @param {Object} properties
   */
  applyCustomStyle(style, properties) {
    let rules = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["h" /* rulesForStyle */](/** @type {HTMLStyleElement} */(style));
    let self = this;
    style.textContent = __WEBPACK_IMPORTED_MODULE_3__style_util_js__["j" /* toCssText */](rules, function(/** StyleNode */rule) {
      let css = rule['cssText'] = rule['parsedCssText'];
      if (rule.propertyInfo && rule.propertyInfo.cssText) {
        // remove property assignments
        // so next function isn't confused
        // NOTE: we have 3 categories of css:
        // (1) normal properties,
        // (2) custom property assignments (--foo: red;),
        // (3) custom property usage: border: var(--foo); @apply(--foo);
        // In elements, 1 and 3 are separated for efficiency; here they
        // are not and this makes this case unique.
        css = Object(__WEBPACK_IMPORTED_MODULE_0__css_parse_js__["c" /* removeCustomPropAssignment */])(/** @type {string} */(css));
        // replace with reified properties, scenario is same as mixin
        rule['cssText'] = self.valueForProperties(css, properties);
      }
    });
  }
}

/**
 * @param {number} n
 * @param {Array<number>} bits
 */
function addToBitMask(n, bits) {
  let o = parseInt(n / 32, 10);
  let v = 1 << (n % 32);
  bits[o] = (bits[o] || 0) | v;
}

/* harmony default export */ __webpack_exports__["a"] = (new StyleProperties());

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_util_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style_settings_js__ = __webpack_require__(3);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/






/** @type {Object<string, !Node>} */
let placeholderMap = {};

/**
 * @const {CustomElementRegistry}
 */
const ce = window['customElements'];
if (ce && !__WEBPACK_IMPORTED_MODULE_1__style_settings_js__["b" /* nativeShadow */]) {
  /**
   * @const {function(this:CustomElementRegistry, string,function(new:HTMLElement),{extends: string}=)}
   */
  const origDefine = ce['define'];
  /**
   * @param {string} name
   * @param {function(new:HTMLElement)} clazz
   * @param {{extends: string}=} options
   * @return {function(new:HTMLElement)}
   */
  const wrappedDefine = (name, clazz, options) => {
    placeholderMap[name] = Object(__WEBPACK_IMPORTED_MODULE_0__style_util_js__["c" /* applyStylePlaceHolder */])(name);
    return origDefine.call(/** @type {!CustomElementRegistry} */(ce), name, clazz, options);
  }
  ce['define'] = wrappedDefine;
}

/* harmony default export */ __webpack_exports__["a"] = (placeholderMap);


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/


class StyleCache {
  constructor(typeMax = 100) {
    // map element name -> [{properties, styleElement, scopeSelector}]
    this.cache = {};
    this.typeMax = typeMax;
  }

  _validate(cacheEntry, properties, ownPropertyNames) {
    for (let idx = 0; idx < ownPropertyNames.length; idx++) {
      let pn = ownPropertyNames[idx];
      if (cacheEntry.properties[pn] !== properties[pn]) {
        return false;
      }
    }
    return true;
  }

  store(tagname, properties, styleElement, scopeSelector) {
    let list = this.cache[tagname] || [];
    list.push({properties, styleElement, scopeSelector});
    if (list.length > this.typeMax) {
      list.shift();
    }
    this.cache[tagname] = list;
  }

  fetch(tagname, properties, ownPropertyNames) {
    let list = this.cache[tagname];
    if (!list) {
      return;
    }
    // reverse list for most-recent lookups
    for (let idx = list.length - 1; idx >= 0; idx--) {
      let entry = list[idx];
      if (this._validate(entry, properties, ownPropertyNames)) {
        return entry;
      }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StyleCache;



/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return flush; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_settings_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__style_transformer_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__style_util_js__ = __webpack_require__(8);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/







let flush = function() {};

/**
 * @param {HTMLElement} element
 * @return {!Array<string>}
 */
function getClasses(element) {
  let classes = [];
  if (element.classList) {
    classes = Array.from(element.classList);
  } else if (element instanceof window['SVGElement'] && element.hasAttribute('class')) {
    classes = element.getAttribute('class').split(/\s+/);
  }
  return classes;
}

/**
 * @param {HTMLElement} element
 * @return {string}
 */
function getCurrentScope(element) {
  let classes = getClasses(element);
  let idx = classes.indexOf(__WEBPACK_IMPORTED_MODULE_1__style_transformer_js__["a" /* default */].SCOPE_NAME);
  if (idx > -1) {
    return classes[idx + 1];
  }
  return '';
}

/**
 * @param {Array<MutationRecord|null>|null} mxns
 */
function handler(mxns) {
  for (let x=0; x < mxns.length; x++) {
    let mxn = mxns[x];
    if (mxn.target === document.documentElement ||
      mxn.target === document.head) {
      continue;
    }
    for (let i=0; i < mxn.addedNodes.length; i++) {
      let n = mxn.addedNodes[i];
      if (n.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }
      n = /** @type {HTMLElement} */(n); // eslint-disable-line no-self-assign
      let root = n.getRootNode();
      let currentScope = getCurrentScope(n);
      // node was scoped, but now is in document
      if (currentScope && root === n.ownerDocument) {
        __WEBPACK_IMPORTED_MODULE_1__style_transformer_js__["a" /* default */].dom(n, currentScope, true);
      } else if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        let newScope;
        let host = /** @type {ShadowRoot} */(root).host;
        // element may no longer be in a shadowroot
        if (!host) {
          continue;
        }
        newScope = Object(__WEBPACK_IMPORTED_MODULE_2__style_util_js__["e" /* getIsExtends */])(host).is;
        if (currentScope === newScope) {
          continue;
        }
        if (currentScope) {
          __WEBPACK_IMPORTED_MODULE_1__style_transformer_js__["a" /* default */].dom(n, currentScope, true);
        }
        __WEBPACK_IMPORTED_MODULE_1__style_transformer_js__["a" /* default */].dom(n, newScope);
      }
    }
  }
}

if (!__WEBPACK_IMPORTED_MODULE_0__style_settings_js__["b" /* nativeShadow */]) {
  let observer = new MutationObserver(handler);
  let start = (node) => {
    observer.observe(node, {childList: true, subtree: true});
  }
  let nativeCustomElements = (window['customElements'] &&
    !window['customElements']['polyfillWrapFlushCallback']);
  // need to start immediately with native custom elements
  // TODO(dfreedm): with polyfilled HTMLImports and native custom elements
  // excessive mutations may be observed; this can be optimized via cooperation
  // with the HTMLImports polyfill.
  if (nativeCustomElements) {
    start(document);
  } else {
    let delayedStart = () => {
      start(document.body);
    }
    // use polyfill timing if it's available
    if (window['HTMLImports']) {
      window['HTMLImports']['whenReady'](delayedStart);
    // otherwise push beyond native imports being ready
    // which requires RAF + readystate interactive.
    } else {
      requestAnimationFrame(function() {
        if (document.readyState === 'loading') {
          let listener = function() {
            delayedStart();
            document.removeEventListener('readystatechange', listener);
          }
          document.addEventListener('readystatechange', listener);
        } else {
          delayedStart();
        }
      });
    }
  }

  flush = function() {
    handler(observer.takeRecords());
  }
}


/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = invalidate;
/* unused harmony export invalidateTemplate */
/* unused harmony export isValid */
/* harmony export (immutable) */ __webpack_exports__["c"] = templateIsValid;
/* unused harmony export isValidating */
/* harmony export (immutable) */ __webpack_exports__["d"] = templateIsValidating;
/* unused harmony export startValidating */
/* harmony export (immutable) */ __webpack_exports__["b"] = startValidatingTemplate;
/* unused harmony export elementsAreInvalid */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__template_map_js__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_parse_js__ = __webpack_require__(4);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



 // eslint-disable-line no-unused-vars

/*
 * Utilities for handling invalidating apply-shim mixins for a given template.
 *
 * The invalidation strategy involves keeping track of the "current" version of a template's mixins, and updating that count when a mixin is invalidated.
 * The template
 */

/** @const {string} */
const CURRENT_VERSION = '_applyShimCurrentVersion';

/** @const {string} */
const NEXT_VERSION = '_applyShimNextVersion';

/** @const {string} */
const VALIDATING_VERSION = '_applyShimValidatingVersion';

/**
 * @const {Promise<void>}
 */
const promise = Promise.resolve();

/**
 * @param {string} elementName
 */
function invalidate(elementName){
  let template = __WEBPACK_IMPORTED_MODULE_0__template_map_js__["a" /* default */][elementName];
  if (template) {
    invalidateTemplate(template);
  }
}

/**
 * This function can be called multiple times to mark a template invalid
 * and signal that the style inside must be regenerated.
 *
 * Use `startValidatingTemplate` to begin an asynchronous validation cycle.
 * During that cycle, call `templateIsValidating` to see if the template must
 * be revalidated
 * @param {HTMLTemplateElement} template
 */
function invalidateTemplate(template) {
  // default the current version to 0
  template[CURRENT_VERSION] = template[CURRENT_VERSION] || 0;
  // ensure the "validating for" flag exists
  template[VALIDATING_VERSION] = template[VALIDATING_VERSION] || 0;
  // increment the next version
  template[NEXT_VERSION] = (template[NEXT_VERSION] || 0) + 1;
}

/**
 * @param {string} elementName
 * @return {boolean}
 */
function isValid(elementName) {
  let template = __WEBPACK_IMPORTED_MODULE_0__template_map_js__["a" /* default */][elementName];
  if (template) {
    return templateIsValid(template);
  }
  return true;
}

/**
 * @param {HTMLTemplateElement} template
 * @return {boolean}
 */
function templateIsValid(template) {
  return template[CURRENT_VERSION] === template[NEXT_VERSION];
}

/**
 * @param {string} elementName
 * @return {boolean}
 */
function isValidating(elementName) {
  let template = __WEBPACK_IMPORTED_MODULE_0__template_map_js__["a" /* default */][elementName];
  if (template) {
    return templateIsValidating(template);
  }
  return false;
}

/**
 * Returns true if the template is currently invalid and `startValidating` has been called since the last invalidation.
 * If false, the template must be validated.
 * @param {HTMLTemplateElement} template
 * @return {boolean}
 */
function templateIsValidating(template) {
  return !templateIsValid(template) && template[VALIDATING_VERSION] === template[NEXT_VERSION];
}

/**
 * the template is marked as `validating` for one microtask so that all instances
 * found in the tree crawl of `applyStyle` will update themselves,
 * but the template will only be updated once.
 * @param {string} elementName
*/
function startValidating(elementName) {
  let template = __WEBPACK_IMPORTED_MODULE_0__template_map_js__["a" /* default */][elementName];
  startValidatingTemplate(template);
}

/**
 * Begin an asynchronous invalidation cycle.
 * This should be called after every validation of a template
 *
 * After one microtask, the template will be marked as valid until the next call to `invalidateTemplate`
 * @param {HTMLTemplateElement} template
 */
function startValidatingTemplate(template) {
  // remember that the current "next version" is the reason for this validation cycle
  template[VALIDATING_VERSION] = template[NEXT_VERSION];
  // however, there only needs to be one async task to clear the counters
  if (!template._validating) {
    template._validating = true;
    promise.then(function() {
      // sync the current version to let future invalidations cause a refresh cycle
      template[CURRENT_VERSION] = template[NEXT_VERSION];
      template._validating = false;
    });
  }
}

/**
 * @return {boolean}
 */
function elementsAreInvalid() {
  for (let elementName in __WEBPACK_IMPORTED_MODULE_0__template_map_js__["a" /* default */]) {
    let template = __WEBPACK_IMPORTED_MODULE_0__template_map_js__["a" /* default */][elementName];
    if (!templateIsValid(template)) {
      return true;
    }
  }
  return false;
}

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = updateNativeProperties;
/* unused harmony export getComputedStyleValue */
/* harmony export (immutable) */ __webpack_exports__["a"] = detectMixin;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_regex_js__ = __webpack_require__(16);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/





/**
 * @param {Element} element
 * @param {Object=} properties
 */
function updateNativeProperties(element, properties) {
  // remove previous properties
  for (let p in properties) {
    // NOTE: for bc with shim, don't apply null values.
    if (p === null) {
      element.style.removeProperty(p);
    } else {
      element.style.setProperty(p, properties[p]);
    }
  }
}

/**
 * @param {Element} element
 * @param {string} property
 * @return {string}
 */
function getComputedStyleValue(element, property) {
  /**
   * @const {string}
   */
  const value = window.getComputedStyle(element).getPropertyValue(property);
  if (!value) {
    return '';
  } else {
    return value.trim();
  }
}

/**
 * return true if `cssText` contains a mixin definition or consumption
 * @param {string} cssText
 * @return {boolean}
 */
function detectMixin(cssText) {
  const has = __WEBPACK_IMPORTED_MODULE_0__common_regex_js__["f" /* MIXIN_MATCH */].test(cssText) || __WEBPACK_IMPORTED_MODULE_0__common_regex_js__["g" /* VAR_ASSIGN */].test(cssText);
  // reset state of the regexes
  __WEBPACK_IMPORTED_MODULE_0__common_regex_js__["f" /* MIXIN_MATCH */].lastIndex = 0;
  __WEBPACK_IMPORTED_MODULE_0__common_regex_js__["g" /* VAR_ASSIGN */].lastIndex = 0;
  return has;
}


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export CustomStyleProvider */
/* unused harmony export CustomStyleInterfaceInterface */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__document_wait_js__ = __webpack_require__(31);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/





/**
 * @typedef {HTMLStyleElement | {getStyle: function():HTMLStyleElement}}
 */
let CustomStyleProvider;

const SEEN_MARKER = '__seenByShadyCSS';
const CACHED_STYLE = '__shadyCSSCachedStyle';

/** @type {?function(!HTMLStyleElement)} */
let transformFn = null;

/** @type {?function()} */
let validateFn = null;

/**
This interface is provided to add document-level <style> elements to ShadyCSS for processing.
These styles must be processed by ShadyCSS to simulate ShadowRoot upper-bound encapsulation from outside styles
In addition, these styles may also need to be processed for @apply rules and CSS Custom Properties

To add document-level styles to ShadyCSS, one can call `ShadyCSS.addDocumentStyle(styleElement)` or `ShadyCSS.addDocumentStyle({getStyle: () => styleElement})`

In addition, if the process used to discover document-level styles can be synchronously flushed, one should set `ShadyCSS.documentStyleFlush`.
This function will be called when calculating styles.

An example usage of the document-level styling api can be found in `examples/document-style-lib.js`

@unrestricted
*/
class CustomStyleInterface {
  constructor() {
    /** @type {!Array<!CustomStyleProvider>} */
    this['customStyles'] = [];
    this['enqueued'] = false;
  }
  /**
   * Queue a validation for new custom styles to batch style recalculations
   */
  enqueueDocumentValidation() {
    if (this['enqueued'] || !validateFn) {
      return;
    }
    this['enqueued'] = true;
    Object(__WEBPACK_IMPORTED_MODULE_0__document_wait_js__["a" /* default */])(validateFn);
  }
  /**
   * @param {!HTMLStyleElement} style
   */
  addCustomStyle(style) {
    if (!style[SEEN_MARKER]) {
      style[SEEN_MARKER] = true;
      this['customStyles'].push(style);
      this.enqueueDocumentValidation();
    }
  }
  /**
   * @param {!CustomStyleProvider} customStyle
   * @return {HTMLStyleElement}
   */
  getStyleForCustomStyle(customStyle) {
    if (customStyle[CACHED_STYLE]) {
      return customStyle[CACHED_STYLE];
    }
    let style;
    if (customStyle['getStyle']) {
      style = customStyle['getStyle']();
    } else {
      style = customStyle;
    }
    return style;
  }
  /**
   * @return {!Array<!CustomStyleProvider>}
   */
  processStyles() {
    const cs = this['customStyles'];
    for (let i = 0; i < cs.length; i++) {
      const customStyle = cs[i];
      if (customStyle[CACHED_STYLE]) {
        continue;
      }
      const style = this.getStyleForCustomStyle(customStyle);
      if (style) {
        // HTMLImports polyfill may have cloned the style into the main document,
        // which is referenced with __appliedElement.
        const styleToTransform = /** @type {!HTMLStyleElement} */(style['__appliedElement'] || style);
        if (transformFn) {
          transformFn(styleToTransform);
        }
        customStyle[CACHED_STYLE] = styleToTransform;
      }
    }
    return cs;
  }
}
/* unused harmony export default */


CustomStyleInterface.prototype['addCustomStyle'] = CustomStyleInterface.prototype.addCustomStyle;
CustomStyleInterface.prototype['getStyleForCustomStyle'] = CustomStyleInterface.prototype.getStyleForCustomStyle;
CustomStyleInterface.prototype['processStyles'] = CustomStyleInterface.prototype.processStyles;

Object.defineProperties(CustomStyleInterface.prototype, {
  'transformCallback': {
    /** @return {?function(!HTMLStyleElement)} */
    get() {
      return transformFn;
    },
    /** @param {?function(!HTMLStyleElement)} fn */
    set(fn) {
      transformFn = fn;
    }
  },
  'validateCallback': {
    /** @return {?function()} */
    get() {
      return validateFn;
    },
    /**
     * @param {?function()} fn
     * @this {CustomStyleInterface}
     */
    set(fn) {
      let needsEnqueue = false;
      if (!validateFn) {
        needsEnqueue = true;
      }
      validateFn = fn;
      if (needsEnqueue) {
        this.enqueueDocumentValidation();
      }
    },
  }
})

/** @typedef {{
 * customStyles: !Array<!CustomStyleProvider>,
 * addCustomStyle: function(!CustomStyleProvider),
 * getStyleForCustomStyle: function(!CustomStyleProvider): HTMLStyleElement,
 * findStyles: function(),
 * transformCallback: ?function(!HTMLStyleElement),
 * validateCallback: ?function()
 * }}
 */
let CustomStyleInterfaceInterface;


/***/ }),
/* 60 */
/***/ (function(module, exports) {

/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function(scope) {

  'use strict';

  // defaultPrevented is broken in IE.
  // https://connect.microsoft.com/IE/feedback/details/790389/event-defaultprevented-returns-false-after-preventdefault-was-called
  var workingDefaultPrevented = (function() {
    var e = document.createEvent('Event');
    e.initEvent('foo', true, true);
    e.preventDefault();
    return e.defaultPrevented;
  })();

  if (!workingDefaultPrevented) {
    var origPreventDefault = Event.prototype.preventDefault;
    Event.prototype.preventDefault = function() {
      if (!this.cancelable) {
        return;
      }

      origPreventDefault.call(this);

      Object.defineProperty(this, 'defaultPrevented', {
        get: function() {
          return true;
        },
        configurable: true
      });
    };
  }

  var isIE = /Trident/.test(navigator.userAgent);

  // CustomEvent constructor shim
  if (!window.CustomEvent || isIE && (typeof window.CustomEvent !== 'function')) {
    window.CustomEvent = function(inType, params) {
      params = params || {};
      var e = document.createEvent('CustomEvent');
      e.initCustomEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable), params.detail);
      return e;
    };
    window.CustomEvent.prototype = window.Event.prototype;
  }

  // Event constructor shim
  if (!window.Event || isIE && (typeof window.Event !== 'function')) {
    var origEvent = window.Event;
    window.Event = function(inType, params) {
      params = params || {};
      var e = document.createEvent('Event');
      e.initEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable));
      return e;
    };
    if (origEvent) {
      for (var i in origEvent) {
        window.Event[i] = origEvent[i];
      }
    }
    window.Event.prototype = origEvent.prototype;
  }

  if (!window.MouseEvent || isIE && (typeof window.MouseEvent !== 'function')) {
    var origMouseEvent = window.MouseEvent;
    window.MouseEvent = function(inType, params) {
      params = params || {};
      var e = document.createEvent('MouseEvent');
      e.initMouseEvent(inType,
        Boolean(params.bubbles), Boolean(params.cancelable),
        params.view || window, params.detail,
        params.screenX, params.screenY, params.clientX, params.clientY,
        params.ctrlKey, params.altKey, params.shiftKey, params.metaKey,
        params.button, params.relatedTarget);
      return e;
    };
    if (origMouseEvent) {
      for (var i in origMouseEvent) {
        window.MouseEvent[i] = origMouseEvent[i];
      }
    }
    window.MouseEvent.prototype = origMouseEvent.prototype;
  }

  // ES6 stuff
  if (!Array.from) {
    Array.from = function (object) {
      return [].slice.call(object);
    };
  }

  if (!Object.assign) {
    var assign = function(target, source) {
      var n$ = Object.getOwnPropertyNames(source);
      for (var i=0, p; i < n$.length; i++) {
        p = n$[i];
        target[p] = source[p];
      }
    }

    Object.assign = function(target, sources) {
      var args = [].slice.call(arguments, 1);
      for (var i=0, s; i < args.length; i++) {
        s = args[i];
        if (s) {
          assign(target, s);
        }
      }
      return target;
    }
  }

})(window.WebComponents);


/***/ }),
/* 61 */
/***/ (function(module, exports) {

/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// minimal template polyfill
(function() {

  var needsTemplate = (typeof HTMLTemplateElement === 'undefined');

  // NOTE: Patch document.importNode to work around IE11 bug that
  // casues children of a document fragment imported while
  // there is a mutation observer to not have a parentNode (!?!)
  // It's important that this is the first patch to `importNode` so that
  // dom produced for later patches is correct.
  if (/Trident/.test(navigator.userAgent)) {
    (function() {
      var Native_importNode = Document.prototype.importNode;
      Document.prototype.importNode = function() {
        var n = Native_importNode.apply(this, arguments);
        // Copy all children to a new document fragment since
        // this one may be broken
        if (n.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          var f = this.createDocumentFragment();
          f.appendChild(n);
          return f;
        } else {
          return n;
        }
      };
    })();
  }

  // NOTE: we rely on this cloneNode not causing element upgrade.
  // This means this polyfill must load before the CE polyfill and
  // this would need to be re-worked if a browser supports native CE
  // but not <template>.
  var Native_cloneNode = Node.prototype.cloneNode;
  var Native_createElement = Document.prototype.createElement;
  var Native_importNode = Document.prototype.importNode;

  // returns true if nested templates cannot be cloned (they cannot be on
  // some impl's like Safari 8 and Edge)
  // OR if cloning a document fragment does not result in a document fragment
  var needsCloning = (function() {
    if (!needsTemplate) {
      var t = document.createElement('template');
      var t2 = document.createElement('template');
      t2.content.appendChild(document.createElement('div'));
      t.content.appendChild(t2);
      var clone = t.cloneNode(true);
      return (clone.content.childNodes.length === 0 || clone.content.firstChild.content.childNodes.length === 0
        || !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment));
    }
  })();

  var TEMPLATE_TAG = 'template';
  var PolyfilledHTMLTemplateElement = function() {};

  if (needsTemplate) {

    var contentDoc = document.implementation.createHTMLDocument('template');
    var canDecorate = true;

    var templateStyle = document.createElement('style');
    templateStyle.textContent = TEMPLATE_TAG + '{display:none;}';

    var head = document.head;
    head.insertBefore(templateStyle, head.firstElementChild);

    /**
      Provides a minimal shim for the <template> element.
    */
    PolyfilledHTMLTemplateElement.prototype = Object.create(HTMLElement.prototype);


    // if elements do not have `innerHTML` on instances, then
    // templates can be patched by swizzling their prototypes.
    var canProtoPatch =
      !(document.createElement('div').hasOwnProperty('innerHTML'));

    /**
      The `decorate` method moves element children to the template's `content`.
      NOTE: there is no support for dynamically adding elements to templates.
    */
    PolyfilledHTMLTemplateElement.decorate = function(template) {
      // if the template is decorated, return fast
      if (template.content) {
        return;
      }
      template.content = contentDoc.createDocumentFragment();
      var child;
      while (child = template.firstChild) {
        template.content.appendChild(child);
      }
      // NOTE: prefer prototype patching for performance and
      // because on some browsers (IE11), re-defining `innerHTML`
      // can result in intermittent errors.
      if (canProtoPatch) {
        template.__proto__ = PolyfilledHTMLTemplateElement.prototype;
      } else {
        template.cloneNode = function(deep) {
          return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
        };
        // add innerHTML to template, if possible
        // Note: this throws on Safari 7
        if (canDecorate) {
          try {
            defineInnerHTML(template);
          } catch (err) {
            canDecorate = false;
          }
        }
      }
      // bootstrap recursively
      PolyfilledHTMLTemplateElement.bootstrap(template.content);
    };

    function defineInnerHTML(obj) {
      Object.defineProperty(obj, 'innerHTML', {
        get: function() {
          var o = '';
          for (var e = this.content.firstChild; e; e = e.nextSibling) {
            o += e.outerHTML || escapeData(e.data);
          }
          return o;
        },
        set: function(text) {
          contentDoc.body.innerHTML = text;
          PolyfilledHTMLTemplateElement.bootstrap(contentDoc);
          while (this.content.firstChild) {
            this.content.removeChild(this.content.firstChild);
          }
          while (contentDoc.body.firstChild) {
            this.content.appendChild(contentDoc.body.firstChild);
          }
        },
        configurable: true
      });
    }

    defineInnerHTML(PolyfilledHTMLTemplateElement.prototype);

    /**
      The `bootstrap` method is called automatically and "fixes" all
      <template> elements in the document referenced by the `doc` argument.
    */
    PolyfilledHTMLTemplateElement.bootstrap = function(doc) {
      var templates = doc.querySelectorAll(TEMPLATE_TAG);
      for (var i=0, l=templates.length, t; (i<l) && (t=templates[i]); i++) {
        PolyfilledHTMLTemplateElement.decorate(t);
      }
    };

    // auto-bootstrapping for main document
    document.addEventListener('DOMContentLoaded', function() {
      PolyfilledHTMLTemplateElement.bootstrap(document);
    });

    // Patch document.createElement to ensure newly created templates have content
    Document.prototype.createElement = function() {
      'use strict';
      var el = Native_createElement.apply(this, arguments);
      if (el.localName === 'template') {
        PolyfilledHTMLTemplateElement.decorate(el);
      }
      return el;
    };

    var escapeDataRegExp = /[&\u00A0<>]/g;

    function escapeReplace(c) {
      switch (c) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '\u00A0':
          return '&nbsp;';
      }
    }

    function escapeData(s) {
      return s.replace(escapeDataRegExp, escapeReplace);
    }
  }

  // make cloning/importing work!
  if (needsTemplate || needsCloning) {

    PolyfilledHTMLTemplateElement._cloneNode = function(template, deep) {
      var clone = Native_cloneNode.call(template, false);
      // NOTE: decorate doesn't auto-fix children because they are already
      // decorated so they need special clone fixup.
      if (this.decorate) {
        this.decorate(clone);
      }
      if (deep) {
        // NOTE: use native clone node to make sure CE's wrapped
        // cloneNode does not cause elements to upgrade.
        clone.content.appendChild(
            Native_cloneNode.call(template.content, true));
        // now ensure nested templates are cloned correctly.
        this.fixClonedDom(clone.content, template.content);
      }
      return clone;
    };

    PolyfilledHTMLTemplateElement.prototype.cloneNode = function(deep) {
      return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
    }

    // Given a source and cloned subtree, find <template>'s in the cloned
    // subtree and replace them with cloned <template>'s from source.
    // We must do this because only the source templates have proper .content.
    PolyfilledHTMLTemplateElement.fixClonedDom = function(clone, source) {
      // do nothing if cloned node is not an element
      if (!source.querySelectorAll) return;
      // these two lists should be coincident
      var s$ = source.querySelectorAll(TEMPLATE_TAG);
      var t$ = clone.querySelectorAll(TEMPLATE_TAG);
      for (var i=0, l=t$.length, t, s; i<l; i++) {
        s = s$[i];
        t = t$[i];
        if (this.decorate) {
          this.decorate(s);
        }
        t.parentNode.replaceChild(s.cloneNode(true), t);
      }
    };

    // override all cloning to fix the cloned subtree to contain properly
    // cloned templates.
    Node.prototype.cloneNode = function(deep) {
      var dom;
      // workaround for Edge bug cloning documentFragments
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8619646/
      if (this instanceof DocumentFragment) {
        if (!deep) {
          return this.ownerDocument.createDocumentFragment();
        } else {
          dom = this.ownerDocument.importNode(this, true);
        }
      } else {
        dom = Native_cloneNode.call(this, deep);
      }
      // template.content is cloned iff `deep`.
      if (deep) {
        PolyfilledHTMLTemplateElement.fixClonedDom(dom, this);
      }
      return dom;
    };

    // NOTE: we are cloning instead of importing <template>'s.
    // However, the ownerDocument of the cloned template will be correct!
    // This is because the native import node creates the right document owned
    // subtree and `fixClonedDom` inserts cloned templates into this subtree,
    // thus updating the owner doc.
    Document.prototype.importNode = function(element, deep) {
      if (element.localName === TEMPLATE_TAG) {
        return PolyfilledHTMLTemplateElement._cloneNode(element, deep);
      } else {
        var dom = Native_importNode.call(this, element, deep);
        if (deep) {
          PolyfilledHTMLTemplateElement.fixClonedDom(dom, element);
        }
        return dom;
      }
    };

    if (needsCloning) {
      window.HTMLTemplateElement.prototype.cloneNode = function(deep) {
        return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
      };
    }
  }

  if (needsTemplate) {
    window.HTMLTemplateElement = PolyfilledHTMLTemplateElement;
  }

})();


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__es6_promise__ = __webpack_require__(63);

__WEBPACK_IMPORTED_MODULE_0__es6_promise__["a" /* default */].polyfill();
/* unused harmony default export */ var _unused_webpack_default_export = (__WEBPACK_IMPORTED_MODULE_0__es6_promise__["a" /* default */]);


/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__es6_promise_promise__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__es6_promise_polyfill__ = __webpack_require__(70);



// Strange compat..
__WEBPACK_IMPORTED_MODULE_0__es6_promise_promise__["a" /* default */].polyfill = __WEBPACK_IMPORTED_MODULE_1__es6_promise_polyfill__["a" /* default */];
__WEBPACK_IMPORTED_MODULE_0__es6_promise_promise__["a" /* default */].Promise = __WEBPACK_IMPORTED_MODULE_0__es6_promise_promise__["a" /* default */];
/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__es6_promise_promise__["a" /* default */]);


/***/ }),
/* 64 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 65 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = all;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__enumerator__ = __webpack_require__(67);


/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new __WEBPACK_IMPORTED_MODULE_0__enumerator__["a" /* default */](this, entries).promise;
}


/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__internal__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__then__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__promise__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__promise_resolve__ = __webpack_require__(19);










/* harmony default export */ __webpack_exports__["a"] = (Enumerator);
function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(__WEBPACK_IMPORTED_MODULE_1__internal__["l" /* noop */]);

  if (!this.promise[__WEBPACK_IMPORTED_MODULE_1__internal__["c" /* PROMISE_ID */]]) {
    Object(__WEBPACK_IMPORTED_MODULE_1__internal__["j" /* makePromise */])(this.promise);
  }

  if (Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* isArray */])(input)) {
    this.length     = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      Object(__WEBPACK_IMPORTED_MODULE_1__internal__["e" /* fulfill */])(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate(input);
      if (this._remaining === 0) {
        Object(__WEBPACK_IMPORTED_MODULE_1__internal__["e" /* fulfill */])(this.promise, this._result);
      }
    }
  } else {
    Object(__WEBPACK_IMPORTED_MODULE_1__internal__["m" /* reject */])(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function(input) {
  for (let i = 0; this._state === __WEBPACK_IMPORTED_MODULE_1__internal__["b" /* PENDING */] && i < input.length; i++) {
    this._eachEntry(input[i], i);
  }
};

Enumerator.prototype._eachEntry = function(entry, i) {
  let c = this._instanceConstructor;
  let { resolve } = c;

  if (resolve === __WEBPACK_IMPORTED_MODULE_4__promise_resolve__["a" /* default */]) {
    let then = Object(__WEBPACK_IMPORTED_MODULE_1__internal__["f" /* getThen */])(entry);

    if (then === __WEBPACK_IMPORTED_MODULE_2__then__["a" /* default */] &&
        entry._state !== __WEBPACK_IMPORTED_MODULE_1__internal__["b" /* PENDING */]) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === __WEBPACK_IMPORTED_MODULE_3__promise__["a" /* default */]) {
      let promise = new c(__WEBPACK_IMPORTED_MODULE_1__internal__["l" /* noop */]);
      Object(__WEBPACK_IMPORTED_MODULE_1__internal__["g" /* handleMaybeThenable */])(promise, entry, then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(resolve => resolve(entry)), i);
    }
  } else {
    this._willSettleAt(resolve(entry), i);
  }
};

Enumerator.prototype._settledAt = function(state, i, value) {
  let { promise } = this;

  if (promise._state === __WEBPACK_IMPORTED_MODULE_1__internal__["b" /* PENDING */]) {
    this._remaining--;

    if (state === __WEBPACK_IMPORTED_MODULE_1__internal__["d" /* REJECTED */]) {
      Object(__WEBPACK_IMPORTED_MODULE_1__internal__["m" /* reject */])(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    Object(__WEBPACK_IMPORTED_MODULE_1__internal__["e" /* fulfill */])(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function(promise, i) {
  let enumerator = this;

  Object(__WEBPACK_IMPORTED_MODULE_1__internal__["o" /* subscribe */])(promise, undefined, value => enumerator._settledAt(__WEBPACK_IMPORTED_MODULE_1__internal__["a" /* FULFILLED */], i, value),
                               reason => enumerator._settledAt(__WEBPACK_IMPORTED_MODULE_1__internal__["d" /* REJECTED */], i, reason));
};


/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = race;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(10);


/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  let Constructor = this;

  if (!Object(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* isArray */])(entries)) {
    return new Constructor((_, reject) => reject(new TypeError('You must pass an array to race.')));
  } else {
    return new Constructor((resolve, reject) => {
      let length = entries.length;
      for (let i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}


/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = reject;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__internal__ = __webpack_require__(5);


/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  let Constructor = this;
  let promise = new Constructor(__WEBPACK_IMPORTED_MODULE_0__internal__["l" /* noop */]);
  Object(__WEBPACK_IMPORTED_MODULE_0__internal__["m" /* reject */])(promise, reason);
  return promise;
}


/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (immutable) */ __webpack_exports__["a"] = polyfill;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__promise__ = __webpack_require__(17);
/*global self*/


function polyfill() {
  let local;

  if (typeof global !== 'undefined') {
      local = global;
  } else if (typeof self !== 'undefined') {
      local = self;
  } else {
      try {
          local = Function('return this')();
      } catch (e) {
          throw new Error('polyfill failed because global object is unavailable in this environment');
      }
  }

  let P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
        promiseToString = Object.prototype.toString.call(P.resolve());
    } catch(e) {
        // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast){
        return;
    }
  }

  local.Promise = __WEBPACK_IMPORTED_MODULE_0__promise__["a" /* default */];
}

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(71)))

/***/ }),
/* 71 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 72 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ })
/******/ ]);
});