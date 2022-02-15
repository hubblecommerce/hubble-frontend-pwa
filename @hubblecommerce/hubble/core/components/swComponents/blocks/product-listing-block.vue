<template>
    <div v-if="content.slots[0].data.listing != null" class="container">
        <product-listing-filter
            :aggregations="aggregations"
            :current-filters="currentFilters"
            :limit="limit"
            :sorting="sorting"
        />
        <div class="toolbar top">
            <product-listing-pagination
                v-if="total > 0"
                :page="page"
                :limit="limit"
                :total="total"
                :sorting="sorting"
                :current-filters="currentFilters"
            />
        </div>
        <product-listing
            v-if="products != null"
            :data-items="products"
            :total="total"
            :listing-class="'col-12 col-sm-12 col-md-4 col-lg-3'"
        />
        <div class="toolbar bottom">
            <product-listing-pagination
                v-if="total > 0"
                :page="page"
                :limit="limit"
                :total="total"
                :sorting="sorting"
                :current-filters="currentFilters"
                :scroll-top-on-change="true"
            />
        </div>
    </div>
</template>

<script>
import { mappingCategoryProducts, mappingListingFilters } from '@/utils/api-mapping-helper';

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
            page: null,
            total: null,
            limit: null,
            sorting: null
        };
    },

    created() {
        this.products = mappingCategoryProducts(this.content.slots[0].data.listing.elements);
        this.aggregations = this.content.slots[0].data.listing.aggregations;
        this.currentFilters = mappingListingFilters(this.content.slots[0].data.listing.currentFilters);
        this.page = this.content.slots[0].data.listing.page;
        this.total = this.content.slots[0].data.listing.total;
        this.limit = this.content.slots[0].data.listing.limit;
        this.sorting = this.content.slots[0].data.listing.sorting;

        this.$nuxt.$on('set-filter', (data) => {
            this.products = mappingCategoryProducts(data.elements);
            this.aggregations = data.aggregations;
            this.currentFilters = mappingListingFilters(data.currentFilters);
            this.page = data.page;
            this.total = data.total;
            this.refreshComponent++;
        });

        this.$nuxt.$on('set-page', (data) => {
            this.products = mappingCategoryProducts(data.elements);
            this.page = data.page;
        });
    }
};
</script>

<style lang="scss">
.toolbar {
    display: flex;
    justify-content: center;

    &.top {
        display: none;
    }
}

@media (min-width: 1024px) {
    .toolbar {
        &.top {
            display: flex;
        }
    }
}
</style>
