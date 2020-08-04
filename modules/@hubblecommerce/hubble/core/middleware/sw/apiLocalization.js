import Middleware from './middleware';

Middleware.apiLocalization = function ({ store }) {
    store.commit('modApiResources/setApiLocale', 'de');
};
