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
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * 2.3
 * http://w3c.github.io/webcomponents/spec/custom/#dfn-element-definition
 * @typedef {{
 *  name: string,
 *  localName: string,
 *  constructor: function(new:HTMLElement),
 *  connectedCallback: (Function|undefined),
 *  disconnectedCallback: (Function|undefined),
 *  attributeChangedCallback: (Function|undefined),
 *  observedAttributes: Array<string>,
 * }}
 */
var CustomElementDefinition = void 0;

/**
 * @typedef {{
 *  resolve: !function(undefined),
 *  promise: !Promise<undefined>,
 * }}
 */
var Deferred = void 0;

(function () {
  'use strict';

  /**
   * Gets 'customElement' from window so that it could be modified after
   * the polyfill loads.
   * @function
   * @return {CustomElementRegistry}
   */

  var _customElements = function _customElements() {
    return window['customElements'];
  };

  var _observerProp = '__$CE_observer';
  var _attachedProp = '__$CE_attached';
  var _upgradedProp = '__$CE_upgraded';

  if (_customElements()) {
    _customElements().flush = function () {};
    if (!_customElements().forcePolyfill) {
      return;
    }
  }

  // name validation
  // https://html.spec.whatwg.org/multipage/scripting.html#valid-custom-element-name

  /**
   * @const
   * @type {Array<string>}
   */
  var reservedTagList = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];

  /**
   * @param {!string} name
   * @return {!Error|undefined}
   */
  function checkValidCustomElementName(name) {
    if (!(/^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(name) && reservedTagList.indexOf(name) === -1)) {
      return new Error('The element name \'' + name + '\' is not valid.');
    }
  }

  /**
   * @param {!Node} root
   * @return {TreeWalker}
   */
  function createTreeWalker(root) {
    // IE 11 requires the third and fourth arguments be present. If the third
    // arg is null, it applies the default behaviour. However IE also requires
    // the fourth argument be present even though the other browsers ignore it.
    return document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
  }

  /**
   * @param {!Node} node
   * @return {boolean}
   */
  function isElement(node) {
    return node.nodeType === Node.ELEMENT_NODE;
  }

  /**
   * @param {!Element} element
   * @return {boolean}
   */
  function isHtmlImport(element) {
    return element.tagName === 'LINK' && element.rel && element.rel.toLowerCase().split(' ').indexOf('import') !== -1;
  }

  /**
   * @param {!Element} element
   * @return {boolean}
   */
  function isConnected(element) {
    var n = element;
    do {
      if (n[_attachedProp] || n.nodeType === Node.DOCUMENT_NODE) return true;
      n = n.parentNode || n.nodeType === Node.DOCUMENT_FRAGMENT_NODE && n.host;
    } while (n);
    return false;
  }

  /**
   * A registry of custom element definitions.
   *
   * See https://html.spec.whatwg.org/multipage/scripting.html#customelementsregistry
   *
   * @property {boolean} enableFlush Set to true to enable the flush() method
   *   to work. This should only be done for tests, as it causes a memory leak.
   */

  var CustomElementRegistry = function () {
    function CustomElementRegistry() {
      _classCallCheck(this, CustomElementRegistry);

      /** @private {!Map<string, !CustomElementDefinition>} **/
      this._definitions = new Map();

      /** @private {!Map<Function, string>} **/
      this._constructors = new Map();

      /** @private {!Map<string, !Deferred>} **/
      this._whenDefinedMap = new Map();

      /** @private {!Set<!MutationObserver>} **/
      this._observers = new Set();

      /** @private {!MutationObserver} **/
      this._attributeObserver = new MutationObserver(
      /** @type {function(Array<MutationRecord>, MutationObserver)} */
      this._handleAttributeChange.bind(this));

      /** @private {?HTMLElement} **/
      this._newInstance = null;

      /** @private {!Set<string>} **/
      this._pendingHtmlImportUrls = new Set();

      /** @type {boolean} **/
      this.enableFlush = true;

      /** @private {boolean} **/
      this._upgradeScheduled = false;

      /** @type {MutationObserver} **/
      this._mainDocumentObserver = null;
    }

    // HTML spec part 4.13.4
    // https://html.spec.whatwg.org/multipage/scripting.html#dom-customelementsregistry-define
    /**
     * @param {string} name
     * @param {function(new:HTMLElement)} constructor
     * @param {{extends: string}} options
     * @return {undefined}
     */


    _createClass(CustomElementRegistry, [{
      key: 'define',
      value: function define(name, constructor, options) {
        // 1:
        if (typeof constructor !== 'function') {
          throw new TypeError('constructor must be a Constructor');
        }

        // 2. If constructor is an interface object whose corresponding interface
        //    either is HTMLElement or has HTMLElement in its set of inherited
        //    interfaces, throw a TypeError and abort these steps.
        //
        // It doesn't appear possible to check this condition from script

        // 3:
        var nameError = checkValidCustomElementName(name);
        if (nameError) throw nameError;

        // 4, 5:
        // Note: we don't track being-defined names and constructors because
        // define() isn't normally reentrant. The only time user code can run
        // during define() is when getting callbacks off the prototype, which
        // would be highly-unusual. We can make define() reentrant-safe if needed.
        if (this._definitions.has(name)) {
          throw new Error('An element with name \'' + name + '\' is already defined');
        }

        // 6, 7:
        if (this._constructors.has(constructor)) {
          throw new Error('Definition failed for \'' + name + '\': ' + 'The constructor is already used.');
        }

        // 8:
        /** @type {string} */
        var localName = name;

        // 9, 10: We do not support extends currently.

        // 11, 12, 13: Our define() isn't rentrant-safe

        // 14.1:
        /** @type {Object} */
        var prototype = constructor.prototype;

        // 14.2:
        if ((typeof prototype === 'undefined' ? 'undefined' : _typeof(prototype)) !== 'object') {
          throw new TypeError('Definition failed for \'' + name + '\': ' + 'constructor.prototype must be an object');
        }

        /**
         * @param {string} callbackName
         * @return {Function|undefined}
         */
        function getCallback(callbackName) {
          var callback = prototype[callbackName];
          if (callback !== undefined && typeof callback !== 'function') {
            throw new Error(localName + ' \'' + callbackName + '\' is not a Function');
          }
          return callback;
        }

        // 3, 4:
        var connectedCallback = getCallback('connectedCallback');

        // 5, 6:
        var disconnectedCallback = getCallback('disconnectedCallback');

        // Divergence from spec: we always throw if attributeChangedCallback is
        // not a function.

        // 7, 9.1:
        var attributeChangedCallback = getCallback('attributeChangedCallback');

        // 8, 9.2, 9.3:
        var observedAttributes = attributeChangedCallback && constructor['observedAttributes'] || [];

        // 15:
        /** @type {CustomElementDefinition} */
        var definition = {
          name: name,
          localName: localName,
          constructor: constructor,
          connectedCallback: connectedCallback,
          disconnectedCallback: disconnectedCallback,
          attributeChangedCallback: attributeChangedCallback,
          observedAttributes: observedAttributes
        };

        // 16:
        this._definitions.set(localName, definition);
        this._constructors.set(constructor, localName);

        // 17, 18, 19:
        this._upgradeDoc();

        // 20:
        /** @type {Deferred} **/
        var deferred = this._whenDefinedMap.get(localName);
        if (deferred) {
          deferred.resolve(undefined);
          this._whenDefinedMap.delete(localName);
        }
      }

      /**
       * Returns the constructor defined for `name`, or `null`.
       *
       * @param {string} name
       * @return {Function|undefined}
       */

    }, {
      key: 'get',
      value: function get(name) {
        // https://html.spec.whatwg.org/multipage/scripting.html#custom-elements-api
        var def = this._definitions.get(name);
        return def ? def.constructor : undefined;
      }

      /**
       * Returns a `Promise` that resolves when a custom element for `name` has
       * been defined.
       *
       * @param {string} name
       * @return {!Promise}
       */

    }, {
      key: 'whenDefined',
      value: function whenDefined(name) {
        // https://html.spec.whatwg.org/multipage/scripting.html#dom-customelementsregistry-whendefined
        var nameError = checkValidCustomElementName(name);
        if (nameError) return Promise.reject(nameError);
        if (this._definitions.has(name)) return Promise.resolve();

        /** @type {Deferred} **/
        var deferred = this._whenDefinedMap.get(name);
        if (deferred) return deferred.promise;

        var resolve = void 0;
        var promise = new Promise(function (_resolve, _) {
          resolve = _resolve;
        });
        deferred = { promise: promise, resolve: resolve };
        this._whenDefinedMap.set(name, deferred);
        return promise;
      }

      /**
       * Causes all pending mutation records to be processed, and thus all
       * customization, upgrades and custom element reactions to be called.
       * `enableFlush` must be true for this to work. Only use during tests!
       */

    }, {
      key: 'flush',
      value: function flush() {
        if (this.enableFlush) {
          // console.warn("flush!!!");
          this._handleMutations(this._mainDocumentObserver.takeRecords());
          this._handleAttributeChange(this._attributeObserver.takeRecords());
          this._observers.forEach(
          /**
           * @param {!MutationObserver} observer
           * @this {CustomElementRegistry}
           */
          function (observer) {
            this._handleMutations(observer.takeRecords());
          }, this);
        }
      }

      /**
       * Upgrade all existing in document elements. This process is expensive so
       * is optionally batched based on the state of HTMLImports. (Note,
       * this batching might not be necessary if instead of walking the dom,
       * a map of upgrade candidates was maintained.)
       * @private
       */

    }, {
      key: '_upgradeDoc',
      value: function _upgradeDoc() {
        var _this2 = this;

        if (!this._upgradeScheduled) {
          this._upgradeScheduled = true;
          var onReady = function onReady() {
            _this2._upgradeScheduled = false;
            if (!_this2._mainDocumentObserver) {
              _this2._mainDocumentObserver = _this2._observeRoot(document);
            }
            _this2._addNodes(document.childNodes);
          };
          if (window['HTMLImports']) {
            window['HTMLImports']['whenReady'](onReady);
          } else {
            onReady();
          }
        }
      }

      /**
       * @param {?HTMLElement} instance
       * @private
       */

    }, {
      key: '_setNewInstance',
      value: function _setNewInstance(instance) {
        this._newInstance = instance;
      }

      /**
       * Observes a DOM root for mutations that trigger upgrades and reactions.
       * @param {Node} root
       * @private
       */

    }, {
      key: '_observeRoot',
      value: function _observeRoot(root) {
        //console.log('_observeRoot', root, root.baseURI);
        // console.assert(!root[_observerProp]);
        if (root[_observerProp] != null) {
          //console.warn(`Root ${root} is already observed`);
          return root[_observerProp];
        }
        root[_observerProp] = new MutationObserver(
        /** @type {function(Array<MutationRecord>, MutationObserver)} */
        this._handleMutations.bind(this));
        root[_observerProp].observe(root, { childList: true, subtree: true });
        if (this.enableFlush) {
          // this is memory leak, only use in tests
          this._observers.add(root[_observerProp]);
        }
        return root[_observerProp];
      }

      /**
       * @param {Node} root
       * @private
       */

    }, {
      key: '_unobserveRoot',
      value: function _unobserveRoot(root) {
        if (root[_observerProp] != null) {
          root[_observerProp].disconnect();
          if (this.enableFlush) {
            this._observers.delete(root[_observerProp]);
          }
          root[_observerProp] = null;
        }
      }

      /**
       * @param {!Array<!MutationRecord>} mutations
       * @private
       */

    }, {
      key: '_handleMutations',
      value: function _handleMutations(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          /** @type {!MutationRecord} */
          var mutation = mutations[i];
          if (mutation.type === 'childList') {
            // Note: we can't get an ordering between additions and removals, and
            // so might diverge from spec reaction ordering
            var addedNodes = /** @type {!NodeList<!Node>} */mutation.addedNodes;
            var removedNodes = /** @type {!NodeList<!Node>} */mutation.removedNodes;
            this._addNodes(addedNodes);
            this._removeNodes(removedNodes);
          }
        }
      }

      /**
       * @param {!(NodeList<!Node>|Array<!Node>)} nodeList
       * @param {?Set<Node>=} visitedNodes
       * @private
       */

    }, {
      key: '_addNodes',
      value: function _addNodes(nodeList, visitedNodes) {
        visitedNodes = visitedNodes || new Set();

        for (var i = 0; i < nodeList.length; i++) {
          var root = nodeList[i];

          if (!isElement(root)) {
            continue;
          }

          // Since we're adding this node to an observed tree, we can unobserve
          this._unobserveRoot(root);

          var walker = createTreeWalker(root);
          do {
            var node = /** @type {!HTMLElement} */walker.currentNode;
            this._addElement(node, visitedNodes);
          } while (walker.nextNode());
        }
      }

      /**
       * @param {!HTMLElement} element
       * @param {!Set<Node>=} visitedNodes
       */

    }, {
      key: '_addElement',
      value: function _addElement(element, visitedNodes) {
        if (visitedNodes.has(element)) return;
        visitedNodes.add(element);

        /** @type {?CustomElementDefinition} */
        var definition = this._definitions.get(element.localName);
        if (definition) {
          if (!element[_upgradedProp]) {
            this._upgradeElement(element, definition, true);
          }
          if (element[_upgradedProp] && !element[_attachedProp] && isConnected(element)) {
            element[_attachedProp] = true;
            if (definition.connectedCallback) {
              definition.connectedCallback.call(element);
            }
          }
        }
        if (element.shadowRoot) {
          // TODO(justinfagnani): do we need to check that the shadowRoot
          // is observed?
          this._addNodes(element.shadowRoot.childNodes, visitedNodes);
        }
        if (isHtmlImport(element)) {
          this._addImport( /** @type {!HTMLLinkElement} */element, visitedNodes);
        }
      }

      /**
       * @param {!HTMLLinkElement} link
       * @param {!Set<Node>=} visitedNodes
       */

    }, {
      key: '_addImport',
      value: function _addImport(link, visitedNodes) {
        var _this3 = this;

        // During a tree walk to add or upgrade nodes, we may encounter multiple
        // HTML imports that reference the same document, and may encounter
        // imports in various states of loading.

        // First, we only want to process the first import for a document in a
        // walk, so we check visitedNodes for the document, not the link.
        //
        // Second, for documents that haven't loaded yet, we only want to add one
        // listener, regardless of the number of links or walks, so we track
        // pending loads in _pendingHtmlImportUrls.

        // Check to see if the import is loaded
        /** @type {?Document} */
        var _import = link.import;
        if (_import) {
          // The import is loaded, but only process the first link element
          if (visitedNodes.has(_import)) return;
          visitedNodes.add(_import);

          // The import is loaded observe it
          if (!_import[_observerProp]) this._observeRoot(_import);

          // walk the document
          this._addNodes(_import.childNodes, visitedNodes);
        } else {
          var _ret = function () {
            // The import is not loaded, so wait for it
            /** @type {string} */
            var importUrl = link.href;
            if (_this3._pendingHtmlImportUrls.has(importUrl)) return {
                v: void 0
              };
            _this3._pendingHtmlImportUrls.add(importUrl);

            /**
             * @const
             * @type {CustomElementRegistry}
             */
            var _this = _this3;
            var onLoad = function onLoad() {
              link.removeEventListener('load', /** @type {function(Event)} */onLoad);
              if (!link.import[_observerProp]) _this._observeRoot(link.import);
              // We don't pass visitedNodes because this is async and not part of
              // the current tree walk.
              _this._addNodes(link.import.childNodes);
            };
            link.addEventListener('load', onLoad);
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
      }

      /**
       * @param {NodeList} nodeList
       * @private
       */

    }, {
      key: '_removeNodes',
      value: function _removeNodes(nodeList) {
        for (var i = 0; i < nodeList.length; i++) {
          var root = nodeList[i];

          if (!isElement(root)) {
            continue;
          }

          // Since we're detatching this element from an observed root, we need to
          // reobserve it.
          // TODO(justinfagnani): can we do this in a microtask so we don't thrash
          // on creating and destroying MutationObservers on batch DOM mutations?
          this._observeRoot(root);

          var walker = createTreeWalker(root);
          do {
            var node = walker.currentNode;
            if (node[_upgradedProp] && node[_attachedProp]) {
              node[_attachedProp] = false;
              var definition = this._definitions.get(node.localName);
              if (definition && definition.disconnectedCallback) {
                definition.disconnectedCallback.call(node);
              }
            }
          } while (walker.nextNode());
        }
      }

      /**
       * Upgrades or customizes a custom element.
       *
       * @param {HTMLElement} element
       * @param {CustomElementDefinition} definition
       * @param {boolean} callConstructor
       * @private
       */

    }, {
      key: '_upgradeElement',
      value: function _upgradeElement(element, definition, callConstructor) {
        var prototype = definition.constructor.prototype;
        element.__proto__ = prototype;
        if (callConstructor) {
          this._setNewInstance(element);
          new definition.constructor();
          element[_upgradedProp] = true;
          console.assert(this._newInstance == null);
        }

        var observedAttributes = definition.observedAttributes;
        var attributeChangedCallback = definition.attributeChangedCallback;
        if (attributeChangedCallback && observedAttributes.length > 0) {
          this._attributeObserver.observe(element, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: observedAttributes
          });

          // Trigger attributeChangedCallback for existing attributes.
          // https://html.spec.whatwg.org/multipage/scripting.html#upgrades
          for (var i = 0; i < observedAttributes.length; i++) {
            var name = observedAttributes[i];
            if (element.hasAttribute(name)) {
              var value = element.getAttribute(name);
              attributeChangedCallback.call(element, name, null, value, null);
            }
          }
        }
      }

      /**
       * @param {!Array<!MutationRecord>} mutations
       * @private
       */

    }, {
      key: '_handleAttributeChange',
      value: function _handleAttributeChange(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var mutation = mutations[i];
          if (mutation.type === 'attributes') {
            var target = /** @type {HTMLElement} */mutation.target;
            // We should be gaurenteed to have a definition because this mutation
            // observer is only observing custom elements observedAttributes
            var definition = this._definitions.get(target.localName);
            var name = /** @type {!string} */mutation.attributeName;
            var oldValue = mutation.oldValue;
            var newValue = target.getAttribute(name);
            // Skip changes that were handled synchronously by setAttribute
            if (newValue !== oldValue) {
              var namespace = mutation.attributeNamespace;
              definition.attributeChangedCallback.call(target, name, oldValue, newValue, namespace);
            }
          }
        }
      }
    }]);

    return CustomElementRegistry;
  }();

  // Closure Compiler Exports


  window['CustomElementRegistry'] = CustomElementRegistry;
  CustomElementRegistry.prototype['define'] = CustomElementRegistry.prototype.define;
  CustomElementRegistry.prototype['get'] = CustomElementRegistry.prototype.get;
  CustomElementRegistry.prototype['whenDefined'] = CustomElementRegistry.prototype.whenDefined;
  CustomElementRegistry.prototype['flush'] = CustomElementRegistry.prototype.flush;
  CustomElementRegistry.prototype['polyfilled'] = true;
  // TODO(justinfagnani): remove these in production code
  CustomElementRegistry.prototype['_observeRoot'] = CustomElementRegistry.prototype._observeRoot;
  CustomElementRegistry.prototype['_addImport'] = CustomElementRegistry.prototype._addImport;

  // patch window.HTMLElement

  /** @const */
  var origHTMLElement = window.HTMLElement;
  CustomElementRegistry.prototype['nativeHTMLElement'] = origHTMLElement;
  /**
   * @type {function(new: HTMLElement)}
   */
  var newHTMLElement = function HTMLElement() {
    var customElements = _customElements();

    // If there's an being upgraded, return that
    if (customElements._newInstance) {
      var i = customElements._newInstance;
      customElements._newInstance = null;
      return i;
    }
    if (this.constructor) {
      // Find the tagname of the constructor and create a new element with it
      var tagName = customElements._constructors.get(this.constructor);
      return _createElement(document, tagName, undefined, false);
    }
    throw new Error('Unknown constructor. Did you call customElements.define()?');
  };
  window.HTMLElement = newHTMLElement;
  // By setting the patched HTMLElement's prototype property to the native
  // HTMLElement's prototype we make sure that:
  //     document.createElement('a') instanceof HTMLElement
  // works because instanceof uses HTMLElement.prototype, which is on the
  // ptototype chain of built-in elements.
  window.HTMLElement.prototype = origHTMLElement.prototype;

  // patch doc.createElement
  // TODO(justinfagnani): why is the cast neccessary?
  // Can we fix the Closure DOM externs?
  var _nativeCreateElement =
  /** @type {function(this:Document, string, (Object|undefined)=): !HTMLElement}}*/
  document.createElement;

  /**
   * Creates a new element and upgrades it if it's a custom element.
   * @param {!Document} doc
   * @param {!string} tagName
   * @param {Object|undefined} options
   * @param {boolean} callConstructor whether or not to call the elements
   *   constructor after upgrading. If an element is created by calling its
   *   constructor, then `callConstructor` should be false to prevent double
   *   initialization.
   */
  function _createElement(doc, tagName, options, callConstructor) {
    var customElements = _customElements();
    var element = options ? _nativeCreateElement.call(doc, tagName, options) : _nativeCreateElement.call(doc, tagName);
    var definition = customElements._definitions.get(tagName.toLowerCase());
    if (definition) {
      customElements._upgradeElement(element, definition, callConstructor);
    }
    customElements._observeRoot(element);
    return element;
  };
  document.createElement = function (tagName, options) {
    return _createElement(document, tagName, options, true);
  };

  // patch document.createElementNS

  var HTMLNS = 'http://www.w3.org/1999/xhtml';

  /** @type {function(this:Document,string,string):Element} */
  var _nativeCreateElementNS = document.createElementNS;
  document.createElementNS =
  /** @type {function(this:Document,(string|null),string):!Element} */
  function (namespaceURI, qualifiedName) {
    if (namespaceURI === HTMLNS) {
      return document.createElement(qualifiedName);
    } else {
      return _nativeCreateElementNS.call(document, namespaceURI, qualifiedName);
    }
  };

  // patch Element.attachShadow

  /** @type {function({closed: boolean})} */
  var _nativeAttachShadow = Element.prototype['attachShadow'];
  if (_nativeAttachShadow) {
    Object.defineProperty(Element.prototype, 'attachShadow', {
      value: function value(options) {
        /** @type {!Node} */
        var root = _nativeAttachShadow.call(this, options);
        /** @type {CustomElementRegistry} */
        var customElements = _customElements();
        customElements._observeRoot(root);
        return root;
      }
    });
  }

  // patch document.importNode

  var _nativeImportNode = document.importNode;
  document.importNode = function (node, deep) {
    var clone = /** @type{!Node} */_nativeImportNode.call(document, node, deep);
    var customElements = _customElements();
    var nodes = isElement(clone) ? [clone] : clone.childNodes;
    /** @type {CustomElementRegistry} */_customElements()._addNodes(nodes);
    return clone;
  };

  // patch Element.setAttribute & removeAttribute

  var _nativeSetAttribute = Element.prototype.setAttribute;
  Element.prototype['setAttribute'] = function (name, value) {
    changeAttribute(this, name, value, _nativeSetAttribute);
  };
  var _nativeRemoveAttribute = Element.prototype.removeAttribute;
  Element.prototype['removeAttribute'] = function (name) {
    changeAttribute(this, name, null, _nativeRemoveAttribute);
  };

  function changeAttribute(element, name, value, operation) {
    name = name.toLowerCase();
    var oldValue = element.getAttribute(name);
    operation.call(element, name, value);

    // Bail if this wasn't a fully upgraded custom element
    if (element[_upgradedProp] == true) {
      var definition = _customElements()._definitions.get(element.localName);
      var observedAttributes = definition.observedAttributes;
      var attributeChangedCallback = definition.attributeChangedCallback;
      if (attributeChangedCallback && observedAttributes.indexOf(name) >= 0) {
        var newValue = element.getAttribute(name);
        if (newValue !== oldValue) {
          attributeChangedCallback.call(element, name, oldValue, newValue, null);
        }
      }
    }
  }

  Object.defineProperty(window, 'customElements', {
    value: new CustomElementRegistry(),
    configurable: true,
    enumerable: true
  });

  // TODO(justinfagnani): Remove. Temporary for backward-compatibility
  window['CustomElements'] = {
    takeRecords: function takeRecords() {
      if (_customElements().flush) _customElements().flush();
    }
  };
})();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

