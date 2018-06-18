import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import config from '../config';

// https://reactjs.org/docs/dom-elements.html <<<<<<<<< 'dangerouslySetInnerHTML'

const Html = ({
  assets, store, content, bundles
}) => {
  const head = Helmet.renderStatic();

  // console.log('>>>>>> HTML.JS > Object.keys(assets.styles): ', Object.keys(assets.styles));
  // console.log('>>>>>> HTML.JS > Object.keys(assets.styles).length: ', Object.keys(assets.styles).length);
  // console.log('>>>>>> HTML.JS > assets.styles: ', assets.styles);
  // console.log('>>>>>> HTML.JS > assets: ', assets);
  // console.log('>>>>>> HTML.JS > bundle => bundle: ', bundles.map(bundle => bundle));

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

        {/*  { __DLLS__ === true && console.log(">>>>>>>>>>>>>>> YES __DLLS__ <<<<<<<<<<<<<<<<<<") } */}
        {/*  { __DLLS__ !== true && console.log(">>>>>>>>>>>>>>> NO __DLLS__ <<<<<<<<<<<<<<<<<<") } */}

        { __DLLS__ && <script key="dlls__vendor" src="/assets/dlls/dll__vendor.js" charSet="UTF-8" /> }

        {/*  It is important that the bundles (loaded modules which have been mapped to bundles) are included before the main bundle,  */}
        {/*  so that they can be loaded by the browser prior to the app rendering.  */}
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
