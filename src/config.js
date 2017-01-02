import * as feature from './feature-detection';

const polyfills = [
    {
        validate: feature.isCustomEventNative(),
        filePath: 'custom-events'
    },
    {
        validate: feature.isFetchNative(),
        filePath: 'fetch'
    },
    {
        validate: feature.isTemplateNative(),
        filePath: 'Template'
    },
    {
        validate: feature.isCustomElementsNative(),
        filePath: 'custom-elements'
    }
];

// preventing from mutation, polyfills object will be available for refering what all polyfills loaded.
Object.freeze(polyfills);

export default polyfills;
