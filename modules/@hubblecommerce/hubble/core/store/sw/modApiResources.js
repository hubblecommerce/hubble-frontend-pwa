import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime'

export default function (ctx) {
    const modApiResources = {
        namespaced: true,
        state: () => ({
            cacheTTL: 300,

            // api
            apiLocale: null,

            // resources
            dataProductUrls: {},

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
            setPageType: (state, item) => {
                state.pageType = item;
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
            getPageType: state => {
                return state.pageType;
            },
            getDataProductUrls: state => {
                return state.dataProductUrls;
            }
        },
        actions: {
            async swGetProductUrls({commit, state, dispatch}, payload) {
                return new Promise(function(resolve, reject) {
                    if(!_.isEmpty(state.dataProductUrls)) {
                        resolve();
                    }

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: '/sales-channel-api/v1/dmf/seo-url?filter[routeName]=frontend.detail.page&limit=500'
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
                return new Promise(function(resolve, reject) {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: '/sales-channel-api/v1/product',
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
                        commit('setCmsObject', response.data.cmsPage);

                        resolve(response);
                    });
                });
            },
        }
    };

    ctx.store.registerModule('modApiResources', modApiResources);
}
