/* eslint-disable import/no-dynamic-require, prefer-template, global-require  */
import getPolyfills from './config';

/**
 * After pollyfilled, add ready class to html element
 * @param {Array} polyfilled list of features that are polyfilled
 * @return {Array} polyfilled
 */
function polyfillingComplete(polyfilled) {
    const rootEle = document.documentElement;
    rootEle.classList.add('wc-polyfilled');

    return polyfilled;
}

/**
 * This will check and polyfil features sent as a param
 * @param {array} polyfillFeatures list of features that needs to be polyfilled
 * @return {array} array of boolean/promise object which will trigger fulfilled/rejected state
 */
function loadPolyfills(polyfillFeatures) {
    return polyfillFeatures.map((item) => {
        const filePath = item.filePath;

        return new Promise((resolve, reject) => {
            /**
             *  this can be further optimized, to load as dynamic chunks
             *  but since HTTP2 support is not widely available
             *  bundling all into one file for now
             */
            try {
                require('./lib/' + filePath);
                resolve(filePath);
            } catch (e) {
                reject(e);
            }
        });
    });
}

/**
 * Throw error with reason as message
 * @param {string} reason for the promise failed
 */
function rejectedMessage(reason) {
    throw new Error(`Loading polyfills failed due to ${reason}.`);
}

/**
 * This checks for native features support and initiates polyfills loading
 * once polyfills loaded then starts loading page assets from split chunks
 */
function ready(polyfillsList) {
    const nonSupportedPolyfills = getPolyfills(polyfillsList);

    return Promise.all(loadPolyfills(nonSupportedPolyfills))
        .then(polyfillingComplete)
        .catch(rejectedMessage);
}

export { ready as default, ready };
