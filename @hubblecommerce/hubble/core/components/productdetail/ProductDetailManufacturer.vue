<template>
    <div v-if="dataProduct.manufacturer_item.logo != null" class="brand-logo-wrp">
        <img-lazy
            :src="dataProduct.manufacturer_item.logo"
            :alt-info="dataProduct.manufacturer_item.name"
            :title-info="dataProduct.manufacturer_item.name"
        />
    </div>
    <div
        v-else-if="dataProduct.manufacturer_item != null"
        class="manufacturer-name text-small"
        v-text="dataProduct.manufacturer_item.name"
    />
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
