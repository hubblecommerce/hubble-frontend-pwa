<template>
    <div v-if="content.slots[0].data.listing === 0" class="container">
        <div class="error-message" v-text="'There are no products available in this category or for this filter.'" />
    </div>
    <div v-else>
        <div class="toolbar-top">
            <product-listing-pagination
                :paginationItemsTotal="content.slots[0].data.listing.total"
                :paginationPerPage="content.slots[0].data.listing.limit"
            />
        </div>
        <product-listing
            v-if="products != null"
            :data-items="products"
            :total="content.slots[0].data.listing.total"
            :listing-class="'col-12 col-sm-12 col-md-4 col-lg-3'"
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
        };
    },

    created() {
        this.products = mappingCategoryProducts(this.content.slots[0].data.listing.elements);
    },
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
