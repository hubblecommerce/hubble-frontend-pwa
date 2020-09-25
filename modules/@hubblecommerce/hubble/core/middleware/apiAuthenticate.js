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

    let apiAuth = store.getters['modApi/getApiResourcesAuthResponse'];

    // check vuex store object first
    if (!_.isEmpty(apiAuth)) {
        // check expiry of cachable object
        if (apiAuth.expires_at_unixtime >= datetimeUnixNow()) {
            return;
        }
    }

    return new Promise((resolve, reject) => {
        if (process.client && process.env.NO_CORS === 'true') {
            store
                .dispatch('modApi/getServerSideApiAuth', {
                    baseUrl: process.env.API_BASE_URL,
                    endpoint: process.env.API_ENDPOINT_AUTH,
                    clientId: process.env.API_CLIENT_ID,
                    clientSecret: process.env.API_CLIENT_SECRET,
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
                .dispatch('modApi/apiResourcesGetAuth')
                .then(response => {
                    resolve(response);
                })
                .catch(response => {
                    error({ statusCode: 401, message: 'API authentication failed' });
                    resolve(response);
                });
        }
    });
};
