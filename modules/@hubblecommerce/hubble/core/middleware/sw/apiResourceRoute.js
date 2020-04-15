import Middleware from './middleware';
import { findCategoryByUrl, findProductByUrl } from '@hubblecommerce/hubble/core/utils/menuHelper';

Middleware.apiResourceRoute = function ({ store, route, error }) {
    // remove leading '/'
    let path = route.path.slice(1);

    // split 'path' into segments
    let segments = path.split('/');

    // drop localization prefix
    if (segments[0].match(/^(en)$/)) {
        segments = _.drop(segments, 1);
    }

    path = _.join(segments, '/');

    // Lookup if url matches one of the category urls
    let matchingCategory = findCategoryByUrl(store.getters['modApiMenu/getDataMenu'].result.items, path);
    if (matchingCategory) {
        return new Promise((resolve, reject) => {
            // Get page to set available filters
            store.dispatch('modApiResources/getPage', path).then(pageResponse => {
                store.dispatch('modApiRequests/mapFilterToFacets', pageResponse.data.listingConfiguration.availableFilters).then(facets => {
                    store.commit('modApiRequests/setRequestFacets', facets);
                });
            });

            // Get and store category
            store
                .dispatch('modApiCategory/swGetCategory', matchingCategory.id)
                .then(() => {
                    store.commit('modApiResources/setPageType', 'category');

                    // Reset term of api request body,
                    // in case user come from search page
                    store.commit('modApiCategory/setTerm', null);

                    // Set filters from url query
                    // important to call it first because it resets all filters
                    if (route.query != null) {
                        store.commit('modApiCategory/setFilters', route.query);
                    }

                    // Set limit to request if isset in url
                    if (route.query.limit != null) {
                        store.commit('modApiCategory/setLimit', route.query.limit);
                        store.commit('modApiRequests/setPaginationPerPage', route.query.limit);
                    }

                    // Set page to request if isset in url
                    if (route.query.page != null) {
                        store.commit('modApiCategory/setPage', route.query.page);
                    } else {
                        store.commit('modApiCategory/setPage', 1);
                    }

                    // Set order to request if isset in url
                    if (route.query.sort != null) {
                        store.commit('modApiCategory/setSorting', route.query.sort);
                    } else {
                        store.commit('modApiCategory/setSorting', 0);
                    }

                    // Filter by category id
                    store
                        .dispatch('modApiCategory/setApiRequestFilter', {
                            type: 'contains',
                            field: 'categoryTree',
                            value: matchingCategory.id,
                        })
                        .then(() => {
                            // Get products
                            store.dispatch('modApiCategory/swGetProducts', matchingCategory.id).then(() => {
                                resolve();
                            });
                        });
                })
                .catch(() => {
                    error({ statusCode: 404, message: 'Unknown URL' });
                    resolve();
                });
        });
    }

    // TODO: Find better solution to check if it's a valid product (path endpoint)
    let matchingProduct = findProductByUrl(store.getters['modApiResources/getDataProductUrls'], path);
    if (matchingProduct) {
        store.commit('modApiProduct/setProductId', matchingProduct.foreignKey);

        // Load detail page client side if its accessed via anchor
        if (store.getters['modApiProduct/getOpenDetail']) {
            store.commit('modApiResources/setPageType', 'product');
        } else {
            return new Promise((resolve, reject) => {
                // Get and store category including products from api
                store
                    .dispatch('modApiProduct/getProductData', { path: path })
                    .then(() => {
                        store.commit('modApiResources/setPageType', 'product');
                        resolve();
                    })
                    .catch(() => {
                        error({ statusCode: 404, message: 'Unknown URL' });
                        resolve();
                    });
            });
        }
    }
};
