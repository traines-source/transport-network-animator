const path = require('path');
const LicensePlugin = require('webpack-license-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  devtool: 'inline-source-map',
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
  output: {
    filename: 'network-animator.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new LicensePlugin()
  ],
};