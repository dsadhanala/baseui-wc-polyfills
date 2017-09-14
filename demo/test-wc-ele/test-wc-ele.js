/* eslint-disable */
class ToggleView extends HTMLElement {
    static get observedAttributes() {
        return ['toggle-view'];
    }

    constructor() {
        super();
        this._toggleHandler = this._toggleHandler.bind(this);
    }

    get toggleView() {
        return this.getAttribute('toggle-view');;
    }

    set toggleView(val) {
        this.setAttribute('toggle-view', val);
    }

    _toggleHandler(e) {
        this.toggleView = (this.toggleView === 'list') ? 'table' : 'list';
    }

    connectedCallback() {
        this._render();
        this.addEventListener('click', this._toggleHandler);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._toggleHandler);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === null || oldValue === newValue) return;
        this.toggleView = newValue;
    }

    _render() {
        console.info(`'toggle-view' rendered from HTML`);
    }
}

window.customElements.define('toggle-view', ToggleView);

/**
 * extend example
 */
class ExtendedToggleView extends ToggleView {
    static featuresListTemplate(item) {
        return `
            <article js-result-item role="listitem">
                <h2 js-result-item-title>${item.name}</h2>
                <p js-result-item-desc>${item.email}</p>
            </article>
        `;
    }

    static promiseRejected(reason) {
        throw new Error(`Promise rejected due to ${reason}.`);
    }

    constructor() {
        super();
        this._searchUrl = this.getAttribute('data-search-url');
        this._maxLength = this.getAttribute('data-max-list-length');
    }

    _getJSONResponse(url) {
        return fetch(url)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                }
            })
            .then(response => response.json())
            .then(response => response)
            .catch(this.constructor.promiseRejected);
    }

    _render() {
        const fetchData = this._getJSONResponse(this._searchUrl);

        fetchData.then(response => {
            this.innerHTML = response.filter((item, i) => i < this._maxLength).map(this.constructor.featuresListTemplate).join('');
        });
    }
}

customElements.define('extended-toggle-view', ExtendedToggleView, { extends: 'toggle-view' });

class TestComp extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <extended-toggle-view toggle-view="table" data-max-list-length="4" data-search-url="https://jsonplaceholder.typicode.com/users">
            </extended-toggle-view>
        `;
    }
}

customElements.define('test-comp', TestComp);