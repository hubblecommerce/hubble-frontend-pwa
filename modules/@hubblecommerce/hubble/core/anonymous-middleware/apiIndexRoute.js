export default async function({ store, route, error }) {

    if(process.env.API_TYPE !== 'sw') {
        return;
    }

    try {
        let pageResponse = await store.dispatch('apiCall', {
            action: 'post',
            tokenType: 'sw',
            apiType: 'data',
            endpoint: '/store-api/v1/category/home',
            data: {
                associations: {
                    categories: {},
                    manufacturer: {
                        associations: {
                            media: {}
                        }
                    },
                    media: {},
                    seoUrls: {},
                    crossSellings: {},
                    children: {
                        associations: {
                            options: {
                                associations: {
                                    group: {}
                                }
                            }
                        }
                    },
                }
            }
        }, { root: true });

        store.commit('modApiResources/setCmsObject', pageResponse.data.cmsPage);

        // Handle Categories
        let matchingCategoryId = pageResponse.data.id;

        return new Promise((resolve, reject) => {

            // Get and store category
            store.dispatch('modApiCategory/swGetCategory', matchingCategoryId).then(() => {
                store.commit('modApiResources/setPageType', 'category');

                // Reset term of api request body,
                // in case user come from search page
                store.commit('modApiCategory/setTerm', null);

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

                // Filter by category id
                store.dispatch('modApiCategory/setApiRequestFilter', {
                    type: 'contains',
                    field: 'categoryTree',
                    value: matchingCategoryId
                })
                    .then(() => {
                        // Get products
                        store.dispatch('modApiCategory/swGetProducts', matchingCategoryId)
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                console.log("swGetProducts error: ", err);
                            });
                    })
                    .catch((err) => {
                        console.log("setApiRequestFilter error: ", err);
                    });
                })
                .catch(() => {
                    error({statusCode: 404, message: 'Unknown URL'});
                    resolve();
                });
        });
    } catch (e) {
        console.log(e);
    }
}
