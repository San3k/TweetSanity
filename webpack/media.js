exports.optimImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        include,
        exclude,
        loaders: [
          {
            loader: 'url-loader',
            options,
          },
          {
            loader: 'image-webpack-loader',
            query: {
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              optipng: {
                optimizationLevel: 7,
              },
              gifsicle: {
                interlaced: false,
              },
              mozjpeg: {
                progressive: true,
              },
            },
          },
        ],
      },
    ],
  },
});

exports.loadFonts = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        // Capture eot, ttf, woff, and woff2
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        include,
        exclude,

        use: {
          loader: 'file-loader',
          options,
        },
      },
    ],
  },
});