(function customEventPloyfill() {
    function CustomEvent(event, params) {
        var parmsObj = {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };

        var evt = document.createEvent('CustomEvent');

        var hasParams = params || parmsObj;
        evt.initCustomEvent(event, hasParams.bubbles, hasParams.cancelable, hasParams.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();

/***/ }),
/* 2 */
/***/ (function(module, exports) {

(function (self) {
  'use strict';

  if (self.fetch) {
    return;
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    }(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

    var isDataView = function isDataView(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj);
    };

    var isArrayBufferView = ArrayBuffer.isView || function (obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value;
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function next() {
        var value = items.shift();
        return { done: value === undefined, value: value };
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ',' + value : value;
  };

  Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function (name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };

  Headers.prototype.values = function () {
    var items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  };

  Headers.prototype.entries = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function (body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type');
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function () {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };
    }

    this.text = function () {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        var view = new Uint8Array(this._bodyArrayBuffer);
        var str = String.fromCharCode.apply(null, view);
        return Promise.resolve(str);
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text');
      } else {
        return Promise.resolve(this._bodyText);
      }
    };

    if (support.arrayBuffer) {
      this.arrayBuffer = function () {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode);
      };
    }

    this.json = function () {
      return this.text().then(JSON.parse);
    };

    return this;
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (typeof input === 'string') {
      this.url = input;
    } else {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  Request.prototype.clone = function () {
    return new Request(this, { body: this._bodyInit });
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    rawHeaders.split('\r\n').forEach(function (line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = 'status' in options ? options.status : 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  };

  Response.error = function () {
    var response = new Response(null, { status: 0, statusText: '' });
    response.type = 'error';
    return response;
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, { status: status, headers: { location: url } });
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function (input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : this);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict'; /**
                @license
                Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
                This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
                The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
                The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
                Code distributed by Google as part of the polymer project is also
                subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
                */
  function e(Fe) {
    return Fe = a(Fe), u(d(Fe), Fe);
  }function a(Fe) {
    return Fe.replace(X.comments, '').replace(X.port, '');
  }function d(Fe) {
    var ke = { start: 0, end: Fe.length },
        Ue = ke;for (var Ke = 0, Xe = Fe.length; Ke < Xe; Ke++) {
      if (Fe[Ke] === U) {
        Ue.rules || (Ue.rules = []);var Ve = Ue,
            je = Ve.rules[Ve.rules.length - 1];Ue = { start: Ke + 1, parent: Ve, previous: je }, Ve.rules.push(Ue);
      } else Fe[Ke] === K && (Ue.end = Ke + 1, Ue = Ue.parent || ke);
    }return ke;
  }function u(Fe, ke) {
    var Ue = ke.substring(Fe.start, Fe.end - 1);if (Fe.parsedCssText = Fe.cssText = Ue.trim(), Fe.parent) {
      var Xe = Fe.previous ? Fe.previous.end : Fe.parent.start;Ue = ke.substring(Xe, Fe.start - 1), Ue = y(Ue), Ue = Ue.replace(X.multipleSpaces, ' '), Ue = Ue.substring(Ue.lastIndexOf(';') + 1);var Ve = Fe.parsedSelector = Fe.selector = Ue.trim();Fe.atRule = 0 === Ve.indexOf('@'), Fe.atRule ? 0 === Ve.indexOf('@media') ? Fe.type = k.MEDIA_RULE : Ve.match(X.keyframesRule) && (Fe.type = k.KEYFRAMES_RULE, Fe.keyframesName = Fe.selector.split(X.multipleSpaces).pop()) : 0 === Ve.indexOf(V) ? Fe.type = k.MIXIN_RULE : Fe.type = k.STYLE_RULE;
    }var Ke = Fe.rules;if (Ke) for (var je, _Xe = 0, _Ve = Ke.length; _Xe < _Ve && (je = Ke[_Xe]); _Xe++) {
      u(je, ke);
    }return Fe;
  }function y(Fe) {
    return Fe.replace(/\\([0-9a-f]{1,6})\s/gi, function () {
      var ke = arguments[1],
          Ue = 6 - ke.length;for (; Ue--;) {
        ke = '0' + ke;
      }return '\\' + ke;
    });
  }function _(Fe, ke, Ue) {
    Ue = Ue || '';var Ke = '';if (Fe.cssText || Fe.rules) {
      var Xe = Fe.rules;if (Xe && !S(Xe)) for (var Be, Ve = 0, je = Xe.length; Ve < je && (Be = Xe[Ve]); Ve++) {
        Ke = _(Be, ke, Ke);
      } else Ke = ke ? Fe.cssText : h(Fe.cssText), Ke = Ke.trim(), Ke && (Ke = '  ' + Ke + '\n');
    }return Ke && (Fe.selector && (Ue += Fe.selector + ' ' + U + '\n'), Ue += Ke, Fe.selector && (Ue += K + '\n\n')), Ue;
  }function S(Fe) {
    return 0 === Fe[0].selector.indexOf(V);
  }function h(Fe) {
    return Fe = g(Fe), C(Fe);
  }function g(Fe) {
    return Fe.replace(X.customProp, '').replace(X.mixinProp, '');
  }function C(Fe) {
    return Fe.replace(X.mixinApply, '').replace(X.varApply, '');
  }function E(Fe) {
    Fe && (B = B && !Fe.shimcssproperties, j = j && !Fe.shimshadow);
  }function T(Fe, ke) {
    return 'string' == typeof Fe && (Fe = e(Fe)), ke && R(Fe, ke), _(Fe, B);
  }function A(Fe) {
    return !Fe.__cssRules && Fe.textContent && (Fe.__cssRules = e(Fe.textContent)), Fe.__cssRules;
  }function N(Fe) {
    return Fe.parent && Fe.parent.type === k.KEYFRAMES_RULE;
  }function R(Fe, ke, Ue, Ke) {
    if (Fe) {
      var Xe = !1;if (Ke && Fe.type === k.MEDIA_RULE) {
        var je = Fe.selector.match(q.MEDIA_MATCH);je && !window.matchMedia(je[1]).matches && (Xe = !0);
      }Fe.type === k.STYLE_RULE ? ke(Fe) : Ue && Fe.type === k.KEYFRAMES_RULE ? Ue(Fe) : Fe.type === k.MIXIN_RULE && (Xe = !0);var Ve = Fe.rules;if (Ve && !Xe) for (var Ye, _je = 0, Be = Ve.length; _je < Be && (Ye = Ve[_je]); _je++) {
        R(Ye, ke, Ue, Ke);
      }
    }
  }function P(Fe, ke, Ue, Ke) {
    var Xe = O(Fe, ke);return I(Xe, Ue, Ke);
  }function I(Fe, ke, Ue) {
    ke = ke || document.head;var Ke = Ue && Ue.nextSibling || ke.firstChild;return G = Fe, ke.insertBefore(Fe, Ke);
  }function O(Fe, ke) {
    var Ue = document.createElement('style');return ke && Ue.setAttribute('scope', ke), Ue.textContent = Fe, Ue;
  }function M(Fe) {
    var ke = document.createComment(' Shady DOM styles for ' + Fe + ' '),
        Ue = G ? G.nextSibling : null,
        Ke = document.head;return Ke.insertBefore(ke, Ue || Ke.firstChild), G = ke, ke;
  }function b(Fe, ke) {
    var Ue = 0;for (var Ke = ke, Xe = Fe.length; Ke < Xe; Ke++) {
      if ('(' === Fe[Ke]) Ue++;else if (')' === Fe[Ke] && 0 == --Ue) return Ke;
    }return -1;
  }function w(Fe, ke) {
    var Ue = Fe.indexOf('var(');if (-1 === Ue) return ke(Fe, '', '', '');var Ke = b(Fe, Ue + 3),
        Xe = Fe.substring(Ue + 4, Ke),
        Ve = Fe.substring(0, Ue),
        je = w(Fe.substring(Ke + 1), ke),
        Be = Xe.indexOf(',');if (-1 === Be) return ke(Ve, Xe.trim(), '', je);var Ye = Xe.substring(0, Be).trim(),
        Ge = Xe.substring(Be + 1).trim();return ke(Ve, Ye, Ge, je);
  }function L(Fe, ke) {
    window.ShadyDOM ? window.ShadyDOM.nativeMethods.setAttribute.call(Fe, 'class', ke) : Fe.setAttribute('class', ke);
  }function H(Fe, ke) {
    var Ue = parseInt(Fe / 32);ke[Ue] = (ke[Ue] || 0) | 1 << Fe % 32;
  }function D() {
    we || (we = !0, window.HTMLImports ? window.HTMLImports.whenReady(F) : 'complete' === document.readyState ? F() : document.addEventListener('readystatechange', function () {
      'complete' === document.readyState && F();
    }));
  }function F() {
    requestAnimationFrame(function () {
      (we || be._elementsHaveApplied) && be.updateStyles(), we = !1;
    });
  }var k = { STYLE_RULE: 1, KEYFRAMES_RULE: 7, MEDIA_RULE: 4, MIXIN_RULE: 1e3 },
      U = '{',
      K = '}',
      X = { comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim, port: /@import[^;]*;/gim, customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim, mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim, mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim, varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim, keyframesRule: /^@[^\s]*keyframes/, multipleSpaces: /\s+/g },
      V = '--',
      j = !(window.ShadyDOM && window.ShadyDOM.inUse),
      B = !navigator.userAgent.match('AppleWebKit/601') && window.CSS && CSS.supports && CSS.supports('box-shadow', '0 0 0 var(--foo)'),
      Y = !1;window.ShadyCSS ? E(window.ShadyCSS) : window.WebComponents && E(window.WebComponents.flags);var G = null,
      q = { VAR_ASSIGN: /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:([^;{]*)|{([^}]*)})(?:(?=[;\s}])|$)/gi, MIXIN_MATCH: /(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi, VAR_CONSUMED: /(--[\w-]+)\s*([:,;)]|$)/gi, ANIMATION_MATCH: /(animation\s*:)|(animation-name\s*:)/, MEDIA_MATCH: /@media[^(]*(\([^)]*\))/, IS_VAR: /^--/, BRACKETED: /\{[^}]*\}/g, HOST_PREFIX: '(?:^|[^.#[:])', HOST_SUFFIX: '($|[.:[\\s>+~])' };var W = 'style-scope';
  var z = function () {
    function z() {
      _classCallCheck(this, z);
    }

    _createClass(z, [{
      key: 'dom',
      value: function dom(Fe, ke, Ue) {
        Fe.__styleScoped ? Fe.__styleScoped = null : this._transformDom(Fe, ke || '', Ue);
      }
    }, {
      key: '_transformDom',
      value: function _transformDom(Fe, ke, Ue) {
        Fe.nodeType === Node.ELEMENT_NODE && this.element(Fe, ke, Ue);var Ke = 'template' === Fe.localName ? (Fe.content || Fe._content).childNodes : Fe.children || Fe.childNodes;if (Ke) for (var Xe = 0; Xe < Ke.length; Xe++) {
          this._transformDom(Ke[Xe], ke, Ue);
        }
      }
    }, {
      key: 'element',
      value: function element(Fe, ke, Ue) {
        if (ke) if (Fe.classList) Ue ? (Fe.classList.remove(W), Fe.classList.remove(ke)) : (Fe.classList.add(W), Fe.classList.add(ke));else if (Fe.getAttribute) {
          var Ke = Fe.getAttribute('class');if (!Ue) {
            var Xe = (Ke ? Ke + ' ' : '') + W + ' ' + ke;L(Fe, Xe);
          } else if (Ke) {
            var _Xe2 = Ke.replace(W, '').replace(ke, '');L(Fe, _Xe2);
          }
        }
      }
    }, {
      key: 'elementStyles',
      value: function elementStyles(Fe, ke, Ue) {
        var Ke = Fe.__cssBuild,
            Xe = j || 'shady' === Ke ? T(ke, Ue) : this.css(ke, Fe.is, Fe.extends, Ue) + '\n\n';return Xe.trim();
      }
    }, {
      key: 'css',
      value: function css(Fe, ke, Ue, Ke) {
        var Xe = this._calcHostScope(ke, Ue);ke = this._calcElementScope(ke);var Ve = this;return T(Fe, function (je) {
          je.isScoped || (Ve.rule(je, ke, Xe), je.isScoped = !0), Ke && Ke(je, ke, Xe);
        });
      }
    }, {
      key: '_calcElementScope',
      value: function _calcElementScope(Fe) {
        return Fe ? '.' + Fe : '';
      }
    }, {
      key: '_calcHostScope',
      value: function _calcHostScope(Fe, ke) {
        return ke ? '[is=' + Fe + ']' : Fe;
      }
    }, {
      key: 'rule',
      value: function rule(Fe, ke, Ue) {
        this._transformRule(Fe, this._transformComplexSelector, ke, Ue);
      }
    }, {
      key: '_transformRule',
      value: function _transformRule(Fe, ke, Ue, Ke) {
        Fe.selector = Fe.transformedSelector = this._transformRuleCss(Fe, ke, Ue, Ke);
      }
    }, {
      key: '_transformRuleCss',
      value: function _transformRuleCss(Fe, ke, Ue, Ke) {
        var Xe = Fe.selector.split(Z);if (!N(Fe)) for (var Be, Ve = 0, je = Xe.length; Ve < je && (Be = Xe[Ve]); Ve++) {
          Xe[Ve] = ke.call(this, Be, Ue, Ke);
        }return Xe.join(Z);
      }
    }, {
      key: '_transformComplexSelector',
      value: function _transformComplexSelector(Fe, ke, Ue) {
        var _this = this;

        var Ke = !1;return Fe = Fe.trim(), Fe = Fe.replace($, function (Xe, Ve, je) {
          return ':' + Ve + '(' + je.replace(/\s/g, '') + ')';
        }), Fe = Fe.replace(re, te + ' $1'), Fe = Fe.replace(J, function (Xe, Ve, je) {
          if (!Ke) {
            var Be = _this._transformCompoundSelector(je, Ve, ke, Ue);Ke = Ke || Be.stop, Ve = Be.combinator, je = Be.value;
          }return Ve + je;
        }), Fe;
      }
    }, {
      key: '_transformCompoundSelector',
      value: function _transformCompoundSelector(Fe, ke, Ue, Ke) {
        var Xe = Fe.indexOf(se);0 <= Fe.indexOf(te) ? Fe = this._transformHostSelector(Fe, Ke) : 0 !== Xe && (Fe = Ue ? this._transformSimpleSelector(Fe, Ue) : Fe);var Ve = !1;0 <= Xe && (ke = '', Ve = !0);var je = void 0;return Ve && (je = !0, Ve && (Fe = Fe.replace(oe, function (Be, Ye) {
          return ' > ' + Ye;
        }))), Fe = Fe.replace(le, function (Be, Ye, Ge) {
          return '[dir="' + Ge + '"] ' + Ye + ', ' + Ye + '[dir="' + Ge + '"]';
        }), { value: Fe, combinator: ke, stop: je };
      }
    }, {
      key: '_transformSimpleSelector',
      value: function _transformSimpleSelector(Fe, ke) {
        var Ue = Fe.split(ae);return Ue[0] += ke, Ue.join(ae);
      }
    }, {
      key: '_transformHostSelector',
      value: function _transformHostSelector(Fe, ke) {
        var Ue = Fe.match(ne),
            Ke = Ue && Ue[2].trim() || '';if (Ke) {
          if (!Ke[0].match(ee)) {
            var Xe = Ke.split(ee)[0];return Xe === ke ? Ke : 'should_not_match';
          }return Fe.replace(ne, function (Xe, Ve, je) {
            return ke + je;
          });
        }return Fe.replace(te, ke);
      }
    }, {
      key: 'documentRule',
      value: function documentRule(Fe) {
        Fe.selector = Fe.parsedSelector, this.normalizeRootSelector(Fe), this._transformRule(Fe, this._transformDocumentSelector);
      }
    }, {
      key: 'normalizeRootSelector',
      value: function normalizeRootSelector(Fe) {
        ':root' === Fe.selector && (Fe.selector = 'html');
      }
    }, {
      key: '_transformDocumentSelector',
      value: function _transformDocumentSelector(Fe) {
        return Fe.match(se) ? this._transformComplexSelector(Fe, Q) : this._transformSimpleSelector(Fe.trim(), Q);
      }
    }, {
      key: 'SCOPE_NAME',
      get: function get() {
        return W;
      }
    }]);

    return z;
  }();

  var $ = /:(nth[-\w]+)\(([^)]+)\)/,
      Q = ':not(.' + W + ')',
      Z = ',',
      J = /(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=\[])+)/g,
      ee = /[[.:#*]/,
      te = ':host',
      se = '::slotted',
      re = /^(::slotted)/,
      ne = /(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,
      oe = /(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,
      le = /(.*):dir\((?:(ltr|rtl))\)/,
      ae = ':';var ie = new z(),
      pe = {};var de = Promise.resolve();
  var me = function () {
    _createClass(me, null, [{
      key: 'get',
      value: function get(Fe) {
        return Fe.__styleInfo;
      }
    }, {
      key: 'set',
      value: function set(Fe, ke) {
        return Fe.__styleInfo = ke, ke;
      }
    }, {
      key: 'invalidate',
      value: function invalidate(Fe) {
        pe[Fe] && (pe[Fe]._applyShimInvalid = !0);
      }
    }, {
      key: 'startValidating',
      value: function startValidating(Fe) {
        var ke = pe[Fe];ke._validating || (ke._validating = !0, de.then(function () {
          ke._applyShimInvalid = !1, ke._validating = !1;
        }));
      }
    }]);

    function me(Fe, ke, Ue, Ke, Xe, Ve) {
      _classCallCheck(this, me);

      this.styleRules = Fe || null, this.placeholder = ke || null, this.ownStylePropertyNames = Ue || [], this.overrideStyleProperties = null, this.elementName = Ke || '', this.cssBuild = Ve || '', this.typeExtension = Xe || '', this.styleProperties = null, this.scopeSelector = null, this.customStyle = null;
    }

    return me;
  }();

  var ue = window.Element.prototype,
      ye = ue.matches || ue.matchesSelector || ue.mozMatchesSelector || ue.msMatchesSelector || ue.oMatchesSelector || ue.webkitMatchesSelector,
      _e = navigator.userAgent.match('Trident'),
      fe = 'x-scope';
  var Se = function () {
    function Se() {
      _classCallCheck(this, Se);
    }

    _createClass(Se, [{
      key: 'decorateStyles',
      value: function decorateStyles(Fe) {
        var ke = this,
            Ue = {},
            Ke = [],
            Xe = 0;R(Fe, function (je) {
          ke.decorateRule(je), je.index = Xe++, ke.collectPropertiesInCssText(je.propertyInfo.cssText, Ue);
        }, function (Be) {
          Ke.push(Be);
        }), Fe._keyframes = Ke;var Ve = [];for (var je in Ue) {
          Ve.push(je);
        }return Ve;
      }
    }, {
      key: 'decorateRule',
      value: function decorateRule(Fe) {
        if (Fe.propertyInfo) return Fe.propertyInfo;var ke = {},
            Ue = {},
            Ke = this.collectProperties(Fe, Ue);return Ke && (ke.properties = Ue, Fe.rules = null), ke.cssText = this.collectCssText(Fe), Fe.propertyInfo = ke, ke;
      }
    }, {
      key: 'collectProperties',
      value: function collectProperties(Fe, ke) {
        var Ue = Fe.propertyInfo;if (!Ue) {
          var Ke = void 0,
              Xe = q.VAR_ASSIGN,
              Ve = Fe.parsedCssText,
              je = void 0,
              Be = void 0;for (; Ke = Xe.exec(Ve);) {
            je = (Ke[2] || Ke[3]).trim(), ('inherit' !== je || 'unset' !== je) && (ke[Ke[1].trim()] = je), Be = !0;
          }return Be;
        } else if (Ue.properties) return Object.assign(ke, Ue.properties), !0;
      }
    }, {
      key: 'collectCssText',
      value: function collectCssText(Fe) {
        return this.collectConsumingCssText(Fe.parsedCssText);
      }
    }, {
      key: 'collectConsumingCssText',
      value: function collectConsumingCssText(Fe) {
        return Fe.replace(q.BRACKETED, '').replace(q.VAR_ASSIGN, '');
      }
    }, {
      key: 'collectPropertiesInCssText',
      value: function collectPropertiesInCssText(Fe, ke) {
        for (var Ue; Ue = q.VAR_CONSUMED.exec(Fe);) {
          var Ke = Ue[1];':' !== Ue[2] && (ke[Ke] = !0);
        }
      }
    }, {
      key: 'reify',
      value: function reify(Fe) {
        var ke = Object.getOwnPropertyNames(Fe);for (var Ke, Ue = 0; Ue < ke.length; Ue++) {
          Ke = ke[Ue], Fe[Ke] = this.valueForProperty(Fe[Ke], Fe);
        }
      }
    }, {
      key: 'valueForProperty',
      value: function valueForProperty(Fe, ke) {
        var _this2 = this;

        if (Fe) if (0 <= Fe.indexOf(';')) Fe = this.valueForProperties(Fe, ke);else {
          (function () {
            var Ue = _this2;Fe = w(Fe, function (Ke, Xe, Ve, je) {
              if (!Xe) return Ke + je;var Be = Ue.valueForProperty(ke[Xe], ke);return Be && 'initial' !== Be ? 'apply-shim-inherit' === Be && (Be = 'inherit') : Be = Ue.valueForProperty(ke[Ve] || Ve, ke) || Ve, Ke + (Be || '') + je;
            });
          })();
        }return Fe && Fe.trim() || '';
      }
    }, {
      key: 'valueForProperties',
      value: function valueForProperties(Fe, ke) {
        var Ue = Fe.split(';');for (var Xe, Ve, Ke = 0; Ke < Ue.length; Ke++) {
          if (Xe = Ue[Ke]) {
            if (q.MIXIN_MATCH.lastIndex = 0, Ve = q.MIXIN_MATCH.exec(Xe), Ve) Xe = this.valueForProperty(ke[Ve[1]], ke);else {
              var je = Xe.indexOf(':');if (-1 !== je) {
                var Be = Xe.substring(je);Be = Be.trim(), Be = this.valueForProperty(Be, ke) || Be, Xe = Xe.substring(0, je) + Be;
              }
            }Ue[Ke] = Xe && Xe.lastIndexOf(';') === Xe.length - 1 ? Xe.slice(0, -1) : Xe || '';
          }
        }return Ue.join(';');
      }
    }, {
      key: 'applyProperties',
      value: function applyProperties(Fe, ke) {
        var Ue = '';Fe.propertyInfo || this.decorateRule(Fe), Fe.propertyInfo.cssText && (Ue = this.valueForProperties(Fe.propertyInfo.cssText, ke)), Fe.cssText = Ue;
      }
    }, {
      key: 'applyKeyframeTransforms',
      value: function applyKeyframeTransforms(Fe, ke) {
        var Ue = Fe.cssText,
            Ke = Fe.cssText;if (null == Fe.hasAnimations && (Fe.hasAnimations = q.ANIMATION_MATCH.test(Ue)), Fe.hasAnimations) {
          var Xe = void 0;if (null == Fe.keyframeNamesToTransform) for (var Ve in Fe.keyframeNamesToTransform = [], ke) {
            Xe = ke[Ve], Ke = Xe(Ue), Ue !== Ke && (Ue = Ke, Fe.keyframeNamesToTransform.push(Ve));
          } else {
            for (var _Ve2 = 0; _Ve2 < Fe.keyframeNamesToTransform.length; ++_Ve2) {
              Xe = ke[Fe.keyframeNamesToTransform[_Ve2]], Ue = Xe(Ue);
            }Ke = Ue;
          }
        }Fe.cssText = Ke;
      }
    }, {
      key: 'propertyDataFromStyles',
      value: function propertyDataFromStyles(Fe, ke) {
        var Ue = {},
            Ke = this,
            Xe = [];return R(Fe, function (Ve) {
          Ve.propertyInfo || Ke.decorateRule(Ve);var je = Ve.transformedSelector || Ve.parsedSelector;ke && Ve.propertyInfo.properties && je && ye.call(ke, je) && (Ke.collectProperties(Ve, Ue), H(Ve.index, Xe));
        }, null, !0), { properties: Ue, key: Xe };
      }
    }, {
      key: 'whenHostOrRootRule',
      value: function whenHostOrRootRule(Fe, ke, Ue, Ke) {
        if (ke.propertyInfo || this.decorateRule(ke), !!ke.propertyInfo.properties) {
          var Xe = Fe.is ? ie._calcHostScope(Fe.is, Fe.extends) : 'html',
              Ve = ke.parsedSelector,
              je = ':host > *' === Ve || 'html' === Ve,
              Be = 0 === Ve.indexOf(':host') && !je;if ('shady' === Ue && (je = Ve === Xe + ' > *.' + Xe || -1 !== Ve.indexOf('html'), Be = !je && 0 === Ve.indexOf(Xe)), 'shadow' === Ue && (je = ':host > *' === Ve || 'html' === Ve, Be = Be && !je), je || Be) {
            var Ye = Xe;Be && (j && !ke.transformedSelector && (ke.transformedSelector = ie._transformRuleCss(ke, ie._transformComplexSelector, ie._calcElementScope(Fe.is), Xe)), Ye = ke.transformedSelector || Xe), Ke({ selector: Ye, isHost: Be, isRoot: je });
          }
        }
      }
    }, {
      key: 'hostAndRootPropertiesForScope',
      value: function hostAndRootPropertiesForScope(Fe, ke) {
        var Ue = {},
            Ke = {},
            Xe = this,
            Ve = ke && ke.__cssBuild;return R(ke, function (je) {
          Xe.whenHostOrRootRule(Fe, je, Ve, function (Be) {
            var Ye = Fe._element || Fe;ye.call(Ye, Be.selector) && (Be.isHost ? Xe.collectProperties(je, Ue) : Xe.collectProperties(je, Ke));
          });
        }, null, !0), { rootProps: Ke, hostProps: Ue };
      }
    }, {
      key: 'transformStyles',
      value: function transformStyles(Fe, ke, Ue) {
        var Ke = this,
            Xe = ie._calcHostScope(Fe.is, Fe.extends),
            Ve = Fe.extends ? '\\' + Xe.slice(0, -1) + '\\]' : Xe,
            je = new RegExp(q.HOST_PREFIX + Ve + q.HOST_SUFFIX),
            Be = me.get(Fe).styleRules,
            Ye = this._elementKeyframeTransforms(Fe, Be, Ue);return ie.elementStyles(Fe, Be, function (Ge) {
          Ke.applyProperties(Ge, ke), j || N(Ge) || !Ge.cssText || (Ke.applyKeyframeTransforms(Ge, Ye), Ke._scopeSelector(Ge, je, Xe, Ue));
        });
      }
    }, {
      key: '_elementKeyframeTransforms',
      value: function _elementKeyframeTransforms(Fe, ke, Ue) {
        var Ke = ke._keyframes,
            Xe = {};if (!j && Ke) for (var Ve = 0, je = Ke[Ve]; Ve < Ke.length; je = Ke[++Ve]) {
          this._scopeKeyframes(je, Ue), Xe[je.keyframesName] = this._keyframesRuleTransformer(je);
        }return Xe;
      }
    }, {
      key: '_keyframesRuleTransformer',
      value: function _keyframesRuleTransformer(Fe) {
        return function (ke) {
          return ke.replace(Fe.keyframesNameRx, Fe.transformedKeyframesName);
        };
      }
    }, {
      key: '_scopeKeyframes',
      value: function _scopeKeyframes(Fe, ke) {
        Fe.keyframesNameRx = new RegExp(Fe.keyframesName, 'g'), Fe.transformedKeyframesName = Fe.keyframesName + '-' + ke, Fe.transformedSelector = Fe.transformedSelector || Fe.selector, Fe.selector = Fe.transformedSelector.replace(Fe.keyframesName, Fe.transformedKeyframesName);
      }
    }, {
      key: '_scopeSelector',
      value: function _scopeSelector(Fe, ke, Ue, Ke) {
        Fe.transformedSelector = Fe.transformedSelector || Fe.selector;var Xe = Fe.transformedSelector,
            Ve = '.' + Ke,
            je = Xe.split(',');for (var Ge, Be = 0, Ye = je.length; Be < Ye && (Ge = je[Be]); Be++) {
          je[Be] = Ge.match(ke) ? Ge.replace(Ue, Ve) : Ve + ' ' + Ge;
        }Fe.selector = je.join(',');
      }
    }, {
      key: 'applyElementScopeSelector',
      value: function applyElementScopeSelector(Fe, ke, Ue) {
        var Ke = Fe.getAttribute('class') || '',
            Xe = Ke;Ue && (Xe = Ke.replace(new RegExp('\\s*' + fe + '\\s*' + Ue + '\\s*', 'g'), ' ')), Xe += (Xe ? ' ' : '') + fe + ' ' + ke, Ke !== Xe && L(Fe, Xe);
      }
    }, {
      key: 'applyElementStyle',
      value: function applyElementStyle(Fe, ke, Ue, Ke) {
        var Xe = Ke ? Ke.textContent || '' : this.transformStyles(Fe, ke, Ue),
            Ve = me.get(Fe),
            je = Ve.customStyle;return je && !j && je !== Ke && (je._useCount--, 0 >= je._useCount && je.parentNode && je.parentNode.removeChild(je)), j ? Ve.customStyle ? (Ve.customStyle.textContent = Xe, Ke = Ve.customStyle) : Xe && (Ke = P(Xe, Ue, Fe.shadowRoot, Ve.placeholder)) : Ke ? !Ke.parentNode && I(Ke, null, Ve.placeholder) : Xe && (Ke = P(Xe, Ue, null, Ve.placeholder)), Ke && (Ke._useCount = Ke._useCount || 0, Ve.customStyle != Ke && Ke._useCount++, Ve.customStyle = Ke), _e && (Ke.textContent = Ke.textContent), Ke;
      }
    }, {
      key: 'applyCustomStyle',
      value: function applyCustomStyle(Fe, ke) {
        var Ue = A(Fe),
            Ke = this;Fe.textContent = T(Ue, function (Xe) {
          var Ve = Xe.cssText = Xe.parsedCssText;Xe.propertyInfo && Xe.propertyInfo.cssText && (Ve = g(Ve), Xe.cssText = Ke.valueForProperties(Ve, ke));
        });
      }
    }, {
      key: 'XSCOPE_NAME',
      get: function get() {
        return fe;
      }
    }]);

    return Se;
  }();

  var he = new Se();var ge = {};var xe = window.customElements;if (xe && !j) {
    (function () {
      var Fe = xe.define;xe.define = function (ke, Ue, Ke) {
        return ge[ke] = M(ke), Fe.call(xe, ke, Ue, Ke);
      };
    })();
  }var Ce = q.MIXIN_MATCH,
      Ee = q.VAR_ASSIGN,
      Te = /;\s*/m,
      Ae = /^\s*(initial)|(inherit)\s*$/,
      Ne = '_-_';
  var Re = function () {
    function Re() {
      _classCallCheck(this, Re);

      this._map = {};
    }

    _createClass(Re, [{
      key: 'set',
      value: function set(Fe, ke) {
        Fe = Fe.trim(), this._map[Fe] = { properties: ke, dependants: {} };
      }
    }, {
      key: 'get',
      value: function get(Fe) {
        return Fe = Fe.trim(), this._map[Fe];
      }
    }]);

    return Re;
  }();

  var ve = function () {
    function ve() {
      var _this3 = this;

      _classCallCheck(this, ve);

      this._currentTemplate = null, this._measureElement = null, this._map = new Re(), this._separator = Ne, this._boundProduceCssProperties = function (Fe, ke, Ue, Ke) {
        return _this3._produceCssProperties(Fe, ke, Ue, Ke);
      };
    }

    _createClass(ve, [{
      key: 'detectMixin',
      value: function detectMixin(Fe) {
        var ke = Ce.test(Fe) || Ee.test(Fe);return Ce.lastIndex = 0, Ee.lastIndex = 0, ke;
      }
    }, {
      key: 'transformStyle',
      value: function transformStyle(Fe, ke) {
        var Ue = A(Fe);return this.transformRules(Ue, ke), Ue;
      }
    }, {
      key: 'transformRules',
      value: function transformRules(Fe, ke) {
        var _this4 = this;

        this._currentTemplate = pe[ke], R(Fe, function (Ue) {
          _this4.transformRule(Ue);
        }), this._currentTemplate = null;
      }
    }, {
      key: 'transformRule',
      value: function transformRule(Fe) {
        Fe.cssText = this.transformCssText(Fe.parsedCssText), ':root' === Fe.selector && (Fe.selector = ':host > *');
      }
    }, {
      key: 'transformCssText',
      value: function transformCssText(Fe) {
        return Fe = Fe.replace(Ee, this._boundProduceCssProperties), this._consumeCssProperties(Fe);
      }
    }, {
      key: '_getInitialValueForProperty',
      value: function _getInitialValueForProperty(Fe) {
        return this._measureElement || (this._measureElement = document.createElement('meta'), this._measureElement.style.all = 'initial', document.head.appendChild(this._measureElement)), window.getComputedStyle(this._measureElement).getPropertyValue(Fe);
      }
    }, {
      key: '_consumeCssProperties',
      value: function _consumeCssProperties(Fe) {
        for (var ke; ke = Ce.exec(Fe);) {
          var Ue = ke[0],
              Ke = ke[1],
              Xe = ke.index,
              Ve = Xe + Ue.indexOf('@apply'),
              je = Xe + Ue.length,
              Be = Fe.slice(0, Ve),
              Ye = Fe.slice(je),
              Ge = this._cssTextToMap(Be),
              qe = this._atApplyToCssProperties(Ke, Ge);Fe = [Be, qe, Ye].join(''), Ce.lastIndex = Xe + qe.length;
        }return Fe;
      }
    }, {
      key: '_atApplyToCssProperties',
      value: function _atApplyToCssProperties(Fe, ke) {
        Fe = Fe.replace(Te, '');var Ue = [],
            Ke = this._map.get(Fe);if (Ke || (this._map.set(Fe, {}), Ke = this._map.get(Fe)), Ke) {
          this._currentTemplate && (Ke.dependants[this._currentTemplate.name] = this._currentTemplate);var Xe = void 0,
              Ve = void 0,
              je = void 0;for (Xe in Ke.properties) {
            je = ke && ke[Xe], Ve = [Xe, ': var(', Fe, Ne, Xe], je && Ve.push(',', je), Ve.push(')'), Ue.push(Ve.join(''));
          }
        }return Ue.join('; ');
      }
    }, {
      key: '_replaceInitialOrInherit',
      value: function _replaceInitialOrInherit(Fe, ke) {
        var Ue = Ae.exec(ke);return Ue && (Ue[1] ? ke = ve._getInitialValueForProperty(Fe) : ke = 'apply-shim-inherit'), ke;
      }
    }, {
      key: '_cssTextToMap',
      value: function _cssTextToMap(Fe) {
        var ke = Fe.split(';'),
            Ue = void 0,
            Ke = void 0,
            Xe = {};for (var je, Be, Ve = 0; Ve < ke.length; Ve++) {
          je = ke[Ve], je && (Be = je.split(':'), 1 < Be.length && (Ue = Be[0].trim(), Ke = this._replaceInitialOrInherit(Ue, Be.slice(1).join(':')), Xe[Ue] = Ke));
        }return Xe;
      }
    }, {
      key: '_invalidateMixinEntry',
      value: function _invalidateMixinEntry(Fe) {
        for (var ke in Fe.dependants) {
          this._currentTemplate && ke === this._currentTemplate.name || me.invalidate(ke);
        }
      }
    }, {
      key: '_produceCssProperties',
      value: function _produceCssProperties(Fe, ke, Ue, Ke) {
        var _this5 = this;

        if (Ue && w(Ue, function (Qe, Ze) {
          Ze && _this5._map.get(Ze) && (Ke = '@apply ' + Ze + ';');
        }), !Ke) return Fe;var Xe = this._consumeCssProperties(Ke),
            Ve = Fe.slice(0, Fe.indexOf('--')),
            je = this._cssTextToMap(Xe),
            Be = je,
            Ye = this._map.get(ke),
            Ge = Ye && Ye.properties;Ge ? Be = Object.assign(Object.create(Ge), je) : this._map.set(ke, Be);var We = void 0,
            ze = void 0,
            qe = [],
            $e = !1;for (We in Be) {
          ze = je[We], void 0 == ze && (ze = 'initial'), Ge && !(We in Ge) && ($e = !0), qe.push(ke + Ne + We + ': ' + ze);
        }return $e && this._invalidateMixinEntry(Ye), Ye && (Ye.properties = Be), Ue && (Ve = Fe + ';' + Ve), Ve + qe.join('; ') + ';';
      }
    }]);

    return ve;
  }();

  var Pe = new ve();window.ApplyShim = Pe;var Ie = function Ie() {};if (!j) {
    (function () {
      var Fe = function Fe(Ve) {
        return Ve.classList && !Ve.classList.contains(ie.SCOPE_NAME) || Ve instanceof SVGElement && (!Ve.hasAttribute('class') || 0 > Ve.getAttribute('class').indexOf(ie.SCOPE_NAME));
      },
          ke = function ke(Ve) {
        for (var je = 0; je < Ve.length; je++) {
          var Be = Ve[je];if (Be.target !== document.documentElement && Be.target !== document.head) {
            for (var Ye = 0; Ye < Be.addedNodes.length; Ye++) {
              var Ge = Be.addedNodes[Ye];if (Fe(Ge)) {
                var qe = Ge.getRootNode();if (qe.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                  var We = qe.host;if (We) {
                    var ze = We.is || We.localName;ie.dom(Ge, ze);
                  }
                }
              }
            }for (var _Ye = 0; _Ye < Be.removedNodes.length; _Ye++) {
              var _Ge = Be.removedNodes[_Ye];if (_Ge.nodeType === Node.ELEMENT_NODE) {
                var _qe = void 0;if (_Ge.classList ? _qe = Array.from(_Ge.classList) : _Ge.hasAttribute('class') && (_qe = _Ge.getAttribute('class').split(/\s+/)), void 0 != _qe) {
                  var _We = _qe.indexOf(ie.SCOPE_NAME);if (0 <= _We) {
                    var _ze = _qe[_We + 1];_ze && ie.dom(_Ge, _ze, !0);
                  }
                }
              }
            }
          }
        }
      },
          Ue = new MutationObserver(ke),
          Ke = function Ke(Ve) {
        Ue.observe(Ve, { childList: !0, subtree: !0 });
      },
          Xe = window.customElements && !window.customElements.flush;if (Xe) Ke(document);else {
        (function () {
          var Ve = function Ve() {
            Ke(document.body);
          };window.HTMLImports ? window.HTMLImports.whenReady(Ve) : requestAnimationFrame(function () {
            if ('loading' === document.readyState) {
              (function () {
                var je = function je() {
                  Ve(), document.removeEventListener('readystatechange', je);
                };document.addEventListener('readystatechange', je);
              })();
            } else Ve();
          });
        })();
      }Ie = function Ie() {
        ke(Ue.takeRecords());
      };
    })();
  }var Oe = new (function () {
    function _class() {
      var ke = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;

      _classCallCheck(this, _class);

      this.cache = {}, this.typeMax = ke;
    }

    _createClass(_class, [{
      key: '_validate',
      value: function _validate(ke, Ue, Ke) {
        for (var Xe = 0; Xe < Ke.length; Xe++) {
          var Ve = Ke[Xe];if (ke.properties[Ve] !== Ue[Ve]) return !1;
        }return !0;
      }
    }, {
      key: 'store',
      value: function store(ke, Ue, Ke, Xe) {
        var Ve = this.cache[ke] || [];Ve.push({ properties: Ue, styleElement: Ke, scopeSelector: Xe }), Ve.length > this.typeMax && Ve.shift(), this.cache[ke] = Ve;
      }
    }, {
      key: 'fetch',
      value: function fetch(ke, Ue, Ke) {
        var Xe = this.cache[ke];if (Xe) for (var Ve = Xe.length - 1; 0 <= Ve; Ve--) {
          var je = Xe[Ve];if (this._validate(je, Ue, Ke)) return je;
        }
      }
    }]);

    return _class;
  }())();
  var Me = function () {
    function Me() {
      _classCallCheck(this, Me);

      this._scopeCounter = {}, this._documentOwner = document.documentElement, this._documentOwnerStyleInfo = me.set(document.documentElement, new me({ rules: [] })), this._elementsHaveApplied = !1;
    }

    _createClass(Me, [{
      key: 'flush',
      value: function flush() {
        Ie();
      }
    }, {
      key: '_generateScopeSelector',
      value: function _generateScopeSelector(Fe) {
        var ke = this._scopeCounter[Fe] = (this._scopeCounter[Fe] || 0) + 1;return Fe + '-' + ke;
      }
    }, {
      key: 'getStyleAst',
      value: function getStyleAst(Fe) {
        return A(Fe);
      }
    }, {
      key: 'styleAstToString',
      value: function styleAstToString(Fe) {
        return T(Fe);
      }
    }, {
      key: '_gatherStyles',
      value: function _gatherStyles(Fe) {
        var ke = Fe.content.querySelectorAll('style'),
            Ue = [];for (var Ke = 0; Ke < ke.length; Ke++) {
          var Xe = ke[Ke];Ue.push(Xe.textContent), Xe.parentNode.removeChild(Xe);
        }return Ue.join('').trim();
      }
    }, {
      key: '_getCssBuild',
      value: function _getCssBuild(Fe) {
        var ke = Fe.content.querySelector('style');return ke ? ke.getAttribute('css-build') || '' : '';
      }
    }, {
      key: 'prepareTemplate',
      value: function prepareTemplate(Fe, ke, Ue) {
        if (!Fe._prepared) {
          Fe._prepared = !0, Fe.name = ke, Fe.extends = Ue, pe[ke] = Fe;var Ke = this._getCssBuild(Fe),
              Xe = this._gatherStyles(Fe),
              Ve = { is: ke, extends: Ue, __cssBuild: Ke };this.nativeShadow || ie.dom(Fe.content, ke);var je = Pe.detectMixin(Xe),
              Be = e(Xe);je && this.nativeCss && !this.nativeCssApply && Pe.transformRules(Be, ke), Fe._styleAst = Be;var Ye = [];if (this.nativeCss || (Ye = he.decorateStyles(Fe._styleAst, Ve)), !Ye.length || this.nativeCss) {
            var Ge = this.nativeShadow ? Fe.content : null,
                qe = ge[ke],
                We = this._generateStaticStyle(Ve, Fe._styleAst, Ge, qe);Fe._style = We;
          }Fe._ownPropertyNames = Ye;
        }
      }
    }, {
      key: '_generateStaticStyle',
      value: function _generateStaticStyle(Fe, ke, Ue, Ke) {
        var Xe = ie.elementStyles(Fe, ke);if (Xe.length) return P(Xe, Fe.is, Ue, Ke);
      }
    }, {
      key: '_prepareHost',
      value: function _prepareHost(Fe) {
        var Ue = void 0,
            ke = Fe.getAttribute('is') || Fe.localName;ke !== Fe.localName && (Ue = Fe.localName);var Ve = void 0,
            je = void 0,
            Be = void 0,
            Ke = ge[ke],
            Xe = pe[ke];return Xe && (Ve = Xe._styleAst, je = Xe._ownPropertyNames, Be = Xe._cssBuild), me.set(Fe, new me(Ve, Ke, je, ke, Ue, Be));
      }
    }, {
      key: 'applyStyle',
      value: function applyStyle(Fe, ke) {
        var Ue = Fe.getAttribute('is') || Fe.localName,
            Ke = me.get(Fe),
            Xe = !!Ke;if (Ke || (Ke = this._prepareHost(Fe)), this._isRootOwner(Fe) || (this._elementsHaveApplied = !0), window.CustomStyle) {
          var Ve = window.CustomStyle;if (Ve._documentDirty) {
            if (Ve.findStyles(), this.nativeCss ? !this.nativeCssApply && Ve._revalidateApplyShim() : this._updateProperties(this._documentOwner, this._documentOwnerStyleInfo), Ve.applyStyles(), !this._elementsHaveApplied) return;if (!this.nativeCss && (this.updateStyles(), Xe)) return;
          }
        }if (ke && (Ke.overrideStyleProperties = Ke.overrideStyleProperties || {}, Object.assign(Ke.overrideStyleProperties, ke)), this.nativeCss) {
          Ke.overrideStyleProperties && this._updateNativeProperties(Fe, Ke.overrideStyleProperties);var _Ve3 = pe[Ue];if (!_Ve3 && !this._isRootOwner(Fe)) return;if (_Ve3 && _Ve3._applyShimInvalid && _Ve3._style) {
            if (_Ve3._validating || (Pe.transformRules(_Ve3._styleAst, Ue), _Ve3._style.textContent = ie.elementStyles(Fe, Ke.styleRules), me.startValidating(Ue)), this.nativeShadow) {
              var je = Fe.shadowRoot;if (je) {
                var Be = je.querySelector('style');Be.textContent = ie.elementStyles(Fe, Ke.styleRules);
              }
            }Ke.styleRules = _Ve3._styleAst;
          }
        } else this._updateProperties(Fe, Ke), Ke.ownStylePropertyNames && Ke.ownStylePropertyNames.length && this._applyStyleProperties(Fe, Ke);if (Xe) {
          var _Ve4 = this._isRootOwner(Fe) ? Fe : Fe.shadowRoot;_Ve4 && this._applyToDescendants(_Ve4);
        }
      }
    }, {
      key: '_applyToDescendants',
      value: function _applyToDescendants(Fe) {
        var ke = Fe.children;for (var Ke, Ue = 0; Ue < ke.length; Ue++) {
          Ke = ke[Ue], Ke.shadowRoot && this.applyStyle(Ke), this._applyToDescendants(Ke);
        }
      }
    }, {
      key: '_styleOwnerForNode',
      value: function _styleOwnerForNode(Fe) {
        var ke = Fe.getRootNode(),
            Ue = ke.host;return Ue ? me.get(Ue) ? Ue : this._styleOwnerForNode(Ue) : this._documentOwner;
      }
    }, {
      key: '_isRootOwner',
      value: function _isRootOwner(Fe) {
        return Fe === this._documentOwner;
      }
    }, {
      key: '_applyStyleProperties',
      value: function _applyStyleProperties(Fe, ke) {
        var Ue = Fe.getAttribute('is') || Fe.localName,
            Ke = Oe.fetch(Ue, ke.styleProperties, ke.ownStylePropertyNames),
            Xe = Ke && Ke.scopeSelector,
            Ve = Ke ? Ke.styleElement : null,
            je = ke.scopeSelector;ke.scopeSelector = Xe || this._generateScopeSelector(Ue);var Be = he.applyElementStyle(Fe, ke.styleProperties, ke.scopeSelector, Ve);return this.nativeShadow || he.applyElementScopeSelector(Fe, ke.scopeSelector, je), Ke || Oe.store(Ue, ke.styleProperties, Be, ke.scopeSelector), Be;
      }
    }, {
      key: '_updateProperties',
      value: function _updateProperties(Fe, ke) {
        var Ue = this._styleOwnerForNode(Fe),
            Ke = me.get(Ue),
            Xe = Ke.styleProperties,
            Ve = Object.create(Xe || null),
            je = he.hostAndRootPropertiesForScope(Fe, ke.styleRules),
            Be = he.propertyDataFromStyles(Ke.styleRules, Fe),
            Ye = Be.properties;Object.assign(Ve, je.hostProps, Ye, je.rootProps), this._mixinOverrideStyles(Ve, ke.overrideStyleProperties), he.reify(Ve), ke.styleProperties = Ve;
      }
    }, {
      key: '_mixinOverrideStyles',
      value: function _mixinOverrideStyles(Fe, ke) {
        for (var Ue in ke) {
          var Ke = ke[Ue];(Ke || 0 === Ke) && (Fe[Ue] = Ke);
        }
      }
    }, {
      key: '_updateNativeProperties',
      value: function _updateNativeProperties(Fe, ke) {
        for (var Ue in ke) {
          null === Ue ? Fe.style.removeProperty(Ue) : Fe.style.setProperty(Ue, ke[Ue]);
        }
      }
    }, {
      key: 'updateStyles',
      value: function updateStyles(Fe) {
        this.applyStyle(this._documentOwner, Fe);
      }
    }, {
      key: '_transformCustomStyleForDocument',
      value: function _transformCustomStyleForDocument(Fe) {
        var _this6 = this;

        var ke = A(Fe);R(ke, function (Ue) {
          j ? ie.normalizeRootSelector(Ue) : ie.documentRule(Ue), _this6.nativeCss && !_this6.nativeCssApply && Pe.transformRule(Ue);
        }), this.nativeCss ? Fe.textContent = T(ke) : this._documentOwnerStyleInfo.styleRules.rules.push(ke);
      }
    }, {
      key: '_revalidateApplyShim',
      value: function _revalidateApplyShim(Fe) {
        if (this.nativeCss && !this.nativeCssApply) {
          var ke = A(Fe);Pe.transformRules(ke), Fe.textContent = T(ke);
        }
      }
    }, {
      key: '_applyCustomStyleToDocument',
      value: function _applyCustomStyleToDocument(Fe) {
        this.nativeCss || he.applyCustomStyle(Fe, this._documentOwnerStyleInfo.styleProperties);
      }
    }, {
      key: 'getComputedStyleValue',
      value: function getComputedStyleValue(Fe, ke) {
        var Ue = void 0;if (!this.nativeCss) {
          var Ke = me.get(Fe) || me.get(this._styleOwnerForNode(Fe));Ue = Ke.styleProperties[ke];
        }return Ue = Ue || window.getComputedStyle(Fe).getPropertyValue(ke), Ue.trim();
      }
    }, {
      key: 'setElementClass',
      value: function setElementClass(Fe, ke) {
        var Ue = Fe.getRootNode(),
            Ke = ke ? ke.split(/\s/) : [],
            Xe = Ue.host && Ue.host.localName;if (!Xe) {
          var Ve = Fe.getAttribute('class');if (Ve) {
            var je = Ve.split(/\s/);for (var Be = 0; Be < je.length; Be++) {
              if (je[Be] === ie.SCOPE_NAME) {
                Xe = je[Be + 1];break;
              }
            }
          }
        }if (Xe && Ke.push(ie.SCOPE_NAME, Xe), !this.nativeCss) {
          var _je2 = me.get(Fe);_je2 && _je2.scopeSelector && Ke.push(he.XSCOPE_NAME, _je2.scopeSelector);
        }L(Fe, Ke.join(' '));
      }
    }, {
      key: '_styleInfoForNode',
      value: function _styleInfoForNode(Fe) {
        return me.get(Fe);
      }
    }, {
      key: 'nativeShadow',
      get: function get() {
        return j;
      }
    }, {
      key: 'nativeCss',
      get: function get() {
        return B;
      }
    }, {
      key: 'nativeCssApply',
      get: function get() {
        return Y;
      }
    }]);

    return Me;
  }();

  window.ShadyCSS = new Me();var be = window.ShadyCSS,
      we = !1,
      Le = [],
      He = null;
  var De = function (_HTMLElement) {
    _inherits(De, _HTMLElement);

    _createClass(De, null, [{
      key: 'findStyles',
      value: function findStyles() {
        for (var Fe = 0; Fe < Le.length; Fe++) {
          var ke = Le[Fe];if (!ke._style) {
            var Ue = ke.querySelector('style');if (!Ue) continue;if (Ue.__appliedElement) for (var Ke = 0; Ke < Ue.attributes.length; Ke++) {
              var Xe = Ue.attributes[Ke];Ue.__appliedElement.setAttribute(Xe.name, Xe.value);
            }ke._style = Ue.__appliedElement || Ue, He && He(ke._style), be._transformCustomStyleForDocument(ke._style);
          }
        }
      }
    }, {
      key: '_revalidateApplyShim',
      value: function _revalidateApplyShim() {
        for (var Fe = 0; Fe < Le.length; Fe++) {
          var ke = Le[Fe];ke._style && be._revalidateApplyShim(ke._style);
        }
      }
    }, {
      key: 'applyStyles',
      value: function applyStyles() {
        for (var Fe = 0; Fe < Le.length; Fe++) {
          var ke = Le[Fe];ke._style && be._applyCustomStyleToDocument(ke._style);
        }we = !1;
      }
    }, {
      key: '_customStyles',
      get: function get() {
        return Le;
      }
    }, {
      key: 'processHook',
      get: function get() {
        return He;
      },
      set: function set(Fe) {
        He = Fe;
      }
    }, {
      key: '_documentDirty',
      get: function get() {
        return we;
      }
    }]);

    function De() {
      var _this7;

      _classCallCheck(this, De);

      (_this7 = _possibleConstructorReturn(this, (De.__proto__ || Object.getPrototypeOf(De)).call(this)), _this7), Le.push(_this7), D();return _this7;
    }

    return De;
  }(HTMLElement);

  window.CustomStyle = De, window.customElements.define('custom-style', De);
})();
//# sourceMappingURL=shadycss.min.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = 'function' == typeof Symbol && 'symbol' == _typeof2(Symbol.iterator) ? function (obj) {
  return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
} : function (obj) {
  return obj && 'function' == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
};var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 'value' in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor;
  };
}();function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) throw new TypeError('Cannot call a class as a function');
}(function () {
  'use strict'; /**
                @license
                Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
                This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
                The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
                The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
                Code distributed by Google as part of the polymer project is also
                subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
                */
  function t(Qt) {
    return !('ShadyRoot' !== Qt.__localName);
  }function o(Qt) {
    var Kt = Qt.getRootNode();if (t(Kt)) return Kt;
  }function r(Qt, Kt) {
    return We.call(Qt, Kt);
  }function a(Qt, Kt, Jt) {
    var Yt = Object.getOwnPropertyDescriptor(Kt, Qt);Yt && Object.defineProperty(Jt, Qt, Yt);
  }function _(Qt, Kt) {
    if (Qt && Kt) {
      var Jt = Object.getOwnPropertyNames(Kt);for (var Zt, Yt = 0; Yt < Jt.length && (Zt = Jt[Yt]); Yt++) {
        a(Zt, Kt, Qt);
      }
    }return Qt || Kt;
  }function h(Qt) {
    for (var _len = arguments.length, Kt = Array(1 < _len ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      Kt[_key - 1] = arguments[_key];
    }for (var Jt = 0; Jt < Kt.length; Jt++) {
      _(Qt, Kt[Jt]);
    }return Qt;
  }function u(Qt, Kt) {
    for (var Jt in Kt) {
      Qt[Jt] = Kt[Jt];
    }return Qt;
  }function g(Qt, Kt) {
    var Jt = Object.getPrototypeOf(Qt);if (!Jt.hasOwnProperty('__patchProto')) {
      var Yt = Object.create(Jt);Yt.__sourceProto = Jt, _(Yt, Kt), Jt.__patchProto = Yt;
    }Qt.__proto__ = Jt.__patchProto;
  }function y(Qt) {
    He || (He = !0, Fe.then(N)), je.push(Qt);
  }function N() {
    for (He = !1, qe++; je.length;) {
      je.shift()();
    }Ue && Ue.flush && Ue.flush();var Qt = 100 < qe;if (je.length && !Qt && N(), qe = 0, Qt) throw new Error('Loop detected in ShadyDOM distribution, aborting.');
  }function b(Qt, Kt) {
    var Jt = Kt.getRootNode();return Qt.map(function (Yt) {
      var Zt = Jt === Yt.target.getRootNode();if (Zt && Yt.addedNodes) {
        var $t = Array.from(Yt.addedNodes).filter(function (eo) {
          return Jt === eo.getRootNode();
        });if ($t.length) return Yt = Object.create(Yt), Object.defineProperty(Yt, 'addedNodes', { value: $t, configurable: !0 }), Yt;
      } else if (Zt) return Yt;
    }).filter(function (Yt) {
      return Yt;
    });
  }function f(Qt) {
    return '&' === Qt ? '&amp;' : '<' === Qt ? '&lt;' : '>' === Qt ? '&gt;' : '"' === Qt ? '&quot;' : '\xA0' === Qt ? '&nbsp;' : void 0;
  }function v(Qt) {
    return Qt.replace(ht, f);
  }function E(Qt) {
    return Qt.replace(pt, f);
  }function S(Qt) {
    var Kt = {};for (var Jt = 0; Jt < Qt.length; Jt++) {
      Kt[Qt[Jt]] = !0;
    }return Kt;
  }function P(Qt, Kt, Jt) {
    switch (Qt.nodeType) {case Node.ELEMENT_NODE:
        {
          var Yt = Qt.localName,
              Zt = '<' + Yt,
              $t = Qt.attributes;for (var to, eo = 0; to = $t[eo]; eo++) {
            Zt += ' ' + to.name + '="' + v(to.value) + '"';
          }return Zt += '>', ut[Yt] ? Zt : Zt + C(Qt, Jt) + '</' + Yt + '>';
        }case Node.TEXT_NODE:
        {
          var _Yt = Qt.data;return Kt && ct[Kt.localName] ? _Yt : E(_Yt);
        }case Node.COMMENT_NODE:
        return '<!--' + Qt.data + '-->';default:
        throw window.console.error(Qt), new Error('not implemented');}
  }function C(Qt, Kt) {
    'template' === Qt.localName && (Qt = Qt.content);var Jt = '',
        Yt = Kt ? Kt(Qt) : Qt.childNodes;for (var eo, Zt = 0, $t = Yt.length; Zt < $t && (eo = Yt[Zt]); Zt++) {
      Jt += P(eo, Qt, Kt);
    }return Jt;
  }function T(Qt) {
    return gt.currentNode = Qt, gt.parentNode();
  }function D(Qt) {
    return gt.currentNode = Qt, gt.firstChild();
  }function O(Qt) {
    return gt.currentNode = Qt, gt.lastChild();
  }function M(Qt) {
    var Kt = [];gt.currentNode = Qt;for (var Jt = gt.firstChild(); Jt;) {
      Kt.push(Jt), Jt = gt.nextSibling();
    }return Kt;
  }function R(Qt) {
    return yt.currentNode = Qt, yt.firstChild();
  }function x(Qt) {
    return yt.currentNode = Qt, yt.lastChild();
  }function I(Qt) {
    return yt.currentNode = Qt, yt.previousSibling();
  }function A(Qt) {
    return yt.currentNode = Qt, yt.nextSibling();
  }function w(Qt) {
    var Kt = [];yt.currentNode = Qt;for (var Jt = yt.firstChild(); Jt;) {
      Kt.push(Jt), Jt = yt.nextSibling();
    }return Kt;
  }function L(Qt) {
    return C(Qt, function (Kt) {
      return M(Kt);
    });
  }function k(Qt) {
    if (Qt.nodeType !== Node.ELEMENT_NODE) return Qt.nodeValue;for (var Yt, Kt = document.createTreeWalker(Qt, NodeFilter.SHOW_TEXT, null, !1), Jt = ''; Yt = Kt.nextNode();) {
      Jt += Yt.nodeValue;
    }return Jt;
  }function W(Qt, Kt) {
    return Qt.__shady && Qt.__shady[Kt];
  }function F(Qt, Kt) {
    return W(Qt, Kt) !== void 0;
  }function U(Qt) {
    return { get: function get() {
        var Kt = W(this, Qt);return Kt === void 0 ? Nt[Qt](this) : Kt;
      }, configurable: !0 };
  }function H(Qt, Kt) {
    var Jt = Array.from(Kt.childNodes);for (var Yt = 0; Yt < Jt.length; Yt++) {
      Qt.appendChild(Jt[Yt]);
    }
  }function q(Qt) {
    for (; Qt.firstChild;) {
      Qt.removeChild(Qt.firstChild);
    }
  }function G() {
    if (bt && bt.get) return bt.get.call(document);return we.hasDescriptors ? void 0 : document.activeElement;
  }function B(Qt) {
    var Kt = G();if (!Kt) return null;var Jt = !!t(Qt);if (Qt !== document) {
      if (!Jt) return null;if (Qt.host === Kt || !Qt.host.contains(Kt)) return null;
    }for (var Yt = o(Kt); Yt && Yt !== Qt;) {
      Kt = Yt.host, Yt = o(Kt);
    }return Qt === document ? Yt ? null : Kt : Yt === Qt ? Kt : null;
  }function z(Qt, Kt, Jt) {
    for (var Yt in Kt) {
      var Zt = Object.getOwnPropertyDescriptor(Qt, Yt);Zt && Zt.configurable || !Zt && Jt ? Object.defineProperty(Qt, Yt, Kt[Yt]) : Jt && console.warn('Could not define', Yt, 'on', Qt);
    }
  }function V(Qt) {
    z(Qt, ft), z(Qt, vt), z(Qt, St);
  }function X(Qt, Kt, Jt) {
    if (Ct(Kt), Kt.__shady = Kt.__shady || {}, F(Kt, 'firstChild') && (Kt.__shady.childNodes = null), Qt.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      var Yt = Qt.childNodes;for (var $t = 0; $t < Yt.length; $t++) {
        Q(Yt[$t], Kt, Jt);
      }Qt.__shady = Qt.__shady || {};var Zt = F(Qt, 'firstChild') ? null : void 0;Qt.__shady.firstChild = Qt.__shady.lastChild = Zt, Qt.__shady.childNodes = Zt;
    } else Q(Qt, Kt, Jt);
  }function Q(Qt, Kt, Jt) {
    Pt(Qt), Jt = Jt || null, Qt.__shady = Qt.__shady || {}, Kt.__shady = Kt.__shady || {}, Jt && (Jt.__shady = Jt.__shady || {}), Qt.__shady.previousSibling = Jt ? Jt.__shady.previousSibling : Kt.lastChild;var Yt = Qt.__shady.previousSibling;Yt && Yt.__shady && (Yt.__shady.nextSibling = Qt);var Zt = Qt.__shady.nextSibling = Jt;Zt && Zt.__shady && (Zt.__shady.previousSibling = Qt), Qt.__shady.parentNode = Kt, Jt ? Jt === Kt.__shady.firstChild && (Kt.__shady.firstChild = Qt) : (Kt.__shady.lastChild = Qt, !Kt.__shady.firstChild && (Kt.__shady.firstChild = Qt)), Kt.__shady.childNodes = null;
  }function K(Qt, Kt) {
    Qt.__shady = Qt.__shady || {}, Kt.__shady = Kt.__shady || {}, Qt === Kt.__shady.firstChild && (Kt.__shady.firstChild = Qt.__shady.nextSibling), Qt === Kt.__shady.lastChild && (Kt.__shady.lastChild = Qt.__shady.previousSibling);var Jt = Qt.__shady.previousSibling,
        Yt = Qt.__shady.nextSibling;Jt && (Jt.__shady = Jt.__shady || {}, Jt.__shady.nextSibling = Yt), Yt && (Yt.__shady = Yt.__shady || {}, Yt.__shady.previousSibling = Jt), Qt.__shady.parentNode = Qt.__shady.previousSibling = Qt.__shady.nextSibling = void 0, F(Kt, 'childNodes') && (Kt.__shady.childNodes = null);
  }function J(Qt, Kt, Jt) {
    var Yt = o(Qt),
        Zt;Yt && (Kt.__noInsertionPoint && !Yt._changePending && (Yt._skipUpdateInsertionPoints = !0), Zt = se(Kt, Qt, Yt), Zt && (Yt._skipUpdateInsertionPoints = !1)), F(Qt, 'firstChild') && X(Kt, Qt, Jt);var $t = oe(Kt, Qt, Yt, Zt) || Qt.shadyRoot;return $t;
  }function Y(Qt) {
    var Kt = F(Qt, 'parentNode') && W(Qt, 'parentNode'),
        Jt,
        Yt = o(Qt);if (Kt || Yt) {
      Jt = le(Qt), Kt && K(Qt, Kt);var Zt = Yt && re(Yt, Qt),
          $t = Kt && Yt && Kt.localName === Yt.getInsertionPointTag();(Zt || $t) && (Yt._skipUpdateInsertionPoints = !1, _e(Yt));
    }return ie(Qt), Jt;
  }function Z(Qt, Kt, Jt) {
    var Yt = Qt.__shady && Qt.__shady.observer;Yt && (Kt && Yt.addedNodes.push(Kt), Jt && Yt.removedNodes.push(Jt), Yt.schedule());
  }function $(Qt, Kt) {
    return Kt ? (Z(Kt, null, Qt), Y(Qt)) : void ie(Qt);
  }function ee(Qt) {
    return !(Qt.__ownerShadyRoot === void 0);
  }function te(Qt) {
    if (Qt && Qt.nodeType) {
      var _Kt = Qt.__ownerShadyRoot;if (void 0 === _Kt) {
        if (t(Qt)) _Kt = Qt;else {
          var Jt = Qt.parentNode;_Kt = Jt ? te(Jt) : Qt;
        }document.documentElement.contains(Qt) && (Qt.__ownerShadyRoot = _Kt);
      }return _Kt;
    }
  }function oe(Qt, Kt, Jt, Yt) {
    var Zt = Jt && Jt.getInsertionPointTag() || '',
        $t = Qt.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !Qt.__noInsertionPoint && Zt && Qt.querySelector(Zt),
        eo = $t && $t.parentNode.nodeType !== Node.DOCUMENT_FRAGMENT_NODE,
        to = $t || Qt.localName === Zt;(to || Kt.localName === Zt || Yt) && Jt && _e(Jt);var oo = ne(Kt);return oo && _e(Kt.shadyRoot), oo || to && !eo;
  }function se(Qt, Kt, Jt) {
    var Yt,
        Zt = Jt.getInsertionPointTag();if (Qt.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !Qt.__noInsertionPoint) {
      var $t = Qt.querySelectorAll(Zt);for (var to, oo, so, eo = 0; eo < $t.length && (to = $t[eo]); eo++) {
        oo = to.parentNode, oo === Qt && (oo = Kt), so = se(to, oo, Jt), Yt = Yt || so;
      }
    } else Qt.localName === Zt && (Tt(Kt), Tt(Qt), Yt = !0);return Yt;
  }function ne(Qt) {
    return Qt && Qt.shadyRoot && Qt.shadyRoot.hasInsertionPoint();
  }function re(Qt, Kt) {
    var Jt,
        Yt = Qt._insertionPoints;for (var Zt = 0; Zt < Yt.length; Zt++) {
      var $t = Yt[Zt];if (de(Kt, $t)) {
        var eo = $t.assignedNodes({ flatten: !0 });for (var to = 0; to < eo.length; to++) {
          Jt = !0;var oo = eo[to],
              so = T(oo);so && Ye.call(so, oo);
        }
      }
    }return Jt;
  }function de(Qt, Kt) {
    for (; Kt;) {
      if (Kt == Qt) return !0;Kt = Kt.parentNode;
    }
  }function ie(Qt) {
    if (ee(Qt)) {
      var Kt = Qt.childNodes;for (var Zt, Jt = 0, Yt = Kt.length; Jt < Yt && (Zt = Kt[Jt]); Jt++) {
        ie(Zt);
      }
    }Qt.__ownerShadyRoot = void 0;
  }function ae(Qt) {
    var Kt = Qt.assignedNodes({ flatten: !0 }),
        Jt = te(Qt);for (var $t, Yt = 0, Zt = Kt.length; Yt < Zt && ($t = Kt[Yt]); Yt++) {
      if (Jt.isFinalDestination(Qt, $t)) return $t;
    }
  }function le(Qt) {
    var Kt = Qt.parentNode;if (ne(Kt)) return _e(Kt.shadyRoot), !0;
  }function _e(Qt) {
    Qt._changePending = !0, Qt.update();
  }function he(Qt, Kt) {
    if ('slot' === Kt) le(Qt);else if ('slot' === Qt.localName && 'name' === Kt) {
      var Jt = o(Qt);Jt && Jt.update();
    }
  }function pe(Qt, Kt, Jt) {
    var Yt = [];return ue(Qt.childNodes, Kt, Jt, Yt), Yt;
  }function ue(Qt, Kt, Jt, Yt) {
    for (var eo, Zt = 0, $t = Qt.length; Zt < $t && (eo = Qt[Zt]); Zt++) {
      if (eo.nodeType === Node.ELEMENT_NODE && ce(eo, Kt, Jt, Yt)) return !0;
    }
  }function ce(Qt, Kt, Jt, Yt) {
    var Zt = Kt(Qt);return Zt && Yt.push(Qt), Jt && Jt(Zt) ? Zt : void ue(Qt.childNodes, Kt, Jt, Yt);
  }function ge(Qt) {
    var Kt = Qt.getRootNode();t(Kt) && Kt.render();
  }function ye(Qt, Kt, Jt) {
    window.ShadyCSS && 'class' === Kt && Qt.ownerDocument === document ? window.ShadyCSS.setElementClass(Qt, Jt) : ($e.call(Qt, Kt, Jt), he(Qt, Kt));
  }function Ne(Qt, Kt) {
    tt.call(Qt, Kt), he(Qt, Kt);
  }function me(Qt, Kt, Jt) {
    if (Jt) {
      var Yt = W(Jt, 'parentNode');if (void 0 !== Yt && Yt !== Qt) throw Error('The ref_node to be inserted before is not a child of this node');
    }if (Kt.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
      var _Yt2 = W(Kt, 'parentNode');$(Kt, _Yt2);
    }if (!J(Qt, Kt, Jt)) {
      if (Jt) {
        var Zt = o(Jt);Zt && (Jt = Jt.localName === Zt.getInsertionPointTag() ? ae(Jt) : Jt);
      }var _Yt3 = t(Qt) ? Qt.host : Qt;Jt ? Ke.call(_Yt3, Kt, Jt) : Xe.call(_Yt3, Kt);
    }return Z(Qt, Kt), Kt;
  }function be(Qt, Kt) {
    if (Kt.parentNode !== Qt) throw Error('The node to be removed is not a child of this node: ' + Kt);if (!Y(Kt)) {
      var Jt = t(Qt) ? Qt.host : Qt,
          Yt = T(Kt);Jt === Yt && Ye.call(Jt, Kt);
    }return Z(Qt, null, Kt), Kt;
  }function fe(Qt, Kt) {
    if ('template' == Qt.localName) return st.call(Qt, Kt);var Jt = st.call(Qt, !1);if (Kt) {
      var Yt = Qt.childNodes;for (var _$t, _Zt = 0; _Zt < Yt.length; _Zt++) {
        _$t = Yt[_Zt].cloneNode(!0), Jt.appendChild(_$t);
      }
    }return Jt;
  }function ve(Qt, Kt, Jt) {
    if (Jt || (Jt = rt), Qt.ownerDocument !== document) return Jt.call(document, Qt, Kt);var Yt = Jt.call(document, Qt, !1);if (Kt) {
      var Zt = Qt.childNodes;for (var eo, $t = 0; $t < Zt.length; $t++) {
        eo = ve(Zt[$t], !0, Jt), Yt.appendChild(eo);
      }
    }return Yt;
  }function Ee(Qt, Kt) {
    for (var Jt = [], Yt = Qt, Zt = Qt === window ? window : Qt.getRootNode(); Yt;) {
      Jt.push(Yt), Yt = Yt.assignedSlot ? Yt.assignedSlot : Yt.nodeType === Node.DOCUMENT_FRAGMENT_NODE && Yt.host && (Kt || Yt !== Zt) ? Yt.host : Yt.parentNode;
    }return Jt[Jt.length - 1] === document && Jt.push(window), Jt;
  }function Se(Qt, Kt) {
    if (!t) return Qt;var Jt = Ee(Qt, !0),
        Yt = Kt;for (var $t, eo, to, oo, Zt = 0; Zt < Yt.length; Zt++) {
      if ($t = Yt[Zt], to = $t === window ? window : $t.getRootNode(), to != eo && (oo = Jt.indexOf(to), eo = to), !t(to) || -1 < oo) return $t;
    }
  }function Pe(Qt) {
    var Kt = function Kt(Jt, Yt) {
      var Zt = new Qt(Jt, Yt);return Zt.__composed = Yt && !!Yt.composed, Zt;
    };return u(Kt, Qt), Kt.prototype = Qt.prototype, Kt;
  }function Ce(Qt, Kt, Jt) {
    var Yt = Kt.__handlers && Kt.__handlers[Qt.type] && Kt.__handlers[Qt.type][Jt];if (Yt) for (var _$t2, _Zt2 = 0; _$t2 = Yt[_Zt2]; _Zt2++) {
      if (_$t2.call(Kt, Qt), Qt.__immediatePropagationStopped) return;
    }
  }function Te(Qt) {
    var Kt = Qt.composedPath(),
        Jt;Object.defineProperty(Qt, 'currentTarget', { get: function get() {
        return Jt;
      }, configurable: !0 });for (var Zt = Kt.length - 1; 0 <= Zt; Zt--) {
      if (Jt = Kt[Zt], Ce(Qt, Jt, 'capture'), Qt.__propagationStopped) return;
    }Object.defineProperty(Qt, 'eventPhase', { value: Event.AT_TARGET });var Yt;for (var _Zt3 = 0; _Zt3 < Kt.length; _Zt3++) {
      if (Jt = Kt[_Zt3], (0 === _Zt3 || Jt.shadowRoot && Jt.shadowRoot === Yt) && (Ce(Qt, Jt, 'bubble'), Jt !== window && (Yt = Jt.getRootNode()), Qt.__propagationStopped)) return;
    }
  }function De() {
    for (var Qt in Mt) {
      window.addEventListener(Qt, function (Kt) {
        Kt.__target || (Kt.__target = Kt.target, Kt.__relatedTarget = Kt.relatedTarget, g(Kt, Ot), Te(Kt), Kt.stopImmediatePropagation());
      }, !0);
    }
  }function Oe() {
    window.Event = Rt, window.CustomEvent = xt, window.MouseEvent = It, De();
  }function Me(Qt, Kt, Jt) {
    return { index: Qt, removed: Kt, addedCount: Jt };
  }function Re(Qt, Kt) {
    if (!Qt) throw 'Must provide a host.';if (!Kt) throw 'Not enough arguments.';var Jt = document.createDocumentFragment();return Jt.__proto__ = Ht, Jt._init(Qt), Jt;
  }function xe(Qt) {
    return ge(Qt), W(Qt, 'assignedSlot') || null;
  }function Ie(Qt, Kt) {
    var Jt = Object.getOwnPropertyNames(Kt);for (var Yt = 0; Yt < Jt.length; Yt++) {
      var Zt = Jt[Yt],
          $t = Object.getOwnPropertyDescriptor(Kt, Zt);$t.value ? Qt[Zt] = $t.value : Object.defineProperty(Qt, Zt, $t);
    }
  }function Ae() {
    Ie(window.Node.prototype, qt), Ie(window.Text.prototype, Gt), Ie(window.DocumentFragment.prototype, Bt), Ie(window.Element.prototype, Vt), Ie(window.Document.prototype, Xt);var Qt = document.importNode;if (document.importNode = function (Kt, Jt) {
      return ve(Kt, Jt, Qt);
    }, window.HTMLSlotElement && Ie(window.HTMLSlotElement.prototype, zt), we.hasDescriptors) {
      V(window.Node.prototype), V(window.Text.prototype), V(window.DocumentFragment.prototype), V(window.Element.prototype);var Kt = window.customElements && customElements.nativeHTMLElement || HTMLElement;V(Kt.prototype), V(window.Document.prototype), window.HTMLSlotElement && V(window.HTMLSlotElement.prototype);
    }
  }var we = window.ShadyDOM || {};we.hasNativeShadowDOM = !!(Element.prototype.attachShadow && Node.prototype.getRootNode);var Le = Object.getOwnPropertyDescriptor(Node.prototype, 'firstChild');we.hasDescriptors = !!(Le && Le.configurable && Le.get), we.inUse = we.force || !we.hasNativeShadowDOM;var ke = Element.prototype,
      We = ke.matches || ke.matchesSelector || ke.mozMatchesSelector || ke.msMatchesSelector || ke.oMatchesSelector || ke.webkitMatchesSelector,
      Fe;window.Promise ? Fe = Promise.resolve() : function () {
    var Qt = document.createTextNode(''),
        Kt = 0;Fe = { then: function then(Jt) {
        var Yt = new MutationObserver(function () {
          Yt.disconnect(), Jt();
        });Yt.observe(Qt, { characterData: !0 }), Qt.textContent = Kt++;
      } };
  }();var Ue = window.customElements,
      je = [],
      He,
      qe = 0;N.list = je;var Ge = function () {
    function Ge() {
      _classCallCheck(this, Ge), this._scheduled = !1, this.addedNodes = [], this.removedNodes = [], this.callbacks = new Set();
    }return _createClass(Ge, [{ key: 'schedule', value: function schedule() {
        var _this = this;this._scheduled || (this._scheduled = !0, Fe.then(function () {
          _this.flush();
        }));
      } }, { key: 'flush', value: function flush() {
        var _this2 = this;this._scheduled && function () {
          _this2._scheduled = !1;var Qt = _this2.takeRecords();Qt.length && _this2.callbacks.forEach(function (Kt) {
            Kt(Qt);
          });
        }();
      } }, { key: 'takeRecords', value: function takeRecords() {
        if (this.addedNodes.length || this.removedNodes.length) {
          var Qt = [{ addedNodes: this.addedNodes, removedNodes: this.removedNodes }];return this.addedNodes = [], this.removedNodes = [], Qt;
        }return [];
      } }]), Ge;
  }(),
      Be = function Be(Qt, Kt) {
    Qt.__shady = Qt.__shady || {}, Qt.__shady.observer || (Qt.__shady.observer = new Ge()), Qt.__shady.observer.callbacks.add(Kt);var Jt = Qt.__shady.observer;return { _callback: Kt, _observer: Jt, _node: Qt, takeRecords: function takeRecords() {
        return Jt.takeRecords();
      } };
  },
      ze = function ze(Qt) {
    var Kt = Qt && Qt._observer;Kt && (Kt.callbacks.delete(Qt._callback), !Kt.callbacks.size && (Qt._node.__shady.observer = null));
  },
      Ve = Element.prototype.appendChild,
      Xe = Ve,
      Qe = Element.prototype.insertBefore,
      Ke = Qe,
      Je = Element.prototype.removeChild,
      Ye = Je,
      Ze = Element.prototype.setAttribute,
      $e = Ze,
      et = Element.prototype.removeAttribute,
      tt = et,
      ot = Element.prototype.cloneNode,
      st = ot,
      nt = Document.prototype.importNode,
      rt = nt,
      dt = Element.prototype.addEventListener,
      it = dt,
      at = Element.prototype.removeEventListener,
      lt = at,
      _t = Object.freeze({ appendChild: Xe, insertBefore: Ke, removeChild: Ye, setAttribute: $e, removeAttribute: tt, cloneNode: st, importNode: rt, addEventListener: it, removeEventListener: lt }),
      ht = /[&\u00A0"]/g,
      pt = /[&\u00A0<>]/g,
      ut = S(['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']),
      ct = S(['style', 'script', 'xmp', 'iframe', 'noembed', 'noframes', 'plaintext', 'noscript']),
      gt = document.createTreeWalker(document, NodeFilter.SHOW_ALL, null, !1),
      yt = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT, null, !1),
      Nt = Object.freeze({ parentNode: T, firstChild: D, lastChild: O, previousSibling: function previousSibling(Kt) {
      return gt.currentNode = Kt, gt.previousSibling();
    }, nextSibling: function nextSibling(Kt) {
      return gt.currentNode = Kt, gt.nextSibling();
    }, childNodes: M, parentElement: function parentElement(Kt) {
      return yt.currentNode = Kt, yt.parentNode();
    }, firstElementChild: R, lastElementChild: x, previousElementSibling: I, nextElementSibling: A, children: w, innerHTML: L, textContent: k }),
      mt = new DOMParser(),
      bt = Object.getOwnPropertyDescriptor(Document.prototype, 'activeElement'),
      ft = { parentElement: U('parentElement'), parentNode: U('parentNode'), nextSibling: U('nextSibling'), previousSibling: U('previousSibling'), className: { get: function get() {
        return this.getAttribute('class');
      }, set: function set(Qt) {
        this.setAttribute('class', Qt);
      }, configurable: !0 }, nextElementSibling: { get: function get() {
        if (F(this, 'nextSibling')) {
          for (var Qt = this.nextSibling; Qt && Qt.nodeType !== Node.ELEMENT_NODE;) {
            Qt = Qt.nextSibling;
          }return Qt;
        }return A(this);
      }, configurable: !0 }, previousElementSibling: { get: function get() {
        if (F(this, 'previousSibling')) {
          for (var Qt = this.previousSibling; Qt && Qt.nodeType !== Node.ELEMENT_NODE;) {
            Qt = Qt.previousSibling;
          }return Qt;
        }return I(this);
      }, configurable: !0 } },
      vt = { childNodes: { get: function get() {
        if (F(this, 'firstChild')) {
          if (!this.__shady.childNodes) {
            this.__shady.childNodes = [];for (var Qt = this.firstChild; Qt; Qt = Qt.nextSibling) {
              this.__shady.childNodes.push(Qt);
            }
          }return this.__shady.childNodes;
        }return M(this);
      }, configurable: !0 }, firstChild: U('firstChild'), lastChild: U('lastChild'), textContent: { get: function get() {
        if (F(this, 'firstChild')) {
          var Qt = [];for (var Yt, Kt = 0, Jt = this.childNodes; Yt = Jt[Kt]; Kt++) {
            Yt.nodeType !== Node.COMMENT_NODE && Qt.push(Yt.textContent);
          }return Qt.join('');
        }return k(this);
      }, set: function set(Qt) {
        this.nodeType === Node.ELEMENT_NODE ? (q(this), Qt && this.appendChild(document.createTextNode(Qt))) : this.nodeValue = Qt;
      }, configurable: !0 }, firstElementChild: { get: function get() {
        if (F(this, 'firstChild')) {
          for (var Qt = this.firstChild; Qt && Qt.nodeType !== Node.ELEMENT_NODE;) {
            Qt = Qt.nextSibling;
          }return Qt;
        }return R(this);
      }, configurable: !0 }, lastElementChild: { get: function get() {
        if (F(this, 'lastChild')) {
          for (var Qt = this.lastChild; Qt && Qt.nodeType !== Node.ELEMENT_NODE;) {
            Qt = Qt.previousSibling;
          }return Qt;
        }return x(this);
      }, configurable: !0 }, children: { get: function get() {
        return F(this, 'firstChild') ? Array.prototype.filter.call(this.childNodes, function (Qt) {
          return Qt.nodeType === Node.ELEMENT_NODE;
        }) : w(this);
      }, configurable: !0 }, innerHTML: { get: function get() {
        var Qt = 'template' === this.localName ? this.content : this;return F(this, 'firstChild') ? C(Qt) : L(Qt);
      }, set: function set(Qt) {
        var Kt = 'template' === this.localName ? this.content : this;q(Kt);var Jt = mt.parseFromString(Qt, 'text/html');Jt.head && H(Kt, Jt.head), Jt.body && H(Kt, Jt.body);
      }, configurable: !0 } },
      Et = { shadowRoot: { get: function get() {
        return this.shadyRoot;
      }, set: function set(Qt) {
        this.shadyRoot = Qt;
      }, configurable: !0 } },
      St = { activeElement: { get: function get() {
        return B(this);
      }, set: function set() {}, configurable: !0 } },
      Pt = we.hasDescriptors ? function () {} : function (Qt) {
    Qt.__shady && Qt.__shady.__outsideAccessors || (Qt.__shady = Qt.__shady || {}, Qt.__shady.__outsideAccessors = !0, z(Qt, ft, !0));
  },
      Ct = we.hasDescriptors ? function () {} : function (Qt) {
    Qt.__shady && Qt.__shady.__insideAccessors || (Qt.__shady = Qt.__shady || {}, Qt.__shady.__insideAccessors = !0, z(Qt, vt, !0), z(Qt, Et, !0));
  },
      Tt = function Tt(Qt) {
    if (!F(Qt, 'firstChild')) {
      Qt.__shady = Qt.__shady || {}, Qt.__shady.firstChild = D(Qt), Qt.__shady.lastChild = O(Qt), Ct(Qt);var Kt = Qt.__shady.childNodes = M(Qt);for (var Yt, Jt = 0; Jt < Kt.length && (Yt = Kt[Jt]); Jt++) {
        Yt.__shady = Yt.__shady || {}, Yt.__shady.parentNode = Qt, Yt.__shady.nextSibling = Kt[Jt + 1] || null, Yt.__shady.previousSibling = Kt[Jt - 1] || null, Pt(Yt);
      }
    }
  },
      Dt = { blur: !0, focus: !0, focusin: !0, focusout: !0, click: !0, dblclick: !0, mousedown: !0, mouseenter: !0, mouseleave: !0, mousemove: !0, mouseout: !0, mouseover: !0, mouseup: !0, wheel: !0, beforeinput: !0, input: !0, keydown: !0, keyup: !0, compositionstart: !0, compositionupdate: !0, compositionend: !0, touchstart: !0, touchend: !0, touchmove: !0, touchcancel: !0, pointerover: !0, pointerenter: !0, pointerdown: !0, pointermove: !0, pointerup: !0, pointercancel: !0, pointerout: !0, pointerleave: !0, gotpointercapture: !0, lostpointercapture: !0, dragstart: !0, drag: !0, dragenter: !0, dragleave: !0, dragover: !0, drop: !0, dragend: !0, DOMActivate: !0, DOMFocusIn: !0, DOMFocusOut: !0, keypress: !0 },
      Ot = { get composed() {
      return this.isTrusted && void 0 === this.__composed && (this.__composed = Dt[this.type]), this.__composed || !1;
    }, composedPath: function composedPath() {
      return this.__composedPath || (this.__composedPath = Ee(this.__target, this.composed)), this.__composedPath;
    }, get target() {
      return Se(this.currentTarget, this.composedPath());
    }, get relatedTarget() {
      return this.__relatedTarget ? (this.__relatedTargetComposedPath || (this.__relatedTargetComposedPath = Ee(this.__relatedTarget, !0)), Se(this.currentTarget, this.__relatedTargetComposedPath)) : null;
    }, stopPropagation: function stopPropagation() {
      Event.prototype.stopPropagation.call(this), this.__propagationStopped = !0;
    }, stopImmediatePropagation: function stopImmediatePropagation() {
      Event.prototype.stopImmediatePropagation.call(this), this.__immediatePropagationStopped = !0, this.__propagationStopped = !0;
    } },
      Mt = { focus: !0, blur: !0 },
      Rt = Pe(window.Event),
      xt = Pe(window.CustomEvent),
      It = Pe(window.MouseEvent),
      At = 0,
      wt = 1,
      Lt = 2,
      kt = 3,
      Wt = { calcEditDistances: function calcEditDistances(Qt, Kt, Jt, Yt, Zt, $t) {
      var eo = $t - Zt + 1,
          to = Jt - Kt + 1,
          oo = Array(eo);for (var so = 0; so < eo; so++) {
        oo[so] = Array(to), oo[so][0] = so;
      }for (var _so = 0; _so < to; _so++) {
        oo[0][_so] = _so;
      }for (var _so2 = 1; _so2 < eo; _so2++) {
        for (var no = 1; no < to; no++) {
          if (this.equals(Qt[Kt + no - 1], Yt[Zt + _so2 - 1])) oo[_so2][no] = oo[_so2 - 1][no - 1];else {
            var ro = oo[_so2 - 1][no] + 1,
                io = oo[_so2][no - 1] + 1;oo[_so2][no] = ro < io ? ro : io;
          }
        }
      }return oo;
    }, spliceOperationsFromEditDistances: function spliceOperationsFromEditDistances(Qt) {
      for (var Kt = Qt.length - 1, Jt = Qt[0].length - 1, Yt = Qt[Kt][Jt], Zt = []; 0 < Kt || 0 < Jt;) {
        if (0 == Kt) {
          Zt.push(Lt), Jt--;continue;
        }if (0 == Jt) {
          Zt.push(kt), Kt--;continue;
        }var $t = Qt[Kt - 1][Jt - 1],
            eo = Qt[Kt - 1][Jt],
            to = Qt[Kt][Jt - 1],
            oo = void 0;oo = eo < to ? eo < $t ? eo : $t : to < $t ? to : $t, oo == $t ? ($t == Yt ? Zt.push(At) : (Zt.push(wt), Yt = $t), Kt--, Jt--) : oo == eo ? (Zt.push(kt), Kt--, Yt = eo) : (Zt.push(Lt), Jt--, Yt = to);
      }return Zt.reverse(), Zt;
    }, calcSplices: function calcSplices(Qt, Kt, Jt, Yt, Zt, $t) {
      var eo = 0,
          to = 0,
          oo,
          so = Math.min(Jt - Kt, $t - Zt);if (0 == Kt && 0 == Zt && (eo = this.sharedPrefix(Qt, Yt, so)), Jt == Qt.length && $t == Yt.length && (to = this.sharedSuffix(Qt, Yt, so - eo)), Kt += eo, Zt += eo, Jt -= to, $t -= to, 0 == Jt - Kt && 0 == $t - Zt) return [];if (Kt == Jt) {
        for (oo = Me(Kt, [], 0); Zt < $t;) {
          oo.removed.push(Yt[Zt++]);
        }return [oo];
      }if (Zt == $t) return [Me(Kt, [], Jt - Kt)];var no = this.spliceOperationsFromEditDistances(this.calcEditDistances(Qt, Kt, Jt, Yt, Zt, $t));oo = void 0;var ro = [],
          io = Kt,
          ao = Zt;for (var lo = 0; lo < no.length; lo++) {
        switch (no[lo]) {case At:
            oo && (ro.push(oo), oo = void 0), io++, ao++;break;case wt:
            oo || (oo = Me(io, [], 0)), oo.addedCount++, io++, oo.removed.push(Yt[ao]), ao++;break;case Lt:
            oo || (oo = Me(io, [], 0)), oo.addedCount++, io++;break;case kt:
            oo || (oo = Me(io, [], 0)), oo.removed.push(Yt[ao]), ao++;}
      }return oo && ro.push(oo), ro;
    }, sharedPrefix: function sharedPrefix(Qt, Kt, Jt) {
      for (var Yt = 0; Yt < Jt; Yt++) {
        if (!this.equals(Qt[Yt], Kt[Yt])) return Yt;
      }return Jt;
    }, sharedSuffix: function sharedSuffix(Qt, Kt, Jt) {
      for (var Yt = Qt.length, Zt = Kt.length, $t = 0; $t < Jt && this.equals(Qt[--Yt], Kt[--Zt]);) {
        $t++;
      }return $t;
    }, calculateSplices: function calculateSplices(Qt, Kt) {
      return this.calcSplices(Qt, 0, Qt.length, Kt, 0, Kt.length);
    }, equals: function equals(Qt, Kt) {
      return Qt === Kt;
    } },
      Ft = function Ft(Qt, Kt) {
    return Wt.calculateSplices(Qt, Kt);
  },
      Ut = 'function' == typeof Event ? Event : function (Qt, Kt) {
    Kt = Kt || {};var Jt = document.createEvent('Event');return Jt.initEvent(Qt, !!Kt.bubbles, !!Kt.cancelable), Jt;
  },
      jt = function () {
    function jt(Qt) {
      _classCallCheck(this, jt), this.root = Qt, this.insertionPointTag = 'slot';
    }return _createClass(jt, [{ key: 'getInsertionPoints', value: function getInsertionPoints() {
        return this.root.querySelectorAll(this.insertionPointTag);
      } }, { key: 'hasInsertionPoint', value: function hasInsertionPoint() {
        return !!(this.root._insertionPoints && this.root._insertionPoints.length);
      } }, { key: 'isInsertionPoint', value: function isInsertionPoint(Qt) {
        return Qt.localName && Qt.localName == this.insertionPointTag;
      } }, { key: 'distribute', value: function distribute() {
        return this.hasInsertionPoint() ? this.distributePool(this.root, this.collectPool()) : [];
      } }, { key: 'collectPool', value: function collectPool() {
        var Qt = this.root.host,
            Kt = [],
            Jt = 0;for (var Yt = Qt.firstChild; Yt; Yt = Yt.nextSibling) {
          Kt[Jt++] = Yt;
        }return Kt;
      } }, { key: 'distributePool', value: function distributePool(Qt, Kt) {
        var Jt = [],
            Yt = this.root._insertionPoints;for (var eo, Zt = 0, $t = Yt.length; Zt < $t && (eo = Yt[Zt]); Zt++) {
          this.distributeInsertionPoint(eo, Kt);var to = eo.parentNode;to && to.shadyRoot && this.hasInsertionPoint(to.shadyRoot) && Jt.push(to.shadyRoot);
        }for (var _Zt4 = 0; _Zt4 < Kt.length; _Zt4++) {
          var _$t3 = Kt[_Zt4];if (_$t3) {
            _$t3.__shady = _$t3.__shady || {}, _$t3.__shady.assignedSlot = void 0;var _eo = T(_$t3);_eo && Ye.call(_eo, _$t3);
          }
        }return Jt;
      } }, { key: 'distributeInsertionPoint', value: function distributeInsertionPoint(Qt, Kt) {
        var Jt = Qt.__shady.assignedNodes;Jt && this.clearAssignedSlots(Qt, !0), Qt.__shady.assignedNodes = [];var Yt = !1,
            Zt = !1;for (var to, $t = 0, eo = Kt.length; $t < eo; $t++) {
          (to = Kt[$t], !!to) && this.matchesInsertionPoint(to, Qt) && (to.__shady._prevAssignedSlot != Qt && (Yt = !0), this.distributeNodeInto(to, Qt), Kt[$t] = void 0, Zt = !0);
        }if (!Zt) {
          var _$t4 = Qt.childNodes;for (var _to, _eo2 = 0; _eo2 < _$t4.length; _eo2++) {
            _to = _$t4[_eo2], _to.__shady._prevAssignedSlot != Qt && (Yt = !0), this.distributeNodeInto(_to, Qt);
          }
        }if (Jt) {
          for (var _$t5 = 0; _$t5 < Jt.length; _$t5++) {
            Jt[_$t5].__shady._prevAssignedSlot = null;
          }Qt.__shady.assignedNodes.length < Jt.length && (Yt = !0);
        }this.setDistributedNodesOnInsertionPoint(Qt), Yt && this._fireSlotChange(Qt);
      } }, { key: 'clearAssignedSlots', value: function clearAssignedSlots(Qt, Kt) {
        var Jt = Qt.__shady.assignedNodes;if (Jt) for (var Yt = 0; Yt < Jt.length; Yt++) {
          var Zt = Jt[Yt];Kt && (Zt.__shady._prevAssignedSlot = Zt.__shady.assignedSlot), Zt.__shady.assignedSlot === Qt && (Zt.__shady.assignedSlot = null);
        }
      } }, { key: 'matchesInsertionPoint', value: function matchesInsertionPoint(Qt, Kt) {
        var Jt = Kt.getAttribute('name');Jt = Jt ? Jt.trim() : '';var Yt = Qt.getAttribute && Qt.getAttribute('slot');return Yt = Yt ? Yt.trim() : '', Yt == Jt;
      } }, { key: 'distributeNodeInto', value: function distributeNodeInto(Qt, Kt) {
        Kt.__shady.assignedNodes.push(Qt), Qt.__shady.assignedSlot = Kt;
      } }, { key: 'setDistributedNodesOnInsertionPoint', value: function setDistributedNodesOnInsertionPoint(Qt) {
        var Kt = Qt.__shady.assignedNodes;Qt.__shady.distributedNodes = [];for (var Yt, Jt = 0; Jt < Kt.length && (Yt = Kt[Jt]); Jt++) {
          if (this.isInsertionPoint(Yt)) {
            var Zt = Yt.__shady.distributedNodes;if (Zt) for (var _$t6 = 0; _$t6 < Zt.length; _$t6++) {
              Qt.__shady.distributedNodes.push(Zt[_$t6]);
            }
          } else Qt.__shady.distributedNodes.push(Kt[Jt]);
        }
      } }, { key: '_fireSlotChange', value: function _fireSlotChange(Qt) {
        Qt.dispatchEvent(new Ut('slotchange')), Qt.__shady.assignedSlot && this._fireSlotChange(Qt.__shady.assignedSlot);
      } }, { key: 'isFinalDestination', value: function isFinalDestination(Qt) {
        return !Qt.__shady.assignedSlot;
      } }]), jt;
  }(),
      Ht = Object.create(DocumentFragment.prototype);h(Ht, { _init: function _init(Qt) {
      this.__localName = 'ShadyRoot', Tt(Qt), Tt(this), Qt.shadowRoot = this, this.host = Qt, this._renderPending = !1, this._hasRendered = !1, this._changePending = !1, this._distributor = new jt(this), this.update();
    }, update: function update() {
      var _this3 = this;this._renderPending || (this._renderPending = !0, y(function () {
        return _this3.render();
      }));
    }, _getRenderRoot: function _getRenderRoot() {
      for (var Qt = this, Kt = this; Kt;) {
        Kt._renderPending && (Qt = Kt), Kt = Kt._rendererForHost();
      }return Qt;
    }, _rendererForHost: function _rendererForHost() {
      var Qt = this.host.getRootNode();if (t(Qt)) {
        var Kt = this.host.childNodes;for (var Yt, Jt = 0; Jt < Kt.length; Jt++) {
          if (Yt = Kt[Jt], this._distributor.isInsertionPoint(Yt)) return Qt;
        }
      }
    }, render: function render() {
      this._renderPending && this._getRenderRoot()._render();
    }, _render: function _render() {
      this._renderPending = !1, this._changePending = !1, this._skipUpdateInsertionPoints ? !this._hasRendered && (this._insertionPoints = []) : this.updateInsertionPoints(), this._skipUpdateInsertionPoints = !1, this.distribute(), this.compose(), this._hasRendered = !0;
    }, forceRender: function forceRender() {
      this._renderPending = !0, this.render();
    }, distribute: function distribute() {
      var Qt = this._distributor.distribute();for (var Kt = 0; Kt < Qt.length; Kt++) {
        Qt[Kt]._render();
      }
    }, updateInsertionPoints: function updateInsertionPoints() {
      var Qt = this.__insertionPoints;if (Qt) for (var _Jt, _Kt2 = 0; _Kt2 < Qt.length; _Kt2++) {
        _Jt = Qt[_Kt2], _Jt.getRootNode() !== this && this._distributor.clearAssignedSlots(_Jt);
      }Qt = this._insertionPoints = this._distributor.getInsertionPoints();for (var _Jt2, _Kt3 = 0; _Kt3 < Qt.length; _Kt3++) {
        _Jt2 = Qt[_Kt3], _Jt2.__shady = _Jt2.__shady || {}, Tt(_Jt2), Tt(_Jt2.parentNode);
      }
    }, get _insertionPoints() {
      return this.__insertionPoints || this.updateInsertionPoints(), this.__insertionPoints || (this.__insertionPoints = []);
    }, set _insertionPoints(Qt) {
      this.__insertionPoints = Qt;
    }, hasInsertionPoint: function hasInsertionPoint() {
      return this._distributor.hasInsertionPoint();
    }, compose: function compose() {
      this._composeTree();
    }, _composeTree: function _composeTree() {
      this._updateChildNodes(this.host, this._composeNode(this.host));var Qt = this._insertionPoints || [];for (var Yt, Zt, Kt = 0, Jt = Qt.length; Kt < Jt && (Yt = Qt[Kt]); Kt++) {
        Zt = Yt.parentNode, Zt !== this.host && Zt !== this && this._updateChildNodes(Zt, this._composeNode(Zt));
      }
    }, _composeNode: function _composeNode(Qt) {
      var Kt = [],
          Jt = (Qt.shadyRoot || Qt).childNodes;for (var Yt = 0; Yt < Jt.length; Yt++) {
        var Zt = Jt[Yt];if (this._distributor.isInsertionPoint(Zt)) {
          var $t = Zt.__shady.distributedNodes || (Zt.__shady.distributedNodes = []);for (var eo = 0; eo < $t.length; eo++) {
            var to = $t[eo];this.isFinalDestination(Zt, to) && Kt.push(to);
          }
        } else Kt.push(Zt);
      }return Kt;
    }, isFinalDestination: function isFinalDestination(Qt, Kt) {
      return this._distributor.isFinalDestination(Qt, Kt);
    }, _updateChildNodes: function _updateChildNodes(Qt, Kt) {
      var Jt = M(Qt),
          Yt = Ft(Kt, Jt);for (var eo, Zt = 0, $t = 0; Zt < Yt.length && (eo = Yt[Zt]); Zt++) {
        for (var oo, to = 0; to < eo.removed.length && (oo = eo.removed[to]); to++) {
          T(oo) === Qt && Ye.call(Qt, oo), Jt.splice(eo.index + $t, 1);
        }$t -= eo.addedCount;
      }for (var _$t7, _eo3, _Zt5 = 0; _Zt5 < Yt.length && (_$t7 = Yt[_Zt5]); _Zt5++) {
        _eo3 = Jt[_$t7.index];for (var _oo, _to2 = _$t7.index; _to2 < _$t7.index + _$t7.addedCount; _to2++) {
          _oo = Kt[_to2], Ke.call(Qt, _oo, _eo3), Jt.splice(_to2, 0, _oo);
        }
      }
    }, getInsertionPointTag: function getInsertionPointTag() {
      return this._distributor.insertionPointTag;
    } }), function (Kt) {
    z(Kt, vt, !0), z(Kt, St, !0);
  }(Ht);var qt = { addEventListener: function addEventListener(Kt, Jt, Yt) {
      var _this4 = this;if (Jt) {
        var _ret3 = function () {
          var Zt, $t, eo;if ('object' == ('undefined' == typeof Yt ? 'undefined' : _typeof(Yt)) ? (Zt = !!Yt.capture, $t = !!Yt.once, eo = !!Yt.passive) : (Zt = !!Yt, $t = !1, eo = !1), Jt.__eventWrappers) {
            for (var _oo3 = 0; _oo3 < Jt.__eventWrappers.length; _oo3++) {
              if (Jt.__eventWrappers[_oo3].node === _this4 && Jt.__eventWrappers[_oo3].type === Kt && Jt.__eventWrappers[_oo3].capture === Zt && Jt.__eventWrappers[_oo3].once === $t && Jt.__eventWrappers[_oo3].passive === eo) return { v: void 0 };
            }
          } else Jt.__eventWrappers = [];var to = function to(oo) {
            if ($t && this.removeEventListener(Kt, Jt, Yt), oo.__target || (oo.__target = oo.target, oo.__relatedTarget = oo.relatedTarget, g(oo, Ot)), oo.composed || -1 < oo.composedPath().indexOf(this)) return oo.eventPhase === Event.BUBBLING_PHASE && oo.target === oo.relatedTarget ? void oo.stopImmediatePropagation() : Jt(oo);
          };Jt.__eventWrappers.push({ node: _this4, type: Kt, capture: Zt, once: $t, passive: eo, wrapperFn: to }), Mt[Kt] ? (_this4.__handlers = _this4.__handlers || {}, _this4.__handlers[Kt] = _this4.__handlers[Kt] || { capture: [], bubble: [] }, _this4.__handlers[Kt][Zt ? 'capture' : 'bubble'].push(to)) : it.call(_this4, Kt, to, Yt);
        }();if ('object' == ('undefined' == typeof _ret3 ? 'undefined' : _typeof(_ret3))) return _ret3.v;
      }
    }, removeEventListener: function removeEventListener(Kt, Jt, Yt) {
      if (Jt) {
        var _Zt6, _$t8, _eo4;'object' == ('undefined' == typeof Yt ? 'undefined' : _typeof(Yt)) ? (_Zt6 = !!Yt.capture, _$t8 = !!Yt.once, _eo4 = !!Yt.passive) : (_Zt6 = !!Yt, _$t8 = !1, _eo4 = !1);var _to3;if (Jt.__eventWrappers) for (var _oo6 = 0; _oo6 < Jt.__eventWrappers.length; _oo6++) {
          if (Jt.__eventWrappers[_oo6].node === this && Jt.__eventWrappers[_oo6].type === Kt && Jt.__eventWrappers[_oo6].capture === _Zt6 && Jt.__eventWrappers[_oo6].once === _$t8 && Jt.__eventWrappers[_oo6].passive === _eo4) {
            _to3 = Jt.__eventWrappers.splice(_oo6, 1)[0].wrapperFn, Jt.__eventWrappers.length || (Jt.__eventWrappers = void 0);break;
          }
        }if (lt.call(this, Kt, _to3 || Jt, Yt), _to3 && Mt[Kt] && this.__handlers && this.__handlers[Kt]) {
          var _oo5 = this.__handlers[Kt][_Zt6 ? 'capture' : 'bubble'],
              so = _oo5.indexOf(_to3);-1 < so && _oo5.splice(so, 1);
        }
      }
    }, appendChild: function appendChild(Qt) {
      return me(this, Qt);
    }, insertBefore: function insertBefore(Qt, Kt) {
      return me(this, Qt, Kt);
    }, removeChild: function removeChild(Qt) {
      return be(this, Qt);
    }, replaceChild: function replaceChild(Qt, Kt) {
      return this.insertBefore(Qt, Kt), this.removeChild(Kt), Qt;
    }, cloneNode: function cloneNode(Qt) {
      return fe(this, Qt);
    }, getRootNode: function getRootNode(Qt) {
      return te(this, Qt);
    }, get isConnected() {
      return document.documentElement.contains(this);
    } },
      Gt = { get assignedSlot() {
      return xe(this);
    } },
      Bt = { querySelector: function querySelector(Qt) {
      var Kt = pe(this, function (Jt) {
        return r(Jt, Qt);
      }, function (Jt) {
        return !!Jt;
      })[0];return Kt || null;
    }, querySelectorAll: function querySelectorAll(Qt) {
      return pe(this, function (Kt) {
        return r(Kt, Qt);
      });
    } },
      zt = { assignedNodes: function assignedNodes(Qt) {
      if ('slot' === this.localName) return ge(this), this.__shady ? (Qt && Qt.flatten ? this.__shady.distributedNodes : this.__shady.assignedNodes) || [] : [];
    } },
      Vt = h({ setAttribute: function setAttribute(Qt, Kt) {
      ye(this, Qt, Kt);
    }, removeAttribute: function removeAttribute(Qt) {
      Ne(this, Qt);
    }, attachShadow: function attachShadow(Qt) {
      return Re(this, Qt);
    }, get slot() {
      return this.getAttribute('slot');
    }, set slot(Qt) {
      this.setAttribute('slot', Qt);
    }, get assignedSlot() {
      return xe(this);
    } }, Bt, zt);Object.defineProperties(Vt, Et);var Xt = h({}, Bt);Object.defineProperties(Xt, { _activeElement: St.activeElement }), we.inUse && (window.ShadyDOM = { inUse: we.inUse, patch: function patch(Qt) {
      return Qt;
    }, isShadyRoot: t, enqueue: y, flush: N, settings: we, filterMutations: b, observeChildren: Be, unobserveChildren: ze, nativeMethods: _t, nativeTree: Nt }, Oe(), Ae());
})();
//# sourceMappingURL=shadydom.min.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// minimal template polyfill
(function () {
  var needsTemplate = typeof HTMLTemplateElement === 'undefined';
  // NOTE: Patch document.importNode to work around IE11 bug that
  // casues children of a document fragment imported while
  // there is a mutation observer to not have a parentNode (!?!)
  // This needs to happen *after* patching importNode to fix template cloning
  if (/Trident/.test(navigator.userAgent)) {
    (function () {
      var importNode = document.importNode;
      document.importNode = function () {
        var n = importNode.apply(document, arguments);
        // Copy all children to a new document fragment since
        // this one may be broken
        if (n.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          var f = document.createDocumentFragment();
          f.appendChild(n);
          return f;
        } else {
          return n;
        }
      };
    })();
  }

  // returns true if nested templates cannot be cloned (they cannot be on
  // some impl's like Safari 8)
  var needsCloning = function () {
    if (!needsTemplate) {
      var t = document.createElement('template');
      var t2 = document.createElement('template');
      t2.content.appendChild(document.createElement('div'));
      t.content.appendChild(t2);
      var clone = t.cloneNode(true);
      return clone.content.childNodes.length === 0 || clone.content.firstChild.content.childNodes.length === 0;
    }
  }();

  var TEMPLATE_TAG = 'template';
  var TemplateImpl = function TemplateImpl() {};

  if (needsTemplate) {
    var contentDoc;
    var canDecorate;
    var templateStyle;
    var head;
    var createElement;
    var escapeDataRegExp;

    (function () {
      var escapeReplace = function escapeReplace(c) {
        switch (c) {
          case '&':
            return '&amp;';
          case '<':
            return '&lt;';
          case '>':
            return '&gt;';
          case '\xA0':
            return '&nbsp;';
        }
      };

      var escapeData = function escapeData(s) {
        return s.replace(escapeDataRegExp, escapeReplace);
      };

      contentDoc = document.implementation.createHTMLDocument('template');
      canDecorate = true;
      templateStyle = document.createElement('style');

      templateStyle.textContent = TEMPLATE_TAG + '{display:none;}';

      head = document.head;

      head.insertBefore(templateStyle, head.firstElementChild);

      /**
        Provides a minimal shim for the <template> element.
      */
      TemplateImpl.prototype = Object.create(HTMLElement.prototype);

      /**
        The `decorate` method moves element children to the template's `content`.
        NOTE: there is no support for dynamically adding elements to templates.
      */
      TemplateImpl.decorate = function (template) {
        // if the template is decorated, return fast
        if (template.content) {
          return;
        }
        template.content = contentDoc.createDocumentFragment();
        var child;
        while (child = template.firstChild) {
          template.content.appendChild(child);
        }

        template.cloneNode = function (deep) {
          return TemplateImpl.cloneNode(this, deep);
        };

        // add innerHTML to template, if possible
        // Note: this throws on Safari 7
        if (canDecorate) {
          try {
            Object.defineProperty(template, 'innerHTML', {
              get: function get() {
                var o = '';
                for (var e = this.content.firstChild; e; e = e.nextSibling) {
                  o += e.outerHTML || escapeData(e.data);
                }
                return o;
              },
              set: function set(text) {
                contentDoc.body.innerHTML = text;
                TemplateImpl.bootstrap(contentDoc);
                while (this.content.firstChild) {
                  this.content.removeChild(this.content.firstChild);
                }
                while (contentDoc.body.firstChild) {
                  this.content.appendChild(contentDoc.body.firstChild);
                }
              },
              configurable: true
            });
          } catch (err) {
            canDecorate = false;
          }
        }
        // bootstrap recursively
        TemplateImpl.bootstrap(template.content);
      };

      /**
        The `bootstrap` method is called automatically and "fixes" all
        <template> elements in the document referenced by the `doc` argument.
      */
      TemplateImpl.bootstrap = function (doc) {
        var templates = doc.querySelectorAll(TEMPLATE_TAG);
        for (var i = 0, l = templates.length, t; i < l && (t = templates[i]); i++) {
          TemplateImpl.decorate(t);
        }
      };

      // auto-bootstrapping for main document
      document.addEventListener('DOMContentLoaded', function () {
        TemplateImpl.bootstrap(document);
      });

      // Patch document.createElement to ensure newly created templates have content
      createElement = document.createElement;

      document.createElement = function () {
        'use strict';

        var el = createElement.apply(document, arguments);
        if (el.localName === 'template') {
          TemplateImpl.decorate(el);
        }
        return el;
      };

      escapeDataRegExp = /[&\u00A0<>]/g;
    })();
  }

  // make cloning/importing work!
  if (needsTemplate || needsCloning) {
    // NOTE: we rely on this cloneNode not causing element upgrade.
    // This means this polyfill must load before the CE polyfill and
    // this would need to be re-worked if a browser supports native CE
    // but not <template>.
    var nativeCloneNode = Node.prototype.cloneNode;

    TemplateImpl.cloneNode = function (template, deep) {
      var clone = nativeCloneNode.call(template, false);
      // NOTE: decorate doesn't auto-fix children because they are already
      // decorated so they need special clone fixup.
      if (this.decorate) {
        this.decorate(clone);
      }
      if (deep) {
        // NOTE: use native clone node to make sure CE's wrapped
        // cloneNode does not cause elements to upgrade.
        clone.content.appendChild(nativeCloneNode.call(template.content, true));
        // now ensure nested templates are cloned correctly.
        this.fixClonedDom(clone.content, template.content);
      }
      return clone;
    };

    // Given a source and cloned subtree, find <template>'s in the cloned
    // subtree and replace them with cloned <template>'s from source.
    // We must do this because only the source templates have proper .content.
    TemplateImpl.fixClonedDom = function (clone, source) {
      // do nothing if cloned node is not an element
      if (!source.querySelectorAll) return;
      // these two lists should be coincident
      var s$ = source.querySelectorAll(TEMPLATE_TAG);
      var t$ = clone.querySelectorAll(TEMPLATE_TAG);
      for (var i = 0, l = t$.length, t, s; i < l; i++) {
        s = s$[i];
        t = t$[i];
        if (this.decorate) {
          this.decorate(s);
        }
        t.parentNode.replaceChild(s.cloneNode(true), t);
      }
    };

    var originalImportNode = document.importNode;

    // override all cloning to fix the cloned subtree to contain properly
    // cloned templates.
    Node.prototype.cloneNode = function (deep) {
      var dom = nativeCloneNode.call(this, deep);
      // template.content is cloned iff `deep`.
      if (deep) {
        TemplateImpl.fixClonedDom(dom, this);
      }
      return dom;
    };

    // NOTE: we are cloning instead of importing <template>'s.
    // However, the ownerDocument of the cloned template will be correct!
    // This is because the native import node creates the right document owned
    // subtree and `fixClonedDom` inserts cloned templates into this subtree,
    // thus updating the owner doc.
    document.importNode = function (element, deep) {
      if (element.localName === TEMPLATE_TAG) {
        return TemplateImpl.cloneNode(element, deep);
      } else {
        var dom = originalImportNode.call(document, element, deep);
        if (deep) {
          TemplateImpl.fixClonedDom(dom, element);
        }
        return dom;
      }
    };

    if (needsCloning) {
      HTMLTemplateElement.prototype.cloneNode = function (deep) {
        return TemplateImpl.cloneNode(this, deep);
      };
    }
  }

  if (needsTemplate) {
    window.HTMLTemplateElement = TemplateImpl;
  }
})();

/***/ }),
/* 6 */
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

