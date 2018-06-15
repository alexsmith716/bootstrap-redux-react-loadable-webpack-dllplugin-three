import axios from 'axios';
import config from '../config';
// baseURL: __SERVER__ ? 'http://localhost:3000' : 'http://localhost:3000'

export default function apiClient(req) {
  const instance = axios.create({
    baseURL: __SERVER__ ? 'http://localhost:3000' : 'http://localhost:3000'
  });

  const cs = __SERVER__ ? '__SERVER__' : '__CLIENT__';
  console.log('> ApiClient.JS || AXIOS > __SERVER__ || __CLIENT__: ', cs);

  if (__SERVER__) {
    console.log('> ApiClient.JS || AXIOS > __SERVER__ !!!!!!!!!!!!!!!!!!!!!!!!!!');
  } else {
    console.log('> ApiClient.JS || AXIOS > __CLIENT__ !!!!!!!!!!!!!!!!!!!!!!!!!!');
  }

  let token;

  instance.setJwtToken = newToken => {
    token = newToken;
  };

  instance.interceptors.request.use(
    conf => {
      if (__SERVER__) {
        console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use1');
        if (req.header('cookie')) {
          conf.headers.Cookie = req.header('cookie');
          console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use2: ', conf.headers.Cookie);
        }
        if (req.header('authorization')) {
          conf.headers.authorization = token || req.header('authorization') || '';
          console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use3: ', conf.headers.authorization);
        }
      }
      console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use1 > conf: ', conf);
      return conf;
    },
    error => {
      console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use4');
      Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    response => {
      console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use5 > response.data: ', response.data);
      return response.data;
    },
    error => {
      console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use6');
      Promise.reject(error.response ? error.response.data : error);
    }
  );

  console.log('> ApiClient.JS || AXIOS > instance: ', instance);

  return instance;
}
