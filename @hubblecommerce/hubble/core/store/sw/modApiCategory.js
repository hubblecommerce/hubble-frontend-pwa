import { categoryMapping } from '@hubblecommerce/hubble/core/mapping/sw/category';
import { productMapping } from '@hubblecommerce/hubble/core/mapping/sw/product';
import _ from 'lodash';

export const state = () => ({
    dataCategory: {},
    dataCategoryProducts: {},
    apiRequestBody: {
        'limit': process.env.limiter_default,
        'total-count-mode': true,
        'page': 1,
        'filter': [
            {
                type: 'equals',
                field: 'active',
                value: true,
            },
            {
                type: 'range',
                field: 'stock',
                parameters: {
                    gt: 0,
                },
            },
        ],
        'sort': [
            {
                field: 'price',
                direction: 'asc',
            },
        ],
        'associations': {
            manufacturer: {},
            media: {},
            seoUrls: {},
            cover: {},
        },
    },
});

export const mutations = {
    setDataCategory(state, payload) {
        state.dataCategory = payload.data;
    },
    setDataCategoryProducts(state, payload) {
        state.dataCategoryProducts = payload.data;
    },
    setFilter(state, payload) {
        _.remove(state.apiRequestBody.filter, function (o) {
            // remove by field
            return o.field === payload.field;
        });
        state.apiRequestBody.filter.push(payload);
    },
    resetFilter(state) {
        state.apiRequestBody.filter = [
            {
                type: 'equals',
                field: 'active',
                value: true,
            },
            {
                type: 'range',
                field: 'stock',
                parameters: {
                    gt: 0,
                },
            },
        ];
    },
    setLimit(state, payload) {
        state.apiRequestBody.limit = payload;
    },
    setPage(state, payload) {
        state.apiRequestBody.page = payload;
    },
    setTerm(state, payload) {
        state.apiRequestBody.search = payload;
    },
    setFilters(state, query) {
        // Reset all filters
        state.apiRequestBody.filter = [];

        const paramBlackList = ['term', 'page', 'limit', 'sort', 'manufacturer', 'price_from', 'price_to'];

        // Iterate all query params
        _.forEach(query, (val, param) => {
            // Only proceed if parameter is not blacklisted apply only filter parameters (pagination, limiter, etc...)
            if (!paramBlackList.includes(param)) {
                // Build filter object
                // Turn comma seperated parameter values to array
                let filter = {
                    type: 'multi',
                    operator: 'OR',
                    queries: [
                        {
                            type: 'equalsAny',
                            field: 'propertyIds',
                            value: val.split(','),
                        },
                        {
                            type: 'equalsAny',
                            field: 'optionIds',
                            value: val.split(','),
                        },
                    ],
                };

                // Set filterobject to request body
                state.apiRequestBody.filter.push(filter);
            }

            // Special entity manufacturer
            if (param === 'manufacturer') {
                let filter = {
                    type: 'equalsAny',
                    field: 'manufacturerId',
                    value: val.split(','),
                };

                state.apiRequestBody.filter.push(filter);
            }
        });

        // Special entity price_to
        let priceRangeFilter = {
            type: 'range',
            field: 'price',
            parameters: {},
        };

        if (query['price_from'] != null) {
            priceRangeFilter.parameters.gte = query['price_from'];
        }

        if (query['price_to'] != null) {
            priceRangeFilter.parameters.lte = query['price_to'];
        }

        if (query['price_from'] != null || query['price_to'] != null) {
            state.apiRequestBody.filter.push(priceRangeFilter);
        }
    },
    setSorting(state, payload) {
        let sort = _.find(process.env.sorter, { option_id: parseInt(payload) });
        let direction;

        if (sort.direction === 'asc') {
            direction = '';
        }

        if (sort.direction === 'desc') {
            direction = '-';
        }

        state.apiRequestBody.sort = direction + sort.order;
    },
};

export const getters = {
    getDataCategory(state) {
        return state.dataCategory;
    },
    getDataCategoryProducts(state) {
        return state.dataCategoryProducts;
    },
};

