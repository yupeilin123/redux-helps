import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const config = {
  input: 'src/index.js',
  plugins: [],
};

if (env === 'es' || env === 'cjs') {
  config.output = { format: env, indent: false };
  config.external = id => /redux-saga/.test(id) || /@babel\/runtime/.test(id);
  config.plugins.push(
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    })
  );
}

if (env === 'development' || env === 'production') {
  config.output = {
    format: 'umd',
    name: 'redux-helper',
    indent: false,
    globals: {
      '@babel/runtime/helpers/typeof': '_typeof',
      '@babel/runtime/helpers/objectSpread': '_objectSpread',
      '@babel/runtime/helpers/objectWithoutProperties': '_objectWithoutProperties',
      '@babel/runtime/regenerator': '_regeneratorRuntime',
      'redux-saga/effects': 'effects'
    }
  };
  config.external = id => /redux-saga/.test(id) || /@babel\/runtime/.test(id);
  config.plugins.push(
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    })
  );
}

if (env === 'production') {
  config.plugins.push(
    uglify()
  );
}

export default config;