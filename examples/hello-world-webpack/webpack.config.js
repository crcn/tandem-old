var HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: "out",
    filename: "index.bundle.js" 
  },
  plugins: [
    new HtmlPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'webpack-tandem-jsx-loader!ts-loader?sourceMap'
      }
    ]
  }
}