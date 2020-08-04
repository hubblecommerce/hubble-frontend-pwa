import _ from 'lodash';

export default function (ctx) {
    const modApiRequests = {
        namespaced: true,
        state: () => ({
            paginationPage: 1,
            paginationPerPage: process.env.limiter_default,

            optionsLimit: process.env.limiter,
            optionsSorter: process.env.sorter,

            parsedQuery: {},
            selectedFacets: {
                priceMin: null,
                priceMax: null,
            },
            requestFacets: null,

            queryWellKnown: ['term', 'page', 'sort', 'limit'],
        }),
        mutations: {
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
            resetSelectedFacetsParam: state => {
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
            isNumeric: state => value => {
                return !isNaN(parseFloat(value)) && isFinite(value);
            },
            areNumeric: state => values => {
                let _ok = true;

                _.forEach(values, value => {
                    let _status = !isNaN(parseFloat(value)) && isFinite(value);

                    if (!_status) {
                        _ok = _status;
                    }
                });

                return _ok;
            },
            getRequestFacets: state => {
                return state.requestFacets;
            },
            getRequestNumberFacets: state => {
                if (_.has(state.requestFacets, 'number_facets')) {
                    return _.map(state.requestFacets.number_facets, item => item);
                }

                return null;
            },
            getRequestStringFacets: state => {
                if (_.has(state.requestFacets, 'string_facets')) {
                    return _.map(state.requestFacets.string_facets, item => item);
                }

                return null;
            },
            getRequestPriceFacets: state => {
                if (_.has(state.requestFacets, 'price_facets')) {
                    return _.map(state.requestFacets.price_facets, item => item);
                }

                return null;
            },
            getRequestCategoryFacets: state => {
                if (_.has(state.requestFacets, 'category_facets')) {
                    return _.map(state.requestFacets.category_facets, item => item);
                }

                return null;
            },
        },
        actions: {
            parseRequest({ commit, dispatch }, payload) {
                let _query = payload.query;

                // If page is set in url set pagination page to query otherwise set to page 1
                if (_query.page != null) {
                    commit('setPaginationPage', _query.page);
                } else {
                    commit('setPaginationPage', 1);
                }

                return new Promise((resolve, reject) => {
                    // initialize nested properties of
                    // well known and possibly selected
                    // query parameters and set them to
                    // their query param value (or null)
                    dispatch('parseRequestQuery', {
                        query: _query,
                    })
                        .then(response => {
                            resolve(response);
                        })
                        .catch(response => {
                            reject(response);
                        });
                });
            },
            parseRequestFacets({ commit }, payload) {
                let _query = payload.query;

                let _propertyFacets = _.cloneDeep(payload.propertyFacets);

                return new Promise((resolve, reject) => {
                    // start with empty object
                    let _parsed = {};

                    // loop for string facets only ...
                    _.forEach(_propertyFacets.string_facets, facet => {
                        _parsed[facet.key] = _query[facet.key] ? _query[facet.key] : null;
                    });

                    // special case 'price'
                    if (_.has(_query, 'price_to')) {
                        _parsed['priceMax'] = parseInt(_query['price_to']);
                    }
                    if (_.has(_query, 'price_from')) {
                        _parsed['priceMin'] = parseInt(_query['price_from']);
                    }

                    // loop for string facets only ...
                    _.forEach(_propertyFacets.category_facets, facet => {
                        _parsed[facet.key] = _query[facet.key] ? _query[facet.key] : null;
                    });

                    // commit to store
                    commit('setSelectedFacets', _parsed);
                    commit('setRequestFacets', _propertyFacets);

                    resolve('parseRequestFacets OK!');
                });
            },
            parseRequestQuery({ commit, state }, payload) {
                let _query = payload.query;

                return new Promise((resolve, reject) => {
                    // start with empty object
                    let _parsed = {};

                    _.forEach(state.queryWellKnown, paramName => {
                        // set nested property to either query parameter or null
                        _parsed[paramName] = _query[paramName] ? _query[paramName] : null;
                    });

                    // special case 'price'
                    if (_.has(_query, 'price_to')) {
                        _parsed['priceMax'] = parseInt(_query['price_to']);
                    }

                    if (_.has(_query, 'price_from')) {
                        _parsed['priceMin'] = parseInt(_query['price_from']);
                    }

                    commit('setParsedQuery', _parsed);

                    // Set selected filter from query
                    let selectedFilters = {};
                    Object.keys(_query).forEach(param => {
                        if (!state.queryWellKnown.includes(param)) {
                            selectedFilters[param] = _query[param];
                        }
                    });

                    commit('setSelectedFacets', selectedFilters);

                    resolve('parseRequestQuery OK!');
                });
            },
            async mapFilterToFacets({ commit }, filters) {
                return new Promise((resolve, reject) => {
                    let facets = {
                        all: {
                            storeId: true,
                            cat: true,
                        },
                        selected: true,
                        string_facets: {},
                        price_facets: {},
                    };

                    Object.keys(filters).forEach(function (filter) {
                        // Map string facets
                        if (filters[filter].type === 'entity') {
                            facets.string_facets[filter] = {
                                key: filters[filter].name,
                                label: filters[filter].name,
                                selected: false,
                                options: [],
                            };

                            Object.keys(filters[filter].values).forEach(function (value) {
                                facets.string_facets[filter].options.push({
                                    key: value,
                                    label: filters[filter].values[value].name,
                                });
                            });
                        }

                        // Map price facet
                        if (filter === 'price') {
                            facets.price_facets[filter] = {
                                key: filter,
                                label: filter,
                                selected: false,
                                'facet-stats': {
                                    min: filters[filter].values.min,
                                    max: filters[filter].values.max,
                                },
                            };
                        }
                    });

                    resolve(facets);
                });
            },
            // applys set filters and set new url
            applyFilter({ commit, state, dispatch, getters }) {
                //reset pagination
                commit('setPaginationPage', 1);
                //take all filters and change path to new path with new filters

                // query well known without page
                let queryWellKnown = ['term', 'sort', 'limit'];

                let selected = [];

                _.forEach(queryWellKnown, property => {
                    // Parse query option value to int because only int are allowed as param filter values
                    let val = parseInt(state.parsedQuery[property], 10);

                    // except of the term filter which is string
                    if (property === 'term') {
                        selected.push([property, state.parsedQuery[property]]);
                    }

                    // stack property, if not null
                    if (val !== null && Number.isInteger(val) && property !== 'term') {
                        selected.push([property, state.parsedQuery[property]]);
                    }
                });

                // attach price (from, to), if selected
                if (_.isNumber(state.selectedFacets['priceMin']) && _.isNumber(state.selectedFacets['priceMax'])) {
                    selected.push(['price_from', state.selectedFacets['priceMin']]);
                    selected.push(['price_to', state.selectedFacets['priceMax']]);
                }

                // Put selected string facets to array
                let facets = getters.getRequestStringFacets;
                _.forEach(facets, facet => {
                    if (state.selectedFacets[facet.key]) {
                        selected.push([facet.key, state.selectedFacets[facet.key]]);
                    }
                });

                // Put selected category facets to array
                facets = getters.getRequestCategoryFacets;
                _.forEach(facets, facet => {
                    if (state.selectedFacets[facet.key]) {
                        selected.push([facet.key, state.selectedFacets[facet.key]]);
                    }
                });

                let filterRoute = {
                    path: ctx.app.router.currentRoute.path,
                    query: _.fromPairs(selected),
                };

                dispatch('modNavigation/hideOffcanvasAction', {}, { root: true }).then(() => {
                    ctx.app.router.push(filterRoute);
                });
            },
        },
    };

    ctx.store.registerModule('modApiRequests', modApiRequests);
}
