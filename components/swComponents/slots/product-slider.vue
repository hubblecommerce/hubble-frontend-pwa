<template>
    <div :class="elementClass">
        <div class="cms-element-alignment" :class="verticalAlign">
            <product-listing v-if="loaded" :data-items="dataItems" :is-slider="true" />
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
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
            ...mapState({
                dataProductUrls: state => state.modApiResources.dataProductUrls,

            }),
            verticalAlign() {
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
                return '';
            }
        },

        created() {
            this.$store.dispatch('modApiCategory/mappingCategoryProducts', {
                data: this.content.data.products
            }).then((res) => {
                this.dataItems = res.items;
                this.loaded = true;
            });
        }
    };
</script>

<style lang="scss" scoped>
</style>
