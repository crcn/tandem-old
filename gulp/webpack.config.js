const webpack               = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const cssnext               = require('cssnext');
const { join, dirname }     = require('path');
const { FileCacheProvider } = require('../out/@tandem/sandbox');

const {
  WATCH,
  SRC_DIR,
  OUT_DIR,
  BASE_DIR,
  NODE_MODULES_DIR
} = require('./config');

// SANDBOXED=1 tandem component.tsx
const SANDBOXED = !!process.env.SANDBOXED;
module.exports = {
    output: {
      filename: '[name].js',
    },
    sassLoader: {
      includePaths: [SRC_DIR],
      outputStyle: "expanded"
    },
    stats: {
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: true,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: false,
      publicPath: false
    },
    resolve: {
      extensions: ['', '.ts', '.tsx', '.js', '.jsx', '.peg', '.scss'],
      modulesDirectories: [SRC_DIR, NODE_MODULES_DIR],
      alias: {
        'react': require.resolve('node_modules/react/dist/react.js'),
        'react-dom': require.resolve('node_modules/react-dom/dist/react-dom.js'),
        'chokidar': 'null-loader?chokidar',
        'detective': 'null-loader?detective',
        'node-sass': 'null-loader?node-sass',
        'mongodb': 'null-loader?mongodb',
        'cluster': 'null-loader?cluster'
      }
    },
    tandem: {
      setup(strategy) {

        strategy.config.sassLoader.importer = (url, prev, done) => {
          strategy.resolve(url, dirname(prev)).then(({ filePath }) => {
            const fileCache = FileCacheProvider.getInstance(strategy.injector);
            fileCache.item(filePath).then((item) => {
              item.read().then((buffer) => {
                done({ file: filePath, contents: String(buffer) });
              }, done);
            }, done);
          }, done);
        }
      }
    },
    ts: {
      transpileOnly: true,
      logLevel: "error"
    },
    watch: !!WATCH,
    plugins: [
      new webpack.DefinePlugin({

        // required for mongoid-js plugin particularly
        'process.pid': process.pid
      }),
      new WebpackNotifierPlugin({
        excludeWarnings: true,
        alwaysNotify: true
      }),
      new ExtractTextPlugin('styles.css')
    ],
    node: {
      __filename: true,
      fs: 'empty',
      Buffer: true
    },
    postcss: () => [cssnext()],
    module: {
      loaders: [
        {
          test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
          loader: 'url-loader?limit=1000'
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.peg$/,
          loader: 'pegjs-loader'
        },
        {
          test: /\.tsx?$/,

          // TODO - add jsx dataSource loader here
          loader: SANDBOXED ? [
            join(__dirname, '/../out/tandem-loader'),
            'ts-loader?sourceMap',
          ].join('!') : 'ts-loader',
          exclude:  /node_modules/
        },
        {
          test: /\.scss$/,
          loader: [
            'style-loader',
            'css-loader?sourceMap',
            'sass-loader?sourceMap=true'
          ].join('!')
        },
        {
          test: /\.css$/,
          loader: [
            'style-loader',
            'css-loader?sourceMap=true'
          ].join('!')
        }
      ]
    }
  }