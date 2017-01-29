/* eslint-disable import/no-dynamic-require, prefer-template, global-require  */
import es6Promise from 'es6-promise';
import polyfills from './config';

// Polyfill promise before loading other
window.Promise = window.Promise || es6Promise.Promise;

/**
 * After pollyfilled
 * add ready class to html element
 * Trigger page ready custom event once polyfills and page level scripts loaded
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
        if (item.validate) return false;

        return new Promise((resolve, reject) => {
            const filePath = item.filePath;
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
    })
    .filter(valid => valid);
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
function ready() {
    return Promise.all(loadPolyfills(polyfills))
        .then(polyfillingComplete)
        .catch(rejectedMessage);
}

ready();

export { polyfills, ready };
