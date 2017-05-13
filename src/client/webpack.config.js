var path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    entry: {
        client: './src/client/index.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname,'..','..', 'dist')
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts?$/, 						  // All ts and tsx files will be process by
                use: [
                    {loader: 'babel-loader'},
                    {loader: 'ts-loader'}
                ], // first babel-loader, then ts-loader
                exclude: /node_modules/
            }, {
                test: /\.js?$/,                          // all js and jsx files will be processed by
                use: [
                    {loader: 'babel-loader'}
                ],
                exclude: /node_modules/
            }
        ]
    }
};