<template>
    <div v-if="content.slots[0].data.listing != null" class="container">
        <product-listing-filter
            :aggregations="aggregations"
            :current-filters="currentFilters"
            :limit="limit"
            :sorting="sorting"
        />
        <div class="toolbar-top">
            <product-listing-pagination
                :paginationItemsTotal="total"
                :paginationPerPage="limit"
            />
        </div>
        <product-listing
            v-if="products != null"
            :data-items="products"
            :total="total"
            :listing-class="'col-12 col-sm-12 col-md-4 col-lg-3'"
        />
        <div class="toolbar-bottom">
            <product-listing-pagination
                :paginationItemsTotal="total"
                :paginationPerPage="limit"
            />
        </div>
    </div>
</template>

<script>
import { mappingCategoryProducts } from '@/utils/api-mapping-helper';

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
            products: null,
            aggregations: null,
            currentFilters: null,
            total: null,
            limit: null,
            sorting: null,
            refreshComponent: 0
        };
    },

    created() {
        this.products = mappingCategoryProducts(this.content.slots[0].data.listing.elements);
        this.aggregations = this.content.slots[0].data.listing.aggregations;
        this.currentFilters = this.content.slots[0].data.listing.currentFilters;
        this.total = this.content.slots[0].data.listing.total;
        this.limit = this.content.slots[0].data.listing.limit;
        this.sorting = this.content.slots[0].data.listing.sorting;

        this.$nuxt.$on('set-filter', (data) => {
            this.products = mappingCategoryProducts(data.elements);
            this.aggregations = data.aggregations;
            this.currentFilters = data.currentFilters;
            this.total = data.total;
            this.refreshComponent++;
        })
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
    }
}
</style>
