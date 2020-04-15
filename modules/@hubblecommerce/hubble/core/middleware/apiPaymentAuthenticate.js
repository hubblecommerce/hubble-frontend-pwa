import { datetimeUnixNow } from '@hubblecommerce/hubble/core/utils/datetime';
import Middleware from './middleware';

Middleware.apiPaymentAuthenticate = function ({ isHMR, store, error }) {
    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    if (process.env.API_TYPE === 'sw') {
        return;
    }

    let _apiAuth = store.getters['modApiPayment/getApiAuthResponse'];

    // check vuex store object first
    if (!_.isEmpty(_apiAuth)) {
        // check expiry of cachable object
        if (_apiAuth.expires_at_unixtime >= datetimeUnixNow()) {
            return;
        }
    }

    return new Promise((resolve, reject) => {
        if (process.client && process.env.NO_CORS === 'true') {
            store
                .dispatch('modApi/getServerSideApiAuth', {
                    baseUrl: process.env.API_PAYMENT_BASE_URL,
                    endpoint: process.env.API_PAYMENT_ENDPOINT_AUTH,
                    clientId: process.env.API_PAYMENT_CLIENT_ID,
                    clientSecret: process.env.API_PAYMENT_CLIENT_SECRET,
                })
                .then(response => {
                    resolve(response);
                })
                .catch(response => {
                    error({ statusCode: 401, message: 'API authentication failed' });
                    resolve(response);
                });
        }

        if (process.server || process.env.NO_CORS !== 'true') {
            store
                .dispatch('modApi/apiPaymentGetAuth', {})
                .then(response => {
                    resolve(response);
                })
                .catch(response => {
                    error({ statusCode: 401, message: 'API authentication failed apiPaymentAuthenticate' });
                    resolve(response);
                });
        }
    });
};
