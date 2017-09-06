const markup = `
    <slot name="title"></slot>
    <slot></slot>
    <section class="wrapper" js-result-items></section>
`;

const styles = `
<style>
    :host  {
        display: block;
    }

    .wrapper {
      border: 1px solid #ccc;
      border-radius: 6px;
      color: #333;
      cursor: pointer;
      position: relative;
    }

    .wrapper:after {
      content: "view: " attr(view);
      display: block;
      background-color: #FFBB33;
      position: absolute;
      top: 0;
      right: 0;
      padding: 2px 6px;
      border-top-right-radius: 4px;
    }

    :host([toggle-view="list"]) .wrapper {
      margin: 0;
    }

    :host([toggle-view="list"]) article {
      display: block;
      padding: 0 2%;
    }

    :host([toggle-view="list"]) article:not(:last-child) {
      border-bottom: 1px solid #ccc;
    }

    :host([toggle-view="table"]) .wrapper {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }

    :host([toggle-view="table"]) article {
      -webkit-box-flex: 1;
          -ms-flex: 1 0 calc(50% - (4% + 2px));
              flex: 1 0 calc(50% - (4% + 2px));
      padding: 0 2%;
    }

    :host([toggle-view="table"]) article:not(:nth-last-child(-n+2)) {
      border-bottom: 1px solid #ccc;
    }

    :host([toggle-view="table"]) article:nth-child(2n+2) {
      border-left: 1px solid #ccc;
    }

    h2 {
      margin: 20px 0 0;
    }

    p {
      margin-top: 5px;
    }
</style>
`;

class ToggleView extends HTMLElement {
    static get observedAttributes() {
        return ['toggle-view'];
    }

    constructor() {
        super();

        // component template and styles
        this._templateEle = document.createElement('template');
        this._templateEle.innerHTML = `${styles} ${markup}`;

        // create shadowDOM
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        // props
        this._view = this.getAttribute('toggle-view');
        this._searchUrl = this.getAttribute('data-search-url');
    }

    connectedCallback() {
        this._populateFeatures()
            .then(this._render.bind(this))
            .catch(this._promiseRejected);
    }

    disconnectedCallback() {
        this._wrapper.removeEventListener('click', this._toggleHandler.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this._view = newValue;
    }

    get toggleView() {
        return this._view;
    }

    set toggleView(val) {
        this.setAttribute('toggle-view', val);
    }

    static _promiseRejected(reason) {
        throw new Error(`Promise rejected due to ${reason}.`);
    }

    _getJSONResponse(url) {
        return window.fetch(url)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                }

                return false;
            })
            .then(response => response.json())
            .then(response => response)
            .catch(this.constructor._promiseRejected);
    }

    static _createFeaturesList(item) {
        return `
        <article>
            <h2>${item.title}</h2>
            <p>${item.description}</p>
        </article>
    `;
    }

    _populateFeatures() {
        return new Promise((resolve, reject) => {
            const wcFeatures = this._getJSONResponse(this._searchUrl);

            wcFeatures.then(
                (response) => {
                    const featuresList = response.articles.map(this.constructor._createFeaturesList).join('');
                    this._templateEle.content.querySelector('[js-result-items]').innerHTML = featuresList;

                    // resolve promise once template updated
                    resolve();
                }
            ).catch(reject);
        });
    }

    _render() {
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

    _addEvents() {
        this._wrapper.addEventListener('click', this._toggleHandler.bind(this));
    }

    _toggleHandler() {
        this.toggleView = (this._view === 'list') ? 'table' : 'list';
        this._wrapper.setAttribute('view', this.toggleView);
    }
}
window.ToggleView = ToggleView;
window.customElements.define('toggle-view', ToggleView);
