<template>
    <div v-if="totalItems > 0" class="item-count-wrp text-small">
            <span v-if="totalItems > 1">
                {{ dataCategoryProducts.result.stats.total }} {{$t('shopping_cart_label_items')}}
            </span>
        <span v-else>
                {{ dataCategoryProducts.result.stats.total }} {{$t('shopping_cart_label_item')}}
            </span>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    export default {
        name: 'ItemCount',

        computed: {
            ...mapState({
                dataMenu: state => state.modApiMenu.dataMenu,
                dataCategory: state => state.modApiCategory.dataCategory,
                dataCategoryProducts: state => state.modApiCategory.dataCategoryProducts
            }),
            totalItems: function() {
                if(this.dataCategoryProducts.result.stats != null) {
                    return this.dataCategoryProducts.result.stats.total;
                }

                return 0;
            }
        }
    }
</script>

<style scoped>

</style>
