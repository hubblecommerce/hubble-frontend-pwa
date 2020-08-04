import _ from 'lodash';

export default function (ctx) {
    const modApiProduct = {
        namespaced: true,
        state: () => ({
            dataProduct: {},
            dataProductRelations: {},
            dataProductsCrossBuybox: {},
            dataProductsCrossByOrder: {},
            dataProductsCrossSimilar: {},
            dataProductUpsellings: {},
            optionIsSelected: false,
            optionNotSelectedError: false,

            selectedVariants: [],

            // Routing Information
            openDetail: false,
            productId: null,
        }),
        mutations: {
            setDataProduct: (state, payload) => {
                state.dataProduct = payload.data;
            },
            setDataProductItem: (state, payload) => {
                state.dataProduct.result.item = payload.data;
            },
            setDataProductRelations: (state, payload) => {
                state.dataProductRelations = payload.data;
            },
            setDataProductsCrossBuybox: (state, payload) => {
                state.dataProductsCrossBuybox = payload.data;
            },
            setDataProductsCrossByOrder: (state, payload) => {
                state.dataProductsCrossByOrder = payload.data;
            },
            setDataProductsCrossSimilar: (state, payload) => {
                state.dataProductsCrossSimilar = payload.data;
            },
            setDataProductUpsellings: (state, payload) => {
                state.dataProductUpsellings = payload.data;
            },
            setOptionIsSelected: (state, variant) => {
                state.optionIsSelected = true;
                state.selectedVariants = [];
                state.selectedVariants.push(variant);
            },
            resetSelectedVariants: state => {
                state.optionIsSelected = false;
                state.selectedVariants = [];
            },
            setOptionNotSelectedError: state => {
                state.optionNotSelectedError = true;
            },
            removeOptionNotSelectedError: state => {
                state.optionNotSelectedError = false;
            },
            setOpenDetail: (state, payload) => {
                state.openDetail = payload;
            },
            setProductId: (state, payload) => {
                state.productId = payload;
            },
        },
        getters: {
            getMediaGalleryArray: state => {
                if (!_.isEmpty(state.dataProduct)) {
                    let image = state.dataProduct.result.item.image,
                        mediaGallery = state.dataProduct.result.item.media_gallery;
                    let allProductImages = [];

                    allProductImages.push(image);
                    mediaGallery.forEach(item => {
                        allProductImages.push(item.value);
                    });

                    return allProductImages;
                }
            },
            getOpenDetail: state => {
                return state.openDetail;
            },
            getProductId: state => {
                return state.productId;
            },
        },
        actions: {
            async getProductData({ commit, state, dispatch }) {
                return new Promise(function (resolve, reject) {
                    let endpoint = _.join(['/api/json/products/', state.productId], '');

                    dispatch(
                        'apiCall',
                        {
                            action: 'get',
                            tokenType: 'api',
                            apiType: 'data',
                            endpoint: endpoint,
                            params: {
                                _withProps: _.join(['facets', 'media_gallery', 'related_product_ids', 'search_result_data_children', 'status'], ','),
                            },
                        },
                        { root: true }
                    )
                        .then(response => {
                            commit('setDataProduct', {
                                data: response.data,
                            });
                            resolve('ok');
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            },
            async getRelatedProducts({ commit, dispatch }, payload) {
                return new Promise(function (resolve, reject) {
                    let endpoint = _.join(['/api/json/products/', payload.data, '/relations'], '');

                    dispatch(
                        'apiCall',
                        {
                            action: 'get',
                            tokenType: 'api',
                            apiType: 'data',
                            endpoint: endpoint,
                        },
                        { root: true }
                    )
                        .then(response => {
                            commit('setDataProductRelations', {
                                data: response.data,
                            });

                            resolve('OK');
                        })
                        .catch(() => {
                            reject('API request failed!');
                        });
                });
            },
            async getProductsCrossBuybox({ commit, dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    let endpoint = _.join(['/api/json/products/', payload.data, '/buybox'], '');

                    dispatch(
                        'apiCall',
                        {
                            action: 'get',
                            tokenType: 'api',
                            apiType: 'data',
                            endpoint: endpoint,
                        },
                        { root: true }
                    )
                        .then(response => {
                            //Save Cross-selling data to store
                            commit('setDataProductsCrossBuybox', {
                                data: response.data.result.items,
                            });

                            resolve(response.data);
                        })
                        .catch(() => {
                            reject('API request failed!');
                        });
                });
            },
            async getProductsCrossByOrder({ commit, dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    let endpoint = _.join(['/api/json/products/', payload.data, '/byorder'], '');

                    dispatch(
                        'apiCall',
                        {
                            action: 'get',
                            tokenType: 'api',
                            apiType: 'data',
                            endpoint: endpoint,
                        },
                        { root: true }
                    )
                        .then(response => {
                            //Save Cross-selling data to store
                            commit('setDataProductsCrossByOrder', {
                                data: response.data.result.items,
                            });

                            resolve(response.data);
                        })
                        .catch(() => {
                            reject('API request failed!');
                        });
                });
            },
            async getProductsCrossSimilar({ commit, dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    let endpoint = _.join(['/api/json/products/', payload.data, '/similar'], '');

                    dispatch(
                        'apiCall',
                        {
                            action: 'get',
                            tokenType: 'api',
                            apiType: 'data',
                            endpoint: endpoint,
                        },
                        { root: true }
                    )
                        .then(response => {
                            //Save Cross-selling data to store
                            commit('setDataProductsCrossSimilar', {
                                data: response.data.result.items,
                            });

                            resolve(response.data);
                        })
                        .catch(() => {
                            reject('API request failed!');
                        });
                });
            },
        },
    };

    ctx.store.registerModule('modApiProduct', modApiProduct);
}
