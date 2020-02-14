//
// api route middleware dispatching 'modApiResponse' to vuex store
//
// - localization: false
// - cacheable: true      (if response contains 'expires_in')
//
import { datetimeUnixNow } from '@hubblecommerce/hubble/core/utils/datetime'
import Middleware from './middleware'
import axios from 'axios'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.apiAuthenticate = function ({ isHMR, store, error, route }) {

    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    if(process.env.API_TYPE === 'sw') {
        return;
    }

    let _apiAuth = store.getters['modApi/getApiResourcesAuthResponse'];

    // check vuex store object first
    if(! _.isEmpty(_apiAuth)) {

        // check expiry of cachable object
        if(_apiAuth.expires_at_unixtime >= datetimeUnixNow()) {
            return;
        }
    }

    // dispatch to vuex store by promise
    return new Promise((resolve, reject) => {

        if (process.client && process.env.NO_CORS === 'true') {
            store.dispatch('modApi/getServerSideApiAuth', {
                baseUrl: process.env.API_BASE_URL,
                endpoint: process.env.API_ENDPOINT_AUTH,
                clientId: process.env.API_CLIENT_ID,
                clientSecret: process.env.API_CLIENT_SECRET
            })
                .then(response => {
                    resolve('OK');
                })
                .catch(response => {
                    error({ statusCode: 401, message: 'API authentication failed' });
                    resolve('Fail');
                });
        }

        if (process.server || process.env.NO_CORS !== 'true') {

            store.dispatch('modApi/apiResourcesGetAuth')
                .then(response => {
                    resolve('OK');
                })
                .catch(response => {
                    error({ statusCode: 401, message: 'API authentication failed' });
                    resolve('Fail');
                });
        }

    });

};