/**
 * This shim allows elements written in, or compiled to, ES5 to work on native
 * implementations of Custom Elements.
 *
 * ES5-style classes don't work with native Custom Elements because the
 * HTMLElement constructor uses the value of `new.target` to look up the custom
 * element definition for the currently called constructor. `new.target` is only
 * set when `new` is called and is only propagated via super() calls. super()
 * is not emulatable in ES5. The pattern of `SuperClass.call(this)`` only works
 * when extending other ES5-style classes, and does not propagate `new.target`.
 *
 * This shim allows the native HTMLElement constructor to work by generating and
 * registering a stand-in class instead of the users custom element class. This
 * stand-in class's constructor has an actual call to super().
 * `customElements.define()` and `customElements.get()` are both overridden to
 * hide this stand-in class from users.
 *
 * In order to create instance of the user-defined class, rather than the stand
 * in, the stand-in's constructor swizzles its instances prototype and invokes
 * the user-defined constructor. When the user-defined constructor is called
 * directly it creates an instance of the stand-in class to get a real extension
 * of HTMLElement and returns that.
 *
 * There are two important constructors: A patched HTMLElement constructor, and
 * the StandInElement constructor. They both will be called to create an element
 * but which is called first depends on whether the browser creates the element
 * or the user-defined constructor is called directly. The variables
 * `browserConstruction` and `userConstruction` control the flow between the
 * two constructors.
 *
 * This shim should be better than forcing the polyfill because:
 *   1. It's smaller
 *   2. All reaction timings are the same as native (mostly synchronous)
 *   3. All reaction triggering DOM operations are automatically supported
 *
 * There are some restrictions and requirements on ES5 constructors:
 *   1. All constructors in a inheritance hierarchy must be ES5-style, so that
 *      they can be called with Function.call(). This effectively means that the
 *      whole application must be compiled to ES5.
 *   2. Constructors must return the value of the emulated super() call. Like
 *      `return SuperClass.call(this)`
 *   3. The `this` reference should not be used before the emulated super() call
 *      just like `this` is illegal to use before super() in ES6.
 *   4. Constructors should not create other custom elements before the emulated
 *      super() call. This is the same restriction as with native custom
 *      elements.
 *
 *  Compiling valid class-based custom elements to ES5 will satisfy these
 *  requirements with the latest version of popular transpilers.
 */
