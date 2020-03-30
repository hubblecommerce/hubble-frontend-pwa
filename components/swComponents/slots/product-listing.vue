<template>
    <product-listing :data-items="categoryProductItems" list="Category" :extra-class="{'offset-top': isSticky}" :category="categoryItem.name" />
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import ProductListing from '../../productlist/ProductListing'
    export default {
        name: 'ProductListingSlot',
        components: { ProductListing },

        data() {
            return {
                categoryItem: {},
                categoryData: {},
                isSticky: false,
            }
        },

        computed: {
            ...mapState({
                dataCategory: state => state.modApiCategory.dataCategory,
                dataCategoryProducts: state => state.modApiCategory.dataCategoryProducts,
                dataMenu: state => state.modApiMenu.dataMenu,
                cmsObject: state => state.modApiResources.cmsObject,
                pathIds: state => state.modApiCategory.dataCategory.result.item.path_ids
            }),
            categoryProductItems() {
                if (_.isEmpty(this.dataCategoryProducts)) {
                    return this.dataCategoryProducts
                }

                return this.dataCategoryProducts.result.items
            },

        }

    }
</script>

<style scoped>

</style>
