module.exports = {
    entry: './src/Blowfish.js',
    output: {
        path: './dist',
        filename: 'blowfish.es6.js',
        library: 'Blowfish',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: [['env', {
                    modules: false
                }]]
            }
        }]
    }
};
