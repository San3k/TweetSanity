const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const cssnano = require('cssnano');

exports.lintCSS = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        include,
        exclude,
        enforce: 'pre',

        loader: 'postcss-loader',
        options: {
          plugins: () => [
            require('stylelint')({
              // Ignore node_modules CSS
              ignoreFiles: 'node_modules/**/*.css',
            }),
          ],
        },
      },
    ],
  },
});

exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
});

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        include,
        exclude,

        use: [
          'style-loader',
          // {
          //   loader: 'css-loader',
          //   options: {
          //     modules: true,
          //     localIdentName: '[name]__[local]___[hash:base64:5]',
          //     importLoaders: 1,
          //   },
          // }
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
});

exports.extractCSS = ({ include, exclude, use }) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    filename: '[name].[contenthash:8].css',
  });

  return {
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          include,
          exclude,

          use: plugin.extract({
            use,
            fallback: 'style-loader',
          }),
        },
      ],
    },
    plugins: [plugin],
  };
};

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => [require('autoprefixer')],
  },
});

exports.purifyCSS = ({ paths }) => ({
  plugins: [new PurifyCSSPlugin({ paths })],
});
