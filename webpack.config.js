var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

console.log("Building " + (debug ? 'debug':'production'));

module.exports = {
    context: path.join(__dirname, './src/frontend'),
    devtool: debug ? "inline-sourcemap" : null,
    entry: {
        index: "./index.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy'],
                }
            }
        ]
    },
    output: {
        path: __dirname + "/public/js",
        filename: "[name].min.js"
    },
    plugins: debug ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
    ]
};
