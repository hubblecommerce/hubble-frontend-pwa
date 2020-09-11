export const state = () => ({
            dataCategory: {},
            dataCategoryProducts: {},
})

export const mutations = {
            setDataCategory: (state, payload) => {
                state.dataCategory = payload.data;
            },
            setDataCategoryProducts: (state, payload) => {
                state.dataCategoryProducts = payload.data;
            }
}

export const getters = {
            getDataCategory: state => {
                return state.dataCategory;
            },
            getDataCategoryProducts: state => {
                return state.dataCategoryProducts;
            }
}

export const actions = {}
