const webpack = require('webpack');
const path = require('path');
const LicensePlugin = require('webpack-license-plugin')
const TerserPlugin = require('terser-webpack-plugin');

const defaultConfig = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test:  /\.tsx?$/,
        use: [
          {loader: 'expose-loader', options: { exposes: [{globalName: 'TNA', override: true}]}},
          {loader: 'ts-loader', options: {onlyCompileBundledFiles: true}}
        ],
        include: /src/,
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.ts', '.js' ],
  },
};

module.exports = [
  {
    ...defaultConfig,
    mode: 'development',
    devtool: 'source-map',
    output: {
      filename: 'network-animator.js',
      path: path.resolve(__dirname, 'dist'),
    },
  },
  {
    ...defaultConfig,
    mode: 'production',
    output: {
      filename: 'network-animator.min.js',
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
      minimizer: [new TerserPlugin({
        extractComments: false,
      })],
    },
    plugins: [
      new LicensePlugin({ outputFilename: 'network-animator.LICENSES.json' }),
      new webpack.BannerPlugin({banner: 'https://github.com/traines-source/transport-network-animator MIT License. For vendor licenses, please see network-animator.LICENSES.json'})
    ],
  },
];