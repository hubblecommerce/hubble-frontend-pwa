//
// api route middleware dispatching 'catalogsearch'
//
import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.apiResourceSearch = function ({ store, route }) {

    return new Promise((resolve, reject) => {

        let _outerReject = reject;
        let _outerResolve = resolve;

        store.dispatch('modApiResources/apiCatalogsearch', {
            query: route.query
        })
            .then(response => {
                // console.log("middleware api-resource-search OK response: %o", response);
                _outerResolve();
            })
            .catch(response => {
                // console.log("middleware api-resource-search ERROR response: %o", response);
                _outerReject();
            })
    })

};
