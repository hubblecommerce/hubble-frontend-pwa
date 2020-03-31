export default function (ctx) {
    const modApiRequests = {
        namespaced: true,
        state: () => ({
            paginationPage: 1,
            paginationPerPage: process.env.limiter_default,
            paginationOffset: 0,

            optionsLimit: {},
            optionsSorter: {},

            parsedQuery: {},
            selectedFacets: {
                priceMin: null,
                priceMax: null
            },
            requestFacets: null,

            queryWellKnown: ['term', 'page', 'sort', 'limit']
        }),
        mutations: {
            setPaginationOffset: (state, value) => {
                state.paginationOffset = value;
            },
            setPaginationPage: (state, value) => {
                state.paginationPage = value;
            },
            setPaginationPerPage: (state, value) => {
                state.paginationPerPage = value;
            },
            setSelectedPriceMax: (state, value) => {
                state.selectedFacets.priceMax = value;
            },
            setSelectedPriceMin: (state, value) => {
                state.selectedFacets.priceMin = value;
            },
            setSelectedQueryParam: (state, payload) => {
                state.parsedQuery[payload.name] = payload.data;
            },
            setSelectedFacets: (state, items) => {
                state.selectedFacets = items;
            },
            setSelectedFacetsParam: (state, payload) => {
                state.selectedFacets[payload.name] = payload.data;
            },
            resetSelectedFacetsParam: (state) => {
                state.selectedFacets = _.pick(state.selectedFacets, state.queryWellKnown);
                state.selectedFacets.priceMax = null;
                state.selectedFacets.priceMin = null;
            },
            setOptionsLimit: (state, payload) => {
                state.optionsLimit = payload;
            },
            setOptionsSorter: (state, payload) => {
                state.optionsSorter = payload;
            },
            setRequestFacets: (state, items) => {
                state.requestFacets = items;
            },
            setParsedQuery: (state, items) => {
                state.parsedQuery = items;
            },
        },
        getters: {
            isNumeric: () => (value) => {
                return ! isNaN(parseFloat(value)) && isFinite(value);
            },
            areNumeric: () => (values) => {
                let ok = true;

                _.forEach(values, (value) => {

                    let status = ! isNaN(parseFloat(value)) && isFinite(value);

                    if(! status) {
                        ok = status;
                    }
                });

                return ok;
            },
            isStringAlnum: () => (value) => {
                return (/[a-z0-9]/.test(value.toLowerCase()));
            },
            querySanitize: (state, getters) => (query) => {
                let queryKnown = {
                    term: query.term
                };

                if(_.has(query, 'dir')) {
                    queryKnown['dir'] = getters.isStringAlnum(query.dir) ? query.dir.toLowerCase() : 'desc';
                }

                if(_.has(query, 'order')) {
                    queryKnown['order'] = getters.isStringAlnum(query.order) ? query.order.toLowerCase() : 'relevance';
                }

                if(_.has(query, 'price_to')) {
                    queryKnown['price_to'] = getters.isNumeric(query.price_to) ? parseInt(query.price_to) : 0;
                }

                if(_.has(query, 'price_from')) {
                    queryKnown['price_from'] = getters.isNumeric(query.price_from) ? parseInt(query.price_from) : 0;
                }


                let queryUnknown = _.omit(query, ['term', 'dir', 'order', 'price_to', 'price_from']);

                _.forEach(_.keys(queryUnknown), (paramName) => {

                    // reset parameter value to '0', if any value is not numeric
                    if(! getters.areNumeric(_.split(queryUnknown[paramName], ','))) {
                        queryUnknown[paramName] = 0;
                    }
                })

                // return merge known and sanitized unknown query params
                return _.merge({}, queryKnown, queryUnknown);
            },
            queryPaginate: (state, getters) => (query) => {
                // sanitize query
                let queryClean = getters.querySanitize(query);

                let paginationPerPage = getters.getNumericOrDefault(query.limit, state.paginationPerPage);

                let paginationOffset = (getters.getNumericOrDefault(query.page, 1) * state.paginationPerPage) - state.paginationPerPage;

                // rebuild query object, kick
                // some params, that we don't need any
                // longer and append _from/_size/_term params.
                let queryObject = {};

                // stack term 1st
                if(_.has(queryClean, 'term')) {
                    queryObject = _.merge(queryObject, { _term: queryClean.term });
                }

                if(_.has(queryClean, 'sort')) {
                    queryObject = _.merge(queryObject, { _sort: queryClean.sort });
                }

                if(_.has(queryClean, 'price_to')) {
                    queryObject = _.merge(queryObject, { _price_to: queryClean.price_to });
                }

                if(_.has(queryClean, 'price_from')) {
                    queryObject = _.merge(queryObject, { _price_from: queryClean.price_from });
                }

                queryObject = _.merge(
                    queryObject,
                    _.omit(queryClean, ['term', 'page', 'sort', 'limit', 'price_to', 'price_from']),
                    {
                        _from: paginationOffset,
                        _size: paginationPerPage
                    });

                return queryObject;
            },
            getNumericOrDefault: (state, getters) => (requestValue, defaultValue) => {
                return getters.isNumeric(requestValue) ? requestValue : defaultValue;
            },
            getRequestFacets: (state) => {
                return state.requestFacets;
            },
            getRequestNumberFacets: (state) => {
                if(_.has(state.requestFacets, 'number_facets')) {
                    return _.map(state.requestFacets.number_facets, (item) => item);
                }

                return null;
            },
            getRequestStringFacets: (state) => {
                if(_.has(state.requestFacets, 'string_facets')) {
                    return _.map(state.requestFacets.string_facets, (item) => item);
                }

                return null;
            },
            getRequestPriceFacets: (state) => {
                if(_.has(state.requestFacets, 'price_facets')) {
                    return _.map(state.requestFacets.price_facets, (item) => item);
                }

                return null;
            },
            getRequestCategoryFacets: (state) => {
                if(_.has(state.requestFacets, 'category_facets')) {
                    return _.map(state.requestFacets.category_facets, (item) => item);
                }

                return null;
            }
        },
        actions: {
            parseRequest({ commit, dispatch, rootGetters }, payload) {
                let query = payload.query;

                // If page is set in url set pagination page to query otherwise set to page 1
                if(query.page != null) {
                    commit('setPaginationPage', query.page);
                } else {
                    commit('setPaginationPage', 1);
                }

                let items = rootGetters['modApiCategory/getDataCategoryProducts'];

                return new Promise((resolve, reject) => {
                    // initialize nested properties of
                    // possibly selected facets and set
                    // to their query param value (or null)
                    dispatch('parseRequestFacets', {
                        propertyName: 'selectedFacets',
                        propertyFacets: items.result.facets,
                        query: query
                    })
                        .then(response => {

                            // initialize nested properties of
                            // well known and possibly selected
                            // query parameters and set them to
                            // their query param value (or null)
                            dispatch('parseRequestQuery', {
                                query: query
                            })
                                .then(response => {
                                    resolve(response);
                                })
                                .catch(response => {
                                    reject(response);
                                })
                        })
                });
            },
            parseRequestFacets({ commit }, payload) {
                let query = payload.query;
                let propertyFacets = _.cloneDeep(payload.propertyFacets);

                return new Promise((resolve) => {

                    // start with empty object
                    let parsed = {};

                    // loop for string facets only ...
                    _.forEach(propertyFacets.string_facets, (facet) => {
                        parsed[facet.key] = query[facet.key] ? query[facet.key] : null;
                    });

                    // special case 'price'
                    if(_.has(query, 'price_to')) {
                        parsed['priceMax'] = parseInt(query['price_to']);
                    }
                    if(_.has(query, 'price_from')) {
                        parsed['priceMin'] = parseInt(query['price_from']);
                    }

                    // loop for string facets only ...
                    _.forEach(propertyFacets.category_facets, (facet) => {
                        parsed[facet.key] = query[facet.key] ? query[facet.key] : null;
                    });

                    commit('setSelectedFacets', parsed);
                    commit('setRequestFacets', propertyFacets);

                    resolve("parseRequestFacets OK!");
                });
            },
            parseRequestQuery({ commit, state }, payload) {
                let query = payload.query;
                let params = state.queryWellKnown;

                return new Promise((resolve) => {
                    let parsed = {};

                    _.forEach(params, (paramName) => {
                        // set nested property to either query parameter or null
                        parsed[paramName] = query[paramName] ? query[paramName] : null;
                    })

                    // special case 'price'
                    if(_.has(query, 'price_to')) {
                        parsed['priceMax'] = parseInt(query['price_to']);
                    }
                    if(_.has(query, 'price_from')) {
                        parsed['priceMin'] = parseInt(query['price_from']);
                    }

                    commit('setParsedQuery', parsed);

                    resolve("parseRequestQuery OK!");
                });
            }
        }
    };

    ctx.store.registerModule('modApiRequests', modApiRequests);
}
