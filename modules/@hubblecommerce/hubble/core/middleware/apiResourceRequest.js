//
// api route middleware dispatching request related data to vuex store
//
import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.apiResourceRequest = function ({ isHMR, store, route, error }) {

    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    // skip, if page type is not 'category'
    if(store.state.modApiResources.pageType !== 'category') {
        // console.log("middleware api-resource-request NOT running for pageType %s", store.state.modApiResources.pageType);
        return;
    }

    // dispatch to vuex store by promise
    return new Promise((resolve, reject) => {

        let _outerReject = reject;
        let _outerResolve = resolve;

        store.dispatch('modApiRequests/parseRequest', {
            query: route.query
        })
            .then(response => {
                _outerResolve('OK');
            })
            .catch(response => {
                error({ statusCode: 401, message: 'API authentication failed' });
                resolve('Fail');
            });
    });

};
