const webpack = require('webpack');
const path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;

const { clientConfiguration } = require('universal-webpack');
const settings = require('./universal-webpack-settings');
const base_configuration = require('./webpack.config');

const configuration = clientConfiguration(base_configuration, settings);

const bundleAnalyzerPath = path.resolve(configuration.context, './build/analyzers/bundleAnalyzer');
const visualizerPath = path.resolve(configuration.context, './build/analyzers/visualizer');
const assetsPath = path.resolve(configuration.context, './build/public/assets');
const serverPath = path.resolve(configuration.context, './build/server');

configuration.mode = 'production';

configuration.devtool = 'source-map';
// configuration.devtool = 'hidden-source-map';

configuration.entry.main.push(
  'bootstrap-loader',
  './client/index.entry.js',
);

// the name of each output bundle
configuration.output.filename = '[name].bundle.js';
configuration.output.chunkFilename = '[name].[chunkhash].chunk.js';
//configuration.output.filename = '[name].[chunkhash].bundle.js';
//configuration.output.chunkFilename = '[name].[chunkhash].chunk.js';
//configuration.output.filename = '[name].[hash].bundle.js';
// name of non-entry chunk files
//configuration.output.chunkFilename = '[name].[hash].chunk.js';

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
      styles: {
        name: 'main',
        test: /\.(sa|sc|c)ss$/,
        chunks: 'all',
        enforce: true,
      },
    },
    name: false,
  }
}

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
    // filename: '[name].css',
    filename: '[name]-[contenthash].css',
    // filename: '[name].[hash].css',
    // chunkFilename: '[id].[hash].css',
  }),

  // new UglifyJsPlugin({
  //   cache: false,      // Enable file caching (default: false)
  //   parallel: true,   // Use multi-process parallel running to improve the build speed (default: false)
  //   sourceMap: true, // Use source maps to map error message locations to modules (default: false)
  //   extractComments: false, // Whether comments shall be extracted to a separate file (default: false)
  //   uglifyOptions: {
  //     ecma: 8, // Supported ECMAScript Version (default undefined)
  //     warnings: false, // Display Warnings (default false)
  //     mangle: true, // Enable Name Mangling (default true)
  //     compress: {
  //       passes: 2,  // The maximum number of times to run compress (default: 1)
  //     },
  //     output: {
  //       beautify: false, // whether to actually beautify the output (default true)
  //       comments: false, // true or "all" to preserve all comments, "some" to preserve some (default false)
  //     },
  //     ie8: false, // Enable IE8 Support (default false)
  //     safari10: false, // Enable work around Safari 10/11 bugs in loop scoping and await (default false)
  //   }
  // }),

  // new OptimizeCSSAssetsPlugin({
  //   cssProcessor: require('cssnano'), // cssnano >>> default optimize \ minimize css processor 
  //   cssProcessorOptions: { discardComments: { removeAll: true } }, // defaults to {}
  //   canPrint: true, // indicating if the plugin can print messages to the console (default true)
  // }),

  new ReactLoadablePlugin({
    filename: path.join(configuration.output.path, 'loadable-chunks.json')
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

console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configuration: ', configuration)

export default configuration;
