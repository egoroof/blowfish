module.exports = (config) => {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'chai'],
        files: [
            'dist/blowfish.js',
            'test/common.js',
            'test/browser.js'
        ],
        reporters: ['dots'],
        browsers: process.env.CI ? ['Firefox'] : ['Chrome', 'Firefox', 'IE', 'Edge'],
        singleRun: true
    });
};
