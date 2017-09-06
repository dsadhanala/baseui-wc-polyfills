/* eslint-disable */
const path = require('path');
const commonConfig = require('./webpack.common-config');
const inheritedConfig = commonConfig.inheritedConfig();

module.exports = function() {
    return inheritedConfig;
};
