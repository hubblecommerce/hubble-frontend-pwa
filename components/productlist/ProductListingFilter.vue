<template>
    <div class="filter-wrp">
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
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';

    import SelectableFacet from './toolbar/SelectableFacet.vue';
    import CollapsibleFilter from "./toolbar/CollapsibleFilter";
    import PriceSlider from "./toolbar/PriceSlider";

    export default {
        name: 'ProductListingFilter',

        components: {
            PriceSlider,
            CollapsibleFilter,
            SelectableFacet,
        },

        data() {
            return {
                name: 'ProductListingFilter',
                showFilter: false,
                filterRoute: {},

                queryWellKnown: ['term', 'sort', 'limit'],
            }
        },

        computed: {
            ...mapState({
                dataMenu: state => state.modApiMenu.dataMenu,
                dataCategory: state => state.modApiCategory.dataCategory,
                dataCategoryProducts: state => state.modApiCategory.dataCategoryProducts,
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
            categoryProductItems() {
                if (_.isEmpty(this.dataCategoryProducts)) {
                    return this.dataCategoryProducts;
                }

                return this.dataCategoryProducts.result.items;
            },
            hasFacetsSelected() {
                return this.hasNumberFacetsSelected || this.hasStringFacetsSelected || this.hasPriceFacetsSelected || (this.hasCategoryFacetsSelected && this.isSearchPage());
            },
            hasNumberFacetsSelected() {
                let selected = false

                _.forEach(this.requestNumberFacets, facet => {
                    if (facet.selected) {
                        selected = true
                    }
                });

                return selected
            },
            hasStringFacetsSelected() {
                let selected = false

                _.forEach(this.requestStringFacets, facet => {
                    if (facet.selected) {
                        selected = true
                    }
                });

                return selected
            },
            hasPriceFacetsSelected() {

                let selected = false


                _.forEach(this.requestPriceFacets, facet => {
                    if (facet.selected) {
                        selected = true
                    }
                });

                return selected
            },
            hasCategoryFacetsSelected() {
                let selected = false


                _.forEach(this.requestCategoryFacets, facet => {
                    if (facet.selected) {
                        selected = true
                    }
                });

                return selected
            },
            maxPriceFacets() {
                if (_.isEmpty(this.requestPriceFacets)) {
                    return 1
                }

                let facet = _.head(_.filter(this.requestPriceFacets, (item) => item.key === 'price'));

                return !_.isEmpty(facet) ? parseInt(facet['facet-stats'].max) + 1 : 0
            },
            minPriceFacets() {
                if (_.isEmpty(this.requestPriceFacets)) {
                    return 0
                }

                let facet = _.head(_.filter(this.requestPriceFacets, (item) => item.key === 'price'));

                return !_.isEmpty(facet) ? parseInt(facet['facet-stats'].min) : 0
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

        methods: {
            ...mapMutations({
                setPaginationPage: 'modApiRequests/setPaginationPage',
                setSelectedFacetsParam: 'modApiRequests/setSelectedFacetsParam',
                resetSelectedFacetsParam: 'modApiRequests/resetSelectedFacetsParam',
            }),
            ...mapActions({
                toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
                hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
                applyFilter: 'modApiRequests/applyFilter',
            }),
            resetPagination: function() {
                this.setPaginationPage(1);
            },
            getSelectedFacetOptionsLabel(facet) {
                let selectedIds = facet.options.filter(item => item.selected);

                let selectedLabels = _.join(selectedIds.map(item => item.label), ', ');

                return selectedLabels;
            },
            routeOnPropertyRemoveAll: function() {
                // always reset to 1st page
                this.resetPagination();

                // null property from nested storage object (facet)
                this.resetSelectedFacetsParam();

                // If current route is a search, keep the search term and remove rest of filter
                let route;
                if (this.$route.query.term) {
                    route = {
                        path: this.$route.path,
                        query: {
                            term: this.$route.query.term
                        }
                    };
                } else {
                    route = {
                        path: this.$route.path,
                        query: _.pick(this.$route.query, this.queryWellKnown)
                    };
                }

                this.hideFilters().then(response => {
                    this.$router.push(route)
                })
            },
            toggle: function() {
                this.showFilter = !this.showFilter;
                this.toggleOffcanvasAction({
                    component: this.name,
                    direction: 'rightLeft'
                });
            },
            hideFilters: function() {
                this.hideOffcanvasAction();

                return new Promise((resolve, reject) => {
                    //this.showFilter = false;
                    resolve()
                })
            },
            isSearchPage: function() {
                if(this.$router.history.current.path.includes('search')) {
                    return true;
                }
            }
        }
    }
</script>
