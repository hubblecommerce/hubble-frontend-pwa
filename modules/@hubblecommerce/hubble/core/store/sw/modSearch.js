export default function (ctx) {
    const modSearch = {
        namespaced: true,
        state: () => ({
            maxProductItems: 5,
            maxCategoryItems: 5,

            autoCompleteResultsArray: [],
            autoCompleteResults: {
                categoryItems: [],
                productItems: []
            },

            showAutoCompleteResults: false,

            selectedItemPosition: -1,
            selectedItemId: null
        }),
        getters: {
            getAutoCompleteResults: (state) => {
                return state.autoCompleteResults;
            },
            getAutoCompleteResultsArray: (state) => {
                return state.autoCompleteResultsArray;
            },
            getAutoCompleteResultsLength: (state) => {
                return state.autoCompleteResults.categoryItems.length + state.autoCompleteResults.productItems.length;
            },
        },
        mutations: {
            setAutoCompleteResults: (state, value) => {
                state.autoCompleteResults.categoryItems = value.categoryItems;
                state.autoCompleteResults.productItems = value.productItems;
            },
            setCategoryItems: (state, value) => {
                state.autoCompleteResults.categoryItems = value;
            },
            setProductItems: (state, value) => {
                state.autoCompleteResults.productItems = value;
            },
            setAutoCompleteResultsArray: (state, value) => {
                state.autoCompleteResultsArray = value;
            },
            setSelectedItemPosition: (state, value) => {
                state.selectedItemPosition = value;
            },
            setSelectedItemId: (state, value) => {
                state.selectedItemId = value;
            },
            setShowAutoCompleteResults: (state, value) => {
                state.showAutoCompleteResults = value;
            },
        },
        actions: {
            // Api call to search/autocomplete
            async getAutocompleteResults({commit, state, rootState, dispatch}, payload) {
                return new Promise(function(resolve, reject) {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: '/sales-channel-api/v1/product?&associations[manufacturer][]',
                        params: {
                            term: payload.query,
                            limit: 500
                        }
                    }, { root: true })
                        .then(response => {
                            if(response.data.total === 0) {
                                commit('setShowAutoCompleteResults', false);

                                resolve('OK');
                            } else {
                                // map product data
                                dispatch('modApiCategory/mappingCategoryProducts', response.data, {root:true})
                                    .then((res) => {
                                        // Get all product urls to find urls of search result products
                                        dispatch('modApiResources/swGetProductUrls',{}, {root:true}).then(() => {
                                            _.forEach(res.items, (item, key) => {
                                                let matchingProduct = _.find(rootState.modApiResources.dataProductUrls, function(o) {
                                                    return o.foreignKey === item.id;
                                                });

                                                // Set urls of matches
                                                res.items[key].url_pds = matchingProduct.seoPathInfo;

                                                commit('setProductItems', res.items);

                                                // Set all items also in one array to handle key events
                                                commit('setAutoCompleteResultsArray', state.autoCompleteResults.productItems);
                                                commit('setSelectedItemPosition', -1);
                                                commit('setSelectedItemId', null);
                                                commit('setShowAutoCompleteResults', true);

                                                resolve('OK');
                                            });
                                        });
                                    });
                            }
                        })
                        .catch(response => {
                            reject('API request failed!');
                        });
                });
            },
            // Reset data in store to initial state
            resetAutoCompleteResults({commit}) {
                commit('setAutoCompleteResults', {
                    categoryItems: [],
                    productItems: []
                });

                commit('setAutoCompleteResultsArray', []);

                commit('setSelectedItemPosition', -1);

                commit('setSelectedItemId', null);

                commit('setShowAutoCompleteResults', false);
            },
            // Change the selected item depending on key event
            changeSelectedItem({state, commit}, payload) {
                if(_.isEmpty(state.autoCompleteResultsArray)) {
                    return;
                }

                let currentItemPosition = state.selectedItemPosition;

                currentItemPosition = currentItemPosition + payload;

                if(currentItemPosition < 0) {
                    currentItemPosition = state.autoCompleteResultsArray.length - 1;
                }

                if(currentItemPosition >= state.autoCompleteResultsArray.length) {
                    currentItemPosition = 0;
                }

                commit('setSelectedItemPosition', currentItemPosition);

                commit('setSelectedItemId', state.autoCompleteResultsArray[currentItemPosition].id);
            },
            // Redirect to product or category if an item is selected via keyevent
            redirectToItem({state}) {
                if(state.selectedItemPosition === -1) {
                    return;
                }

                let currentSelectedItem = state.autoCompleteResultsArray[state.selectedItemPosition];

                let url = '';

                if(currentSelectedItem.url_path) {
                    url = currentSelectedItem.url_path;
                } else {
                    url = currentSelectedItem.url_pds;
                }

                ctx.app.router.push('/' + url);
            },
            async apiCatalogsearch({commit, rootState, dispatch}) {
                return new Promise(function(resolve, reject) {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: '/sales-channel-api/v1/product',
                        data: rootState.modApiCategory.apiRequestBody
                    }, { root: true })
                    .then(response => {
                        if(response.data.total === 0) {
                            resolve('OK');
                        }

                        // map product data
                        dispatch('modApiCategory/mappingCategoryProducts', response.data, {root:true}).then((res) => {
                            // Get all product urls to find urls of search result products
                            dispatch('modApiResources/swGetProductUrls',{}, {root:true}).then(() => {
                                _.forEach(res.items, (item, key) => {
                                    let matchingProduct = _.find(rootState.modApiResources.dataProductUrls, function(o) {
                                        return o.foreignKey === item.id;
                                    });

                                    // Set urls of matches
                                    res.items[key].url_pds = matchingProduct.seoPathInfo;

                                    commit('modApiResources/setPageType', 'category' , {root: true});

                                    commit('modApiCategory/setDataCategoryProducts', {
                                        data: {
                                            result: res
                                        }
                                    }, {root:true});

                                    resolve('OK');
                                });
                            });
                        });
                    })
                    .catch(response => {
                        reject('API request failed!');
                    });
                })
            },
        }
    };

    ctx.store.registerModule('modSearch', modSearch);
}
