<template>
    <div :class="elementClass">
        <div class="cms-element-alignment" :class="verticalAlign">
            <product-listing-card v-if="loaded" :item-orig="itemOrig" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { slotMixins } from '../helper'
    import ProductListingCard from '../../productlist/ProductListingCard'
    export default {
        name: 'ProductBoxSlot',
        components: { ProductListingCard },
        mixins: [slotMixins],
        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return{
                itemOrig: {},
                loaded: false
            }
        },
        computed: {
            verticalAlign() {
                if(this.content.config && this.content.config.verticalAlign) {
                    if(this.content.config.verticalAlign.value === "center") {
                        return 'align-self-center';
                    }
                    if(this.content.config.verticalAlign.value === "flex-end") {
                        return 'align-self-end';
                    }
                    if(this.content.config.verticalAlign.value === "flex-end") {
                        return 'align-self-start';
                    }
                }
                return '';
            }
        },

        created() {
            this.$store.dispatch('modApiResources/mappingProduct', this.content.data).then((response) => {
                // map product id to url from product urls probably already fetched
                this.itemOrig = response;
                this.loaded = true;
            });
        }
    };
</script>

<style lang="scss" scoped>
    .actions {
        display: none;
    }
</style>
