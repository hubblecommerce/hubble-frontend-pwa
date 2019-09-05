<template>
    <div class="view-catalogsearch">
        <template v-if="hasCategoryProductItems">
            <div class="container search-content-wrp">
                <div class="search-products-wrp">
                    <product-listing-filter />
                    <product-listing :data-items="categoryProductItems"></product-listing>
                    <div class="pagination-bottom">
                        <pagination />
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="container category-header no-results">
                <div class="category-info row">
                    <div class="col-12">
                        <h1 class="title" v-text="noSearchResultLabel"></h1>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Pagination from './Pagination.vue';

    export default {
        name: 'ViewCatalogsearch',

        components: {
            Pagination
        },

        computed: {
            ...mapState({
                dataCategory: state => state.modApiResources.dataCategory,
                dataCategoryProducts: state => state.modApiResources.dataCategoryProducts
            }),
            categoryItem() {
                if(_.isEmpty(this.dataCategory)) {
                    return this.dataCategory;
                }

                // console.log("debug dataCategory.result: %o", this.dataCategory.result);
                return this.dataCategory.result.item;
            },
            categoryProductItems() {
                if(_.isEmpty(this.dataCategoryProducts)) {
                    return this.dataCategoryProducts;
                }

                // console.log("debug categoryProductItems: %o", this.dataCategoryProducts.result);
                return this.dataCategoryProducts.result.items;
            },
            hasCategoryProductItems() {
                return ! _.isEmpty(this.categoryProductItems);
            },
            noSearchResultLabel() {
                return this.$t('No search results for:') + ' ' + this.$route.query.term;
            },
            curSearchResultLabel() {
                return 'Search for: ' + this.$route.query.term;
            }
        },

        head () {
            return {
                title: this.curSearchResultLabel,
                meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                { hid: 'description', name: 'description', content: 'Generic Homepage Meta-Description' },
                { hid: 'robots', name: 'robots', content: 'INDEX, FOLLOW' },
                { hid: 'keywords', name: 'keywords', content: 'Home, Nuxt, Test' }
                ]
            }
        }
    }
</script>
