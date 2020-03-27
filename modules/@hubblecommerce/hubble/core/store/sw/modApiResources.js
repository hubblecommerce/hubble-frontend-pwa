//
// resources module
//
import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime'
import { sortMenuEntries, unflatten } from "@hubblecommerce/hubble/core/utils/menuHelper";

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

            // Menu
            dataMenu: {},
            dataMenuCacheable: true,

            dataProductUrls: {},

            // CMS
            dataContent: {},
            dataCustomContent: {},

            // stuff
            pageType: null,

            // cmsObject
            cmsObject: {}

        }),
        mutations: {
            setCmsObject: (state, value) => {
                state.cmsObject = value;
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

                }
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
            setDataProductUrls: (state, payload) => {
                state.dataProductUrls = payload;

                if(state.dataMenuCacheable) {
                    let _ttl = state.dataMenuCacheableTTL || state.cacheTTL;

                    state.dataProductUrls.created_at_unixtime = datetimeUnixNow();
                    state.dataProductUrls.expires_at_unixtime = datetimeUnixNowAddSecs(_ttl);
                }
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
            getQueryPaginated: (state, getters, rootState, rootGetters) => (query) => {
                return rootGetters['modApiRequests/queryPaginate'](query);
            },
            getDataContent: state => {
                return state.dataContent;
            },
            getDataCustomContent: state => {
                return state.dataCustomContent;
            },
            getPageType: state => {
                return state.pageType;
            },
            getDataProductUrls: state => {
                return state.dataProductUrls;
            }
        },
        actions: {
            async mappingMenu({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    // MAPPING
                    let mapped = [];
                    _.forEach(payload, (category) => {

                        let obj = {};

                        // Add 0 as value for parentId to root categories to make unflatten function work
                        if(category.parentId === null) {
                            category.parentId = 0;
                        }

                        // Map required properties from sw response to hubble requirements
                        obj.parentId = category.parentId;
                        obj.name = category.name;

                        if(!_.isEmpty(category.seoUrls)) {
                            obj.url_path = category.seoUrls[0].seoPathInfo;
                        } else {
                            obj.url_path = '/';
                        }

                        obj.level = category.level;
                        obj.active = category.is_active;
                        obj.id = category._uniqueIdentifier;

                        mapped.push(obj);
                    });

                    // Build required parent child relations from flat array
                    resolve(unflatten(mapped));

                });
            },
            async swGetProductUrls({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    if(!_.isEmpty(state.dataProductUrls)) {
                        resolve();
                    }

                    let _endpoint = '/sales-channel-api/v1/dmf/seo-url?filter[routeName]=frontend.detail.page&limit=500';

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: _endpoint
                    }, { root: true })
                        .then(response => {
                            commit('setDataProductUrls', response.data.data);

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });

                });
            },
            async swGetMenu({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = '/sales-channel-api/v1/category?limit=100&associations[seoUrls][]';

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: _endpoint
                    }, { root: true })
                        .then(response => {

                            dispatch('mappingMenu', response.data.data).then((res) => {
                                commit('setDataMenu', {
                                    data: {
                                        result: {
                                            items: res
                                        }
                                    }
                                });
                            });

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });

                });
            },
            async apiCatalogsearch({commit, state, rootState, dispatch, getters}, payload) {
                // console.log("store apiCatalogsearch called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = '/sales-channel-api/v1/product';

                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: _endpoint,
                        data: state.apiRequestBody
                    }, { root: true })
                        .then(response => {

                            if(response.data.total === 0) {
                                resolve('OK');
                            }
                            // map product data
                            dispatch('mappingCategoryProducts', response.data).then((res) => {

                                    // Get all product urls to find urls of search result products
                                    dispatch('modApiResources/swGetProductUrls',{}, {root:true}).then(() => {

                                        _.forEach(res.items, (item, key) => {

                                            let matchingProduct = _.find(rootState.modApiResources.dataProductUrls, function(o) {
                                                return o.foreignKey === item.id;
                                            });

                                            // Set urls of matches
                                            res.items[key].url_pds = matchingProduct.seoPathInfo;

                                            commit('setPageType', 'category');

                                            commit('setDataCategoryProducts', {
                                                data: {
                                                    result: res
                                                }
                                            });

                                            resolve('OK');

                                        });

                                    });

                                });

                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });
                })
            },
            async getPage({commit, state, rootState, dispatch, getters}, payload) {
                return new Promise((resolve, reject) => {
                    let _endpoint = '/sales-channel-api/v1/dmf/page';

                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: _endpoint,
                        data: {
                            path: payload
                        }
                    }, { root: true }).then(response => {
                        commit('setCmsObject', response.data.cmsPage)
                        resolve(response);
                    });
                });
            },
            async mapFilterToFacets({commit, state, rootState, dispatch, getters}, filters) {
                return new Promise((resolve, reject) => {

                    let facets = {
                        all: {
                            storeId: true,
                            cat: true
                        },
                        selected: true,
                        string_facets: {},
                        price_facets: {}
                    };

                    Object.keys(filters).forEach(function (filter) {

                        // Map string facets
                        if(filters[filter].type === 'entity') {
                            facets.string_facets[filter] = {
                                key: filters[filter].name,
                                label: filters[filter].name,
                                selected: false,
                                options: []
                            };

                            Object.keys(filters[filter].values).forEach(function (value) {
                                facets.string_facets[filter].options.push({
                                    key: value,
                                    label: filters[filter].values[value].name
                                })
                            });
                        }

                        // Map price facet
                        if(filter === 'price') {
                            facets.price_facets[filter] = {
                                key: filter,
                                label: filter,
                                selected: false,
                                "facet-stats": {
                                    min: filters[filter].values.min,
                                    max: filters[filter].values.max
                                },
                            };
                        }

                    });

                    resolve(facets);
                });
            }
        }
    };

    ctx.store.registerModule('modApiResources', modApiResources);
}
