export default function (ctx) {

    // Create vuex store module
    const modClickPath = {
        namespaced: true,
        state: () => ({
            clickPath: [],
            clickPathHistoryCount: 5
        }),
        getters: {
            getLastVisited: (state) => {
                let cutLastElement = state.clickPath.slice(-1);

                console.log(cutLastElement);

                return false;
            },
        },
        mutations: {
            setClickPath: (state, payload) => {
                state.clickPath = payload;
            },
            appendToClickPath: (state, payload) => {
                if(state.clickPath.length >= state.clickPathHistoryCount) {
                    state.clickPath.shift();
                }

                state.clickPath.push(payload);
            }
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modClickPath', modClickPath);
}
