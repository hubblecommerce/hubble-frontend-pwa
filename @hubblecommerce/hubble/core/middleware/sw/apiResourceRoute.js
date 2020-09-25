import _ from 'lodash';

export default async function ({ store, route, error }) {
    // Load detail page client side if its accessed via anchor
    if (store.getters['modApiProduct/getOpenDetail']) {
        store.commit('modApiResources/setPageType', 'product');
        return;
    }

    // remove leading '/'
    let path = route.path.slice(1);

    // split 'path' into segments
    let segments = path.split('/');

    // drop localization prefix
    if (segments[0].match(/^(en)$/)) {
        segments = _.drop(segments, 1);
    }

    path = _.join(segments, '/');

    try {
        let pageResponse = await store.dispatch('modApiResources/getPage', path);

        // Handle Categories
        let matchingCategoryId = pageResponse.data.resourceIdentifier;

        if (pageResponse.data.resourceType === 'frontend.navigation.page') {
            return new Promise((resolve, reject) => {
                store.dispatch('modApiRequests/mapFilterToFacets', pageResponse.data.listingConfiguration.availableFilters).then(facets => {
                    store.commit('modApiRequests/setRequestFacets', facets);
                });

                // Get and store category
                store
                    .dispatch('modApiCategory/swGetCategory', matchingCategoryId)
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
                                value: matchingCategoryId,
                            })
                            .then(() => {
                                // Get products
                                store.dispatch('modApiCategory/swGetProducts', matchingCategoryId).then(() => {
                                    resolve();
                                });
                            });
                    })
                    .catch(() => {
                        error({ statusCode: 404, message: 'Unknown Category' });
                        resolve();
                    });
            });
        }

        // Handle Detailpage
        let matchingProduct = pageResponse.data.product;
        if (pageResponse.data.resourceType === 'frontend.detail.page') {
            store.commit('modApiProduct/setProductId', pageResponse.data.product.id);

            return new Promise((resolve, reject) => {
                store.dispatch('modApiProduct/mappingProduct', { product: matchingProduct }).then(res => {
                    store.commit('modApiProduct/setDataProduct', {
                        data: {
                            result: {
                                item: res,
                            },
                        },
                    });

                    store.commit('modApiResources/setPageType', 'product');

                    resolve('ok');
                });
            });
        }
    } catch (err) {
        console.log(err);
        error({ statusCode: 404, message: 'Unknown URL' });
    }
};
