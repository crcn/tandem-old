This loader allows you use Paperclip files (`*.pc`) in your application code. Here's a basic Webpack example:

```javascript
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.pc$/,
        loader: "paperclip-loader"
      },

      // Required since paperclip-loader emits
      // CSS files
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: ["file-loader"]
      }
    ]
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};

```

Next, you'll need to setup a `pcconfig.json`:



#### Useful Resources

- [Integrations](../../documentation/Integrations)
