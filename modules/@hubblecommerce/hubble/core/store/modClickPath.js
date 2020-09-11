export const state = () => ({
    clickPath: [],
    clickPathHistoryCount: 5
})

export const getters = {}

export const mutations = {
    setClickPath (state, payload) {
        state.clickPath = payload;
    },
    appendToClickPath (state, payload) {
        if (state.clickPath.length >= state.clickPathHistoryCount) {
            state.clickPath.shift();
        }

        state.clickPath.push(payload);
    }
}
