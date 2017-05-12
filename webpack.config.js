var path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts?$/, 						  // All ts and tsx files will be process by
                use: ['babel-loader', 'ts-loader'], // first babel-loader, then ts-loader
                exclude: /node_modules/                   // ignore node_modules
            }, {
                test: /\.js?$/,                          // all js and jsx files will be processed by
                use: 'babel-loader',                   // babel-loader
                exclude: /node_modules/                  // ignore node_modules
            }
        ]
    },
};