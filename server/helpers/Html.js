import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import config from '../config';

// https://reactjs.org/docs/dom-elements.html <<<<<<<<< 'dangerouslySetInnerHTML'

const Html = props => {
  const { assets, content, store , bundles } = props;
  const head = Helmet.renderStatic();

  console.log('>>>>>> HTML.JS > Object.keys(assets.styles): ', Object.keys(assets.styles));
  console.log('>>>>>> HTML.JS > Object.keys(assets.styles).length: ', Object.keys(assets.styles).length);
  console.log('>>>>>> HTML.JS > assets.styles: ', assets.styles);
  console.log('>>>>>> HTML.JS > assets: ', assets);
  console.log('>>>>>> HTML.JS > bundle => bundle: ', bundles.map(bundle => bundle));

  // SERVER OUTPUT BEFORE USING webpack.DllPlugin:

  // DEVELOPMENT -----------------------------------------------------------------------------------------
  // >>>>>> HTML.JS > Object.keys(assets.styles):  []
  // >>>>>> HTML.JS > Object.keys(assets.styles).length:  0
  // >>>>>> HTML.JS > assets.styles:  {}
  // >>>>>> HTML.JS > assets:  { javascript: 
  //    { main: 'http://localhost:3001/assets/main.1477b7d5a2530eebb1a3.js',
  //      vendor: 'http://localhost:3001/assets/vendor.1477b7d5a2530eebb1a3.js',
  //      'vendors-main': 'http://localhost:3001/assets/vendors-main.3afdb594fc0a4022d7da.js',
  //      'vendors-main-vendor': 'http://localhost:3001/assets/vendors-main-vendor.fa7ad64be4f3caa2531d.js',
  //      'vendors-vendor': 'http://localhost:3001/assets/vendors-vendor.558be7861b6e9c645b4b.js' },
  //   styles: {} }

  // PRODUCTION -------------------------------------------------------------------------------------------
  // >>>>>> HTML.JS > Object.keys(assets.styles):  [ 'main' ]
  // >>>>>> HTML.JS > Object.keys(assets.styles).length:  1
  // >>>>>> HTML.JS > assets.styles:  { main: '/assets/main-741466ca48ed79dc2012.css' }
  // >>>>>> HTML.JS > assets:  { javascript: 
  //    { 'vendors-main-vendor': '/assets/vendors-main-vendor.974b806033a7bba944d4.js',
  //      'vendors-vendor': '/assets/vendors-vendor.7cb9126fcebdcdd7a169.js',
  //      'vendors-main': '/assets/vendors-main.2385dc9ef36d5746edc2.js',
  //      vendor: '/assets/vendor.423863f32e02f2f88f2a.js',
  //      main: '/assets/main.423863f32e02f2f88f2a.js' },
  //   styles: { main: '/assets/main-741466ca48ed79dc2012.css' } }


  // SERVER OUTPUT AFTER USING webpack.DllPlugin:

  // DEVELOPMENT -----------------------------------------------------------------------------------------
  // >>>>>> HTML.JS > Object.keys(assets.styles):  []
  // >>>>>> HTML.JS > Object.keys(assets.styles).length:  0
  // >>>>>> HTML.JS > assets.styles:  {}
  // >>>>>> HTML.JS > assets:  { javascript:
  //    { main: 'http://localhost:3001/assets/main.7f61a6be4b116a6181dd.js' },
  //   styles: {} }

  // PRODUCTION -------------------------------------------------------------------------------------------
  // >>>>>> HTML.JS > Object.keys(assets.styles):  [ 'main' ]
  // >>>>>> HTML.JS > Object.keys(assets.styles).length:  1
  // >>>>>> HTML.JS > assets.styles:  { main: '/assets/main.c247e68a49230868eb80.css' }
  // >>>>>> HTML.JS > assets:  { javascript: { main: '/assets/main.0e2c37777b0bf217d730.chunk.js' },
  //   styles: { main: '/assets/main.c247e68a49230868eb80.css' } }


  return (

    <html lang="en-US">

      <head>
        {/* (>>>>>>> META <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<) */}
        {head.base.toComponent()}
        {head.meta.toComponent()}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Election App 2018!" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Election App 2018!" />
        <meta name="theme-color" content="#1E90FF" />

        {/* (>>>>>>> TITLE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<) */}
        {head.title.toComponent()}

        {/* (>>>>>>> LINKS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<) */}
        {head.link.toComponent()}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

        {/* (>>>>>>> SCRIPTS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<) */}
        {head.script.toComponent()}

        {/* (>>>>>>> STYLES - will be physically present only in production with 'WETP' || 'MCEP') */}
        {/* {Object.keys(assets.styles).length > 0 &&
          Object.keys(assets.styles)
            .reverse()
            .map(key => (
              <link
                rel="stylesheet"
                type="text/css"
                key={key}
                href={assets.styles[key]}
              />
            ))} */}

        {assets.styles &&
          Object.keys(assets.styles).map(style => (
            <link
              href={assets.styles[style]}
              key={style}
              media="screen, projection"
              rel="stylesheet"
              type="text/css"
              charSet="UTF-8"
            />
          ))}

        {/* (will be present only in development mode) */}
        {/* {assets.styles && Object.keys(assets.styles).length === 0 ? (
          <style dangerouslySetInnerHTML={{ __html: '#content{display:none}' }} />
        ) : null} */}

      </head>

      <body>

        {/* (>>>>>>> CONTENT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<) */}
        <div id="content" dangerouslySetInnerHTML={{ __html: content }} ></div>

        {/* (>>>>>>> STORE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<) */}
        {store && (
          <script
            dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }}
            charSet="UTF-8"
          ></script>
        )}

        { __DLLS__ === true && console.log(">>>>>>>>>>>>>>> YES __DLLS__ <<<<<<<<<<<<<<<<<<") }
        { __DLLS__ !== true && console.log(">>>>>>>>>>>>>>> NO __DLLS__ <<<<<<<<<<<<<<<<<<") }

        { __DLLS__ && <script key="dlls__vendor" src="/assets/dlls/dll__vendor.js" charSet="UTF-8" /> }

        // It is important that the bundles (loaded modules which have been mapped to bundles) are included before the main bundle,
        // so that they can be loaded by the browser prior to the app rendering.
        {bundles.map(bundle => bundle && <script src={config.assetsPath + bundle.file} key={bundle.id} />)}

        {/* (>>>>>>> JAVASCRIPTS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<) */}
        {assets.javascript && <script src={assets.javascript.main} charSet="UTF-8" />}

        {/*  {Object.keys(assets.javascript).length > 0 &&
          Object.keys(assets.javascript)
            .reverse()
            .map(key => <script key={key} src={assets.javascript[key]} charSet="UTF-8"></script>)} */}

      </body>
    </html>
  );
};

Html.propTypes = {
  assets: PropTypes.shape({ styles: PropTypes.object, javascript: PropTypes.object }),
  content: PropTypes.string,
  store: PropTypes.shape({ getState: PropTypes.func }).isRequired,
  bundles: PropTypes.arrayOf(PropTypes.any),
};

Html.defaultProps = {
  assets: {},
  content: '',
  bundles: [],
};

export default Html;
