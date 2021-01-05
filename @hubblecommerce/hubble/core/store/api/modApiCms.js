export const state = () => ({
    dataContent: {},
    dataCustomContent: {},
});

export const mutations = {
    setDataContent: (state, payload) => {
        state.dataContent = payload.data;
    },
    setDataCustomContent: (state, payload) => {
        state.dataCustomContent = payload;
    },
};

export const getters = {
    getDataContent: (state) => {
        return state.dataContent;
    },
    getDataCustomContent: (state) => {
        return state.dataCustomContent;
    },
};
