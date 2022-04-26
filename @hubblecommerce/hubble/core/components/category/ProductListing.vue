<template>
    <div class="listing-wrp row">
        <template v-if="dataItems.length === 0">
            <div class="error-message" v-text="'There are no products available in this category or for this filter.'" />
        </template>
        <template else>
            <div v-for="(item, index) in dataItems" :key="index" class="listing-item" :class="listingClass">
                <product-listing-card :index="index" :item-data="item" :show-badges="true" />
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'ProductListing',

    props: {
        dataItems: {
            type: Array,
            required: true,
        },
        listingClass: {
            type: String,
            required: false,
            default: 'col-6 col-sm-6 col-md-4 col-lg-3',
        },
    },
};
</script>

<style lang="scss">
$product-listing-gutter: 11px;

.listing-wrp {
    position: relative;
    margin-bottom: 15px;

    &.row {
        display: flex;
        flex-wrap: wrap;
        margin-right: -$product-listing-gutter;
        margin-left: -$product-listing-gutter;
    }

    .listing-item {
        padding: $product-listing-gutter;
    }
}
</style>
