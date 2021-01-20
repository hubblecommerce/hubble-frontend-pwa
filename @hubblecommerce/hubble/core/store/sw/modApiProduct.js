import { productMapping } from '@hubblecommerce/hubble/core/mapping/sw/product';
import _ from 'lodash';

export const state = () => ({
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
});

export const mutations = {
    setDataProduct(state, payload) {
        state.dataProduct = payload.data;
    },
    setDataProductItem(state, payload) {
        state.dataProduct.result.item = payload.data;
    },
    setDataProductRelations(state, payload) {
        state.dataProductRelations = payload.data;
    },
    setDataProductsCrossBuybox(state, payload) {
        state.dataProductsCrossBuybox = payload.data;
    },
    setDataProductsCrossByOrder(state, payload) {
        state.dataProductsCrossByOrder = payload.data;
    },
    setDataProductsCrossSimilar(state, payload) {
        state.dataProductsCrossSimilar = payload.data;
    },
    setDataProductUpsellings(state, payload) {
        state.dataProductUpsellings = payload.data;
    },
    setOptionIsSelected(state) {
        state.optionIsSelected = true;
    },
    setSelectedVariants(state, payload) {
        state.selectedVariants = payload;
    },
    resetSelectedVariants(state) {
        state.optionIsSelected = false;
        state.selectedVariants = [];
    },
    setOptionNotSelectedError(state) {
        state.optionNotSelectedError = true;
    },
    removeOptionNotSelectedError(state) {
        state.optionNotSelectedError = false;
    },
    setOpenDetail(state, payload) {
        state.openDetail = payload;
    },
    setProductId(state, payload) {
        state.productId = payload;
    },
};

export const getters = {
    getMediaGalleryArray(state) {
        if (!_.isEmpty(state.dataProduct)) {
            let allProductImages = [],
                mediaGallery = state.dataProduct.result.item.media_gallery;

            mediaGallery.forEach((item) => {
                allProductImages.push(item.value);
            });

            return allProductImages;
        }
    },
    getOpenDetail(state) {
        return state.openDetail;
    },
    getProductId(state) {
        return state.productId;
    },
};

export const actions = {
    async fetchProduct({ commit, state, dispatch }, payload) {
        try {
            const response = await dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    endpoint: '/store-api/v3/product',
                    data: {
                        filter: payload.filter,
                        associations: {
                            "manufacturer": {
                                "associations": {
                                    "media": {},
                                },
                            },
                            "properties": {
                                "associations": {
                                    "group": {}
                                }
                            },
                            "media": {},
                            "productReviews": {},
                            "options": {
                                "associations": {
                                    "productOptions": {},
                                    "group": {}
                                }
                            },
                            "categories": {},
                            "seoUrls": {},
                            "crossSellings": {},
                        },
                        includes: {
                            "product": [
                                "media",
                                "productReviews",
                                "children",
                                "name",
                                "ratingAverage",
                                "calculatedPrice",
                                "calculatedPrices",
                                "calculatedListingPrice",
                                "cover",
                                "parentId",
                                "id",
                                "translated",
                                "options",
                                "properties",
                                "productNumber",
                                "manufacturer",
                                "seoUrls",
                                "optionIds",
                                "ean",
                                "description",
                                "stock",
                                "available",
                                "deliveryTime",
                                "shippingFree",
                                "crossSellings",
                                "childCount"
                            ],
                            "product_media": [
                                "media"
                            ],
                            "calculated_price": [
                                "unitPrice",
                                "quantity",
                                "listPrice"
                            ],
                        }
                    }
                },
                { root: true }
            );

            return response;
        } catch(error) {
            console.log('getProductData error: ', error);
            return error;
        }
    },
    async getProductData({ commit, state, dispatch }, payload) {
        return new Promise(function (resolve, reject) {
            let endpoint = _.join(
                [
                    '/store-api/v3/product/',
                    state.productId,
                    '?associations[manufacturer][associations][media][]',
                    '&associations[seoUrls][]',
                    '&associations[media][]',
                    '&associations[children][associations][options][associations][group][]',
                    '&associations[crossSellings][]',
                ],
                ''
            );

            dispatch(
                'apiCall',
                {
                    action: 'get',
                    tokenType: 'sw',
                    apiType: 'data',
                    endpoint: endpoint,
                },
                { root: true }
            )
                .then((response) => {
                    dispatch('mappingProduct', { product: response.data.data, path: payload.path }).then((res) => {
                        let responseObj = {
                            data: {
                                result: {
                                    item: res
                                }
                            }
                        };

                        commit('setDataProduct', responseObj);

                        resolve(responseObj);
                    });
                })
                .catch((error) => {
                    console.log('getProductData error: ', error);

                    reject(error);
                });
        });
    },
    async mappingProduct({ dispatch }, payload) {
        return new Promise(function (resolve, reject) {
            let product = payload.product;
            let obj = productMapping(product,payload);
            
            resolve(obj);
        });
    },
};
