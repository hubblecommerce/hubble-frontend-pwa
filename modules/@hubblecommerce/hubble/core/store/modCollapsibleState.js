export default function (ctx) {
    const modCollapsibleState = {
        namespaced: true,
        state: () => ({
            collapsed: true,
        }),
        mutations: {
            setCollapsed: state => {
                state.collapsed = false;
            },
            collapseContent: state => {
                state.collapsed = !state.collapsed;
            },
        },
    };

    ctx.store.registerModule('modCollapsibleState', modCollapsibleState);
}
