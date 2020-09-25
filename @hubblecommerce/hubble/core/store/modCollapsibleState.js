export const state = () => ({
    collapsed: true
})

export const mutations = {
    setCollapsed (state)  {
        state.collapsed = false;
    },
    collapseContent (state)  {
        state.collapsed = !state.collapsed;
    }
}
