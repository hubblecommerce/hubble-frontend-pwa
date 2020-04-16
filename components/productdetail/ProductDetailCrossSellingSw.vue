<template>
    <div class="cross-selling-wrp">
        <transition name="fade" mode="out-in">
            <loader v-if="loading" />

            <div v-if="mappedCrossSellings.length > 0">
                <div v-for="result in mappedCrossSellings"
                     v-if="result.crossSelling.active"
                     class="container product-recommendation-slider"
                     :style="result.crossSelling.position != null ? `order: ${result.crossSelling.position};` : ''"
                >
                    <div class="block-title">
                        <div class="slider-title headline-1 pt-4" v-text="result.crossSelling.name" />
                    </div>

                    <div class="product-carousel">
                        <div class="wide-container">
                            <product-listing :data-items="result.products.items" :is-slider="true" :loop="false" />
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import ProductListing from "../productlist/ProductListing";
    import Loader from "../utils/Loader";

    export default {
        name: "ProductDetailCrossSellingSw",

        components: {
            Loader,
            ProductListing
        },

        data() {
            return {
                mappedCrossSellings: [],
                loading: false
            }
        },

        props: {
            productId: {
                type: String,
                required: true
            },

            crossSellings: {
                type: Array,
                required: true
            }
        },

        computed: {
            activeSellings: function() {
                return this.crossSellings.filter(crossSelling => crossSelling.active);
            }
        },

        mounted() {
            if(this.activeSellings.length > 0) {
                this.loading = true;
                this.fetchCrossSellings(this.productId);
            }
        },

        methods: {
            ...mapActions({
                swGetCrossSellingsByProductId: 'modApiCategory/swGetCrossSellingsByProductId'
            }),
            fetchCrossSellings: function(id) {
                this.swGetCrossSellingsByProductId(id).then((response) => {
                    this.loading = false;
                    this.mappedCrossSellings = response;
                }).catch(() => {
                    this.loading = false;
                });
            },
        }
    }
</script>
