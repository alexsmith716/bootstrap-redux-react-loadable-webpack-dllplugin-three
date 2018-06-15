const webpack = require('webpack');
const path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const { clientConfiguration } = require('universal-webpack');
const settings = require('./universal-webpack-settings');
//const base_configuration = require('./webpack.config');
const configuration = require('./webpack.config');

// extracted CSS based on the entry
// extract CSS imported by dynamically imported async routes
// async loading
// async chunking

const bundleAnalyzerPath = path.resolve(configuration.context, './build/analyzers/bundleAnalyzer');
const visualizerPath = path.resolve(configuration.context, './build/analyzers/visualizer');
const assetsPath = path.resolve(configuration.context, './build/public/assets');
const serverPath = path.resolve(configuration.context, './build/server');

const groupsOptions = {minSize: 0, minChunks: 1, reuseExistingChunk: true, enforce: true};

configuration.mode = 'production';

configuration.devtool = 'source-map';
// configuration.devtool = 'hidden-source-map';

configuration.stats = {
  // assets: true,
  // cached: true,
  // entrypoints: true,
}

configuration.entry.main.push(
  'bootstrap-loader',
  './client/index.js',
);

//configuration.entry.vendor.push(
//  'jquery',
//  'popper.js',
//  'bootstrap',
//);

// the name of each output bundle
configuration.output.filename = '[name].bundle.js';
configuration.output.chunkFilename = '[name].chunk.js';
// configuration.output.chunkFilename = '[name].[contenthash].chunk.js';
// configuration.output.filename = '[name].[hash].bundle.js';
// configuration.output.chunkFilename = '[name].[hash].chunk.js';

configuration.module.rules.push(
  {
    test: /\.(scss)$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 2,
          sourceMap: true,
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
        }
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: true,
          // sourceMapContents: true
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(configuration.context, 'client/assets/scss/mixins/mixins.scss')
          ],
        },
      },
    ]
  },
  {
    test: /\.(css)$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader : 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          sourceMap: true,
        }
      },
      {
        loader : 'postcss-loader'
      },
    ]
  },
);

configuration.optimization = {
  splitChunks: {
    cacheGroups: {
      // bootstrapVendors: {
      //   test: /jquery|popper\.js|bootstrap/,
      //   name: 'BootstrapVendors',
      //   chunks: 'all',
      //   ...groupsOptions
      // },
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor',
        chunks: 'initial',
      },
      styles: {
        name: 'main',
        test: /\.(sa|sc|c)ss$/,
        chunks: 'all',
        ...groupsOptions
      },
    },
  },
  runtimeChunk: {
    name: 'main',
  }
}
// optimization: {
//   splitChunks: {
//     chunks: 'all',
//     name: false,
//     cacheGroups: {
//       bootstrapVendors: {
//           test: /jquery|popper\.js|bootstrap/,
//           name: 'BootstrapVendors',
//           chunks: 'all',
//           ...groupsOptions
//       },
//       reactVendors: {
//           test: /react/,
//           name: 'ReactVendors',
//           chunks: 'initial',
//           ...groupsOptions
//       },
//       utilsVendors: {
//           test: /prop-types/,
//           name: 'UtilsVendors',
//           chunks: 'all',
//           ...groupsOptions
//       },
//       commons: {
//           test: /babel-runtime/,
//           name: 'Commons',
//           chunks: 'all',
//           ...groupsOptions
//       },
//       main: {
//         name: 'main',
//         test: /\.(sa|sc|c)ss$/,
//         chunks: 'all',
//         ...groupsOptions
//       },
//     }
//   },
//   runtimeChunk: {
//       name: "manifest",
//   }
// },
// configuration.optimization = {
//   splitChunks: {
//     cacheGroups: {
//       main: {
//         name: 'main',
//         test: /\.(sa|sc|c)ss$/,
//         chunks: 'all',
//         enforce: true,
//       },
//     },
//   },
//   // runtimeChunk: true,
//   // runtimeChunk: 'single',
//   // runtimeChunk: 'multiple',
//   // runtimeChunk: {
//   //   // name: entrypoint => `runtimechunk~${entrypoint.name}`
//   //   // name: 'main'
//   // }
// }

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// PLUGINS +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

