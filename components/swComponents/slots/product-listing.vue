<template>
    <div>
        <div class="d-flex justify-content-between container">
            <pagination />
            <div class="d-flex">
                <selectable-limit :data-options="optionsLimit" />
                <selectable-order :data-options="optionsSorter" />
            </div>
        </div>
        <product-listing :data-items="categoryProductItems" list="Category" :extra-class="{'offset-top': isSticky}" :category="categoryItem.name" />
    </div>
</template>

<script>
import {mapState} from 'vuex';
import ProductListing from '../../productlist/ProductListing'
import Pagination from '../../productlist/toolbar/Pagination'
import SelectableLimit from '../../productlist/toolbar/SelectableLimit'
import SelectableOrder from '../../productlist/toolbar/SelectableOrder'
    export default {
        name: 'ProductListingSlot',
        components: { ProductListing, Pagination, SelectableLimit, SelectableOrder },

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
                pathIds: state => state.modApiCategory.dataCategory.result.item.path_ids,
                optionsLimit: state => state.modApiRequests.optionsLimit,
                optionsSorter: state => state.modApiRequests.optionsSorter,
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
    .limit {
        width: 100px !important;
    }

    .hbl-select {
        width: 180px;
        margin-left: 10px;
        margin-right: 10px;
    }
</style>
