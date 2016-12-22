require("reflect-metadata");

const webpack               = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const cssnext               = require('cssnext');
const { join, dirname }     = require('path');
const { FileCacheProvider } = require('../../out/@tandem/sandbox');

const {
  WATCH,
  SRC_DIR,
  OUT_DIR,
  BASE_DIR,
  NODE_MODULES_DIR,
  OUT_NODE_MODULES_DIR
} = require('../config');


// SANDBOXED=1 tandem component.tsx
const MINIFY      = !!process.env.MINIFY;
const SOURCE_MAPS = !!process.env.SOURCE_MAPS;

const extractCSS = new ExtractTextPlugin('style.css');

const plugins = [
  new webpack.DefinePlugin({

    // required for mongoid-js plugin particularly
    'process.pid': process.pid,
    'process.env.DEV': process.env.DEV,
    'process.env.API_PORT': process.env.API_PORT && JSON.stringify(process.env.API_PORT),
    'process.env.API_HOSTNAME': process.env.API_HOSTNAME && JSON.stringify(process.env.API_HOSTNAME),
    'process.env.API_PROTOCOL': process.env.API_PROTOCOL && JSON.stringify(process.env.API_PROTOCOL)
  }),
  new WebpackNotifierPlugin({
    excludeWarnings: true,
    alwaysNotify: true
  }),
  extractCSS,
];

const SM_QUERY_PARAM = SOURCE_MAPS ? "?sourceMap" : "";

const tsLoaders = [];
const pegLoaders = [];
const loaders = [];

if (SOURCE_MAPS) {
  tsLoaders.push("webpack-tandem-jsx-loader");
}

// does not work
if (MINIFY) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: true,
      output: {
        ascii_only: true
      }
    })
  )

}


const traceurLoader = 'traceur?runtime';

pegLoaders.push(traceurLoader);

loaders.push(
  {
    test: /\.js?$/,

    // TODO - add jsx dataSource loader here
    loader: traceurLoader,
    exclude:  /node_modules/
  }
);

tsLoaders.push('ts-loader' + SM_QUERY_PARAM);
pegLoaders.push('pegjs-loader');

exports.plugins = plugins;

loaders.push(
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
    loader: pegLoaders.join('!')
  },
  {
    test: /\.tsx?$/,

    // TODO - add jsx dataSource loader here
    loader: tsLoaders.join('!'),
    exclude:  /node_modules/
  },
  {
    test: /\.scss$/,
    loader: extractCSS.extract([
      'css-loader' + SM_QUERY_PARAM,
      'sass-loader' + SM_QUERY_PARAM
    ])
  },
  {
    test: /\.css$/,
    loader: extractCSS.extract([
      'css-loader'
    ])
  }
);


exports.config = {
    output: {
      filename: '[name].js',
      path: process.env.PUBLIC_PATH
    },
    sassLoader: {
      includePaths: [SRC_DIR],
      outputStyle: "expanded"
    },
    // devtool: 'eval-source-map',
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
      extensions: ['', '.json', '.ts', '.tsx', '.js', '.jsx', '.peg', '.scss'],
      modulesDirectories: [SRC_DIR, NODE_MODULES_DIR],
      alias: {

        // don't uncomment these -- fudges with tests. Need to decouple tests from these
        // 'react': require.resolve('react/dist/react.js'),
        // 'react-dom': require.resolve('react-dom/dist/react-dom.js'),
        'node-sass': 'null-loader?node-sass',
        'child_process': 'null-loader?child_process',
        'sass.js': 'null-loader?sass.js',
        'mongodb': 'null-loader?mongodb',
        'cluster': 'null-loader?cluster',
        'canvas-prebuilt': 'null-loader?canvas-prebuilt'
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
    node: {
      __dirname: true
    },
    plugins: plugins,
    module: {
      loaders: loaders
    }
  }