//
// route middleware setting 'apiLocale' to vuex store
//
import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.apiLocalization = function ({ app, store }) {

    // ignore if called from hot module replacement
    // if (isHMR) {
    //     return;
    // }

    // set api locale, if unset or update, if it has changed
    if(store.getters['modApiResources/getApiLocale'] !== app.i18n.locale) {
        store.commit('modApiResources/setApiLocale', app.i18n.locale);
    }

};
