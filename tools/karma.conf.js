const babelConfig = require('./.babelrc.json');

module.exports = (config) => {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'chai'],
        files: [
            'dist/blowfish.js',
            'test/browser.js'
        ],
        preprocessors: {
            'test/browser.js': ['webpack']
        },
        reporters: ['dots'],
        browsers: process.env.CI ? ['Firefox'] : ['Chrome', 'Firefox', 'IE', 'Edge'],
        singleRun: true,
        webpack: {
            module: {
                loaders: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: babelConfig
                }]
            }
        },
        webpackMiddleware: {
            noInfo: true
        }
    });
};
