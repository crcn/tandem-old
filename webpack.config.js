module.exports = {
    entry: "./src/entry.js",
    output: {
        path: __dirname,
        filename: "build/bundle.js"
    },
    resolve: {
      extensions: ["", ".jsx", ".js"]
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel', // 'babel-loader' is also a legal name to reference
              query: {
                presets: ['es2015']
              }
            }
        ]
    }
};
