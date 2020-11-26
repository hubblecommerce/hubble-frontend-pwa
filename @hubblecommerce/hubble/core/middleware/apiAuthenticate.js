import { datetimeUnixNow } from '@hubblecommerce/hubble/core/utils/datetime';
import _ from 'lodash';

export default function ({ isHMR, store, error }) {

  // ignore if called from hot module replacement
  if (isHMR) {
    return;
  }

  //
  // API_TYPE: 'sw'
  //
  // don't perform any api authentication
  // when using shopware sales channel api
  if (process.env.API_TYPE === 'sw') {
    return;
  }

  //
  // API_TYPE: 'workhorse'
  //
  // perform api authentication against
  // a single laravel passport oauth server.
  if (process.env.API_TYPE === 'workhorse') {

    //
    // check api auth ...
    let _apiAuth = store.getters['modApi/getApiAuthResponse'];

    // check vuex store object first
    if(! _.isEmpty(_apiAuth)) {

      // check expiry of cachable object
      if(_apiAuth.expires_at_unixtime >= datetimeUnixNow()) {
        return;
      }
    }

    //
    // perform workhorse api auth
    function _getWorkhorseAuth() {
      return new Promise((resolve, reject) => {
        store.dispatch('modApi/apiGetAuth')
        .then(() => {
          resolve('OK');
        })
        .catch(response => {
          reject(response);
        });
      });
    }

    // dispatch to vuex store by promise
    return new Promise((resolve) => {
      Promise.all([_getWorkhorseAuth()])
      .then(() => {
        resolve('OK')
      })
      .catch(() => {
        error({ statusCode: 401, message: 'API authentication failed' });
        resolve('Fail');
      });
    });
  }


  //
  // API_TYPE: 'api'
  //
  // in this (special) case api authentication has to be performed
  // against two different laravel passport oauth servers for:
  //   1. payment api
  //   2. resources api
  // authentication of requests to those api's will be determined
  // by the payload parameter 'apiType' (e.g. 'data', 'payment').

  // assume auth is false
  let _authPaymentOK = false;
  let _authResourcesOK = false;

  //
  // check payment api auth ...
  let _apiAuthPayment = store.getters['modApi/getApiPaymentAuthResponse'];

  // check vuex store object first
  if(! _.isEmpty(_apiAuthPayment)) {

    // check expiry of cachable object
    if(_apiAuthPayment.expires_at_unixtime >= datetimeUnixNow()) {
      _authPaymentOK = true;
    }
  }

  //
  // check resouces api auth ...
  let _apiAuthResources = store.getters['modApi/getApiResourcesAuthResponse'];

  // check vuex store object first
  if(! _.isEmpty(_apiAuthResources)) {

    // check expiry of cachable object
    if(_apiAuthResources.expires_at_unixtime >= datetimeUnixNow()) {
      _authResourcesOK = true;
    }
  }

  // all ok? - fine :)
  if(_authPaymentOK && _authResourcesOK) {
    return;
  }

  //
  // perform payment api auth
  function _getPaymentAuth() {
    return new Promise((resolve, reject) => {
      store.dispatch('modApi/apiPaymentGetAuth')
      .then(() => {
        resolve('OK');
      })
      .catch(response => {
        reject(response);
      });
    });
  }

  //
  // perform resources api auth
  function _getResourcesAuth() {
    return new Promise((resolve, reject) => {
      store.dispatch('modApi/apiResourcesGetAuth')
      .then(() => {
        resolve('OK');
      })
      .catch(response => {
        reject(response);
      });
    });
  }

  // dispatch to vuex store by promise
  return new Promise((resolve) => {
    Promise.all([_getPaymentAuth(), _getResourcesAuth()])
    .then(() => {
      resolve('OK')
    })
    .catch(() => {
      error({ statusCode: 401, message: 'API authentication failed' });
      resolve('Fail');
    });
  });
};
