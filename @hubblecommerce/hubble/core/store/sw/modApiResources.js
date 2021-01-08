export const state = () => ({
    cacheTTL: 300,

    // api
    apiLocale: null,

    // stuff
    pageType: null,

    // cmsObject
    cmsObject: {},
});

export const mutations = {
    setCmsObject(state, value) {
        state.cmsObject = value;
    },
    setApiLocale(state, item) {
        state.apiLocale = item;
    },
    setPageType(state, item) {
        state.pageType = item;
    },
};

export const getters = {
    getApiLocale(state) {
        return state.apiLocale;
    },
    getPageType(state) {
        return state.pageType;
    },
    getDataProductUrls(state) {
        return state.dataProductUrls;
    },
};

export const actions = {
    async getPage({ commit, dispatch, rootState }, payload) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    endpoint: '/store-api/v3/pwa/page',
                    data: payload,
                },
                { root: true }
            )
                .then((response) => {
                    commit('setCmsObject', response.data.cmsPage);

                    resolve(response);
                })
                .catch((error) => {
                    console.log('err occurred: ', error);
                    reject(error);
                });
        });
    },
};
