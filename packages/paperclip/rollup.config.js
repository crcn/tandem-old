// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import uglify from 'rollup-plugin-uglify-es';

export default {
  entry: './src/index.ts',

  plugins: [
    typescript({
      typescript: require('typescript')
    }),
    uglify()
  ]
}