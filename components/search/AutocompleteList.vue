<template>
    <div class="autocomplete-list-wrp">
        <div v-if="showCategories">
            <div class="autocomplete-headline" v-text="$t('Categories')" />
            <div v-for="(category, key) in categoryItems" :key="key" class="autocomplete-element-wrp" :class="{'selected-item': category.id === selectedItemId}">
                <nuxt-link :to="'/' + category.url_path" class="autocomplete-element" v-text="category.heading_title" />
            </div>
        </div>
        <div v-if="showProducts">
            <div class="autocomplete-headline" v-text="$t('Products')" />
            <div v-for="(product, key) in productItems" :key="key" class="autocomplete-element-wrp" :class="{'selected-item': product.id === selectedItemId}">
                <nuxt-link :to="'/' + product.url_pds" class="autocomplete-element" v-text="product.manufacturer_name + ' ' + product.name" />
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        name: "AutocompleteList",

        computed: {
            ...mapState({
                categoryItems: state => state.modSearch.autoCompleteResults.categoryItems,
                productItems: state => state.modSearch.autoCompleteResults.productItems,
                selectedItemId: state => state.modSearch.selectedItemId
            }),
            showCategories: function () {
                return !_.isEmpty(this.categoryItems);
            },
            showProducts: function () {
                return !_.isEmpty(this.productItems);
            }
        }
    }
</script>

<style scoped>

</style>