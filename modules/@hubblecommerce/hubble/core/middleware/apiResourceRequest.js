import Middleware from './middleware'

Middleware.apiResourceRequest = function ({ isHMR, store, route, error }) {
    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    // skip, if page type is not 'category'
    if(store.state.modApiResources.pageType !== 'category') {
        return;
    }

    return new Promise((resolve, reject) => {
        store.dispatch('modApiRequests/parseRequest', {
            query: route.query
        })
            .then(response => {
                resolve(response);
            })
            .catch(response => {
                error({ statusCode: 401, message: 'API authentication failed' });
                resolve(response);
            });
    });

};
