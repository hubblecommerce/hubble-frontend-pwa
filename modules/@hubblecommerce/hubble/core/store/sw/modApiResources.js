//
// resources module
//
import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime'
import { sortMenuEntries, slugify, unflatten } from "@hubblecommerce/hubble/core/utils/menuHelper";

export default function (ctx) {

    // Create vuex store module
    const modApiResources = {
        namespaced: true,
        state: () => ({
            cacheTTL: 300,

            // api
            apiLocale: null,

            // resources
            dataUri: {},

            // Routing Information
            openDetail: false,
            productId: null,

            // Menu
            dataMenu: {},
            dataMenuCacheable: true,

            // Product
            dataProductUrls: {},
            dataProduct: {},
            dataProductRelations: {},
            dataProductsCrossBuybox: {},
            dataProductsCrossByOrder: {},
            dataProductsCrossSimilar: {},
            dataProductUpsellings: {},
            optionIsSelected: false,
            optionNotSelectedError: false,

            // Category
            dataCategory: {},
            dataCategoryProducts: {},
            selectedVariants: [],
            apiRequestBody: {
                limit: process.env.limiter_default,
                page: 1,
                filter: [
                    {
                        type: 'equals',
                        field: 'active',
                        value: true
                    },
                    {
                        type: 'range',
                        field: 'stock',
                        parameters: {
                            gt: 0
                        }
                    }
                ],
                sort: [
                    {
                        field: 'price',
                        direction: 'asc'
                    }
                ],
                associations: {
                    manufacturer: {},
                    media: {},
                    cover: {}
                }
            },

            // CMS
            dataContent: {},
            dataCustomContent: {},

            // stuff
            pageType: null

        }),
        mutations: {
            setOptionIsSelected: (state, variant) => {
                state.optionIsSelected = true;
                state.selectedVariants = [];
                state.selectedVariants.push(variant);
            },
            resetSelectedVariants: (state) => {
                state.optionIsSelected = false;
                state.selectedVariants = [];
            },
            setOptionNotSelectedError: (state) => {
                state.optionNotSelectedError = true;
            },
            removeOptionNotSelectedError: (state) => {
                state.optionNotSelectedError = false;
            },
            setApiLocale: (state, item) => {
                state.apiLocale = item;
            },
            clearDataMenu: (state) => {
                state.dataMenu = {};
            },
            setDataUri: (state, item) => {
                state.dataUri = item;
            },
            setDataMenu: (state, payload) => {

                // Set menu data from payload
                state.dataMenu = payload.data;

                // local copy of menu items before resetting object for mapping
                state.menuItems = payload.data.result.items;

                // Override menu with menu structure from config
                if(process.env.menu) {
                    let map = process.env.menu;

                    // Clear menu structure of api get to set structure of mapping
                     state.dataMenu.result.items = [];

                    _.forEach(map, (val, key) => {

                        // Use menu item from api result by category id when it is set in config
                        if(val.id !== null) {
                            // Get menu item from payload by id
                            _.forEach(state.menuItems, (v, k) =>  {
                                if(v.id === val.id) {
                                    state.dataMenu.result.items[key] = v;
                                    state.dataMenu.result.items[key].name = val.name;
                                }
                            });
                        }

                        // Build menu from virtual entries without id or real category
                        if(typeof val.id === "undefined") {

                            // configure store as source for child elements
                            let childFromConfig = [];
                            if(typeof val.childrenStore !== "undefined") {
                                childFromConfig = state[val.childrenStore];
                            }
                            // Set virtual menu items through config
                            state.dataMenu.result.items[key] = {
                                id: 'virtual'+key,
                                name: val.name,
                                url_path: val.url_path,
                                children: childFromConfig
                            }
                        }

                        // Add custom children to category if set
                        _.forEach(val.children, (child) => {
                            state.dataMenu.result.items[key].children.push(child);
                        });

                        // Sort menu entry and children of entry alphabetically if flag is set
                        if(val.sortAlphabetically && !_.isEmpty(state.dataMenu.result.items[key].children)) {
                            state.dataMenu.result.items[key].children = sortMenuEntries(state.dataMenu.result.items[key].children);
                        }
                    });
                }

                state.dataMenu.locale = state.apiLocale;

                if(state.dataMenuCacheable) {
                    let _ttl = state.dataMenuCacheableTTL || state.cacheTTL;

                    state.dataMenu.created_at_unixtime = datetimeUnixNow();
                    state.dataMenu.expires_at_unixtime = datetimeUnixNowAddSecs(_ttl);

                }
            },
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
            setDataCategory: (state, payload) => {
                state.dataCategory = payload.data;
            },
            setDataCategoryProducts: (state, payload) => {
                state.dataCategoryProducts = payload.data;
            },
            setPageType: (state, item) => {
                state.pageType = item;
            },
            setDataContent: (state, payload) => {
                state.dataContent = payload.data;
            },
            setDataCustomContent: (state, payload) => {
                state.dataCustomContent = payload;
            },
            setOpenDetail: (state, payload) => {
                state.openDetail = payload;
            },
            setProductId: (state, payload) => {
                state.productId = payload;
            },
            setDataProductUrls: (state, payload) => {
                state.dataProductUrls = payload;

                if(state.dataMenuCacheable) {
                    let _ttl = state.dataMenuCacheableTTL || state.cacheTTL;

                    state.dataProductUrls.created_at_unixtime = datetimeUnixNow();
                    state.dataProductUrls.expires_at_unixtime = datetimeUnixNowAddSecs(_ttl);
                }
            },
            setFilter: (state, payload) => {
                _.remove(state.apiRequestBody.filter, function (o) {
                    // remove by field
                    return o.field === payload.field;
                });
                state.apiRequestBody.filter.push(payload);
            },
            setLimit: (state, payload) => {
                state.apiRequestBody.limit = payload;
            },
            setPage: (state, payload) => {
                state.apiRequestBody.page = payload;
            },
            setTerm: (state, payload) => {
                state.apiRequestBody.term = payload;
            },
            setSorting: (state, payload) => {
                let sort = _.find(process.env.sorter, { 'option_id': parseInt(payload) });
                let direction;

                if(sort.direction === 'asc') {
                    direction = '';
                }

                if(sort.direction === 'desc') {
                    direction = '-';
                }

                state.apiRequestBody.sort = direction + sort.order;
            }
        },
        getters:  {
            getApiLocale: state => {
                return state.apiLocale;
            },
            getDataUri: state => {
                return state.dataUri;
            },
            getDataMenu: state => {
                return state.dataMenu;
            },
            getDataMenuItems: state => {
                return state.dataMenu.items ? state.dataMenu.items : null;
            },
            getDataMenuStats: state => {
                return state.dataMenu.stats ? state.dataMenu.stats : null;
            },
            getDataProduct: state => {
                return state.dataProduct;
            },
            getDataProductRelations: state => {
                return state.dataProductRelations;
            },
            getDataProductsCrossBuybox: state => {
                return state.dataProductsCrossBuybox;
            },
            getDataProductsCrossByOrder: state => {
                return state.dataProductsCrossByOrder;
            },
            getDataProductsCrossSimilar: state => {
                return state.dataProductsCrossSimilar;
            },
            getDataProductUpsellings: state => {
                return state.dataProductUpsellings;
            },
            getDataCategory: state => {
                return state.dataCategory;
            },
            getDataCategoryProducts: state => {
                return state.dataCategoryProducts;
            },
            getQueryPaginated: (state, getters, rootState, rootGetters) => (query) => {
                return rootGetters['modApiRequests/queryPaginate'](query);
            },
            getMediaGalleryArray: state => {
              if(!_.isEmpty(state.dataProduct)) {

                let allProductImages = [],
                    mediaGallery = state.dataProduct.result.item.media_gallery;

                mediaGallery.forEach( item => {
                  allProductImages.push(item.value);
                });

                return allProductImages;
              }
            },
            getDataContent: state => {
                return state.dataContent;
            },
            getDataCustomContent: state => {
                return state.dataCustomContent;
            },
            getOpenDetail: state => {
                return state.openDetail;
            },
            getProductId: state => {
                return state.productId;
            },
            getPageType: state => {
                return state.pageType;
            },
            getDataProductUrls: state => {
                return state.dataProductUrls;
            }
        },
        actions: {
            async mappingMenu({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    // MAPPING
                    let mapped = [];
                    _.forEach(payload, (category) => {

                        let obj = {};

                        // Add 0 as value for parentId to root categories to make unflatten function work
                        if(category.parentId === null) {
                            category.parentId = 0;
                        }

                        // Map required properties from sw response to hubble requirements
                        obj.parentId = category.parentId;
                        obj.name = category.name;
                        // As long as sw api doesn't response with seo_Urls build your own urls via slugify
                        obj.url_path = slugify(category.name);
                        obj.level = category.level;
                        obj.active = category.is_active;
                        obj.id = category._uniqueIdentifier;

                        mapped.push(obj);
                    });

                    // Build required parent child relations from flat array
                    resolve(unflatten(mapped));

                });
            },
            async mappingCategory({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    // MAPPING
                    let obj = {};

                    // Map required properties from sw response to hubble requirements
                    obj.id = payload.id;
                    obj.name = payload.name;

                    if(payload.media !== null) {
                        obj.image = payload.media.url;
                    }

                    obj.description = null;
                    obj.teaser = payload.description;
                    obj.meta_title = payload.metaTitle;
                    obj.meta_keywords = payload.keywords;
                    obj.meta_description = payload.metaDescription;
                    obj.level = payload.level;
                    obj.path_ids = payload.breadcrumb;
                    obj.path_names = payload.breadcrumb;
                    obj.path_urls = [];
                    _.each(payload.breadcrumb, (crumb) => {
                        obj.path_urls.push(slugify(crumb))
                    });

                    resolve(obj);

                });
            },
            async mappingCategoryProducts({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    // MAPPING
                    let mapped = [];
                    _.forEach(payload.data, (product) => {

                        let obj = {};

                        obj.id = product.id;
                        obj.ean = product.ean;
                        obj.type = product.sw;
                        if(product.cover !== null) {
                            obj.image = product.cover.media.url;
                        }
                        obj.name = product.name;
                        obj.description = product.description;
                        obj.meta_title = product.metaTitle;
                        obj.meta_keywords = product.keywords;
                        obj.meta_description = product.metaDescription;
                        if(product.manufacturer !== null) {
                            obj.manufacturer_id = product.manufacturer.id;
                            obj.manufacturer_name = product.manufacturer.name;
                        }
                        if(product.seoUrls !== null) {
                            _.forEach(product.seoUrls, (seoUrl) => {
                                if(seoUrl.isCanonical) {
                                    obj.url_pds = seoUrl.seoPathInfo;
                                }
                            });
                        }
                        obj.stock_item = {
                            qty: product.stock,
                            is_in_stock: product.available
                        };
                        obj.final_price_item = {
                            special_to_date: null,
                            special_from_date: null,
                            display_price_netto: product.price[0].net,
                            display_price_netto_special: null,
                            display_price_brutto: product.price[0].gross,
                            display_price_brutto_special: null,
                            priceinfo: null,
                            tax_class_id: 1
                        };

                        mapped.push(obj);
                    });

                    let obj = {
                        items: mapped,
                        stats: {
                            total: payload.total
                        }
                    };

                    resolve(obj);

                });
            },
            async mappingProduct({commit, state, dispatch, router}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {
                    let obj = {};

                    let product = payload.product;

                    obj.id = product.id;
                    obj.sku = product.ean;
                    obj.type = 'sw';
                    if(product.cover !== null) {
                        obj.image = product.cover.media.url;
                    }
                    obj.name = product.name;
                    obj.description = product.description;
                    obj.meta_title = product.metaTitle;
                    obj.meta_keywords = product.keywords;
                    obj.meta_description = product.metaDescription;
                    if(product.manufacturer !== null) {
                        obj.manufacturer_id = product.manufacturer.id;
                        obj.manufacturer_name = product.manufacturer.name;

                        obj.manufacturer_item = {
                            url: product.manufacturer.link,
                            name: product.manufacturer.name
                        };

                        if(product.manufacturer.media !== null) {
                            obj.manufacturer_item.logo = product.manufacturer.media.url;
                        }
                    }
                    obj.name_orig = product.name;

                    if(!_.isEmpty(product.seoUrls)) {
                        obj.url_pds = product.seoUrls[(product.seoUrls.length - 1)].seoPathInfo;
                    } else {
                        obj.url_pds = payload.path;
                    }
                    obj.stock_item = {
                        qty: product.stock,
                        is_in_stock: product.available
                    };
                    obj.final_price_item = {
                        special_to_date: null,
                        special_from_date: null,
                        display_price_netto: product.price[0].net,
                        display_price_netto_special: null,
                        display_price_brutto: product.price[0].gross,
                        display_price_brutto_special: null,
                        priceinfo: null,
                        tax_class_id: 1
                    };

                    if(product.deliveryTime !== null) {
                        obj.delivery_time = product.deliveryTime;
                    }

                    obj.shipping_free = product.shippingFree;

                    obj.media_gallery = [];
                    if(product.media !== null) {
                        _.each(product.media, (item) => {
                            obj.media_gallery.push({
                                attribute_id: null,
                                value: item.media.url,
                                label: item.media.alt,
                                position: item.position,
                                disabled: false
                            })
                        })
                    }

                    obj.related_product_ids = {
                        buybox: [],
                        byorder: []
                    };

                    obj.status = {
                        is_new_from_date: '',
                        is_new_to_date: ''
                    };

                    obj.facets = {
                        number_facets: [],
                        string_facets: [],
                        category_facets: []
                    };

                    resolve(obj);

                });
            },
            async swGetProductUrls({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = '/sales-channel-api/v1/dmf/seo-url?filter[routeName]=frontend.detail.page&limit=500';

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: _endpoint
                    }, { root: true })
                        .then(response => {
                            commit('setDataProductUrls', response.data.data);

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });

                });
            },
            async swGetMenu({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = '/sales-channel-api/v1/category?&limit=100';

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: _endpoint,
                        params: {
                            _size: 30
                        }
                    }, { root: true })
                        .then(response => {

                            dispatch('mappingMenu', response.data.data).then((res) => {
                                commit('setDataMenu', {
                                    data: {
                                        result: {
                                            items: res
                                        }
                                    }
                                });
                            });

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });

                });
            },
            async setApiRequestFilter({commit, state, dispatch}, payload) {
                return new Promise(function(resolve, reject) {
                    commit('setFilter', payload);
                    resolve();
                });
            },
            async swGetProducts({commit, state, dispatch, rootState}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = '/sales-channel-api/v1/product';

                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: _endpoint,
                        data: state.apiRequestBody
                    }, { root: true })
                        .then(response => {

                            console.log(response)

                            dispatch('mappingCategoryProducts', response.data).then((res) => {

                                // Get all product urls to find urls of search result products
                                dispatch('modApiResources/swGetProductUrls',{}, {root:true}).then(() => {

                                    _.forEach(res.items, (item, key) => {

                                        let matchingProduct = _.find(rootState.modApiResources.dataProductUrls, function(o) {
                                            return o.foreignKey === item.id;
                                        });

                                        // Set urls of matches
                                        res.items[key].url_pds = matchingProduct.seoPathInfo;

                                        commit('setDataCategoryProducts', {
                                            data: {
                                                result: res
                                            }
                                        });

                                        resolve();

                                    });

                                });

                            });

                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);
                            reject('API request failed!');
                        });

                });
            },
            async swGetCategoryProductsById({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = '/sales-channel-api/v1/category/'+payload.id+
                        '?associations[products][associations][seoUrls][]' +
                        '&associations[products][associations][manufacturer][]' +
                        '&associations[products][associations][options][]' +
                        '&associations[products][associations][cover][]' +
                        '&associations[media][]';

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: _endpoint
                    }, { root: true })
                        .then(response => {
                            dispatch('mappingCategoryProducts', {data: response.data.data.products}).then((res) => {
                                resolve({
                                    data: {
                                        result: res
                                    }
                                });
                            });
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);
                            reject('API request failed!');
                        });

                });
            },
            async swGetCategory({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = '/sales-channel-api/v1/category/'+payload+
                        '?associations[media][]';

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: _endpoint
                    }, { root: true })
                        .then(response => {

                            dispatch('mappingCategory', response.data.data).then((res) => {
                                commit('setDataCategory', {
                                    data: {
                                        result: {
                                            item: res
                                        }
                                    }
                                });
                            });

                            commit('setPageType', 'category');

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });

                });
            },
            async getProductData({commit, state, dispatch}, payload) {
                return new Promise(function(resolve, reject) {
                    let endpoint = _.join([
                        '/sales-channel-api/v1/product/',
                        state.productId,
                        '?associations[manufacturer][associations][media][]',
                        '&associations[seoUrls][]',
                        '&associations[media][]'
                    ], '');

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: endpoint
                    }, { root: true })
                        .then(response => {

                            dispatch('mappingProduct', {product: response.data.data, path: payload.path}).then((res) => {

                                commit('setDataProduct', {
                                    data: {
                                        result: {
                                            item: res
                                        }
                                    }
                                });

                                resolve('ok');
                            });

                        })
                        .catch(error => {
                            reject(error);
                        })
                });
            },
            async apiCatalogsearch({commit, state, rootState, dispatch, getters}, payload) {
                // console.log("store apiCatalogsearch called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = '/sales-channel-api/v1/product';

                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: _endpoint,
                        data: state.apiRequestBody
                    }, { root: true })
                        .then(response => {

                            if(response.data.total === 0) {
                                resolve('OK');
                            }
                            // map product data
                            dispatch('mappingCategoryProducts', response.data).then((res) => {

                                    // Get all product urls to find urls of search result products
                                    dispatch('modApiResources/swGetProductUrls',{}, {root:true}).then(() => {

                                        _.forEach(res.items, (item, key) => {

                                            let matchingProduct = _.find(rootState.modApiResources.dataProductUrls, function(o) {
                                                return o.foreignKey === item.id;
                                            });

                                            // Set urls of matches
                                            res.items[key].url_pds = matchingProduct.seoPathInfo;

                                            commit('setPageType', 'category');

                                            commit('setDataCategoryProducts', {
                                                data: {
                                                    result: res
                                                }
                                            });

                                            resolve('OK');

                                        });

                                    });

                                });

                        })
                        .catch(response => {
                            console.log("API get request failed: %o", response);

                            reject('API request failed!');
                        });
                })
            }
        }
    };

    ctx.store.registerModule('modApiResources', modApiResources);
}
