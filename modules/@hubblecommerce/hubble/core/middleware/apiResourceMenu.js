//
// api route middleware dispatching 'dataMenu' to vuex store
//
import { datetimeUnixNow } from '@hubblecommerce/hubble/core/utils/datetime'
import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.apiResourceMenu = function ({ isHMR, app, store, error }) {

    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    let _dataMenu = store.getters['modApiResources/getDataMenu'];

    // check vuex store object first (not empty and same locale)
    if(! _.isEmpty(_dataMenu) && _dataMenu.locale === app.i18n.locale) {

        // check expiry of cachable object
        if(_dataMenu.expires_at_unixtime >= datetimeUnixNow()) {
            return;
        }
    }

    // dispatch to vuex store by promise
    return new Promise((resolve, reject) => {

        let _outerReject = reject;
        let _outerResolve = resolve;

        store.dispatch('modApiResources/apiGetMenu', {})
            .then(response => {
                _outerResolve('OK');
            })
            .catch(response => {
                error({ statusCode: 401, message: 'API authentication failed' });
                resolve('Fail');
            });
    });

};
