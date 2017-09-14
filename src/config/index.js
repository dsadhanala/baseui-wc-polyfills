import {
    isTemplateNative,
    isCustomElementsNative,
    isFetchNative,
    isCustomEventNative
} from '../feature-detection';

/**
 * consumers of the polyfills can choose which one to load by sending config params
 * @return {Array} list of polyfills
 */
const getPolyfills = [
    {
        validate: !isCustomElementsNative(),
        filePath: 'built-in-class-shim'
    },
    {
        validate: (isCustomEventNative() || isFetchNative() || isTemplateNative()),
        filePath: 'wc-platform-polyfills'
    },
    {
        validate: isCustomElementsNative(),
        filePath: 'custom-elements'
    }
];

export default getPolyfills;
