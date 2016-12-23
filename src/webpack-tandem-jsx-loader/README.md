This [Webpack](https://webpack.js.org/) loader adds additional information to JSX elements to help Tandem write JSX code. Currently it 
only works with React, but more libraries will be supported soon. 

Here's basic Webpack config example:

```javascript

exports.config = {
  entry: 'src/index.ts',
  output: {
    filename: 'out/index.bundle.js',
  },
  module: {
    loaders: [
      {
        test: /tsx?/,
        loaders: 'webpack-tandem-jsx-loader!ts-loader?sourceMap'
      }
    ]
  }
};

```

#### Setup Checklist

Things that you need to do to your application configuration for this loader to work properly:

- [ ] Turn on source maps for **all loaders** in your webpack config. This usually just means adding `?sourceMap`.
- [ ] Install the proper *source code editor* for Tandem.  




