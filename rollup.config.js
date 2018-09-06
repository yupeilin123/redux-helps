import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const config = {
  input: 'src/index.js',
  plugins: [],
};

if (env === 'es' || env === 'cjs') {
  config.output = { format: env, indent: false };
  config.external = ['redux-saga/effects'];
  config.plugins.push(
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    })
  )
}

if (env === 'development' || env === 'production') {
  config.output = {
    format: 'umd',
    name: 'redux-helper',
    indent: false,
  };
  config.external = ['redux-saga/effects'];
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