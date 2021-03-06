/* tslint:disable:no-require-imports */
const path = require('path')
const formatter = require('eslint-friendly-formatter')

const resolve = (dir) => {
  return path.join(__dirname, '..', dir)
}
// noinspection JSUnusedGlobalSymbols
module.exports = {
  target: 'node',
  entry: {
    app: ['./src/index.ts'],
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    pathinfo: true,
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@': resolve('src'),
      '~': resolve('lib'),
      '@@': resolve('./'),
      '~~': resolve('./'),
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|ts|vue)/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          formatter,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.ts$/, exclude: /node_modules/, use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader', options: {
              appendTsSuffixTo: [/\.vue$/],
            },
          },

        ],
      },
    ],
  },
}
