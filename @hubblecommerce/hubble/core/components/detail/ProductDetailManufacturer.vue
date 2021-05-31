<template>
    <div v-if="dataProduct.manufacturer_item != null" class="brand-logo-wrp">
        <img v-if="dataProduct.manufacturer_item.logo != null" :src="dataProduct.manufacturer_item.logo" :alt="dataProduct.manufacturer_item.name" />
    </div>
    <div v-else-if="dataProduct.manufacturer_item != null" class="manufacturer-name text-small" v-text="dataProduct.manufacturer_item.name" />
</template>

<script>
export default {
    name: 'ProductDetailManufacturer',

    props: {
        dataProduct: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style lang="scss">
.brand-logo-wrp {
    height: 50px;

    img {
        height: 100%;
    }
}
</style>