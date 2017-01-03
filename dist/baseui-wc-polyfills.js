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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

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
window.customElements && eval("(()=>{const a=window.HTMLElement,b=window.customElements.define,c=window.customElements.get,d=new Map,e=new Map;let f=!1,g=!1;window.HTMLElement=function(){if(!f){const a=d.get(this.constructor),b=c.call(window.customElements,a);g=!0;const e=new b;return e}f=!1},window.HTMLElement.prototype=a.prototype,window.customElements.define=((c,h)=>{const i=h.prototype,j=class extends a{constructor(){super(),Object.setPrototypeOf(this,i),g||(f=!0,h.call(this)),g=!1}},k=j.prototype;j.observedAttributes=h.observedAttributes,k.connectedCallback=i.connectedCallback,k.disconnectedCallback=i.disconnectedCallback,k.attributeChangedCallback=i.attributeChangedCallback,k.adoptedCallback=i.adoptedCallback,d.set(h,c),e.set(c,h),b.call(window.customElements,c,j)}),window.customElements.get=(a=>e.get(a))})();");


/***/ },
/* 1 */
/***/ function(module, exports) {

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

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports) {

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__feature_detection__ = __webpack_require__(8);


var polyfills = [{
    validate: __WEBPACK_IMPORTED_MODULE_0__feature_detection__["a" /* isCustomEventNative */](),
    filePath: 'custom-events'
}, {
    validate: __WEBPACK_IMPORTED_MODULE_0__feature_detection__["b" /* isFetchNative */](),
    filePath: 'fetch'
}, {
    validate: __WEBPACK_IMPORTED_MODULE_0__feature_detection__["c" /* isTemplateNative */](),
    filePath: 'Template'
}, {
    validate: __WEBPACK_IMPORTED_MODULE_0__feature_detection__["d" /* isCustomElementsNative */](),
    filePath: 'custom-elements'
}];

// preventing from mutation, polyfills object will be available for refering what all polyfills loaded.
Object.freeze(polyfills);

/* harmony default export */ exports["a"] = polyfills;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

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
    var vertx = __webpack_require__(11);
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9), __webpack_require__(10)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

var map = {
	"./Template": 1,
	"./Template.js": 1,
	"./custom-elements": 2,
	"./custom-elements.js": 2,
	"./custom-events": 3,
	"./custom-events.js": 3,
	"./fetch": 4,
	"./fetch.js": 4,
	"./native-shim": 0,
	"./native-shim.js": 0
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
webpackContext.id = 7;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["c"] = isTemplateNative;
/* harmony export (immutable) */ exports["d"] = isCustomElementsNative;
/* harmony export (immutable) */ exports["b"] = isFetchNative;
/* harmony export (immutable) */ exports["a"] = isCustomEventNative;
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

/***/ },
/* 9 */
/***/ function(module, exports) {

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


/***/ },
/* 10 */
/***/ function(module, exports) {

var g;

// This works in non-strict mode
g = (function() { return this; })();

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


/***/ },
/* 11 */
/***/ function(module, exports) {

/* (ignored) */

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_es6_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_es6_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_es6_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_native_shim__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_native_shim___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__lib_native_shim__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "polyfills", function() { return __WEBPACK_IMPORTED_MODULE_2__config__["a"]; });
/* harmony export (binding) */ __webpack_require__.d(exports, "ready", function() { return ready; });
/* eslint-disable import/no-dynamic-require, prefer-template, global-require  */




// Polyfill promise before loading other
window.Promise = window.Promise || __WEBPACK_IMPORTED_MODULE_0_es6_promise___default.a.Promise;

/**
 * After pollyfilled
 * add ready class to html element
 * Trigger page ready custom event once polyfills and page level scripts loaded
 */
function polyfillingComplete() {
    var rootEle = document.documentElement;
    rootEle.classList.add('wc-polyfilled');
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
                __webpack_require__(7)("./" + filePath);
                resolve();
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
    return Promise.all(loadPolyfills(__WEBPACK_IMPORTED_MODULE_2__config__["a" /* default */])).then(polyfillingComplete).catch(rejectedMessage);
}



/***/ }
/******/ ]);
});