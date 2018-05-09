/* eslint-disable import/no-dynamic-require, prefer-template, global-require  */
// this needs to be imported first to avoid IE11 breaking
import es6Promise from 'es6-promise';
import getPolyfills from './config';

// Polyfill promise before loading others
window.Promise = window.Promise || es6Promise.Promise;

/**
 * This will check and polyfil features sent as a param
 * @param {array} polyfillFeatures list of features that needs to be polyfilled
 * @return {array} array of boolean/promise object which will trigger fulfilled/rejected state
 */
function loadPolyfills(polyfillFeatures) {
    return polyfillFeatures
        .map((item) => {
            if (item.validate) return false;

            const { filePath } = item;

            return new Promise((resolve, reject) => {
                /**
                 *  this can be further optimized, to load as dynamic chunks
                 *  but since HTTP2 support is not widely available
                 *  bundling all into one file for now
                 */
                try {
                    require(`./lib/${filePath}`);
                    resolve(filePath);
                } catch (e) {
                    reject(e);
                }
            });
        })
        .filter(valid => valid);
}

/**
 * After pollyfilled, add ready class to html element
 * @param {Array} polyfilled list of features that are polyfilled
 * @return {Array} polyfilled
 */
function polyfillingComplete(polyfilled) {
    window.requestAnimationFrame(() => {
        const rootEle = document.documentElement;
        rootEle.classList.add('wc-polyfilled');

        window.WebComponents = { ready: true };
        document.dispatchEvent(new CustomEvent('WebComponentsReady', { detail: polyfilled }));
    });

    return polyfilled;
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
export function ready() {
    if (window.WebComponents) return Promise.resolve([]);

    return Promise.all(loadPolyfills(getPolyfills))
        .then(polyfillingComplete)
        .catch(rejectedMessage);
}

ready();

export default ready;