eval("(()=>{const a=window.HTMLElement,b=window.customElements.define,c=window.customElements.get,d=new Map,e=new Map;let f=!1,g=!1;window.HTMLElement=function(){if(!f){const a=d.get(this.constructor),b=c.call(window.customElements,a);g=!0;const e=new b;return e}f=!1},window.HTMLElement.prototype=a.prototype,window.customElements.define=((c,h)=>{const i=h.prototype,j=class extends a{constructor(){super(),Object.setPrototypeOf(this,i),g||(f=!0,h.call(this)),g=!1}},k=j.prototype;j.observedAttributes=h.observedAttributes,k.connectedCallback=i.connectedCallback,k.disconnectedCallback=i.disconnectedCallback,k.attributeChangedCallback=i.attributeChangedCallback,k.adoptedCallback=i.adoptedCallback,d.set(h,c),e.set(c,h),b.call(window.customElements,c,j)}),window.customElements.get=(a=>e.get(a))})();");


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__feature_detection__ = __webpack_require__(10);


var polyfills = [{
    validate: !__WEBPACK_IMPORTED_MODULE_0__feature_detection__["a" /* isCustomElementsNative */](),
    filePath: 'native-shim'
}, {
    validate: __WEBPACK_IMPORTED_MODULE_0__feature_detection__["b" /* isCustomEventNative */](),
    filePath: 'custom-events'
}, {
    validate: __WEBPACK_IMPORTED_MODULE_0__feature_detection__["c" /* isTemplateNative */](),
    filePath: 'template'
}, {
    validate: __WEBPACK_IMPORTED_MODULE_0__feature_detection__["d" /* isFetchNative */](),
    filePath: 'fetch'
}, {
    validate: __WEBPACK_IMPORTED_MODULE_0__feature_detection__["a" /* isCustomElementsNative */](),
    filePath: 'custom-elements'
}, {
    validate: __WEBPACK_IMPORTED_MODULE_0__feature_detection__["e" /* isShadowDOMNative */](),
    filePath: 'shadycss.min'
}, {
    validate: __WEBPACK_IMPORTED_MODULE_0__feature_detection__["e" /* isShadowDOMNative */](),
    filePath: 'shadydom.min'
}];

