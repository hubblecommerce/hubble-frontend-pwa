export default function (ctx) {
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
    
    ctx.store.registerModule('modHubbleSwitch', modHubbleSwitch);
}
