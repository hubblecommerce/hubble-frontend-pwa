<template>
    <div class="filter-wrp" :class="extraClass">

        <button v-if="$mq === 'sm' || $mq === 'md'" class="button button-primary open-filter" @click="toggle()">
            <i class="icon icon-sliders left" />

            <span v-text="$t('Filter')" />

            <material-ripple />
        </button>

        <transition-expand-layer v-if="$mq === 'sm' || $mq === 'md'" :right-left="true">
            <div v-if="showFilters" class="transition-expand-wrp">
                <div class="container position-static">

                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu" @click="toggle()">
                            <i class="icon icon-close" aria-hidden="true" />
                            <material-ripple />
                        </button>

                        <div class="overlay-headline" v-text="$t('Filter')" />
                    </div>

                    <div class="facets-wrp">
                        <template v-if="isSearchPage()">
                            <div v-for="facet in requestCategoryFacets" :key="facet.key" class="facet-wrp">
                                <selectable-facet :data-facet="facet" :type-checkbox="true" />
                            </div>
                        </template>

                        <div v-for="(facet, facetIndex) in requestStringFacets" :key="facetIndex" class="facet-wrp">
                            <selectable-facet :data-facet="facet" :type-checkbox="true" />
                        </div>

                        <div class="facet-wrp">
                            <collapsible :display-via-if="true" :toggle-text="$t('Price')" :max-height="100" open-icon-class="icon-chevron-down" close-icon-class="icon-chevron-up">
                                <price-slider
                                    :data-min-value="minPriceSelectable"
                                    :data-max-value="maxPriceSelectable"
                                    :data-min-selected="minPriceSelected"
                                    :data-max-selected="maxPriceSelected"
                                />
                            </collapsible>
                        </div>
                    </div>

                    <div class="apply-filter-wrp">
                        <button v-if="hasFacetsSelected" class="button-secondary reset-filter" @click="routeOnPropertyRemoveAll()">
                            <span v-text="$t('Reset all')" />
                            <material-ripple />
                        </button>

                        <button class="button button-primary apply-filter" @click="applyFilter()">
                            <span v-text="$t('Apply & Close')" />
                            <material-ripple />
                        </button>
                    </div>

                </div>
            </div>
        </transition-expand-layer>

        <div v-if="$mq === 'lg'" class="facets-wrp desktop">

            <template v-if="isSearchPage()">
                <div v-for="facet in requestCategoryFacets" :key="facet.key" class="facet-wrp">
                    <selectable-facet :data-facet="facet" :type-checkbox="true" :filter-on-change="true" />
                </div>
            </template>

            <div v-for="(facet, facetIndex) in requestStringFacets" :key="facetIndex" class="facet-wrp">
                <selectable-facet :data-facet="facet" :type-checkbox="true" :filter-on-change="true" />
            </div>

            <div class="facet-wrp">
                <collapsible-filter
                    :class="{active: hasPriceFacetsSelected}"
                    :toggle-text="$t('Price')"
                    :max-height="200"
                    open-icon-class="icon-chevron-down"
                    close-icon-class="icon-chevron-up"
                >
                    <price-slider
                        :data-min-value="minPriceSelectable"
                        :data-max-value="maxPriceSelectable"
                        :data-min-selected="minPriceSelected"
                        :data-max-selected="maxPriceSelected"
                        :filter-on-change="true"
                    />
                </collapsible-filter>
            </div>

        </div>

        <selectable-limit :data-options="optionsLimit" />

        <selectable-order :data-options="optionsSorter" />

        <pagination />

        <div v-if="hasFacetsSelected && $mq === 'lg'" class="selected-filters">
            <div class="selected-label" v-text="$t('Your choice:')" />
            <div v-if="hasCategoryFacetsSelected && isSearchPage()" class="filter">
                <div v-for="(facet, facetIndex) in requestCategoryFacets"
                     v-if="facet.selected"
                     :key="facetIndex"
                     class="filter"
                >
                    <button class="button button-secondary" @click="routeOnPropertyRemove(facet.key)">
                        {{ getSelectedFacetOptionsLabel(facet) }} <i class="icon icon-close" />

                        <material-ripple />
                    </button>
                </div>
            </div>

            <div v-for="(facet, facetIndex) in requestStringFacets"
                 v-if="facet.selected"
                 :key="facetIndex"
                 class="filter"
            >
                <button class="button button-secondary" @click="routeOnPropertyRemove(facet.key)">
                    {{ getSelectedFacetOptionsLabel(facet) }} <i class="icon icon-close" />

                    <material-ripple />
                </button>
            </div>

            <div v-if="hasPriceFacetsSelected" class="filter">
                <button class="button button-secondary" @click="routeOnPropertyRemove('price')">
                    {{ $t('price') }}: {{ formatPrice(requestPriceFacets[0].filtered.from) }} - {{ formatPrice(requestPriceFacets[0].filtered.to) }}

                    <i class="icon icon-close" />

                    <material-ripple />
                </button>
            </div>
            <div class="reset-label" @click="routeOnPropertyRemoveAll()" v-text="$t('Reset all')" />
        </div>

        <div v-if="this.totalItems > 0" class="item-count-wrp text-small">
            <span v-if="this.totalItems > 1">
                {{ dataCategoryProducts.result.stats.total }} {{$t('shopping_cart_label_items')}}
            </span>

            <span v-else>
                {{ dataCategoryProducts.result.stats.total }} {{$t('shopping_cart_label_item')}}
            </span>
        </div>

    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

    import SelectableFacet from './toolbar/SelectableFacet.vue';
    import SelectableLimit from './toolbar/SelectableLimit.vue';
    import SelectableOrder from './toolbar/SelectableOrder.vue';
    import Pagination from "./toolbar/Pagination";
    import CollapsibleFilter from "./toolbar/CollapsibleFilter";
    import PriceSlider from "./toolbar/PriceSlider";

    export default {
        name: 'ProductListingFilter',

        components: {
            PriceSlider,
            CollapsibleFilter,
            Pagination,
            SelectableFacet,
            SelectableLimit,
            SelectableOrder
        },

        props: {
            extraClass: {
                type: Object,
                required: false,
                default: () => {}
            },
        },

        data() {
            return {
                name: 'ProductListingFilter',
                showFilter: false,
                elevation: '',
                filterRoute: {},

                modelSelectedCategory: null,

                queryWellKnown: ['term', 'sort', 'limit'],

                listItems: [
                    {text: 'First item', icon: 'fa fa-user'},
                    {text: 'Second item', icon: 'fa fa-copy'},
                    {text: 'Third item', icon: 'fa fa-cut'}
                ]
            }
        },

        computed: {
            ...mapState({
                dataMenu: state => state.modApiMenu.dataMenu,
                dataCategory: state => state.modApiCategory.dataCategory,
                dataCategoryProducts: state => state.modApiCategory.dataCategoryProducts,
                optionsLimit: state => state.modApiRequests.optionsLimit,
                optionsSorter: state => state.modApiRequests.optionsSorter,
                parsedQuery: state => state.modApiRequests.parsedQuery,
                selectedFacets: state => state.modApiRequests.selectedFacets,
                offcanvas: state => state.modNavigation.offcanvas,
                priceCurrencySymbol: state => state.modPrices.priceCurrencySymbol
            }),
            ...mapGetters({
                requestNumberFacets: 'modApiRequests/getRequestNumberFacets',
                requestStringFacets: 'modApiRequests/getRequestStringFacets',
                requestFacets: 'modApiRequests/getRequestFacets',
                requestPriceFacets: 'modApiRequests/getRequestPriceFacets',
                requestCategoryFacets: 'modApiRequests/getRequestCategoryFacets',
                getApiLocale: 'modApiResources/getApiLocale'
            }),
            categoryList() {
                if (_.isEmpty(this.dataMenu)) {
                    return []
                }

                let _items = this.dataMenu.result.items;

                let _combined = [];

                _.forEach(_items, item => {
                    // go for next level items (children)
                    _.forEach(item.children, childItem => {
                        _combined.push(_.omit(childItem, ['children']))
                    });

                    // at least push the item itself
                    _combined.push(_.omit(item, ['children']))
                });

                return _combined
            },
            categoryListChildren() {
                return this.categoryList.filter(
                    item => item.parent_id === this.categoryItem.id
                )
            },
            categoryItem() {
                if (_.isEmpty(this.dataCategory)) {
                    return this.dataCategory;
                }

                return this.dataCategory.result.item;
            },
            categoryProductItems() {
                if (_.isEmpty(this.dataCategoryProducts)) {
                    return this.dataCategoryProducts;
                }

                return this.dataCategoryProducts.result.items;
            },
            changePosition() {
                return this.$mq === 'sm' ? 'fixed' : 'left'
            },
            hasFacetsSelected() {
                return this.hasNumberFacetsSelected || this.hasStringFacetsSelected || this.hasPriceFacetsSelected || (this.hasCategoryFacetsSelected && this.isSearchPage());
            },
            hasNumberFacetsSelected() {
                let _selected = false;

                _.forEach(this.requestNumberFacets, facet => {
                    if (facet.selected) {
                        _selected = true
                    }
                });

                return _selected
            },
            hasStringFacetsSelected() {
                let _selected = false;

                _.forEach(this.requestStringFacets, facet => {
                    if (facet.selected) {
                        _selected = true
                    }
                });

                return _selected
            },
            hasPriceFacetsSelected() {
                let _selected = false;

                _.forEach(this.requestPriceFacets, facet => {
                    if (facet.selected) {
                        _selected = true
                    }
                });

                return _selected
            },
            hasCategoryFacetsSelected() {
                let _selected = false;

                _.forEach(this.requestCategoryFacets, facet => {
                    if (facet.selected) {
                        _selected = true
                    }
                });

                return _selected
            },
            maxPriceFacets() {
                if (_.isEmpty(this.requestPriceFacets)) {
                    return 1
                }

                let _facet = _.head(_.filter(this.requestPriceFacets, (item) => item.key === 'price'));

                return !_.isEmpty(_facet) ? parseInt(_facet['facet-stats'].max) + 1 : 0
            },
            minPriceFacets() {
                if (_.isEmpty(this.requestPriceFacets)) {
                    return 0
                }

                let _facet = _.head(_.filter(this.requestPriceFacets, (item) => item.key === 'price'));

                return !_.isEmpty(_facet) ? parseInt(_facet['facet-stats'].min) : 0
            },
            maxPriceSelected() {
                return _.isNumber(this.parsedQuery['priceMax'])
                    ? this.parsedQuery['priceMax']
                    : this.maxPriceFacets
            },
            minPriceSelected() {
                return _.isNumber(this.parsedQuery['priceMin'])
                    ? this.parsedQuery['priceMin']
                    : this.minPriceFacets
            },
            maxPriceSelectable() {
                return this.maxPriceFacets > this.maxPriceSelected
                    ? this.maxPriceFacets
                    : this.maxPriceSelected
            },
            minPriceSelectable() {
                return this.minPriceFacets < this.minPriceSelected
                    ? this.minPriceFacets
                    : this.minPriceSelected
            },
            validOptions() {
                return {
                    dir: ['asc', 'desc'],
                    order: _.mapValues(this.optionsSorter, function(value, key) {
                        return value.order
                    }),
                    limit: _.mapValues(this.optionsLimit, function(value, key) {
                        return value.limit
                    })
                }
            },
            showFilters: function() {
                return this.offcanvas.component === this.name;
            },
            totalItems: function() {
                if(this.dataCategoryProducts.result.stats != null) {
                    return this.dataCategoryProducts.result.stats.total;
                }

                return 0;
            }
        },

        watch: {
            modelSelectedCategory() {
                this.hideFilters().then(response => {
                    let _prefix = '/';

                    let _locale = this.getApiLocale;

                    if (_locale !== 'de') {
                        _prefix = '/' + _locale + '/'
                    }

                    // always reset to 1st page
                    this.resetPagination();

                    // keep possibly selected 'dir', 'order', 'limit'
                    let _selected = this.getSelectedQueryParams();

                    //console.log(_.fromPairs(_selected));

                    this.$router.push({
                        path: _prefix + this.modelSelectedCategory,
                        query: _.fromPairs(_selected)
                    })
                })
            },
        },

        created() {
            this.$store.commit('modApiRequests/setOptionsLimit', process.env.limiter);
            this.$store.commit('modApiRequests/setOptionsSorter', process.env.sorter);

            this.$bus.$on('price-slider-changed', response => {
                // save emitted price range to store
                this.setSelectedPriceMax(response.payload.price_to);
                this.setSelectedPriceMin(response.payload.price_from);

                this.routeOnPropertyChange();
            });

            this.$bus.$on('price-slider-changed-and-apply', response => {
                // save emitted price range to store
                this.setSelectedPriceMax(response.payload.price_to);
                this.setSelectedPriceMin(response.payload.price_from);

                this.routeOnPropertyChange().then(() => {
                    this.applyFilter();
                });
            })

            this.$bus.$on('selectable-facet-changed', response => {
                // save to store
                this.setSelectedFacetsParam(response.payload);

                this.routeOnPropertyChange();
            });

            this.$bus.$on('selectable-facet-changed-and-applied', response => {
                // save to store
                this.setSelectedFacetsParam(response.payload);

                this.routeOnPropertyChange().then(() => {
                    this.applyFilter();
                });
            });

            this.$bus.$on('selectable-limit-changed', response => {
                // save to store
                this.setSelectedQueryParam(response.payload);

                this.routeOnPropertyChange().then(() => {
                    this.applyFilter();
                });
            });

            this.$bus.$on('selectable-order-changed', response => {
                // save to store
                this.setSelectedQueryParam(response.payload);

                this.routeOnPropertyChange().then(() => {
                    this.applyFilter();
                });
            })
        },

        methods: {
            ...mapMutations({
                setPaginationPage: 'modApiRequests/setPaginationPage',
                setSelectedPriceMax: 'modApiRequests/setSelectedPriceMax',
                setSelectedPriceMin: 'modApiRequests/setSelectedPriceMin',
                setSelectedFacetsParam: 'modApiRequests/setSelectedFacetsParam',
                resetSelectedFacetsParam: 'modApiRequests/resetSelectedFacetsParam',
                setSelectedQueryParam: 'modApiRequests/setSelectedQueryParam'
            }),
            ...mapActions({
                toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
                hideOffcanvasAction: 'modNavigation/hideOffcanvasAction'
            }),
            resetPagination() {
                this.setPaginationPage(1);
            },
            getSelectedQueryParams() {
                let _selected = [];

                _.forEach(this.queryWellKnown, property => {
                    // Parse query option value to int because only int are allowed as param filter values
                    let val = parseInt(this.parsedQuery[property], 10);

                    // except of the term filter which is string
                    if(property === 'term') {
                        _selected.push([property, this.parsedQuery[property]])
                    }

                    // stack property, if not null
                    if(val !== null && Number.isInteger(val) && property !== 'term') {
                        _selected.push([property, this.parsedQuery[property]])
                    }
                });

                return _selected
            },
            getSelectedFacetOptionsLabel(facet) {
                let _selectedIds = facet.options.filter(item => item.selected);

                let _selectedLabels = _.join(_selectedIds.map(item => item.label), ', ');

                return _selectedLabels
            },
            routeOnPropertyChange() {

                return new Promise((resolve, reject) => {
                    // always reset to 1st page
                    this.resetPagination();

                    // start with well known query params
                    let _selected = this.getSelectedQueryParams();

                    // attach price (from, to), if selected
                    if (
                        _.isNumber(this.selectedFacets['priceMin']) &&
                        _.isNumber(this.selectedFacets['priceMax'])
                    ) {
                        _selected.push(['price_from', this.selectedFacets['priceMin']]);
                        _selected.push(['price_to', this.selectedFacets['priceMax']]);
                    }

                    // Put selected string facets to array
                    let _facets = this.requestStringFacets;
                    _.forEach(_facets, facet => {
                        if (this.selectedFacets[facet.key]) {
                            _selected.push([facet.key, this.selectedFacets[facet.key]])
                        }
                    });

                    // Put selected category facets to array
                    _facets = this.requestCategoryFacets;
                    _.forEach(_facets, facet => {
                        if (this.selectedFacets[facet.key]) {
                            _selected.push([facet.key, this.selectedFacets[facet.key]])
                        }
                    });

                    // Prepare route path including filter
                    let _route = {
                        path: this.$route.path,
                        query: _.fromPairs(_selected)
                    };

                    //console.log("resulting _route: %o", _route);

                    this.filterRoute = _route;

                    resolve('New filter route is set');
                });
            },
            routeOnPropertyRemove(propertyName) {
                // always reset to 1st page
                this.resetPagination();

                // null property from nested storage object (facet)
                this.setSelectedFacetsParam({
                    name: propertyName,
                    data: null
                });

                // omit removed property and 'page' parameter
                let _query = _.omit(this.$route.query, [propertyName, 'page']);

                if (propertyName === 'price') {
                    _query = _.omit(_query, ['price_to', 'price_from'])
                }

                let _route = {
                    path: this.$route.path,
                    query: _query
                };

                // console.log("resulting _route: %o", _route);

                this.hideFilters().then(response => {
                    this.$router.push(_route)
                })
            },
            routeOnPropertyRemoveAll() {
                // always reset to 1st page
                this.resetPagination();

                // null property from nested storage object (facet)
                this.resetSelectedFacetsParam();

                // If current route is a search, keep the search term and remove rest of filter
                let _route;
                if (this.$route.query.term) {
                    _route = {
                        path: this.$route.path,
                        query: {
                            term: this.$route.query.term
                        }
                    };
                } else {
                    _route = {
                        path: this.$route.path,
                        query: _.pick(this.$route.query, this.queryWellKnown)
                    };
                }

                // console.log("resulting _route: %o", _route);

                this.hideFilters().then(response => {
                    this.$router.push(_route)
                })
            },
            applyFilter: function() {
                this.hideFilters().then(response => {
                    this.$router.push(this.filterRoute);
                })
            },
            getSortingDirection(order) {
                let _sorting = _.head(
                    this.optionsSorter.filter(
                        item => item.order === this.parsedQuery['order']
                    )
                );

                return _.isObject(_sorting) ? _sorting.dir : 'asc'
            },
            toggle: function() {
                this.showFilter = !this.showFilter;
                this.toggleOffcanvasAction({
                    component: this.name,
                    direction: 'rightLeft'
                });
            },
            hideFilters() {
                this.hideOffcanvasAction();

                return new Promise((resolve, reject) => {
                    //this.showFilter = false;
                    resolve()
                })
            },
            formatPrice(price) {
                return price + '' + this.priceCurrencySymbol
            },
            isSearchPage: function() {
                if(this.$router.history.current.path.includes('search')) {
                    return true;
                }

                return false;
            }
        }
    }
</script>
