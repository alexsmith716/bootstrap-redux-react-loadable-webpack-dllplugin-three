# bootstrap-redux-react-loadable-webpack-dllplugin-too


### Overview:

App is a continuation of repo 'bootstrap-redux-react-loadable-webpack-dllplugin'.


### Universal-Webpack:

Generates client-side and server-side configuration for Webpack. Enables seamless client-side/server-side Webpack builds.

The server() configuration function takes the client-side Webpack configuration and tunes it a bit for server-side usage (target: "node").

  * target: "web", // enum
  * target: "node", // Node.js via require
  * // the environment in which the bundle should run
  * // changes chunk loading behavior and available modules

  * node webpack will compile for usage in a Node.js-like environment

The server-side bundle (settings.server.output file) is generated from settings.server.input file by Webpack when it's run with the webpack.config.server.babel.js configuration.

OK, compared output of `Universal-Webpack`'s `{ serverConfiguration }` `'./webpack.config.server.production.babel.js'` to this repos output of `{ serverConfiguration }` `'./webpack.config.server.production.babel.js'` and the results are appearing standardized and basically the same. Also, `'universal-webpack'` `{ clientConfiguration }` and `{ serverConfiguration }` are clearly using their own instance of base config `'./webpack.config.js'`. No modification of base config is going on, only client and server using their own instance of it. Also, in `node_modules` > `Universal-Webpack`, I tested builds against modifications to `devtool`. Confidence check on my part. I do though wonder about errors arising from customization to a library/framework.


### DllPlugin:

The DllPlugin and DllReferencePlugin provide means to split bundles in a way that can drastically improve build time performance.

Use the DllPlugin to move code that is changed less often into a separate compilation. This will improve the application's compilation speed.


#### DllPlugin (./webpack/vendor.config.js):

This plugin is used in a separate webpack config exclusively to create a dll-only-bundle (./build/public/assets/dlls/dll__vendor.js). It creates a manifest.json (./webpack/dlls/vendor.json) file, which is used by the DllReferencePlugin (./webpack/helpers.js) >>> (./webpack/dev.config.js) to map dependencies.

Creates a manifest.json (./webpack/dlls/vendor.json) which is written to the given path. It contains mappings from require and import requests, to module ids. It is used by the DllReferencePlugin (./webpack/helpers.js).

Combine this plugin with output.library option to expose (aka, put into the global scope) the dll function.


#### DllReferencePlugin (./webpack/helpers.js):

This plugin is used in the primary webpack config (./webpack/helpers.js) >>> (./webpack/dev.config.js), it references the dll-only-bundle(s) to require pre-built dependencies.

References a dll manifest file to map dependency names to module ids, then requires them as needed using the internal __webpack_require__ function.


#### Points of Interest:

[SourceMapDevToolPlugin:](https://webpack.js.org/plugins/source-map-dev-tool-plugin/)

This plugin enables more fine grained control of source map generation. It is an alternative to the devtool configuration option.