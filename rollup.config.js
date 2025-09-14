import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.ts', // Entry point of the package
    output: [
        {
            file: 'dist/index.js', // CommonJS format for Node.js or bundlers that expect require()
            format: 'cjs',
            exports: 'named'
        },
        {
            file: 'dist/index.es.js', // ES Module format for modern bundlers
            format: 'esm'
        }
    ],
    plugins: [
        peerDepsExternal(), // Excludes peer dependencies (like react) from the bundle
        resolve(),          // Helps Rollup find modules in node_modules
        commonjs(),         // Converts CommonJS modules to ES6 modules
        typescript({ useTsconfigDeclarationDir: true }) // Compiles TypeScript and generates types
    ]
};