configuration.plugins.push(

  new CleanWebpackPlugin([bundleAnalyzerPath,visualizerPath,assetsPath,serverPath], { root: configuration.context }),

  new webpack.DefinePlugin({
    'process.env': {
      CLIENT: JSON.stringify(false),
      NODE_ENV  : JSON.stringify('production'),
    },
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false,
    __DLLS__: false,
  }),

  // [Hashes] - Enable Long Term Caching

  // [hash]:
  //    - Returns the build hash. If any portion of the build changes, this changes as well.

  // [chunkhash]:
  //    - Returns an entry chunk-specific hash. 
  //    - Each `entry` defined in the configuration receives a hash of its own. 
  //    - If any portion of the entry changes, the hash will change as well.

  // [contenthash]:
  //    - Returns a hash specific to content
  //    - Calculated by extracted content not by full chunk content
  //    - If you used `chunkhash` for the extracted CSS as well, this would lead to problems ...
  //    -   ... as the code points to the CSS through JavaScript bringing it to the same entry. 
  //    - That means if the application code or CSS changed, it would invalidate both.
  //    - Therefore, instead of `chunkhash`, `contenthash` is generated based on the extracted content

  new MiniCssExtractPlugin({
    //filename: '[name].[contenthash].css',
    filename: '[name].css',
    //chunkFilename: '[id].[hash].css',
  }),

  new UglifyJsPlugin({
    cache: false,      // Enable file caching (default: false)
    parallel: true,   // Use multi-process parallel running to improve the build speed (default: false)
    sourceMap: false, // Use source maps to map error message locations to modules (default: false)
    extractComments: false, // Whether comments shall be extracted to a separate file (default: false)
    uglifyOptions: {
      ecma: 8, // Supported ECMAScript Version (default undefined)
      warnings: false, // Display Warnings (default false)
      mangle: true, // Enable Name Mangling (default true)
      compress: {
        passes: 1,  // The maximum number of times to run compress (default: 1)
      },
      output: {
        beautify: true, // whether to actually beautify the output (default true)
        comments: true, // true or "all" to preserve all comments, "some" to preserve some (default false)
      },
      ie8: false, // Enable IE8 Support (default false)
      safari10: false, // Enable work around Safari 10/11 bugs in loop scoping and await (default false)
    }
  }),

  new OptimizeCSSAssetsPlugin({
    cssProcessor: require('cssnano'), // cssnano >>> default optimize \ minimize css processor 
    cssProcessorOptions: { discardComments: { removeAll: true } }, // defaults to {}
    canPrint: true, // indicating if the plugin can print messages to the console (default true)
  }),

  new ReactLoadablePlugin({
    filename: path.join(configuration.output.path, 'loadable-chunks.json')
  }),

  new SWPrecacheWebpackPlugin({
    cacheId: 'bootstrap-redux-react-loadable-webpack-dllplugin-too',
    filename: 'service-worker.js',
    maximumFileSizeToCacheInBytes: 8388608,

    // Ensure all our static, local assets are cached.
    staticFileGlobs: [path.dirname(configuration.output.path) + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,woff2}'],
    stripPrefix: path.dirname(configuration.output.path),

    directoryIndex: '/',
    verbose: true,
    // navigateFallback: '/index.html'
  }),

  // https://blog.etleap.com/2017/02/02/inspecting-your-webpack-bundle/
  new Visualizer({
    // Relative to the output folder
    filename: '../../analyzers/visualizer/bundle-stats.html'
  }),

  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: '../../analyzers/bundleAnalyzer/client-development.html',
    // analyzerMode: 'server',
    // analyzerPort: 8888,
    // defaultSizes: 'parsed',
    openAnalyzer: false,
    generateStatsFile: false
  }),

);

console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configuration 1: ', configuration)
const configurationClient = clientConfiguration(configuration, settings)

console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configurationClient 2: ', configurationClient)

export default configurationClient;
