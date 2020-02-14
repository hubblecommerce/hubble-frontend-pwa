//
// resources module
//
import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime'
import { sortMenuEntries } from "@hubblecommerce/hubble/core/utils/menuHelper";

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

            // Routing Information
            openDetail: false,
            productId: null,

            // Menu
            dataMenu: {},
            dataMenuCacheable: true,

            // Product
            dataProduct: {},
            dataProductRelations: {},
            dataProductsCrossBuybox: {},
            dataProductsCrossByOrder: {},
            dataProductsCrossSimilar: {},
            dataProductUpsellings: {},
            optionIsSelected: false,
            optionNotSelectedError: false,

            // Category
            dataCategory: {},
            dataCategoryProducts: {},
            selectedVariants: [],

            // CMS
            dataContent: {},
            dataCustomContent: {},

            // stuff
            pageType: null

        }),
        mutations: {
            setOptionIsSelected: (state, variant) => {
                state.optionIsSelected = true;
                state.selectedVariants = [];
                state.selectedVariants.push(variant);
            },
            resetSelectedVariants: (state) => {
                state.optionIsSelected = false;
                state.selectedVariants = [];
            },
            setOptionNotSelectedError: (state) => {
                state.optionNotSelectedError = true;
            },
            removeOptionNotSelectedError: (state) => {
                state.optionNotSelectedError = false;
            },
            setApiLocale: (state, item) => {
                state.apiLocale = item;
            },
            clearDataMenu: (state) => {
                state.dataMenu = {};
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

                        // Add custom children to category if set
                        _.forEach(val.children, (child) => {
                            state.dataMenu.result.items[key].children.push(child);
                        });

                        // Sort menu entry and children of entry alphabetically if flag is set
                        if(val.sortAlphabetically && !_.isEmpty(state.dataMenu.result.items[key].children)) {
                            state.dataMenu.result.items[key].children = sortMenuEntries(state.dataMenu.result.items[key].children);
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
            setDataProduct: (state, payload) => {
                state.dataProduct = payload.data;
            },
            setDataProductItem: (state, payload) => {
                state.dataProduct.result.item = payload.data;
            },
            setDataProductRelations: (state, payload) => {
                state.dataProductRelations = payload.data;
            },
            setDataProductsCrossBuybox: (state, payload) => {
                state.dataProductsCrossBuybox = payload.data;
            },
            setDataProductsCrossByOrder: (state, payload) => {
                state.dataProductsCrossByOrder = payload.data;
            },
            setDataProductsCrossSimilar: (state, payload) => {
                state.dataProductsCrossSimilar = payload.data;
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
            setDataContent: (state, payload) => {
                state.dataContent = payload.data;
            },
            setDataCustomContent: (state, payload) => {
                state.dataCustomContent = payload;
            },
            setOpenDetail: (state, payload) => {
                state.openDetail = payload;
            },
            setProductId: (state, payload) => {
                state.productId = payload;
            },
        },
        getters:  {
            getApiLocale: state => {
                return state.apiLocale;
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
            getDataProduct: state => {
                return state.dataProduct;
            },
            getDataProductRelations: state => {
                return state.dataProductRelations;
            },
            getDataProductsCrossBuybox: state => {
                return state.dataProductsCrossBuybox;
            },
            getDataProductsCrossByOrder: state => {
                return state.dataProductsCrossByOrder;
            },
            getDataProductsCrossSimilar: state => {
                return state.dataProductsCrossSimilar;
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
            getDataContent: state => {
                return state.dataContent;
            },
            getDataCustomContent: state => {
                return state.dataCustomContent;
            },
            getOpenDetail: state => {
                return state.openDetail;
            },
            getProductId: state => {
                return state.productId;
            },
            getPageType: state => {
                return state.pageType;
            }
        },
        actions: {
            async apiGetMenu({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = '/api/json/menu/children';

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'api',
                        apiType: 'data',
                        endpoint: _endpoint,
                        params: {
                            _size: 30
                        }
                    }, { root: true })
                        .then(response => {

                            commit('setDataMenu', {
                                data: response.data
                            });

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });

                });
            },
            async getProductData({commit, state, dispatch}) {
                return new Promise(function(resolve, reject) {
                    let endpoint = _.join([
                        '/api/json/products/',
                        state.productId
                    ], '');

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'api',
                        apiType: 'data',
                        endpoint: endpoint,
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
                        commit('setDataProduct', {
                            data: response.data
                        });
                        resolve('ok');
                    })
                    .catch(error => {
                        reject(error);
                    })
                });
            },
            async getRelatedProducts({commit, state, dispatch}, payload) {
              //console.log("store getRelatedProducts called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = _.join([
                        '/api/json/products/',
                        payload.data,
                        '/relations'
                    ], '');

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'api',
                        apiType: 'data',
                        endpoint: _endpoint
                    }, { root: true })
                        .then(response => {

                            commit('setDataProductRelations', {
                                data: response.data
                            });

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });
                });
            },
            async getProductsCrossBuybox({commit, state, dispatch}, payload) {
                //console.log("store getProductsCrossBuybox called! payload: %o", payload);

                return new Promise((resolve, reject) => {
                    let _endpoint = _.join([
                        '/api/json/products/',
                        payload.data,
                        '/buybox'
                    ], '');

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'api',
                        apiType: 'data',
                        endpoint: _endpoint
                    }, { root: true })
                        .then(response => {
                            //Save Cross-selling data to store
                            commit('setDataProductsCrossBuybox', {
                                data: response.data.result.items
                            });

                            resolve(response.data);
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });
                });
            },
            async getProductsCrossByOrder({commit, state, dispatch}, payload) {
                //console.log("store getProductsCrossByOrder called! payload: %o", payload);

                return new Promise((resolve, reject) => {
                    let _endpoint = _.join([
                        '/api/json/products/',
                        payload.data,
                        '/byorder'
                    ], '');

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'api',
                        apiType: 'data',
                        endpoint: _endpoint
                    }, { root: true })
                        .then(response => {
                            //Save Cross-selling data to store
                            commit('setDataProductsCrossByOrder', {
                                data: response.data.result.items
                            });

                            resolve(response.data);
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });
                });
            },
            async getProductsCrossSimilar({commit, state, dispatch}, payload) {
                // console.log("store getDataProductsCrossSimilar called! payload: %o", payload);

                return new Promise((resolve, reject) => {
                    let _endpoint = _.join([
                        '/api/json/products/',
                        payload.data,
                        '/similar'
                        ], '');

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'api',
                        apiType: 'data',
                        endpoint: _endpoint
                    }, { root: true })
                        .then(response => {
                            //console.log("response: %o", response)
                            //Save Cross-selling data to store
                            commit('setDataProductsCrossSimilar', {
                                data: response.data.result.items
                            });

                            resolve(response.data);
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

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

                                    commit('setDataCategory', {
                                        data: response.data
                                    });

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

                                    commit('setDataCategoryProducts', {
                                        data: response.data
                                    });

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

                                    commit('setDataContent', {
                                        data: response.data.result
                                    });

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
                            // commit('setDataProduct', {
                            //     data: {}
                            // });

                            commit('setDataCategoryProducts', {
                                data: response.data
                            });

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
