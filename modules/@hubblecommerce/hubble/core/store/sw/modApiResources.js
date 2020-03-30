//
// resources module
//
import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime'
import { unflatten } from "@hubblecommerce/hubble/core/utils/menuHelper";

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
            setDataUri: (state, item) => {
                state.dataUri = item;
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
                            dispatch('modApiCategory/mappingCategoryProducts', response.data, {root:true}).then((res) => {

                                    // Get all product urls to find urls of search result products
                                    dispatch('modApiResources/swGetProductUrls',{}, {root:true}).then(() => {

                                        _.forEach(res.items, (item, key) => {

                                            let matchingProduct = _.find(rootState.modApiResources.dataProductUrls, function(o) {
                                                return o.foreignKey === item.id;
                                            });

                                            // Set urls of matches
                                            res.items[key].url_pds = matchingProduct.seoPathInfo;

                                            commit('setPageType', 'category');

                                            commit('modApiCategory/setDataCategoryProducts', {
                                                data: {
                                                    result: res
                                                }
                                            }, {root:true});

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
