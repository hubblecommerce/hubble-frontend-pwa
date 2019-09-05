//
// resources module
//
import axios from 'axios'

import { getAccessToken } from '@hubblecommerce/hubble/core/utils/auth'
import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime'

export default function (ctx) {

    // Create vuex store module
    const modApiResources = {
        namespaced: true,
        state: () => ({
            cacheTTL: 60,

            // api
            apiBaseUrl: null,
            apiAuthResponse: {},
            apiAuthToken: null,
            apiLocale: null,

            // resources
            dataUri: {},

            dataMenu: {},
            dataMenuCacheable: true,

            dataProduct: {},
            dataProductRelations: {},
            dataCareProducts: {},
            dataProductUpsellings: {},
            dataCategory: {},
            dataCategoryProducts: {},

            menuItems: {},
            dataManufacturersFlyout: {},
            dataManufacturers: {},

            // stuff
            pageType: null

        }),
        mutations: {
            setApiBaseUrl: (state, item) => {
                state.apiBaseUrl = item;
            },
            setApiLocale: (state, item) => {
                state.apiLocale = item;
            },
            clearDataMenu: (state) => {
                state.dataMenu = {};
            },
            setApiAuthResponse: (state, payload) => {
                state.apiAuthResponse = payload.data;

                state.apiAuthToken = payload.data.access_token;

                if(payload.cacheable) {
                    let _ttl = payload.cacheTTL || state.cacheTTL;

                    state.apiAuthResponse.created_at_unixtime = datetimeUnixNow();
                    state.apiAuthResponse.expires_at_unixtime = datetimeUnixNowAddSecs(_ttl);

                    // state.apiAuthResponse.created_at_datetime = moment.unix(state.apiAuthResponse.created_at_unixtime).format('YYYY-MM-DDTHH:mm:ss');
                    // state.apiAuthResponse.expires_at_datetime = moment.unix(state.apiAuthResponse.expires_at_unixtime).format('YYYY-MM-DDTHH:mm:ss');
                }
            },
            setDataUri: (state, item) => {
                state.dataUri = item;
            },
            setDataMenu: (state, payload) => {

                // Set menu data from payload
                state.dataMenu = payload.data;

                // local copy of menu items before resetting object for mapping
                state.menuItems = payload.data.result.items;

                // Override menu with menu structure from config
                if(process.env.menu) {
                    let map = process.env.menu;

                    // Clear menu structure of api get to set structure of mapping
                     state.dataMenu.result.items = [];

                    _.forEach(map, (val, key) => {

                        // Use menu item from api result by category id when it is set in config
                        if(val.id !== null) {
                            // Get menu item from payload by id
                            _.forEach(state.menuItems, (v, k) =>  {
                                if(v.id === val.id) {
                                    state.dataMenu.result.items[key] = v;
                                    state.dataMenu.result.items[key].name = val.name;
                                }
                            });
                        }

                        // Build menu from virtual entries without id or real category
                        if(typeof val.id === "undefined") {

                            // configure store as source for child elements
                            let childFromConfig = [];
                            if(typeof val.childrenStore !== "undefined") {
                                childFromConfig = state[val.childrenStore];
                            }

                            // Set virtual menu items through config
                            state.dataMenu.result.items[key] = {
                                id: 'virtual'+key,
                                name: val.name,
                                url_path: val.url_path,
                                children: childFromConfig
                            }
                        }

                    });
                }

                state.dataMenu.locale = state.apiLocale;

                if(state.dataMenuCacheable) {
                    let _ttl = state.dataMenuCacheableTTL || state.cacheTTL;

                    state.dataMenu.created_at_unixtime = datetimeUnixNow();
                    state.dataMenu.expires_at_unixtime = datetimeUnixNowAddSecs(_ttl);

                    // state.dataMenu.created_at_datetime = moment.unix(state.dataMenu.created_at_unixtime).format('YYYY-MM-DDTHH:mm:ss');
                    // state.dataMenu.expires_at_datetime = moment.unix(state.dataMenu.expires_at_unixtime).format('YYYY-MM-DDTHH:mm:ss');
                }
            },
            setDataManufacturersFlyout: (state, payload) => {
                state.dataManufacturersFlyout = payload.data;
            },
            setDataManufacturers: (state, payload) => {
                state.dataManufacturers = payload.data;
            },
            setDataProduct: (state, payload) => {
                state.dataProduct = payload.data;
            },
            setDataProductItem: (state, payload) => {
                state.dataProduct.result.item = payload.data;
            },
            setDataProductRelations: (state, payload) => {
                state.dataProductRelations = payload.data;
            },
            setDataCareProducts: (state, payload) => {
                state.dataCareProducts = payload.data;
            },
            setDataProductUpsellings: (state, payload) => {
                state.dataProductUpsellings = payload.data;
            },
            setDataCategory: (state, payload) => {
                state.dataCategory = payload.data;
            },
            setDataCategoryProducts: (state, payload) => {
                state.dataCategoryProducts = payload.data;
            },
            setPageType: (state, item) => {
                state.pageType = item;
            },
        },
        getters:  {
            getApiBaseUrl: state => {
                return state.apiBaseUrl;
            },
            getApiLocale: state => {
                return state.apiLocale;
            },
            getApiAuthToken: state => {
                return state.apiAuthToken;
            },
            getApiAuthResponse: state => {
                return state.apiAuthResponse;
            },
            getDataUri: state => {
                return state.dataUri;
            },
            getDataMenu: state => {
                return state.dataMenu;
            },
            getDataMenuItems: state => {
                return state.dataMenu.items ? state.dataMenu.items : null;
            },
            getDataMenuStats: state => {
                return state.dataMenu.stats ? state.dataMenu.stats : null;
            },
            getDataManufacturersFlyout: state => {
                return state.dataManufacturersFlyout;
            },
            getDataManufacturers: state => {
                return state.dataManufacturers;
            },
            getDataProduct: state => {
                return state.dataProduct;
            },
            getDataProductRelations: state => {
                return state.dataProductRelations;
            },
            getDataCareProducts: state => {
              return state.dataCareProducts;
            },
            getDataProductUpsellings: state => {
                return state.dataProductUpsellings;
            },
            getDataCategory: state => {
                return state.dataCategory;
            },
            getDataCategoryProducts: state => {
                return state.dataCategoryProducts;
            },
            getQueryPaginated: (state, getters, rootState, rootGetters) => (query) => {
                return rootGetters['modApiRequests/queryPaginate'](query);
            },
            getMediaGalleryArray: state => {
              if(!_.isEmpty(state.dataProduct)) {
                let image = state.dataProduct.result.item.image,
                  mediaGallery = state.dataProduct.result.item.media_gallery;
                let allProductImages = [];

                allProductImages.push(image);
                mediaGallery.forEach( item => {
                  allProductImages.push(item.value);
                });

                return allProductImages;
              }
            },
        },
        actions: {
            async apiGet({commit, state}, payload) {
                // console.log("apiGet called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    axios.get(state.apiBaseUrl + payload.endpoint, {
                        headers: {
                            'Authorization': 'Bearer ' + state.apiAuthToken
                        },
                        params: payload.params
                    })
                        .then(response => {

                            // return response
                            resolve(response);
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });
                });
            },
            async apiGetAuth({commit, state}, payload) {
                // console.log("store apiGetAuth called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    getAccessToken()
                        .then(response => {

                            commit('setApiAuthResponse', {
                                data: response.data,
                                cacheable: !! response.data.expires_in || false,
                                cacheTTL: response.data.expires_in || null
                            });

                            resolve('OK');
                        })
                        .catch(response => {
                            reject('apiGetAuth failed!');
                        })
                });
            },
            async apiGetMenu({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = _.join([
                        '/rocket-api/json/',
                        state.apiLocale,
                        '/menu/children'
                    ], '');

                    dispatch('apiGet', {
                        endpoint: _endpoint
                    })
                        .then(response => {

                            commit('setDataMenu', {
                                data: response.data
                            });

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o" + response);

                            reject('API request failed!');
                        });
                });
            },
            async apiGetManufacturersFlyout({commit, state, dispatch}, payload) {
                //console.log("store apiGetManufacturersFlyout called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = _.join([
                        '/rocket-api/json/',
                        state.apiLocale,
                        '/manufacturers/flyout'
                    ], '');

                    dispatch('apiGet', {
                        endpoint: _endpoint
                    })
                        .then(response => {
                            commit('setDataManufacturersFlyout', {
                                data: response.data.result.items
                            });

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o" + response);

                            reject('API request failed!');
                        });
                });
            },
            async apiGetManufacturers({commit, state, dispatch}, payload) {
                //console.log("store apiGetManufacturersFlyout called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = _.join([
                        '/rocket-api/json/',
                        state.apiLocale,
                        '/manufacturers'
                    ], '');

                    dispatch('apiGet', {
                        endpoint: _endpoint
                    })
                        .then(response => {
                            commit('setDataManufacturers', {
                                data: response.data.result.items
                            });

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o" + response);

                            reject('API request failed!');
                        });
                });
            },
            async getRelatedProducts({commit, state, dispatch}, payload) {
              //console.log("store getRelatedProducts called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = _.join([
                        '/rocket-api/json/',
                        state.apiLocale,
                        '/products/',
                        payload.data,
                        '/relations'
                    ], '');

                    dispatch('apiGet', {
                        endpoint: _endpoint
                    })
                        .then(response => {

                            commit('setDataProductRelations', {
                                data: response.data
                            });

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o" + response);

                            reject('API request failed!');
                        });
                });
            },
            async getCareProducts({commit, state, dispatch}, payload) {
                //console.log("store getCareProducts called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = _.join([
                        '/rocket-api/json/',
                        state.apiLocale,
                        '/products/',
                        payload.data,
                        '/care'
                    ], '');

                    dispatch('apiGet', {
                        endpoint: _endpoint
                    })
                        .then(response => {

                            commit('setDataCareProducts', {
                              data: response.data
                            });

                            resolve(response.data);
                        })
                        .catch(response => {
                            console.log("API get request failed: %o" + response);

                            reject('API request failed!');
                        });
                });
            },
            async apiResolveUriData({commit, state, dispatch, getters}, payload) {
                // console.log("store apiResolveUriData called! payload: %o", payload);

                return new Promise((resolve, reject) => {

                    let _outerReject = reject;
                    let _outerResolve = resolve;

                    commit('setDataUri', payload.data);

                    return new Promise((resolve, reject) => {

                        // fetch category, if known by uri object
                        if(payload.data.result.item.category_id) {
                            let _endpoint = _.join([
                                '/rocket-api/json/',
                                state.apiLocale,
                                '/categories/',
                                payload.data.result.item.category_id
                            ], '');


                            dispatch('apiGet', {
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
                            })
                                .then(response => {

                                    commit('setDataCategory', {
                                        data: response.data
                                    });

                                    // resolve("category OK!");
                                })
                                .catch(response => {
                                    _outerReject("failed to get category data!");
                                });
                        }
                        else {
                            // reset to empty object
                            commit('setDataCategory', {
                                data: {}
                            });
                        }


                        if(payload.data.result.item.product_id) {
                            // console.log("store apiResolveUriData - running for product ...");

                            let _endpoint = _.join([
                                '/rocket-api/json/',
                                state.apiLocale,
                                '/products/',
                                payload.data.result.item.product_id
                            ], '');

                            dispatch('apiGet', {
                                endpoint: _endpoint,
                                params: {
                                    _withProps: _.join([
                                        'facets',
                                        'media_gallery',
                                        'related_product_ids',
                                        'search_result_data_children'
                                    ], ',')
                                }
                            })
                                .then(response => {

                                    commit('setPageType', 'product');

                                    commit('setDataProduct', {
                                        data: response.data
                                    });

                                    //
                                    // xxx: quiz: how to cleanup store from orphaned objects
                                    //
                                    // commit('setDataCategoryProducts', {
                                    //     data: {}
                                    // });

                                    _outerResolve(response);
                                })
                        }
                        else {
                            // console.log("store apiResolveUriData - running for category ...");

                            let _endpoint = _.join([
                                '/rocket-api/json/',
                                state.apiLocale,
                                '/categories/',
                                payload.data.result.item.category_id,
                                '/products'
                            ], '');

                            let _query = getters.getQueryPaginated(payload.query);

                            commit('modApiRequests/setPaginationOffset', _query._from, {root: true});
                            commit('modApiRequests/setPaginationPerPage', _query._size, {root: true});

                            dispatch('apiGet', {
                                endpoint: _endpoint,
                                params: _.merge(
                                    {},
                                    _query,
                                    {
                                        _withProps: _.join([
                                            'facets',
                                            'media_gallery',
                                            'search_result_data_children'
                                        ], ',')
                                    }
                                )
                            })
                                .then(response => {

                                    commit('setPageType', 'category');

                                    commit('setDataProduct', {
                                        data: {}
                                    });

                                    commit('setDataCategoryProducts', {
                                        data: response.data
                                    });

                                    _outerResolve(response);
                                })
                        }
                    });

                    resolve('OK, but should be resolved earlier!');
                });
            },
            async apiCatalogsearch({commit, state, dispatch, getters}, payload) {
                // console.log("store apiCatalogsearch called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = _.join([
                        '/rocket-api/json/',
                        state.apiLocale,
                        '/search/catalogsearch'
                    ], '');

                    let _query = getters.getQueryPaginated(payload.query);

                    commit('modApiRequests/setPaginationOffset', _query._from, {root: true});
                    commit('modApiRequests/setPaginationPerPage', _query._size, {root: true});

                    dispatch('apiGet', {
                        endpoint: _endpoint,
                        params: _.merge(
                            {},
                            _query,
                            {
                                _withProps: _.join([
                                    'facets',
                                    'media_gallery',
                                    'search_result_data_children'
                                ], ',')
                            }
                        )
                    })
                        .then(response => {

                            commit('setPageType', 'category');

                            //
                            // xxx: quiz: how to cleanup store from orphaned objects
                            //
                            // commit('setDataProduct', {
                            //     data: {}
                            // });

                            commit('setDataCategoryProducts', {
                                data: response.data
                            });

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o" + response);

                            reject('API request failed!');
                        });
                })
            }
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modApiResources', modApiResources);
}
