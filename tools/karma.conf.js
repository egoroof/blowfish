const browsers = ['Firefox'];

if (!process.env.CI) {
    browsers.push('Chrome');
    switch (process.platform) {
        case 'darwin':
            browsers.push('Safari');
            break;
        case 'win32':
            browsers.push('IE');
            browsers.push('Edge');
            break;
    }
}

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
        browsers: browsers,
        singleRun: true
    });
};
