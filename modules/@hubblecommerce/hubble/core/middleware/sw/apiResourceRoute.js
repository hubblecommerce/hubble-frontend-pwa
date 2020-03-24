//
// api route middleware dispatching 'dataMenu' to vuex store
//
import Middleware from './middleware'
import {findCategoryByUrl, findProductByUrl} from '@hubblecommerce/hubble/core/utils/menuHelper';

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.apiResourceRoute = function({app, store, route, error}) {

    // remove leading '/'
    let _path = route.path.slice(1);

    // split '_path' into segments
    let _segments = _path.split('/');

    // drop localization prefix
    if (_segments[0].match(/^(en)$/)) {
        _segments = _.drop(_segments, 1)
    }

    _path = _.join(_segments, '/');

    // Lookup if url matches one of the category urls
    let matchingCategory = findCategoryByUrl(store.getters['modApiResources/getDataMenu'].result.items, _path);
    if(matchingCategory) {

        return new Promise((resolve, reject) => {

            // Get page to set available filters
            store.dispatch('modApiResources/getPage', _path).then((pageResponse) => {

                store.dispatch('modApiResources/mapFilterToFacets', pageResponse.data.listingConfiguration.availableFilters).then((facets) => {
                    store.commit('modApiRequests/setRequestFacets', facets);
                });

            });

            // Get and store category
            store.dispatch('modApiResources/swGetCategory', matchingCategory.id).then(() => {

                store.commit('modApiResources/setPageType', 'category');

                // Set filters from url query
                // important to call it first because it resets all filters
                if(route.query != null) {
                    store.commit('modApiResources/setFilters', route.query);
                }

                // Set limit to request if isset in url
                if(route.query.limit != null) {
                    store.commit('modApiResources/setLimit', route.query.limit);
                    store.commit('modApiRequests/setPaginationPerPage', route.query.limit);
                }

                // Set page to request if isset in url
                if(route.query.page != null) {
                    store.commit('modApiResources/setPage', route.query.page);
                } else {
                    store.commit('modApiResources/setPage', 1);
                }

                // Set order to request if isset in url
                if(route.query.sort != null) {
                    store.commit('modApiResources/setSorting', route.query.sort);
                } else {
                    store.commit('modApiResources/setSorting', 0);
                }

                // Filter by category id
                store.dispatch('modApiResources/setApiRequestFilter', {
                    type: 'contains',
                    field: 'categoryTree',
                    value: matchingCategory.id
                }).then(() => {
                    // Get products
                    store.dispatch('modApiResources/swGetProducts', matchingCategory.id).then(() => {
                        resolve();
                    });
                });

            }).catch(() => {
                error({statusCode: 404, message: 'Unknown URL'});
                resolve();
            });
        });

    }

    // TODO: Find better solution to check if it's a valid product (path endpoint)
    let matchingProduct = findProductByUrl(store.getters['modApiResources/getDataProductUrls'], _path);
    if(matchingProduct) {

        store.commit('modApiResources/setProductId', matchingProduct.foreignKey);

        // Load detail page client side if its accessed via anchor
        if(store.getters['modApiResources/getOpenDetail']) {
            store.commit('modApiResources/setPageType', 'product');
        } else {
            // dispatch to vuex store by promise
            return new Promise((resolve, reject) => {
                // Get and store category including products from api
                store.dispatch('modApiProduct/getProductData', {path: _path}).then(() => {
                    store.commit('modApiResources/setPageType', 'product');
                    resolve();
                }).catch(() => {
                    error({statusCode: 404, message: 'Unknown URL'});
                    resolve();
                });
            });
        }

    }
};