export const actions = {
    async swGetCategory({ commit, dispatch }, payload) {
        return new Promise(function (resolve, reject) {
            let _endpoint = '/store-api/v3/category/' + payload + '?associations[media][]';

            dispatch(
                'apiCall',
                {
                    action: 'get',
                    tokenType: 'sw',
                    apiType: 'data',
                    endpoint: _endpoint,
                },
                { root: true }
            )
                .then((response) => {
                    dispatch('mappingCategory', response.data).then((res) => {
                        commit('setDataCategory', {
                            data: {
                                result: {
                                    item: res,
                                },
                            },
                        });
                    });

                    resolve('OK');
                })
                .catch((response) => {
                    console.log('API get request failed: %o', response);

                    reject('API request failed!');
                });
        });
    },
    async swGetProducts({ commit, state, dispatch }, categoryId) {
        return new Promise(function (resolve, reject) {
            let _endpoint = `/store-api/v3/product-listing/${categoryId}`;

            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    endpoint: _endpoint,
                    data: state.apiRequestBody,
                },
                { root: true }
            )
                .then((response) => {
                    // If no products for this category set empty array as category products
                    if (response.data.total === 0) {
                        commit('setDataCategoryProducts', {
                            data: {
                                result: [],
                            },
                        });

                        resolve();
                    }

                    dispatch('mappingCategoryProducts', response.data).then((res) => {
                        commit('setDataCategoryProducts', {
                            data: {
                                result: res,
                            },
                        });

                        resolve();
                    });
                })
                .catch((response) => {
                    console.log('API get request failed: %o', response);
                    reject('API request failed!');
                });
        });
    },
    async mappingListingData({ commit, dispatch }, payload) {
        return new Promise(function (resolve, reject) {
            dispatch(
                'modApiRequests/mapFilterToFacets',
                {
                    filters: payload.listingData.aggregations,
                    query: payload.query,
                },
                { root: true }
            ).then((res) => {
                resolve();
            });
        });
    },
    async mappingCategory({ commit }, payload) {
        return new Promise(function (resolve, reject) {
            let obj = categoryMapping(payload);
            resolve(obj);
        });
    },
    async mappingCategoryProducts({ commit }, payload) {
        return new Promise(function (resolve, reject) {
            let mapped = [];
            let products = payload.data != null ? payload.data : payload.elements;

            _.forEach(products, (product) => {
                let obj = productMapping(product);
                mapped.push(obj);
            });

            let totalItems = 0;
            if (payload.total > 0) {
                totalItems = payload.total;
            }

            let obj = {
                items: mapped,
                stats: {
                    total: totalItems,
                },
            };
            resolve(obj);
        });
    },
    async swGetCategoryProductsById({ dispatch }, payload) {
        return new Promise(function (resolve, reject) {
            let _endpoint =
                '/store-api/v3/category/' +
                payload.id +
                '?associations[products][associations][seoUrls][]' +
                '&associations[products][associations][manufacturer][]' +
                '&associations[products][associations][options][]' +
                '&associations[products][associations][cover][]' +
                '&associations[media][]';

            dispatch(
                'apiCall',
                {
                    action: 'get',
                    tokenType: 'sw',
                    apiType: 'data',
                    endpoint: _endpoint,
                },
                { root: true }
            )
                .then((response) => {
                    dispatch('mappingCategoryProducts', { data: response.data.data.products }).then((res) => {
                        resolve({
                            data: {
                                result: res,
                            },
                        });
                    });
                })
                .catch((response) => {
                    console.log('API get request failed: %o', response);

                    reject(response);
                });
        });
    },
    async setApiRequestFilter({ commit }, payload) {
        return new Promise(function (resolve, reject) {
            commit('setFilter', payload);
            resolve();
        });
    },
    async swGetCrossSellingsByProductId({ dispatch }, id) {
        return new Promise(function (resolve, reject) {
            let _endpoint =
                `/store-api/v3/product/${id}/cross-selling` + '?associations[products][associations][seoUrls][]';

            dispatch(
                'apiCall',
                {
                    action: 'get',
                    tokenType: 'sw',
                    apiType: 'data',
                    endpoint: _endpoint,
                },
                { root: true }
            )
                .then((response) => {
                    let mappedEntities = [];

                    _.forEach(response.data.data, (crossSelling) => {
                        dispatch('mappingCategoryProducts', { data: crossSelling.products }).then((res) => {
                            crossSelling.products = res;
                            mappedEntities.push(crossSelling);
                        });
                    });

                    resolve(mappedEntities);
                })
                .catch((response) => {
                    console.log('API get request failed: %o', response);

                    reject(response);
                });
        });
    },
};
