<template>
    <div>
        <div v-if="!categoryProductItems" class="container">
            <div
                class="error-message"
                v-text="$t('There are no products available in this category or for this filter.')"
            />
        </div>
        <div v-else>
            <pagination />
        </div>
        <product-listing
            v-if="categoryProductItems"
            :data-items="categoryProductItems"
            list="Category"
            :extra-class="{ 'offset-top': isSticky }"
            :listing-class="'col-12 col-sm-12 col-md-4 col-lg-3'"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import ProductListing from '../../productlist/ProductListing';
import Pagination from '../../productlist/toolbar/Pagination';
import _ from 'lodash';

export default {
    name: 'ProductListingSlot',
    components: { ProductListing, Pagination },

    data() {
        return {
            isSticky: false
        };
    },

    computed: {
        ...mapState({
            dataCategoryProducts: (state) => state.modApiCategory.dataCategoryProducts
        }),
        categoryProductItems() {
            if(_.isEmpty(this.dataCategoryProducts.result.items)) {
                return false;
            }

            return this.dataCategoryProducts.result.items;
        }
    },
};
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

@media (min-width: 768px) {
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
