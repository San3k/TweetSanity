const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const merge = require('webpack-merge');
const glob = require('glob');
const HappyPack = require('happypack');

const common = require('./webpack/common');
const media = require('./webpack/media');
const scripts = require('./webpack/scripts');
const styles = require('./webpack/styles');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
};

const commonConfig = merge([
  {
    entry: {
      app: ['react-hot-loader/patch', PATHS.app],
    },
    output: {
      path: PATHS.build,
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.jsx', '.js'],
      modules: ['node_modules', PATHS.app],
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
      new webpack.LoaderOptionsPlugin({
        options: {
          eslint: {
            // Fail only on errors
            failOnWarning: false,
            failOnError: true,

            // Toggle autofix
            fix: false,

            // Output to Jenkins compatible XML
            // outputReport: {
            //   filePath: 'checkstyle.xml',
            //   formatter: require('eslint/lib/formatters/checkstyle'),
            // },
          },
        },
      }),
      new HappyPack({
        loaders: ['babel-loader'],
      }),
    ],
  },
  scripts.lintJavaScript({ include: PATHS.app }),
  styles.lintCSS({ include: PATHS.app }),
  media.loadFonts({
    options: {
      name: './fonts/[name].[hash:8].[ext]',
    },
  }),
  scripts.loadJavaScript({ include: PATHS.app }),
  scripts.extractBundles([
    {
      name: 'vendor',
      minChunks: ({ resource }) =>
        resource && resource.indexOf('node_modules') >= 0 && resource.match(/\.(js|jsx)$/),
    },
    {
      name: 'manifest',
      minChunks: Infinity,
    },
  ]),
]);

const productionConfig = merge([
  common.clean(PATHS.build),
  // common.generateSourceMaps({ type: 'source-map' }),
  scripts.minifyJavaScript(),
  styles.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      safe: true,
    },
  }),
  styles.extractCSS({
    use: [
      // {
      //   loader: 'css-loader',
      //   options: {
      //     modules: true,
      //     localIdentName: '[name]__[local]___[hash:base64:5]',
      //     importLoaders: 1,
      //   },
      // },
      'css-loader',
      styles.autoprefix(),
      'sass-loader',
    ],
  }),
  styles.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*`, { nodir: true }),
  }),
  media.optimImages({
    options: {
      limit: 15000,
      name: './img/[name].[hash:8].[ext]',
    },
  }),
  {
    // performance: {
    //   hints: 'warning', // 'error' or false are valid too
    //   maxEntrypointSize: 100000, // in bytes
    //   maxAssetSize: 450000, // in bytes
    // },
    output: {
      chunkFilename: '[name].[chunkhash:8].js',
      filename: '[name].[chunkhash:8].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        favicon: './app/assets/favicon.ico',
        template: './app/index.html',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
    ],
  },
  common.setFreeVariable('process.env.NODE_ENV', 'production'),
]);

const developmentConfig = merge([
  common.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    },
  },
  common.generateSourceMaps({ type: 'cheap-module-source-map' }),
  styles.loadCSS(),
  media.optimImages(),
  {
    plugins: [
      new HtmlWebpackPlugin({
        title: 'My Boilerplate',
        favicon: './app/assets/favicon.ico',
        template: './app/index.html',
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  },
]);

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
};
