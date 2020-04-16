<template>
    <div v-if="dataProduct.manufacturer_item != null" class="brand-logo-wrp">
        <img :src="logoPath"
             :alt="dataProduct.manufacturer_item.name"
             :title="dataProduct.manufacturer_item.name"
        >
    </div>
    <div v-else-if="dataProduct.manufacturer_item != null" class="manufacturer-name text-small" v-html="dataProduct.manufacturer_item.name" />
</template>

<script>
    export default {
        name: "ProductDetailManufacturer",

        props: {
            dataProduct: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                logoPath: null
            }
        },

        mounted() {
            this.getLogoPath();
        },

        methods: {
            getLogoPath: function() {
                if(this.dataProduct.manufacturer_item != null) {
                    this.logoPath = this.dataProduct.manufacturer_item.logo;
                }
            }
        }
    }
</script>
