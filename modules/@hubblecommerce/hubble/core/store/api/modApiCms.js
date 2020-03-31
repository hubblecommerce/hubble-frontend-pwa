export default function (ctx) {
    const modApiCms = {
        namespaced: true,
        state: () => ({
            dataContent: {},
            dataCustomContent: {},
        }),
        mutations: {
            setDataContent: (state, payload) => {
                state.dataContent = payload.data;
            },
            setDataCustomContent: (state, payload) => {
                state.dataCustomContent = payload;
            },
        },
        getters:  {
            getDataContent: state => {
                return state.dataContent;
            },
            getDataCustomContent: state => {
                return state.dataCustomContent;
            },
        },
        actions: {
        }
    };

    ctx.store.registerModule('modApiCms', modApiCms);
}
