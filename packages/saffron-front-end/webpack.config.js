var path = require('path');

module.exports =  {
  entry: {
    'front-end': './src/entry.ts'
  },
  output: {
    path: 'bundle',
    filename: "[name].js"
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, __dirname + '/src')]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.peg', '.ts', '.tsx'],
    modulesDirectories: ['node_modules', 'src', __dirname + '/../']
  },
  watch: process.env.WATCH === '1',
  node: {
    __filename: true
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.(png|jpg|gif|eot|ttf|woff)$/,
        loader: 'url?limit=1000'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.peg$/,
        loader: 'pegjs-loader'
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  }
};
