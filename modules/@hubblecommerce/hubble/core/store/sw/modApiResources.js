import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime';

export default function (ctx) {
    const modApiResources = {
        namespaced: true,
        state: () => ({
            cacheTTL: 300,

            // api
            apiLocale: null,

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
            async getPage({ commit, dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'post',
                            tokenType: 'sw',
                            apiType: 'data',
                            endpoint: '/store-api/v3/pwa/page',
                            data: {
                                path: payload,
                                associations: {
                                    categories: {},
                                    manufacturer: {
                                        associations: {
                                            media: {},
                                        },
                                    },
                                    media: {},
                                    seoUrls: {},
                                    crossSellings: {},
                                    children: {
                                        associations: {
                                            options: {
                                                associations: {
                                                    group: {},
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        { root: true }
                    )
                        .then(response => {
                            commit('setCmsObject', response.data.cmsPage);

                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            },
        },
    };

    ctx.store.registerModule('modApiResources', modApiResources);
}
