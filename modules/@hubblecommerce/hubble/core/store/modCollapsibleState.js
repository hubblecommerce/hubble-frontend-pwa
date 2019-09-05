export default function (ctx) {

    // Create vuex store module
    const modCollapsibleState = {
        namespaced: true,
        state: () => ({
            collapsed: true
        }),
        mutations: {
            setCollapsed: (state) => {
                state.collapsed = false;
            },
            collapseContent: (state) => {
                state.collapsed = !state.collapsed;
            }
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modCollapsibleState', modCollapsibleState);
}
