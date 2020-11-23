import _ from 'lodash';

export const state = () => ({
  cacheTTL: 300,

  // api
  apiLocale: null,

  // resources
  dataUri: {},

  // stuff
  pageType: null
})

export const mutations = {
  setApiLocale: (state, item) => {
    state.apiLocale = item;
  },
  setDataUri: (state, item) => {
    state.dataUri = item;
  },
  setPageType: (state, item) => {
    state.pageType = item;
  },
}

export const getters = {
  getApiLocale: state => {
    return state.apiLocale;
  },
  getQueryPaginated: (state, getters, rootState, rootGetters) => query => {
    return rootGetters['modApiRequests/queryPaginate'](query);
  },
  getPageType: state => {
    return state.pageType;
  }
}

export const actions = {
  async apiResolveUriData({ commit, dispatch, getters }, payload) {
    return new Promise((resolve, reject) => {
      let _outerReject = reject;
      let _outerResolve = resolve;

      commit('setDataUri', payload.data);

      return new Promise((resolve, reject) => {
        // fetch category data, if known by uri object
        if (payload.data.result.item.category_id) {
          let endpoint = _.join([
            _.trim('/categories', '/'),
            _.trim(payload.data.result.item.category_id, '/')
            ], '/');

          dispatch('apiCall', {
            action: 'get',
            tokenType: 'api',
            apiType: 'data',
            endpoint: endpoint,
            params: {
              _withProps: _.join([
                'path',
                'path_ids',
                'path_names',
                'path_urls',
                'display_mode',
                'parent_id'
                ], ','),
            },
          }, { root: true })
          .then(response => {
            commit('modApiCategory/setDataCategory', {
              data: response.data,
            }, { root: true });

            // resolve("category OK!");
          })
          .catch(() => {
            _outerReject('failed to get category data!');
          });
        }

        // fetch product, if known by uri object
        if (payload.data.result.item.product_id) {
          let endpoint = _.join([
            _.trim('/products', '/'),
            _.trim(payload.data.result.item.product_id, '/')
            ], '/');

          dispatch('apiCall', {
            action: 'get',
            tokenType: 'api',
            apiType: 'data',
            endpoint: endpoint,
            params: {
              _withProps: _.join(
                [
                'facets',
                'media_gallery',
                'related_product_ids',
                'search_result_data_children',
                'status'
                ], ','),
            },
          }, { root: true })
          .then(response => {
            commit('setPageType', 'product');

            commit('modApiProduct/setDataProduct', {
              data: response.data,
            }, { root: true });

            _outerResolve(response);
          });
        } else if (payload.data.result.item.content_id === null) {
          // fetch category products, if known by uri object

          let endpoint = _.join([
            _.trim('/categories', '/'),
            _.trim(payload.data.result.item.category_id, '/'),
            _.trim('/products', '/')
            ], '/');

          let query = getters.getQueryPaginated(payload.query);

          commit('modApiRequests/setPaginationOffset', query._from, { root: true });
          commit('modApiRequests/setPaginationPerPage', query._size, { root: true });

          dispatch('apiCall', {
            action: 'get',
            tokenType: 'api',
            apiType: 'data',
            endpoint: endpoint,
            params: _.merge({}, query, {
              _withProps: _.join([
                'facets',
                'media_gallery',
                'search_result_data_children',
                'status'
                ], ','),
            }),
          }, { root: true })
          .then(response => {
            commit('setPageType', 'category');

            commit('modApiCategory/setDataCategoryProducts', {
              data: response.data,
            }, { root: true });

            _outerResolve(response);
          });
        }

        // fetch cms content, if known by uri object
        if (payload.data.result.item.content_id) {
          let endpoint = _.join([
            _.trim('/cms/blocks', '/'),
            _.trim(payload.data.result.item.request_path, '/')
            ], '/');

          dispatch('apiCall', {
            action: 'get',
            tokenType: 'api',
            apiType: 'data',
            endpoint: endpoint,
          }, { root: true })
          .then(response => {
            commit('setPageType', 'content');

            commit('modApiCms/setDataContent', {
              data: response.data.result,
            }, { root: true });

            _outerResolve();
          });
        }
      });

      resolve('OK, but should be resolved earlier!');
    });
}
}
