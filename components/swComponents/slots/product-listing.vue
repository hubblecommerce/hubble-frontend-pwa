<template>
    <div>
        <div v-if="errorNoProducts" class="container">
            <div class="error-message" v-text="$t('There are no products available in this category or for this filter.')" />
        </div>
        <div v-else class="d-flex justify-content-between product-listing-toolbar__wrapper">
            <pagination />
            <div class="d-flex product-listing-toolbar__selectables">
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
            errorNoProducts() {
                return _.isEmpty(this.categoryProductItems)
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
    }

    .product-listing-toolbar__wrapper {
        flex-wrap: wrap;
    }

    .product-listing-toolbar__selectables {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 40px;
        margin-bottom: 10px;
    }


    @media(min-width: 768px) {
        .product-listing-toolbar__wrapper {
            flex-wrap: inherit;
        }
        .product-listing-toolbar__selectables {
            justify-content: flex-end;
            order: 3;
        }
        .limit {
            margin-right: 20px;
        }
    }
</style>
