<template>
    <div v-if="products.length === 0" class="container">
        <div v-if="!loading" class="error-message" v-text="'There are no products available in this category or for this filter.'" />

        <loader v-else />
    </div>
    <div v-else>
        <div class="toolbar-top">
            <product-listing-pagination
                :paginationItemsTotal="content.slots[0].data.listing.total"
                :paginationPerPage="content.slots[0].data.listing.limit"
            />

            <sorting-dropdown
                :sortings="availableSortings"
                :sorting="currentSorting"
                @onChangeSorting="changeSorting" />
        </div>
        <product-listing
            v-if="products != null"
            :data-items="products"
            :total="content.slots[0].data.listing.total"
            :listing-class="'col-12 col-sm-12 col-md-4 col-lg-3'"
            :loading="loading"
        />
        <div class="toolbar-bottom">
            <product-listing-pagination
                :paginationItemsTotal="content.slots[0].data.listing.total"
                :paginationPerPage="content.slots[0].data.listing.limit"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { mappingCategoryProducts } from '@/utils/api-mapping-helper';
import apiClient from '@/utils/api-client';

export default {
    name: 'ProductListingBlock',

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            availableSortings: [],
            currentSorting: '',
            products: null,
            loading: false,
        };
    },

    computed: {
        ...mapState({
            filterTs: state => state.modFilter.filterTs,
            properties: state => state.modFilter.properties,
            manufacturer: state => state.modFilter.manufacturer,
            minMaxPrice: state => state.modFilter.minMaxPrice
        }),
        categoryId() {
            return this.content.slots[0].data.listing.currentFilters.navigationId;
        }
    },

    watch: {
        filterTs() {
            this.loadProductsByFilter();
        },
    },

    created() {
        this.products = mappingCategoryProducts(this.content.slots[0].data.listing.elements);
        this.availableSortings = this.content.slots[0].data.listing.availableSortings;
        this.currentSorting = this.content.slots[0].data.listing.sorting;

        this.$store.commit('modFilter/setAggregations', this.content.slots[0].data.listing.aggregations);
    },

    methods: {
        async loadProductsByFilter() {
            this.loading = true;

            const resp = await this.fetchFilteredProducts();
            this.products = this.products = mappingCategoryProducts(resp.data.elements);

            this.loading = false;
        },
        
        async fetchFilteredProducts() {
            return new apiClient().apiCall({
                action: 'post',
                endpoint: `store-api/v3/product-listing/${this.categoryId}`,
                data: {
                    properties: this.properties,
                    manufacturer: this.manufacturer,
                    'min-price': this.minMaxPrice.min,
                    'max-price': this.minMaxPrice.max,
                    order: this.currentSorting
                }
            });
        },

        changeSorting(sorting) {
            this.currentSorting = sorting;
            
            this.loadProductsByFilter();
        }
    }
};
</script>

<style lang="scss">
.toolbar-top {
    display: none;
}

@media (min-width: 1024px) {
    .toolbar-top {
        display: block;
        position: relative;
    }
}
</style>
