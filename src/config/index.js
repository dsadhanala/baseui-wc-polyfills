import * as feature from '../feature-detection';

const polyfills = [
    {
        validate: !feature.isCustomElementsNative(),
        filePath: 'native-shim'
    },
    {
        validate: feature.isCustomEventNative(),
        filePath: 'custom-events'
    },
    {
        validate: feature.isTemplateNative(),
        filePath: 'template'
    },
    {
        validate: feature.isFetchNative(),
        filePath: 'fetch'
    },
    {
        validate: feature.isCustomElementsNative(),
        filePath: 'custom-elements'
    },
    {
        validate: false, // force loading as safari native implementation was not working
        filePath: 'shadydom.min'
    },
    {
        validate: false, // force loading as safari native implementation was not working
        filePath: 'shadycss.min'
    }
];

// preventing from mutation, polyfills object will be available for refering what all polyfills loaded.
Object.freeze(polyfills);

export default polyfills;
