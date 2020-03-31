//
// api route middleware dispatching 'catalogsearch'
//
import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.apiResourceSearch = function ({ store, route }) {

    return new Promise((resolve, reject) => {

        // Set limit to request if isset in url
        if(route.query.limit != null) {
            store.commit('modApiCategory/setLimit', route.query.limit);
            store.commit('modApiRequests/setPaginationPerPage', route.query.limit);
        }

        // Set page to request if isset in url
        if(route.query.page != null) {
            store.commit('modApiCategory/setPage', route.query.page);
        } else {
            store.commit('modApiCategory/setPage', 1);
        }

        // Set order to request if isset in url
        if(route.query.sort != null) {
            store.commit('modApiCategory/setSorting', route.query.sort);
        } else {
            store.commit('modApiCategory/setSorting', 0);
        }

        // Set order to request if isset in url
        if(route.query.term != null) {
            store.commit('modApiCategory/setTerm', route.query.term);
        }

        store.dispatch('modSearch/apiCatalogsearch')
            .then(response => {
                // console.log("middleware api-resource-search OK response: %o", response);
                resolve();
            })
            .catch(response => {
                // console.log("middleware api-resource-search ERROR response: %o", response);
                reject();
            })
    })

};
