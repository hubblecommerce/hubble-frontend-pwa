<template>
    <div class="view-catalogsearch">
        <g-t-m-data-layer
            event="searchResultLoaded"
            page-type="Search Result"
            :page-title="curSearchResultLabel"
            :breadcrumbs="[{ '0': 'home' }, { '1': curSearchResultLabel }]"
        />
        <template v-if="hasCategoryProductItems">
            <div class="container search-content-wrp">
                <div class="search-products-wrp">
                    <product-listing-toolbar v-if="!isApiType('sw')" />
                    <product-listing :data-items="categoryProductItems" list="Search Result" />
                    <div class="pagination-bottom">
                        <pagination />
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="container category-header no-results">
                <div class="category-info row">
                    <div class="col-12">
                        <h1 class="title" v-text="noSearchResultLabel" />
                        <div class="headline-3">
                            {{ $t('We are sorry there is no such product. Please try another one.') }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Pagination from './toolbar/Pagination.vue';
import GTMDataLayer from '../utils/GTMDataLayer';
import ProductListing from './ProductListing';
import ProductListingToolbar from './ProductListingToolbar';
import _ from 'lodash';

export default {
    name: 'ViewCatalogsearch',

    components: {
        GTMDataLayer,
        Pagination,
        ProductListing,
        ProductListingToolbar,
    },

    computed: {
        ...mapState({
            dataCategory: state => state.modApiCategory.dataCategory,
            dataCategoryProducts: state => state.modApiCategory.dataCategoryProducts,
        }),
        categoryItem() {
            if (_.isEmpty(this.dataCategory)) {
                return this.dataCategory;
            }

            // console.log("debug dataCategory.result: %o", this.dataCategory.result);
            return this.dataCategory.result.item;
        },
        categoryProductItems() {
            if (_.isEmpty(this.dataCategoryProducts)) {
                return this.dataCategoryProducts;
            }

            // console.log("debug categoryProductItems: %o", this.dataCategoryProducts.result);
            return this.dataCategoryProducts.result.items;
        },
        hasCategoryProductItems() {
            return !_.isEmpty(this.categoryProductItems);
        },
        noSearchResultLabel() {
            return this.$t('No search results for:') + ' ' + this.$route.query.term;
        },
        curSearchResultLabel() {
            return this.$t('Search for:') + ' ' + this.$route.query.term;
        },
    },

    methods: {
        isApiType: function (apiType) {
            return process.env.API_TYPE === apiType;
        },
    },

    head() {
        return {
            title: this.curSearchResultLabel,
            meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                { hid: 'description', name: 'description', content: 'Generic Homepage Meta-Description' },
                { hid: 'robots', name: 'robots', content: 'INDEX, FOLLOW' },
                { hid: 'keywords', name: 'keywords', content: 'Home, Nuxt, Test' },
            ],
        };
    },
};
</script>
