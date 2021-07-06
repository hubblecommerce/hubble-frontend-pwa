<template>
    <div class="listing-wrp row">
        <div v-for="(item, index) in dataItems" :key="index" class="listing-item" :class="listingClass">
            <product-listing-card :index="index" :item-data="item" :show-badges="true" />
        </div>
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
        total: {
            type: Number,
            required: false,
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
$product-listing-gutter: 10px;

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
