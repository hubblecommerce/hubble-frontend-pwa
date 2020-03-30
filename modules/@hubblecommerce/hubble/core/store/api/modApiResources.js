//
// resources module
//

export default function (ctx) {

    // Create vuex store module
    const modApiResources = {
        namespaced: true,
        state: () => ({
            cacheTTL: 300,

            // api
            apiLocale: null,

            // resources
            dataUri: {},

            // stuff
            pageType: null

        }),
        mutations: {
            setApiLocale: (state, item) => {
                state.apiLocale = item;
            },
            setDataUri: (state, item) => {
                state.dataUri = item;
            },
            setPageType: (state, item) => {
                state.pageType = item;
            },
        },
        getters:  {
            getApiLocale: state => {
                return state.apiLocale;
            },
            getDataUri: state => {
                return state.dataUri;
            },
            getQueryPaginated: (state, getters, rootState, rootGetters) => (query) => {
                return rootGetters['modApiRequests/queryPaginate'](query);
            },
            getPageType: state => {
                return state.pageType;
            }
        },
        actions: {
            async apiResolveUriData({commit, state, dispatch, getters}, payload) {
                // console.log("store apiResolveUriData called! payload: %o", payload);

                return new Promise((resolve, reject) => {

                    let _outerReject = reject;
                    let _outerResolve = resolve;

                    commit('setDataUri', payload.data);

                    return new Promise((resolve, reject) => {

                        // fetch category data, if known by uri object
                        if(payload.data.result.item.category_id) {
                            let _endpoint = _.join([
                                '/api/json/categories/',
                                payload.data.result.item.category_id
                            ], '');

                            dispatch('apiCall', {
                                action: 'get',
                                tokenType: 'api',
                                apiType: 'data',
                                endpoint: _endpoint,
                                params: {
                                    _withProps: _.join([
                                        'path',
                                        'path_ids',
                                        'path_names',
                                        'path_urls',
                                        'display_mode',
                                        'parent_id'
                                    ], ',')
                                }
                            }, { root: true })
                                .then(response => {

                                    commit('modApiCategory/setDataCategory', {
                                        data: response.data
                                    }, {root: true});

                                    // resolve("category OK!");
                                })
                                .catch(response => {
                                    _outerReject("failed to get category data!");
                                });
                        }

                        // fetch product, if known by uri object
                        if(payload.data.result.item.product_id) {
                            // console.log("store apiResolveUriData - running for product ...");

                            let _endpoint = _.join([
                                '/api/json/products/',
                                payload.data.result.item.product_id
                            ], '');

                            dispatch('apiCall', {
                                action: 'get',
                                tokenType: 'api',
                                apiType: 'data',
                                endpoint: _endpoint,
                                params: {
                                    _withProps: _.join([
                                        'facets',
                                        'media_gallery',
                                        'related_product_ids',
                                        'search_result_data_children',
                                        'status'
                                    ], ',')
                                }
                            }, { root: true })
                                .then(response => {

                                    commit('setPageType', 'product');

                                    commit('modApiProduct/setDataProduct', {
                                        data: response.data
                                    }, { root: true });

                                    //
                                    // xxx: quiz: how to cleanup store from orphaned objects
                                    //
                                    // commit('modApiCategory/setDataCategoryProducts', {
                                    //     data: {}
                                    // }, {root: true});

                                    _outerResolve(response);
                                })
                        }
                        else if(payload.data.result.item.content_id === null) {
                            // fetch category products, if known by uri object

                            let _endpoint = _.join([
                                '/api/json/categories/',
                                payload.data.result.item.category_id,
                                '/products'
                            ], '');

                            let _query = getters.getQueryPaginated(payload.query);

                            commit('modApiRequests/setPaginationOffset', _query._from, {root: true});
                            commit('modApiRequests/setPaginationPerPage', _query._size, {root: true});

                            dispatch('apiCall', {
                                action: 'get',
                                tokenType: 'api',
                                apiType: 'data',
                                endpoint: _endpoint,
                                params: _.merge(
                                    {},
                                    _query,
                                    {
                                        _withProps: _.join([
                                            'facets',
                                            'media_gallery',
                                            'search_result_data_children',
                                            'status'
                                        ], ',')
                                    }
                                )
                            }, { root: true })
                                .then(response => {

                                    commit('setPageType', 'category');

                                    commit('modApiCategory/setDataCategoryProducts', {
                                        data: response.data
                                    }, {root: true});

                                    _outerResolve(response);
                                })
                        }

                        // fetch cms content, if known by uri object
                        if(payload.data.result.item.content_id) {

                            let _endpoint = _.join([
                                '/api/json/cms/blocks/',
                                payload.data.result.item.request_path
                            ], '');

                            dispatch('apiCall', {
                                action: 'get',
                                tokenType: 'api',
                                apiType: 'data',
                                endpoint: _endpoint
                            }, { root: true })
                                .then(response => {
                                    commit('setPageType', 'content');

                                    commit('modApiCms/setDataContent', {
                                        data: response.data.result
                                    }, { root: true });

                                    _outerResolve();
                                })
                        }
                    });

                    resolve('OK, but should be resolved earlier!');
                });
            },
            async apiCatalogsearch({commit, state, dispatch, getters}, payload) {
                // console.log("store apiCatalogsearch called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = '/api/json/search/catalogsearch';

                    let _query = getters.getQueryPaginated(payload.query);

                    commit('modApiRequests/setPaginationOffset', _query._from, {root: true});
                    commit('modApiRequests/setPaginationPerPage', _query._size, {root: true});

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'api',
                        apiType: 'data',
                        endpoint: _endpoint,
                        params: _.merge(
                            {},
                            _query,
                            {
                                _withProps: _.join([
                                    'facets',
                                    'media_gallery',
                                    'search_result_data_children',
                                    'status'
                                ], ',')
                            }
                        )
                    }, { root: true })
                        .then(response => {

                            commit('setPageType', 'category');

                            //
                            // xxx: quiz: how to cleanup store from orphaned objects
                            //
                            // commit('modApiProduct/setDataProduct', {
                            //     data: {}
                            // });

                            commit('modApiCategory/setDataCategoryProducts', {
                                data: response.data
                            }, {root: true});

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });
                })
            },
        }
    };

    ctx.store.registerModule('modApiResources', modApiResources);
}
