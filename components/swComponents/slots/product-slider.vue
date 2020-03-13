<template>
    <div :class="elementClass">
        <div class="cms-element-alignment" :class="verticalAlign">
            <product-listing v-if="loaded" :data-items="dataItems" :is-slider="true" />
        </div>
    </div>
</template>

<script>
    import { slotMixins } from '../helper'
    import ProductListing from '../../productlist/ProductListing'
    export default {
        name: 'ProductSliderSlot',
        components: { ProductListing },
        mixins: [slotMixins],
        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return{
                dataItems: [],
                loaded: false
            }
        },

        computed: {
            verticalAlign() {
                // to-do: add bootstrap classes align-self to essentials
                if(this.content.config && this.content.config.verticalAlign) {
                    if(this.content.config.verticalAlign.value == "center") {
                        return 'align-self-center'
                    }
                    if(this.content.config.verticalAlign.value == "flex-end") {
                        return 'align-self-end'
                    }
                    if(this.content.config.verticalAlign.value == "flex-end") {
                        return 'align-self-start'
                    }
                }
            }
        },

        created() {
            this.$store.dispatch('modApiResources/mappingCategoryProducts', {
                data: this.content.data.products
            }).then((response) => {
                this.dataItems = response.items;
                this.loaded = true;
            });
        }
    };
</script>

<style lang="scss" scoped>
</style>
