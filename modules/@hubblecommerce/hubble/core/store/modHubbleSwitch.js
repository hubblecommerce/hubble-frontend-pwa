export default function (ctx) {

    // Create vuex store module
    const modHubbleSwitch = {
        namespaced: true,
        state: () => ({
            isHubble: true
        }),
        mutations: {
            turnOnHubble: (state) => {
                state.isHubble = true
            },
            turnOffHubble: (state) => {
                state.isHubble = false
            }
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modHubbleSwitch', modHubbleSwitch);
}
