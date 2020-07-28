export default function (ctx) {
    const modClickPath = {
        namespaced: true,
        state: () => ({
            clickPath: [],
            clickPathHistoryCount: 5,
        }),
        getters: {},
        mutations: {
            setClickPath: (state, payload) => {
                state.clickPath = payload;
            },
            appendToClickPath: (state, payload) => {
                if (state.clickPath.length >= state.clickPathHistoryCount) {
                    state.clickPath.shift();
                }

                state.clickPath.push(payload);
            },
        },
    };

    ctx.store.registerModule('modClickPath', modClickPath);
}
