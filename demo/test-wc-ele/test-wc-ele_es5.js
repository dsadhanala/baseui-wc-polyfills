'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var markup = '\n    <slot name="title"></slot>\n    <slot></slot>\n    <section class="wrapper" js-result-items></section>\n';

var styles = '\n<style>\n    :host  {\n        display: block;\n    }\n\n    .wrapper {\n      border: 1px solid #ccc;\n      border-radius: 6px;\n      color: #333;\n      cursor: pointer;\n      position: relative;\n    }\n\n    .wrapper:after {\n      content: "view: " attr(view);\n      display: block;\n      background-color: #FFBB33;\n      position: absolute;\n      top: 0;\n      right: 0;\n      padding: 2px 6px;\n      border-top-right-radius: 4px;\n    }\n\n    :host([toggle-view="list"]) .wrapper {\n      margin: 0;\n    }\n\n    :host([toggle-view="list"]) article {\n      display: block;\n      padding: 0 2%;\n    }\n\n    :host([toggle-view="list"]) article:not(:last-child) {\n      border-bottom: 1px solid #ccc;\n    }\n\n    :host([toggle-view="table"]) .wrapper {\n      display: -webkit-box;\n      display: -ms-flexbox;\n      display: flex;\n      -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n    }\n\n    :host([toggle-view="table"]) article {\n      -webkit-box-flex: 1;\n          -ms-flex: 1 0 calc(50% - (4% + 2px));\n              flex: 1 0 calc(50% - (4% + 2px));\n      padding: 0 2%;\n    }\n\n    :host([toggle-view="table"]) article:not(:nth-last-child(-n+2)) {\n      border-bottom: 1px solid #ccc;\n    }\n\n    :host([toggle-view="table"]) article:nth-child(2n+2) {\n      border-left: 1px solid #ccc;\n    }\n\n    h2 {\n      margin: 20px 0 0;\n    }\n\n    p {\n      margin-top: 5px;\n    }\n</style>\n';

var ToggleView = function (_HTMLElement) {
    _inherits(ToggleView, _HTMLElement);

    _createClass(ToggleView, null, [{
        key: 'observedAttributes',
        get: function get() {
            return ['toggle-view'];
        }
    }]);

    function ToggleView() {
        _classCallCheck(this, ToggleView);

        // component template and styles
        var _this = _possibleConstructorReturn(this, (ToggleView.__proto__ || Object.getPrototypeOf(ToggleView)).call(this));

        _this._templateEle = document.createElement('template');
        _this._templateEle.innerHTML = styles + ' ' + markup;

        // create shadowDOM
        if (!_this.shadowRoot) {
            _this.attachShadow({ mode: 'open' });
        }

        // props
        _this._view = _this.getAttribute('toggle-view');
        _this._searchUrl = _this.getAttribute('data-search-url');
        return _this;
    }

    _createClass(ToggleView, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
            this._populateFeatures().then(this._render.bind(this)).catch(this._promiseRejected);
        }
    }, {
        key: 'disconnectedCallback',
        value: function disconnectedCallback() {
            this._wrapper.removeEventListener('click', this._toggleHandler.bind(this));
        }
    }, {
        key: 'attributeChangedCallback',
        value: function attributeChangedCallback(name, oldValue, newValue) {
            this._view = newValue;
        }
    }, {
        key: '_getJSONResponse',
        value: function _getJSONResponse(url) {
            return window.fetch(url).then(function (response) {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                }

                return false;
            }).then(function (response) {
                return response.json();
            }).then(function (response) {
                return response;
            }).catch(this.constructor._promiseRejected);
        }
    }, {
        key: '_populateFeatures',
        value: function _populateFeatures() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var wcFeatures = _this2._getJSONResponse(_this2._searchUrl);

                wcFeatures.then(function (response) {
                    var featuresList = response.articles.map(_this2.constructor._createFeaturesList).join('');
                    _this2._templateEle.content.querySelector('[js-result-items]').innerHTML = featuresList;

                    // resolve promise once template updated
                    resolve();
                }).catch(reject);
            });
        }
    }, {
        key: '_render',
        value: function _render() {
            // polyfill for non-supported browsers
            if (window.ShadyCSS) {
                window.ShadyCSS.prepareTemplate(this._templateEle, 'toggle-view');
                window.ShadyCSS.styleElement(this);
            }

            // add template content to shadowRoot
            this.shadowRoot.appendChild(this._templateEle.content);
            this._wrapper = this.shadowRoot.querySelector('[js-result-items]');
            this._wrapper.setAttribute('view', this.toggleView);

            // attach events after render complete
            this._addEvents();
        }
    }, {
        key: '_addEvents',
        value: function _addEvents() {
            this._wrapper.addEventListener('click', this._toggleHandler.bind(this));
        }
    }, {
        key: '_toggleHandler',
        value: function _toggleHandler() {
            this.toggleView = this._view === 'list' ? 'table' : 'list';
            this._wrapper.setAttribute('view', this.toggleView);
        }
    }, {
        key: 'toggleView',
        get: function get() {
            return this._view;
        },
        set: function set(val) {
            this.setAttribute('toggle-view', val);
        }
    }], [{
        key: '_promiseRejected',
        value: function _promiseRejected(reason) {
            throw new Error('Promise rejected due to ' + reason + '.');
        }
    }, {
        key: '_createFeaturesList',
        value: function _createFeaturesList(item) {
            return '\n        <article>\n            <h2>' + item.title + '</h2>\n            <p>' + item.description + '</p>\n        </article>\n    ';
        }
    }]);

    return ToggleView;
}(HTMLElement);

window.ToggleView = ToggleView;
window.customElements.define('toggle-view', ToggleView);
