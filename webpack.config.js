var webpack               = require("webpack");
var path                  = require("path");
var WebpackNotifierPlugin = require('webpack-notifier');
var createVariants = require('parallel-webpack').createVariants;

function createConfig(options) {

  var target = options.entry.target;

  var config = {
    entry: {
      [options.entry.name]: (target === "es5" ? ["babel-polyfill"] : []).concat([
        __dirname + `/src/@tandem/${options.entry.name}/entry.ts`
      ]),
    },
    resolve: {
      alias: {
        'react': 'node_modules/react/dist/react.js',
        'react-dom': 'node_modules/react-dom/dist/react-dom.js'
      }
    },
    output: {
      path: `lib/@tandem/${options.entry.name}/bundle/`,
      filename: "[name].js"
    },
    sassLoader: {
      includePaths: [path.resolve(__dirname, __dirname + "/src")]
    },
    resolve: {
      extensions: ["", ".js", ".jsx", ".ts", ".tsx", ".peg"],
      modulesDirectories: ["src", "node_modules"]
    },
    watch: process.env.WATCH === "1",
    plugins: [
      new webpack.DefinePlugin({
        "process.env.TESTING": process.env.TESTING === "1",

        // required for mongoid-js plugin particularly
        "process.pid": process.pid
      }),
      new WebpackNotifierPlugin({
        alwaysNotify: true
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    node: {
      __filename: true,
      fs: "empty"
    },
    module: {
      loaders: [

        {
          test: /\.(png|jpg|gif|eot|ttf|woff|svg)$/,
          loader: getModuleDirectory("url-loader") + "?limit=1000"
        },
        {
          test: /\.json$/,
          loader: getModuleDirectory("json-loader")
        },
        {
          test: /\.peg$/,
          loader: getModuleDirectory("pegjs-loader")
        },
        {
          test: /\.tsx?$/,
          loader: (target === "es5" ? [getModuleDirectory("babel-loader") + "?presets[]=es2015"] : [])
          .concat(getModuleDirectory("awesome-typescript-loader"))
          .join("!"),
          exclude: __dirname + "/node_modules"
        },
        // {
        //   test: /\.tsx?$/,
        //   loader: getModuleDirectory("tslint-loader")
        // },
        {
          test: /\.scss$/,
          loader: [
            getModuleDirectory("style-loader"),
            getModuleDirectory("css-loader"),
            getModuleDirectory("sass-loader")
          ].join("!")
        },
        {
          test: /\.css$/,
          loader: [
            getModuleDirectory("style-loader"),
            getModuleDirectory("css-loader")
          ].join("!")
        },
      ]
    }
  };

  return config;
}

function getModuleDirectory(moduleName) {
  return path.join(__dirname, "node_modules", moduleName);
}

var variants = {
  entry: [
    { name: "editor" },
    { name: "tether", target: "es5" }
  ]
};


module.exports = createVariants({}, variants, createConfig);
