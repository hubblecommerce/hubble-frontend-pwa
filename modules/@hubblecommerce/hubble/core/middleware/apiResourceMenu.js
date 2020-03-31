import { datetimeUnixNow } from '@hubblecommerce/hubble/core/utils/datetime'
import Middleware from './middleware'

Middleware.apiResourceMenu = function ({ isHMR, store, error }) {
    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    let _dataMenu = store.getters['modApiMenu/getDataMenu'];

    // check vuex store object first (not empty and same locale)
    if(! _.isEmpty(_dataMenu) ) {
        // check expiry of cachable object
        if(_dataMenu.expires_at_unixtime >= datetimeUnixNow()) {
            return;
        }
    }

    return new Promise((resolve, reject) => {
        store.dispatch(`modApiMenu/${process.env.API_TYPE}GetMenu`, {})
            .then(response => {
                resolve(response);
            })
            .catch(response => {
                error({ statusCode: 401, message: 'API authentication failed' });
                reject(response);
            });
    });
};
