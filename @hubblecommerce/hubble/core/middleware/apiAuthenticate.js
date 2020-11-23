import { datetimeUnixNow } from '@hubblecommerce/hubble/core/utils/datetime';
import _ from 'lodash';

export default function ({ isHMR, store, error }) {

  // ignore if called from hot module replacement
  if (isHMR) {
    return;
  }

  if (process.env.API_TYPE === 'sw') {
    return;
  }

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
        console.log("_getResourcesAuth error response: %o", response)
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
