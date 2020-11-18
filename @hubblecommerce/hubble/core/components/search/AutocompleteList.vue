<template>
    <div class="autocomplete-list-wrp container">
        <div class="row">
            <div class="col-12">
                <div v-if="showCategories">
                    <div class="autocomplete-headline" v-text="$t('Categories')" />

                    <div
                        v-for="(category, key) in categoryItems"
                        :key="key"
                        class="autocomplete-element-wrp"
                        :class="{ 'selected-item': category.id === selectedItemId }"
                    >
                        <nuxt-link :to="'/' + category.url_path" class="autocomplete-element" v-text="category.heading_title" />
                    </div>
                </div>

                <div v-if="showProducts">
                    <div class="autocomplete-headline" v-text="$t('Products')" />

                    <div
                        v-for="(product, key) in productItems"
                        :key="key"
                        class="autocomplete-element-wrp"
                        :class="{ 'selected-item': product.id === selectedItemId }"
                    >
                        <nuxt-link :to="'/' + product.url_pds" class="autocomplete-element" v-text="product.manufacturer_name + ' ' + product.name" />
                    </div>
                </div>

                <div v-if="noProductsFound">
                    <div class="autocomplete-headline" v-text="$t('No products found')" />
                    <div class="autocomplete-element-wrp">
                        <div class="autocomplete-element" v-text="$t('We are sorry there is no such product. Please try another one.')" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
    name: 'AutocompleteList',

    computed: {
        ...mapState({
            categoryItems: state => state.modSearch.autoCompleteResults.categoryItems,
            productItems: state => state.modSearch.autoCompleteResults.productItems,
            selectedItemId: state => state.modSearch.selectedItemId,
        }),
        showCategories: function () {
            return !_.isEmpty(this.categoryItems);
        },
        showProducts: function () {
            return !_.isEmpty(this.productItems);
        },
        noProductsFound: function () {
            return _.isEmpty(this.categoryItems) && _.isEmpty(this.productItems);
        },
    },
};
</script>