// preventing from mutation, polyfills object will be available for refering what all polyfills loaded.
Object.freeze(polyfills);

/* harmony default export */ __webpack_exports__["a"] = polyfills;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {var require;/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.0.5
 */

(function (global, factory) {
     true ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

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
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = __webpack_require__(13);
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
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

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

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
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
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
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
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

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

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
  return new Enumerator(this, entries).promise;
}

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
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

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
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

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
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

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
  then: then,

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
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

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

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));
//# sourceMappingURL=es6-promise.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(12)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./custom-elements": 0,
	"./custom-elements.js": 0,
	"./custom-events": 1,
	"./custom-events.js": 1,
	"./fetch": 2,
	"./fetch.js": 2,
	"./native-shim": 6,
	"./native-shim.js": 6,
	"./shadycss.min": 3,
	"./shadycss.min.js": 3,
	"./shadydom.min": 4,
	"./shadydom.min.js": 4,
	"./template": 5,
	"./template.js": 5
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 9;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = isTemplateNative;
/* harmony export (immutable) */ __webpack_exports__["a"] = isCustomElementsNative;
/* harmony export (immutable) */ __webpack_exports__["d"] = isFetchNative;
/* harmony export (immutable) */ __webpack_exports__["b"] = isCustomEventNative;
/* harmony export (immutable) */ __webpack_exports__["e"] = isShadowDOMNative;
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
/* 11 */
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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_es6_promise__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_es6_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_es6_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "polyfills", function() { return __WEBPACK_IMPORTED_MODULE_1__config__["a"]; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ready", function() { return ready; });
/* eslint-disable import/no-dynamic-require, prefer-template, global-require  */



// Polyfill promise before loading other
window.Promise = window.Promise || __WEBPACK_IMPORTED_MODULE_0_es6_promise___default.a.Promise;

/**
 * After pollyfilled
 * add ready class to html element
 * Trigger page ready custom event once polyfills and page level scripts loaded
 */
function polyfillingComplete(polyfilled) {
    var rootEle = document.documentElement;
    rootEle.classList.add('wc-polyfilled');
    return polyfilled;
}

/**
* This will check and polyfil features sent as a param
* @param {array} polyfillFeatures list of features that needs to be polyfilled
* @return {array} array of boolean/promise object which will trigger fulfilled/rejected state
*/
function loadPolyfills(polyfillFeatures) {
    return polyfillFeatures.map(function (item) {
        if (item.validate) return false;

        return new Promise(function (resolve, reject) {
            var filePath = item.filePath;
            /**
             *  this can be further optimized, to load as dynamic chunks
             *  but since HTTP2 support is not widely available
             *  bundling all into one file for now
             */
            try {
                __webpack_require__(9)("./" + filePath);
                resolve(filePath);
            } catch (e) {
                reject(e);
            }
        });
    }).filter(function (valid) {
        return valid;
    });
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
function ready() {
    return Promise.all(loadPolyfills(__WEBPACK_IMPORTED_MODULE_1__config__["a" /* default */])).then(polyfillingComplete).catch(rejectedMessage);
}

ready();



/***/ })
/******/ ]);
});