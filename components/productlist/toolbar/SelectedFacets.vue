<template>
    <div v-if="hasFacetsSelected && $mq === 'lg'" class="selected-filters">
        <div class="selected-label" v-text="$t('Your choice:')" />
        <div v-if="hasCategoryFacetsSelected && isSearchPage()" class="filter">
            <div v-for="(facet, facetIndex) in requestCategoryFacets"
                 v-if="facet.selected"
                 :key="facetIndex"
                 class="filter"
            >
                <button class="button button-secondary" @click="routeOnPropertyRemove(facet.key)">
                    {{ getSelectedFacetOptionsLabel(facet) }}
                    <i class="icon icon-close" />
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
                {{ getSelectedFacetOptionsLabel(facet) }}
                <i class="icon icon-close" />
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
</template>

<script>
    import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
    export default {
        name: 'SelectedFacets',

        data() {
            return {
                name: 'SelectedFacets',
                filterRoute: {},

                queryWellKnown: ['term', 'sort', 'limit'],
            }
        },

        computed: {
            ...mapState({
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
            }),
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
        },

        methods: {
            ...mapMutations({
                setPaginationPage: 'modApiRequests/setPaginationPage',
                setSelectedFacetsParam: 'modApiRequests/setSelectedFacetsParam',
                resetSelectedFacetsParam: 'modApiRequests/resetSelectedFacetsParam',
            }),
            ...mapActions({
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
            routeOnPropertyRemove: function(propertyName) {
                // always reset to 1st page
                this.resetPagination();

                // null property from nested storage object (facet)
                this.setSelectedFacetsParam({
                    name: propertyName,
                    data: null
                });

                // omit removed property and 'page' parameter
                let query = _.omit(this.$route.query, [propertyName, 'page'])

                if (propertyName === 'price') {
                    query = _.omit(query, ['price_to', 'price_from'])
                }

                let route = {
                    path: this.$route.path,
                    query: query
                };

                this.hideFilters().then(response => {
                    this.$router.push(route)
                })
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
            hideFilters: function() {
                this.hideOffcanvasAction();

                return new Promise((resolve, reject) => {
                    //this.showFilter = false;
                    resolve()
                })
            },
            formatPrice: function(price) {
                return price + '' + this.priceCurrencySymbol
            },
            isSearchPage: function() {
                if(this.$router.history.current.path.includes('search')) {
                    return true;
                }
            }
        }
    }
</script>
