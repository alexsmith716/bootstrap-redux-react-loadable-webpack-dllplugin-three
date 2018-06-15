const webpack = require('webpack');
const path = require('path');

const rootPath = path.resolve(__dirname, '..');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {

  // absolute string to the directory that contains the entry files
  // base directory && absolute path, for resolving entry points and loaders
  // By default the current directory is used (./webpack/)
  context: rootPath,

  // point to enter the application. point the application starts executing. If an array all items will be executed
  // A dynamically loaded module is not an entry point.
  // Simple rule: one entry point per HTML page. SPA: one entry point, MPA: multiple entry points.
  // If a string or array of strings is passed, the chunk is named main. 
  // If an object is passed, each key is the name of a chunk, and the value describes the entrypoint for the chunk.
  entry: {
    main: [],
  },

  output: {
    path: path.resolve(rootPath, 'build/public/assets'),
    publicPath: '/assets/',
  },

  module: {

    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          { 
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ]
      },
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'application/font-woff'
        }
      }, 
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'application/octet-stream'
        }
      }, 
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      }, 
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'image/svg+xml'
        }
      },
      // {
      //   test: /\.(ttf|eot|woff|woff2)$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name].[ext]',
      //       },
      //     },
      //   ]
      // },
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx',],
  },

  plugins: [],
};
