/**
 * check for template element native support
 * @return {boolean} return feature available or not
 */
export function isTemplateNative() {
    return 'content' in document.createElement('template');
}

/**
 * check for custom elements native support
 * @return {boolean} return feature available or not
 */
export function isCustomElementsNative() {
    return 'customElements' in window;
}

/**
 * check for fetch native support
 * @return {boolean} return feature available or not
 */
export function isFetchNative() {
    return 'fetch' in window;
}

/**
 * check for CustomEvent native support
 * @return {boolean} return feature available or not
 */
export function isCustomEventNative() {
    return typeof window.CustomEvent === 'function';
}

/**
 * check for shadowDOM native support
 * @return {boolean} return feature available or not
 */
export function isShadowDOMNative() {
    return !!HTMLElement.prototype.attachShadow;
}
