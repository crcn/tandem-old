var webpack           = require("webpack");
var path              = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports =  {
  entry: {
    "sf-front-end": __dirname + "/src/sf-front-end/entry.ts"
  },
  output: {
    path: "lib/sf-front-end/bundle",
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
      "process.env.TESTING": process.env.TESTING === "1"
    })
  ],
  node: {
    __filename: true
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: [
          getModuleDirectory("style-loader"),
          getModuleDirectory("css-loader"),
          getModuleDirectory("sass-loader")
        ].join("!")
      },
      {
        test: /\.(png|jpg|gif|eot|ttf|woff)$/,
        loader: getModuleDirectory("url-loader") + "?limit=1000"
      },
      {
        test: /\.css$/,
        loader: [
          getModuleDirectory("style-loader"),
          getModuleDirectory("css-loader")
        ].join("!")
      },
      {
        test: /\.peg$/,
        loader: getModuleDirectory("pegjs-loader")
      },
      {
        test: /\.tsx?$/,
        loader: getModuleDirectory("ts-loader")
      }
    ]
  }
};

function getModuleDirectory(moduleName) {
  return path.join(__dirname, "node_modules", moduleName);
}
