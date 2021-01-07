import _ from 'lodash';

export const state = () => ({
    maxProductItems: 5,

    autoCompleteResultsArray: [],
    autoCompleteResults: {
        categoryItems: [],
        productItems: [],
    },

    showAutoCompleteResults: false,

    selectedItemPosition: -1,
    selectedItemId: null,
});

export const getters = {
    getAutoCompleteResults(state) {
        return state.autoCompleteResults;
    },
    getAutoCompleteResultsArray(state) {
        return state.autoCompleteResultsArray;
    },
    getAutoCompleteResultsLength(state) {
        return state.autoCompleteResults.categoryItems.length + state.autoCompleteResults.productItems.length;
    },
};

export const mutations = {
    setAutoCompleteResults(state, value) {
        state.autoCompleteResults.categoryItems = value.categoryItems;
        state.autoCompleteResults.productItems = value.productItems;
    },
    setCategoryItems(state, value) {
        state.autoCompleteResults.categoryItems = value;
    },
    setProductItems(state, value) {
        state.autoCompleteResults.productItems = value;
    },
    setAutoCompleteResultsArray(state, value) {
        state.autoCompleteResultsArray = value;
    },
    setSelectedItemPosition(state, value) {
        state.selectedItemPosition = value;
    },
    setSelectedItemId(state, value) {
        state.selectedItemId = value;
    },
    setShowAutoCompleteResults(state, value) {
        state.showAutoCompleteResults = value;
    },
};

export const actions = {
    // Api call to search/autocomplete
    async getAutocompleteResults({ commit, state, dispatch }, payload) {
        return new Promise(function (resolve, reject) {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    endpoint: '/store-api/v3/search',
                    data: {
                        search: payload.query,
                        limit: state.maxProductItems,
                        associations: {
                            manufacturer: {},
                            seoUrls: {},
                        },
                        // Get only Products with parent ID null
                        // because children (generated variants) are delivered from API
                        // with missing props like name etc.
                        filter: [
                            {
                                type: 'equals',
                                field: 'parentId',
                                value: null,
                            },
                        ],
                    },
                },
                { root: true }
            )
                .then((response) => {
                    if (response.data.total === 0) {
                        commit('setProductItems', []);
                        commit('setShowAutoCompleteResults', true);

                        resolve('No products found');
                    } else {
                        // map product data
                        dispatch('modApiCategory/mappingCategoryProducts', response.data, { root: true }).then(
                            (res) => {
                                commit('setProductItems', res.items);

                                // Set all items also in one array to handle key events
                                commit('setAutoCompleteResultsArray', state.autoCompleteResults.productItems);
                                commit('setSelectedItemPosition', -1);
                                commit('setSelectedItemId', null);
                                commit('setShowAutoCompleteResults', true);

                                resolve('OK');
                            }
                        );
                    }
                })
                .catch((error) => {
                    console.log('getAutocompleteResults error: ', error);

                    reject(error);
                });
        });
    },
    // Reset data in store to initial state
    resetAutoCompleteResults({ commit }) {
        commit('setAutoCompleteResults', {
            categoryItems: [],
            productItems: [],
        });

        commit('setAutoCompleteResultsArray', []);

        commit('setSelectedItemPosition', -1);

        commit('setSelectedItemId', null);

        commit('setShowAutoCompleteResults', false);
    },
    // Change the selected item depending on key event
    changeSelectedItem({ state, commit }, payload) {
        if (_.isEmpty(state.autoCompleteResultsArray)) {
            return;
        }

        let currentItemPosition = state.selectedItemPosition;

        currentItemPosition = currentItemPosition + payload;

        if (currentItemPosition < 0) {
            currentItemPosition = state.autoCompleteResultsArray.length - 1;
        }

        if (currentItemPosition >= state.autoCompleteResultsArray.length) {
            currentItemPosition = 0;
        }

        commit('setSelectedItemPosition', currentItemPosition);

        commit('setSelectedItemId', state.autoCompleteResultsArray[currentItemPosition].id);
    },
    // Redirect to product or category if an item is selected via keyevent
    redirectToItem({ state }) {
        if (state.selectedItemPosition === -1) {
            return;
        }

        let currentSelectedItem = state.autoCompleteResultsArray[state.selectedItemPosition];

        let url = '';

        if (currentSelectedItem.url_path) {
            url = currentSelectedItem.url_path;
        } else {
            url = currentSelectedItem.url_pds;
        }

        this.$router.push('/' + url);
    },
    async apiCatalogsearch({ commit, rootState, dispatch }) {
        return new Promise(function (resolve, reject) {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    endpoint: '/store-api/v3/search',
                    data: rootState.modApiCategory.apiRequestBody,
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response);
                })
                .catch(() => {
                    reject('API request failed: /store-api/v3/search');
                });
        });
    },
};
