import Middleware from './middleware'

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
            resolve(response);
        })
        .catch(error => {
            reject(error);
        })
    })

};
