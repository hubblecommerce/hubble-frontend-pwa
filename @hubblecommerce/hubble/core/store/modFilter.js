export const state = () => ({
    filterTs: null,
    aggregations: {},
    manufacturer: [],
    properties: [],
    minMaxPrice: {}
});

export const getters = {
    anyFilterSet(state) {
        return state.manufacturer.length !== 0
            || state.properties.length !== 0
            || state.minMaxPrice.min != null;
    }
};

export const mutations = {
    resetFilters(state, updateFilter = false) {
        if (updateFilter) state.filterTs = Date.now();

        state.properties = [];
        state.manufacturer = [];
        state.minMaxPrice = {};
    },
    setAggregations(state, payload) {
        state.aggregations = payload;

        this.commit('modFilter/resetFilters');
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