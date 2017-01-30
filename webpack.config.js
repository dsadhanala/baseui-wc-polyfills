/* eslint-disable */
const path         = require('path');
const commonConfig = require('./webpack.common-config');

const excludeFromBabel = [
    path.resolve(__dirname, './src/lib/native-shim.js')
];

const inheritedConfig  = commonConfig.inheritedConfig();

module.exports = function () {
    inheritedConfig.module.rules[0].exclude.concat(excludeFromBabel);
    return inheritedConfig;
};
