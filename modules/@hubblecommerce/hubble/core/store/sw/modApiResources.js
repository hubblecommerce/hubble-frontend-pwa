import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime';

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
            cmsObject: {},
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

                if (state.dataMenuCacheable) {
                    let _ttl = state.dataMenuCacheableTTL || state.cacheTTL;

                    state.dataProductUrls.created_at_unixtime = datetimeUnixNow();
                    state.dataProductUrls.expires_at_unixtime = datetimeUnixNowAddSecs(_ttl);
                }
            },
        },
        getters: {
            getApiLocale: state => {
                return state.apiLocale;
            },
            getPageType: state => {
                return state.pageType;
            },
            getDataProductUrls: state => {
                return state.dataProductUrls;
            },
        },
        actions: {
            async swGetProductUrls({ commit, state, dispatch }) {
                return new Promise(function (resolve, reject) {
                    if (!_.isEmpty(state.dataProductUrls)) {
                        resolve();
                    }

                    dispatch(
                        'apiCall',
                        {
                            action: 'get',
                            tokenType: 'sw',
                            apiType: 'data',
                            endpoint: '/sales-channel-api/v1/dmf/seo-url?filter[routeName]=frontend.detail.page&limit=500',
                        },
                        { root: true }
                    )
                        .then(response => {
                            commit('setDataProductUrls', response.data.data);

                            resolve('OK');
                        })
                        .catch(response => {
                            reject('API request failed!');
                        });
                });
            },
            async getPage({ commit, dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'post',
                            tokenType: 'sw',
                            apiType: 'data',
                            endpoint: '/sales-channel-api/v1/dmf/page',
                            data: {
                                path: payload,
                            },
                        },
                        { root: true }
                    ).then(response => {
                        commit('setCmsObject', response.data.cmsPage);

                        resolve(response);
                    });
                });
            },
        },
    };

    ctx.store.registerModule('modApiResources', modApiResources);
}
