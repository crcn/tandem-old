var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        'application' : './src/entry.js'
    },
    output: {
        path: __dirname + '/public',
        filename: '/js/[name].bundle.js',
        sourceMapFilename: '/js/[name].bundle.js.map'
    },
    resolve: {
        modulesDirectories: [__dirname + '/src', 'node_modules', 'bower_components', 'packages'],
        extensions: ['', '.json', '.jsx', '.js']
    },
    publicPath: 'static/',
    lazy: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 500
    },
    node: {
        __filename: true
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'json'
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=1000&prefix=web/static'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'raw!less')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'raw')
            },
            {
                test: /\.json$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'json'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['react', 'es2015', 'stage-1', 'stage-0'],
                    plugins: ['transform-decorators'],
                    ignore: ['buffer']
                }
            }
        ]
    }
};
