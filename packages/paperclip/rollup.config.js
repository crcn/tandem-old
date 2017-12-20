// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import uglify from 'rollup-plugin-uglify-es';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: './src/index.ts',
  format: 'umd',
  plugins: [
    resolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      modulesOnly: false,
      extensions: [ '.js'], 
    }),
    commonjs({
        include: ['node_modules/**', '../**'],
        namedExports: {
          'node_modules/source-mutation/index.js': [ 'createStringMutation' ],
          '../slim-dom/index.js': [ 'NodeType', 'pushChildNode', 'CSSRuleType' ],
          '../aerial-browser-sandbox/constants.js': [ 'UPDATE_VALUE_NODE', 'SET_ELEMENT_ATTRIBUTE_EDIT', 'INSERT_CHILD_NODE_EDIT', 'REMOVE_CHILD_NODE_EDIT', 'INSERT_HTML_EDIT', 'CSS_INSERT_CSS_RULE_TEXT', 'CSS_PARENT_DELETE_RULE', 'CSS_STYLE_RULE_SET_SELECTOR_TEXT', 'CSS_STYLE_RULE_SET_STYLE_PROPERTY'],
          '../aerial-browser-sandbox/mutation.js': [ 'createInsertHTMLMutation'],
        }
    }),
    uglify(),
    typescript({
      typescript: require('typescript')
    })
  ]
}