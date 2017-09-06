import * as feature from '../feature-detection';

/**
 * consumers of the polyfills can choose which one to load by sending config params
 * @param {Boolean} [wcPlatform=true] set of platform polyfills that are required for IE11
 * @param {Boolean} [shadowDOM=true] shadyDOM and shadyCSS polyfills
 * @param {Boolean} [customElements=true] customElements polyfill
 * @return {Array} list of polyfills
 */
function getPolyfills({ wcPlatform = true, shadowDOM = true, customElements = true } = {}) {
    const list = [
        {
            validate: (wcPlatform) ? (feature.isCustomEventNative() || feature.isFetchNative() || feature.isTemplateNative()) : true,
            filePath: 'wc-platform-polyfills'
        },
        {
            validate: (shadowDOM) ? feature.isShadowDOMNative() : true,
            filePath: 'shadow-dom'
        },
        {
            validate: (customElements) ? feature.isCustomElementsNative() : true,
            filePath: 'custom-elements'
        }
    ];

    return list.filter(item => !item.validate);
}

export default getPolyfills;
