const {resolve} = require('path');
const webpack   = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = {
  entry: {
    entry: ['react-hot-loader/patch', __dirname + '/src/front-end/entry.ts']
  },
  output: {
    path: resolve(__dirname, 'lib', 'front-end'),
    filename: 'entry.bundle.js'
  },
  devServer: {
    hot: false,
    inline: false
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      cluster: 'null-loader?cluster',
      net: 'null-loader?net',
      tls: 'null-loader?tls',
      fs: 'null-loader?fs'
    },
    modules: [
      resolve(__dirname, 'src'),
      resolve(__dirname, 'node_modules')
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css')
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
        use: 'url-loader?limit=1000'
      },
      { 
        test: /\.scss$/, 
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader'   },
            { 
              loader: 'sass-loader',
              options: {
                includePaths: [__dirname + '/src']
              }
            }
          ]
        })
      },
      { 
        test: /\.css$/, 
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader'   }
          ]
        })
      },
    ]
  }
};