const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');

exports.lintJavaScript = ({ include, exclude, options }) => ({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include,
        exclude,
        enforce: 'pre',

        loader: 'eslint-loader',
        options,
      },
    ],
  },
});

exports.loadJavaScript = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include,
        exclude,

        loader: 'happypack/loader',
        query: {
          cacheDirectory: true,
        },
      },
    ],
  },
});

exports.extractBundles = bundles => ({
  plugins: bundles.map(bundle => new webpack.optimize.CommonsChunkPlugin(bundle)),
});

exports.minifyJavaScript = () => ({
  plugins: [new BabiliPlugin()],
});
