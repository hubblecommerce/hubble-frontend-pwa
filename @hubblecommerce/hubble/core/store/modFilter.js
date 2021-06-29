export const state = () => ({
    filterTs: null,
    aggregations: {},
    manufacturer: [],
    properties: [],
    minMaxPrice: {}
});

export const mutations = {
    setAggregations(state, payload) {
        state.properties = [];
        state.manufacturer = [];
        state.minMaxPrice = {};

        state.aggregations = payload;
    },
    updateProperties(state, payload) {
        state.filterTs = Date.now();

        if (state.properties.includes(payload)) {
            state.properties = state.properties.filter(v => v !== payload)
        } else {
            state.properties = [...state.properties, payload];
        }
    },
    updateManufacturer(state, payload) {
        state.filterTs = Date.now();

        if (state.manufacturer.includes(payload)) {
            state.manufacturer = state.manufacturer.filter(v => v !== payload)
        } else {
            state.manufacturer = [...state.manufacturer, payload];
        }
    },
    updatePrice(state, payload) {
        state.filterTs = Date.now();

        state.minMaxPrice = payload;
    }
};