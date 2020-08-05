<template>
    <div class="last-viewed--wrp">
        <div class="last-viewed--header">
            <div class="last-viewed--title">Last Viewed Products</div>
            <button v-if="!onViewedProductsPage" class="last-viewed--button--show-all" @click="showAllViewedProducts">Show All</button>
        </div>
        <div class="last-viewed--list">
                <div v-for="product in selectionOfViewedProducts" :key="product.id" class="last-viewed--clickable">
                        <a :href="'/' + product.url_pds">
                            <img-lazy :src="product.image"
                                      :alt-info="product.name"
                                      :title-info="product.name"
                                      class="last-viewed--image"
                            />
                            <div class="last-viewed--name">{{ product.name }}</div>
                        </a>
                </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        name: "LastViewedProducts",

        computed: {
            ...mapState({
                viewedProducts: state => state.modLastViewed.viewedProducts,
                minToShow: state => state.modLastViewed.minToShow,
                maxSaved: state => state.modLastViewed.maxSaved
            }),
            onViewedProductsPage: function () {
                return this.$route.path.includes('/customer/viewedproducts');
            },
            selectionOfViewedProducts: function () {
                if (this.onViewedProductsPage) {
                    return this.viewedProducts.filter((viewedProduct, index) => index < this.maxSaved)
                } else {
                    return this.viewedProducts.filter((viewedProduct, index) => index < this.minToShow)
                }
            }
        },

        methods: {
            showAllViewedProducts: function () {
                this.$router.push({
                    path: this.localePath('customer-viewedproducts')
                })
            }
        },

        created() {
            if (process.client && !(this.onViewedProductsPage)) this.$store.dispatch('modLastViewed/saveViewedProductsToLocalForage');
        }
    }
</script>
