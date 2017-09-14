"use strict";

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

/* eslint-disable */
var ToggleView = (function(_HTMLElement) {
  _inherits(ToggleView, _HTMLElement);

  _createClass(ToggleView, null, [
    {
      key: "observedAttributes",
      get: function get() {
        return ["toggle-view"];
      }
    }
  ]);

  function ToggleView() {
    _classCallCheck(this, ToggleView);

    var _this = _possibleConstructorReturn(
      this,
      (ToggleView.__proto__ || Object.getPrototypeOf(ToggleView)).call(this)
    );

    _this._toggleHandler = _this._toggleHandler.bind(_this);
    return _this;
  }

  _createClass(ToggleView, [
    {
      key: "_toggleHandler",
      value: function _toggleHandler(e) {
        this.toggleView = this.toggleView === "list" ? "table" : "list";
      }
    },
    {
      key: "connectedCallback",
      value: function connectedCallback() {
        this._render();
        this.addEventListener("click", this._toggleHandler);
      }
    },
    {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        this.removeEventListener("click", this._toggleHandler);
      }
    },
    {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === null || oldValue === newValue) return;
        this.toggleView = newValue;
      }
    },
    {
      key: "_render",
      value: function _render() {
        console.info("'toggle-view' rendered from HTML");
      }
    },
    {
      key: "toggleView",
      get: function get() {
        return this.getAttribute("toggle-view");
      },
      set: function set(val) {
        this.setAttribute("toggle-view", val);
      }
    }
  ]);

  return ToggleView;
})(HTMLElement);

window.customElements.define("toggle-view", ToggleView);

/**
 * extend example
 */

var ExtendedToggleView = (function(_ToggleView) {
  _inherits(ExtendedToggleView, _ToggleView);

  _createClass(ExtendedToggleView, null, [
    {
      key: "featuresListTemplate",
      value: function featuresListTemplate(item) {
        return (
          '\n            <article js-result-item role="listitem">\n                <h2 js-result-item-title>' +
          item.name +
          "</h2>\n                <p js-result-item-desc>" +
          item.email +
          "</p>\n            </article>\n        "
        );
      }
    },
    {
      key: "promiseRejected",
      value: function promiseRejected(reason) {
        throw new Error("Promise rejected due to " + reason + ".");
      }
    }
  ]);

  function ExtendedToggleView() {
    _classCallCheck(this, ExtendedToggleView);

    var _this2 = _possibleConstructorReturn(
      this,
      (ExtendedToggleView.__proto__ ||
        Object.getPrototypeOf(ExtendedToggleView))
        .call(this)
    );

    _this2._searchUrl = _this2.getAttribute("data-search-url");
    _this2._maxLength = _this2.getAttribute("data-max-list-length");
    return _this2;
  }

  _createClass(ExtendedToggleView, [
    {
      key: "_getJSONResponse",
      value: function _getJSONResponse(url) {
        return fetch(url)
          .then(function(response) {
            if (response.status >= 200 && response.status < 300) {
              return response;
            }
          })
          .then(function(response) {
            return response.json();
          })
          .then(function(response) {
            return response;
          })
          .catch(this.constructor.promiseRejected);
      }
    },
    {
      key: "_render",
      value: function _render() {
        var _this3 = this;

        var fetchData = this._getJSONResponse(this._searchUrl);

        fetchData.then(function(response) {
          _this3.innerHTML = response
            .filter(function(item, i) {
              return i < _this3._maxLength;
            })
            .map(_this3.constructor.featuresListTemplate)
            .join("");
        });
      }
    }
  ]);

  return ExtendedToggleView;
})(ToggleView);

customElements.define("extended-toggle-view", ExtendedToggleView, {
  extends: "toggle-view"
});

var TestComp = (function(_HTMLElement2) {
  _inherits(TestComp, _HTMLElement2);

  function TestComp() {
    _classCallCheck(this, TestComp);

    return _possibleConstructorReturn(
      this,
      (TestComp.__proto__ || Object.getPrototypeOf(TestComp))
        .apply(this, arguments)
    );
  }

  _createClass(TestComp, [
    {
      key: "connectedCallback",
      value: function connectedCallback() {
        this.innerHTML =
          '\n            <extended-toggle-view toggle-view="table" data-max-list-length="4" data-search-url="https://jsonplaceholder.typicode.com/users">\n            </extended-toggle-view>\n        ';
      }
    }
  ]);

  return TestComp;
})(HTMLElement);

customElements.define("test-comp", TestComp);
