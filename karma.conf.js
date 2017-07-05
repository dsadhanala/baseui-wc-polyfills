var webpack = require('webpack');

module.exports = (config) => {
    config.set({
        frameworks: ['mocha', 'chai'],
        files: [
            './tests-config/index.js'
        ],
        // list of files to exclude
        exclude: [],
        reporters: ['mocha', 'coverage'],
        port: 1919, // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: true,
        autoWatchBatchDelay: 1000,
        // Karma captures browsers, runs the tests and exits
        singleRun: false,
        concurrency: Infinity,
        preprocessors: {
            // preprocess with webpack and sourcemap loader
            './tests-config/index.js': ['webpack', 'sourcemap']
        },
        plugins: [
            'karma-chrome-launcher',
            'karma-chai',
            'karma-mocha',
            'karma-sourcemap-loader',
            'karma-webpack',
            'karma-coverage',
            'karma-mocha-reporter'
        ],
        webpack: {
            // just do inline source maps instead of the default
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        enforce: 'post',
                        use: { loader: 'istanbul-instrumenter-loader', options: { esModules: true } },
                        exclude: /(_test|lib|node_modules)\//
                    }
                ]
            }
        },
        webpackMiddleware: {
            stats: 'errors-only'
        },
        webpackServer: {
            noInfo: true
        },
        // configure the reporter
        coverageReporter: {
            includeAllSources: true,
            fixWebpackSourcePaths: true,
            dir: './coverage/',
            reporters: [
                { type: 'html' },
                { type: 'text' }
            ]
        }
    });
};
