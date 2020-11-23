import _ from 'lodash';

export const state = () => ({
  maxProductItems: 5,
  maxCategoryItems: 5,

  autoCompleteResultsArray: [],
  autoCompleteResults: {
    categoryItems: [],
    productItems: [],
  },

  showAutoCompleteResults: false,

  selectedItemPosition: -1,
  selectedItemId: null,
})

export const getters = {
  getAutoCompleteResults: state => {
    return state.autoCompleteResults;
  },
  getAutoCompleteResultsArray: state => {
    return state.autoCompleteResultsArray;
  },
  getAutoCompleteResultsLength: state => {
    return state.autoCompleteResults.categoryItems.length + state.autoCompleteResults.productItems.length;
  }
}

export const mutations = {
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
  }
}

export const actions = {
  async getAutocompleteResults({ state, commit, dispatch }, payload) {
    return new Promise(function (resolve, reject) {
      dispatch('apiCall', {
        action: 'get',
        tokenType: 'api',
        apiType: 'data',
        endpoint: '/search/autocomplete',
        params: {
          _term: payload.query,
        },
      }, { root: true })
      .then(response => {
        if (response.data.result.stats.count === 0) {
          commit('setShowAutoCompleteResults', false);
        } else {
          _.forEach(response.data.result.groups, group => {
            let currentGroupItems = group.items;
            if (group.meta.label === 'Products') {
              _.slice(currentGroupItems, 0, state.maxProductItems);
              commit('setProductItems', group.items);
            }
            if (group.meta.label === 'Categories') {
              _.slice(currentGroupItems, 0, state.maxCategoryItems);
              commit('setCategoryItems', group.items);
            }
          });

          // Set all items also in one array to handle key events
          commit('setAutoCompleteResultsArray',
            _.concat(
              state.autoCompleteResults.categoryItems,
              state.autoCompleteResults.productItems
              )
            );

          commit('setSelectedItemPosition', -1);
          commit('setSelectedItemId', null);

          commit('setShowAutoCompleteResults', true);
        }

        resolve();
      })
      .catch(error => {
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
    if (state.selectedItemPosition === -1) return;

    let currentSelectedItem = state.autoCompleteResultsArray[state.selectedItemPosition];
    let url = '';

    if (currentSelectedItem.url_path) {
      url = currentSelectedItem.url_path;
    } else {
      url = currentSelectedItem.url_pds;
    }

    this.$router.push('/' + url);
  },
  async apiCatalogsearch({ commit, dispatch, rootGetters }, payload) {
    return new Promise(function (resolve, reject) {
      let query = rootGetters['modApiRequests/queryPaginate'](payload.query);

      commit('modApiRequests/setPaginationOffset', query._from, { root: true });
      commit('modApiRequests/setPaginationPerPage', query._size, { root: true });

      dispatch('apiCall', {
        action: 'get',
        tokenType: 'api',
        apiType: 'data',
        endpoint: '/search/catalogsearch',
        params: _.merge({}, query, {
          _withProps: _.join([
            'facets',
            'media_gallery',
            'search_result_data_children',
            'final_price_item',
            'status'
            ], ','),
        }),
      }, { root: true })
      .then(response => {
        commit('modApiResources/setPageType', 'category', { root: true });

        commit('modApiCategory/setDataCategoryProducts', {
          data: response.data,
        }, { root: true });

        resolve('OK');
      })
      .catch(response => {
        reject('API request failed!');
      });
    });
  },
}
