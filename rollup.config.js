import includePaths from "rollup-plugin-includepaths";
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import pegjs from "rollup-plugin-pegjs";

let includePathOptions = {
    include: {},
    paths: ['out/'],
    external: [],
    extensions: ['.js', '.json']
};
 
export default {
    entry: 'out/tandem-studio/index.js',
    format: 'cjs',
    plugins: [ 
        includePaths(includePathOptions),
        commonjs(),
    ],
};

