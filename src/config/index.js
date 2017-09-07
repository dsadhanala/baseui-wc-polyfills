import {
    isTemplateNative,
    isCustomElementsNative,
    isFetchNative,
    isCustomEventNative,
    isShadowDOMNative
} from '../feature-detection';

/**
 * consumers of the polyfills can choose which one to load by sending config params
 * @param {Boolean} [builtInClassShim=true] shim to help extend built in class when babel transpile customElements as ES5
 * @param {Boolean} [wcPlatform=true] set of platform polyfills that are required for IE11
 * @param {Boolean} [shadowDOM=true] shadyDOM and shadyCSS polyfills
 * @param {Boolean} [customElements=true] customElements polyfill
 * @return {Array} list of polyfills
 */
function getPolyfills({ builtInClassShim = true, wcPlatform = true, shadowDOM = true, customElements = true } = {}) {
    const list = [
        {
            validate: (builtInClassShim) ?  !isCustomElementsNative() : true,
            filePath: 'built-in-class-shim'
        },
        {
            validate: (wcPlatform) ? (isCustomEventNative() || isFetchNative() || isTemplateNative()) : true,
            filePath: 'wc-platform-polyfills'
        },
        {
            validate: (shadowDOM) ? isShadowDOMNative() : true,
            filePath: 'shadow-dom'
        },
        {
            validate: (customElements) ? isCustomElementsNative() : true,
            filePath: 'custom-elements'
        }
    ];

    return list.filter(item => !item.validate);
}

export default getPolyfills;
