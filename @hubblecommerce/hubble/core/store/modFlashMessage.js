export const state = () => ({
    text: '',
    type: '',
    lifeTime: 10, // Seconds
});

export const mutations = {
    setText(state, payload) {
        state.text = payload;
    },
    setType(state, payload) {
        state.type = payload;
    },
};

export const actions = {
    async flashMessage({ commit, dispatch, state }, payload) {
        commit('setText', payload.text);
        commit('setType', payload.type);

        if (payload.persist != null && payload.persist === true) {
            return true;
        }

        setTimeout(() => {
            dispatch('unflashMessage');
        }, state.lifeTime * 1000);
    },
    async unflashMessage({ commit }) {
        commit('setText', '');
        commit('setType', '');
    },
};
