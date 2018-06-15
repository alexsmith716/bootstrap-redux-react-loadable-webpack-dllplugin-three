
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import localForage from 'localforage';
import { ReduxAsyncConnect } from 'redux-connect';
import { AppContainer as HotEnabler } from 'react-hot-loader';
import { getStoredState } from 'redux-persist';
import { Provider } from 'react-redux';

import createStore from './redux/create';
import apiClient from '../server/helpers/apiClient';
import routes from './routes';
import isOnline from '../server/utils/isOnline';

import Loadable from 'react-loadable';

const offlinePersistConfig = {
  storage: localForage,
  whitelist: ['auth', 'info']
};

const client = apiClient();
const dest = document.getElementById('content');

console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS <<<<<<<<<<<<<<<<<<<<<<<<<<<');
console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > __DEVTOOLS__ !!!!!: ', __DEVTOOLS__);

(async () => {

  const storedData = await getStoredState(offlinePersistConfig);
  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > storedData: ', storedData);
  const online = await (window.__data ? true : isOnline());

  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > online: ', online);

  const data = !online ? { ...storedData, ...window.__data, online } : { ...window.__data, online };
  const wd = { ...window.__data };
  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > ...window.__data: ', wd);
  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > data: ', data);
  const history = createBrowserHistory();
  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > history: ', history);
  const store = createStore(history, client, data, offlinePersistConfig);
  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > store: ', store);

  const hydrate = _routes => {
    ReactDOM.hydrate(
      <HotEnabler>
        <Provider store={store}>
          <BrowserRouter>
            <ReduxAsyncConnect routes={_routes} helpers={{ client }} />
          </BrowserRouter>
        </Provider>
      </HotEnabler>
      , dest
    );
  };

  await Loadable.preloadReady();
  await hydrate(routes);
  // hydrate(routes);

  if (module.hot) {
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > MODULE.HOT! <<<<<<<<<<<<<<<<<');
    module.hot.accept('./routes', () => {
      hydrate(require('./routes'));
    });
  } else {
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > NO MODULE.HOT! <<<<<<<<<<<<<<');
  }

  if (process.env.NODE_ENV !== 'production') {
    window.React = React;
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > process.env.NODE_ENV === DEV!!!');

    if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-reactroot']) {
      console.error('Server-side React render was discarded.' +
        'Make sure that your initial render does not contain any client-side code.');
    }
  }

  if (__DEVTOOLS__ && !window.devToolsExtension) {
    console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > __DEVTOOLS__ && NO window.devToolsExtension');
    const devToolsDest = document.createElement('div');
    window.document.body.insertBefore(devToolsDest, null);
    const DevTools = require('./containers/DevTools/DevTools');

    ReactDOM.hydrate(
      <Provider store={store} key="provider">
        <DevTools />
      </Provider>,
      devToolsDest
    );
  }

  if (online && !__DEVELOPMENT__ && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        await navigator.serviceWorker.register('/dist/service-worker.js', { scope: '/' });
        console.log('Service worker registered!');
      } catch (error) {
        console.log('Error registering service worker: ', error);
      }

      await navigator.serviceWorker.ready;
      console.log('Service Worker Ready');
    });
  }
})();
