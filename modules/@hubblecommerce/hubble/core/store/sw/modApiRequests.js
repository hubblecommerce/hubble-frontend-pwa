export default function (ctx) {

    // Create vuex store module
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
            resetSelectedFacetsParam: (state, payload) => {
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
            setRequestStringFacets: (state, payload) => {
                state.requestFacets.string_facets = payload;
            },
            removeFacets: (state, payload) => {
                console.log("remove");

                //delete state.requestedFacets.string_facets[payload];
                //delete state.requestedFacets.all[payload];

                console.log(state.requestedFacets);
            },
        },
        getters: {
            isNumeric: state => (value) => {
                return ! isNaN(parseFloat(value)) && isFinite(value);
            },
            areNumeric: state => (values) => {

                let _ok = true;

                _.forEach(values, (value) => {

                    let _status = ! isNaN(parseFloat(value)) && isFinite(value);

                    if(! _status) {
                        _ok = _status;
                    }
                });

                return _ok;
            },
            isStringAlnum: state => (value) => {
                return (/[a-z0-9]/.test(value.toLowerCase()));
            },
            querySanitize: (state, getters) => (query) => {
                let _queryKnown = {
                    term: query.term
                };

                if(_.has(query, 'dir')) {
                    _queryKnown['dir'] = getters.isStringAlnum(query.dir) ? query.dir.toLowerCase() : 'desc';
                }

                if(_.has(query, 'order')) {
                    _queryKnown['order'] = getters.isStringAlnum(query.order) ? query.order.toLowerCase() : 'relevance';
                }

                if(_.has(query, 'price_to')) {
                    _queryKnown['price_to'] = getters.isNumeric(query.price_to) ? parseInt(query.price_to) : 0;
                }

                if(_.has(query, 'price_from')) {
                    _queryKnown['price_from'] = getters.isNumeric(query.price_from) ? parseInt(query.price_from) : 0;
                }


                let _queryUnknown = _.omit(query, ['term', 'dir', 'order', 'price_to', 'price_from']);

                _.forEach(_.keys(_queryUnknown), (paramName) => {

                    // reset parameter value to '0', if any value is not numeric
                    if(! getters.areNumeric(_.split(_queryUnknown[paramName], ','))) {
                        _queryUnknown[paramName] = 0;
                    }
                })

                // merge known and sanitized unknown query params
                let _query = _.merge({}, _queryKnown, _queryUnknown);

                return _query;
            },
            queryPaginate: (state, getters) => (query) => {

                // sanitize query
                let _queryClean = getters.querySanitize(query);

                let _paginationPerPage = getters.getNumericOrDefault(query.limit, state.paginationPerPage);

                let _paginationOffset = (getters.getNumericOrDefault(query.page, 1) * state.paginationPerPage) - state.paginationPerPage;

                // rebuild query object, kick
                // some params, that we don't need any
                // longer and append _from/_size/_term params.
                let _query = {};

                // stack _term 1st
                if(_.has(_queryClean, 'term')) {
                    _query = _.merge(_query, { _term: _queryClean.term });
                }

                if(_.has(_queryClean, 'sort')) {
                    _query = _.merge(_query, { _sort: _queryClean.sort });
                }

                if(_.has(_queryClean, 'price_to')) {
                    _query = _.merge(_query, { _price_to: _queryClean.price_to });
                }

                if(_.has(_queryClean, 'price_from')) {
                    _query = _.merge(_query, { _price_from: _queryClean.price_from });
                }

                _query = _.merge(
                    _query,
                    _.omit(_queryClean, ['term', 'page', 'sort', 'limit', 'price_to', 'price_from']),
                    {
                        _from: _paginationOffset,
                        _size: _paginationPerPage
                    });

                return _query;
            },
            getSelectedFacetsParam: (state) => {
                return state.selectedFacets;
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
            parseRequest({ commit, state, dispatch, rootState, rootGetters }, payload) {
                // console.log("store parseRequest called! payload: %o", payload);

                let _query = payload.query;

                // If page is set in url set pagination page to query otherwise set to page 1
                if(_query.page != null) {
                    commit('setPaginationPage', _query.page);
                } else {
                    commit('setPaginationPage', 1);
                }

                let _items = rootGetters['modApiResources/getDataCategoryProducts'];

                return new Promise((resolve, reject) => {

                    // initialize nested properties of
                    // well known and possibly selected
                    // query parameters and set them to
                    // their query param value (or null)
                    dispatch('parseRequestQuery', {
                        query: _query
                    })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(response => {
                        reject(response);
                    })
                });
            },
            parseRequestFacets({ commit, state }, payload) {
                //console.log("store parseRequestFacets called! payload: %o", payload);

                let _query = payload.query;

                let _propertyFacets = _.cloneDeep(payload.propertyFacets);

                return new Promise((resolve, reject) => {

                    // start with empty object
                    let _parsed = {};

                    // loop for string facets only ...
                    _.forEach(_propertyFacets.string_facets, (facet) => {
                        _parsed[facet.key] = _query[facet.key] ? _query[facet.key] : null;
                    });

                    // special case 'price'
                    if(_.has(_query, 'price_to')) {
                        _parsed['priceMax'] = parseInt(_query['price_to']);
                    }
                    if(_.has(_query, 'price_from')) {
                        _parsed['priceMin'] = parseInt(_query['price_from']);
                    }

                    // loop for string facets only ...
                    _.forEach(_propertyFacets.category_facets, (facet) => {
                        _parsed[facet.key] = _query[facet.key] ? _query[facet.key] : null;
                    });

                    // commit to store
                    commit('setSelectedFacets', _parsed);
                    commit('setRequestFacets', _propertyFacets);

                    resolve("parseRequestFacets OK!");
                });
            },
            parseRequestQuery({ commit, state }, payload) {
                // console.log("store parseRequestQuery called! payload: %o", payload);

                let _query = payload.query;

                return new Promise((resolve, reject) => {
                    // start with empty object
                    let _parsed = {};

                    _.forEach(state.queryWellKnown, (paramName) => {
                        // set nested property to either query parameter or null
                        _parsed[paramName] = _query[paramName] ? _query[paramName] : null;
                    });

                    // special case 'price'
                    if(_.has(_query, 'price_to')) {
                        _parsed['priceMax'] = parseInt(_query['price_to']);
                    }

                    if(_.has(_query, 'price_from')) {
                        _parsed['priceMin'] = parseInt(_query['price_from']);
                    }

                    commit('setParsedQuery', _parsed);

                    // Set selected filter from query
                    let selectedFilters = {};
                    Object.keys(_query).forEach((param) => {

                        if(!state.queryWellKnown.includes(param)) {
                            selectedFilters[param] = _query[param];
                        }
                    });

                    commit('setSelectedFacets', selectedFilters);

                    resolve("parseRequestQuery OK!");
                });
            },
            actionSetRequestStringFacets({ commit, state }, payload) {
                return new Promise((resolve, reject) => {
                    commit('setRequestStringFacets', payload);
                    resolve();
                });
            }
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modApiRequests', modApiRequests);
}
