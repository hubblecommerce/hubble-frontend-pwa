//
// Category store
//

export default function (ctx) {
    const modApiCategory = {
        namespaced: true,
        state: () => ({
            dataCategory: {},
            dataCategoryProducts: {},
        }),
        mutations: {
            setDataCategory: (state, payload) => {
                state.dataCategory = payload.data;
            },
            setDataCategoryProducts: (state, payload) => {
                state.dataCategoryProducts = payload.data;
            },

        },
        getters:  {
            getDataCategory: state => {
                return state.dataCategory;
            },
            getDataCategoryProducts: state => {
                return state.dataCategoryProducts;
            },

        },
        actions: {
        }
    };

    ctx.store.registerModule('modApiCategory', modApiCategory);
}
