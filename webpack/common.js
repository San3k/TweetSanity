const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    historyApiFallback: true,
    stats: 'none',
    host: '127.17.0.1', // Defaults to `localhost`
    port, // Defaults to 8080
    overlay: {
      errors: true,
      warnings: true,
    },
    // open: true,
    hot: true,
    inline: true,
  },
});

const startRoot = path.resolve(__dirname, '../');
exports.clean = paths => ({
  plugins: [new CleanWebpackPlugin([paths], { root: startRoot })],
});

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);
  return {
    plugins: [new webpack.DefinePlugin(env)],
  };
};

exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});
