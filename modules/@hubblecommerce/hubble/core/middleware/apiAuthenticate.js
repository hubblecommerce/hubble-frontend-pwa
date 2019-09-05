//
// api route middleware dispatching 'modApiResponse' to vuex store
//
// - localization: false
// - cacheable: true      (if response contains 'expires_in')
//
import { datetimeUnixNow } from '@hubblecommerce/hubble/core/utils/datetime'
import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.apiAuthenticate = function ({ isHMR, store, error }) {

    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    let _apiAuth = store.getters['modApiResources/getApiAuthResponse'];

    // check vuex store object first
    if(! _.isEmpty(_apiAuth)) {

        // check expiry of cachable object
        if(_apiAuth.expires_at_unixtime >= datetimeUnixNow()) {
            return;
        }
    }

    // dispatch to vuex store by promise
    return new Promise((resolve, reject) => {
        store.dispatch('modApiResources/apiGetAuth', {})
            .then(response => {
                resolve('OK');
            })
            .catch(response => {
                error({ statusCode: 401, message: 'API authentication failed' });
                resolve('Fail');
            });
    });

};
