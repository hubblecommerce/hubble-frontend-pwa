<template>
    <div v-if="logoPath !== null" class="brand-logo-wrp">
        <img :src="logoPath" :alt="dataProduct.manufacturer_item.name" :title="dataProduct.manufacturer_item.name" />
    </div>
    <div v-else-if="dataProduct.manufacturer_item.name" class="manufacturer-name text-small" v-html="dataProduct.manufacturer_item.name" />
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

    data() {
        return {
            logoPath: null,
        };
    },

    mounted() {
        this.getLogoPath();
    },

    methods: {
        getLogoPath: function () {
            let logoPath = null;

            if (this.dataProduct.manufacturer_item.logo) {
                logoPath = this.dataProduct.manufacturer_item.logo;
            }

            this.logoPath = logoPath;
        },
    },
};
</script>
