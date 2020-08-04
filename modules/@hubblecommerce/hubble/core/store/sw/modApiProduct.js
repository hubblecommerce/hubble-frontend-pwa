import { slugify } from '@hubblecommerce/hubble/core/utils/menuHelper';
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
            setOptionIsSelected: state => {
                state.optionIsSelected = true;
            },
            setSelectedVariants: (state, payload) => {
                state.selectedVariants = payload;
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
                    let allProductImages = [],
                        mediaGallery = state.dataProduct.result.item.media_gallery;

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
            async getProductData({ commit, state, dispatch }, payload) {
                return new Promise(function (resolve, reject) {
                    let endpoint = _.join(
                        [
                            '/sales-channel-api/v1/product/',
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
                        .then(response => {
                            dispatch('mappingProduct', { product: response.data.data, path: payload.path }).then(res => {
                                commit('setDataProduct', {
                                    data: {
                                        result: {
                                            item: res,
                                        },
                                    },
                                });

                                resolve('ok');
                            });
                        })
                        .catch(error => {
                            console.log('getProductData error: ', error);

                            reject(error);
                        });
                });
            },
            async mappingProduct({ dispatch }, payload) {
                return new Promise(function (resolve, reject) {
                    let obj = {};

                    let product = payload.product;

                    obj.id = product.id;
                    obj.sku = product.ean;
                    obj.type = 'simple';
                    if (product.childCount > 0) {
                        obj.type = 'configurable';
                    }
                    if (product.cover !== null) {
                        obj.image = product.cover.media.url;
                    }
                    obj.name = product.name;
                    obj.description = product.description;
                    obj.meta_title = product.metaTitle;
                    obj.meta_keywords = product.keywords;
                    obj.meta_description = product.metaDescription;
                    if (product.manufacturer !== null) {
                        obj.manufacturer_id = product.manufacturer.id;
                        obj.manufacturer_name = product.manufacturer.name;

                        obj.manufacturer_item = {
                            url: product.manufacturer.link,
                            name: product.manufacturer.name,
                        };

                        if (product.manufacturer.media !== null) {
                            obj.manufacturer_item.logo = product.manufacturer.media.url;
                        }
                    }
                    obj.name_orig = product.name;

                    if (!_.isEmpty(product.seoUrls)) {
                        obj.url_pds = product.seoUrls[product.seoUrls.length - 1].seoPathInfo;
                    } else if (!_.isEmpty(payload.path)) {
                        obj.url_pds = payload.path;
                    } else {
                        obj.url_pds = slugify(payload.product.name);
                    }
                    obj.stock_item = {
                        qty: product.stock,
                        is_in_stock: product.available,
                    };
                    obj.final_price_item = {
                        special_to_date: null,
                        special_from_date: null,
                        display_price_netto: product.price[0].net,
                        display_price_netto_special: null,
                        display_price_brutto: product.price[0].gross,
                        display_price_brutto_special: null,
                        priceinfo: null,
                        tax_class_id: 1,
                    };

                    if (!_.isEmpty(product.calculatedPrices)) {
                        obj.calculatedPrices = product.calculatedPrices;
                    }

                    if (product.deliveryTime !== null) {
                        obj.delivery_time = product.deliveryTime;
                    }

                    obj.shipping_free = product.shippingFree;

                    obj.media_gallery = [];
                    if (product.media !== null) {
                        _.each(product.media, item => {
                            obj.media_gallery.push({
                                attribute_id: null,
                                value: item.media.url,
                                label: item.media.alt,
                                position: item.position,
                                disabled: false,
                            });
                        });
                    }

                    obj.related_product_ids = {
                        buybox: [],
                        byorder: [],
                    };

                    obj.crossSellings = product.crossSellings;

                    obj.status = {
                        is_new_from_date: '',
                        is_new_to_date: '',
                    };

                    obj.facets = {
                        number_facets: [],
                        string_facets: [],
                        category_facets: [],
                    };

                    obj.properties = product.properties;
                    obj.optionIds = product.optionIds;
                    obj.options = product.options;

                    // Generate Children
                    if (product.childCount > 0) {
                        obj.children = [];

                        let uniqueOptionsOfAllChildren = [];

                        _.forEach(product.children, child => {
                            dispatch('mappingProduct', { product: child, path: '' }).then(res => {
                                obj.children.push(res);
                            });

                            // Generate unique options
                            // Each option includes it's group
                            _.forEach(child.options, option => {
                                if (!_.some(uniqueOptionsOfAllChildren, option)) {
                                    uniqueOptionsOfAllChildren.push(option);
                                }
                            });
                        });

                        // Generate unique groups
                        let groups = [];
                        _.forEach(uniqueOptionsOfAllChildren, option => {
                            if (!_.some(groups, option.group)) {
                                groups.push(option.group);
                            }
                        });

                        // Assign each unique group it's unique options
                        _.forEach(groups, group => {
                            group.options = [];
                            _.forEach(uniqueOptionsOfAllChildren, option => {
                                if (option.groupId === group.id) {
                                    group.options.push(option);
                                }
                            });
                        });

                        obj.groups = groups;
                    }

                    resolve(obj);
                });
            },
        },
    };

    ctx.store.registerModule('modApiProduct', modApiProduct);
}
