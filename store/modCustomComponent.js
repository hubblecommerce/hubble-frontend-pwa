export const state = () => ({
    showCustomComponentInstead: false,
})

export const mutations = {
    setShowCustomComponentInstead: (state, payload) => {
        state.showCustomComponentInstead = payload
    }
}
