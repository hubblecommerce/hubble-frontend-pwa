import Middleware from './middleware'

Middleware.apiLocalization = function ({ app, store }) {
    store.commit('modApiResources/setApiLocale', 'de');
};
