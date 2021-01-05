<template>
    <div v-if="showProducts" class="container product-recommendation-slider">
        <div class="block-title">
            <div class="slider-title headline-1 pt-4">
                {{ $t('Similar Products') }}
            </div>
        </div>

        <div class="product-carousel">
            <div class="wide-container">
                <product-listing :data-items="dataProductsCrossSimilar" :is-slider="true" :loop="false" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ProductListing from '../productlist/ProductListing';
import _ from 'lodash';

export default {
    name: 'ProductDetailRecommandationsSimilar',

    components: {
        ProductListing,
    },

    props: {
        productId: {
            type: Number,
            required: true,
        },
    },

    data() {
        return {
            showProducts: false,
        };
    },

    computed: {
        ...mapState({
            dataProductsCrossSimilar: (state) => state.modApiProduct.dataProductsCrossSimilar,
        }),
    },

    mounted() {
        this.getProductsCrossSimilar();
    },

    methods: {
        ...mapActions({
            getProductsCrossSimilarApiCall: 'modApiProduct/getProductsCrossSimilar',
        }),
        getProductsCrossSimilar: function () {
            return new Promise((resolve) => {
                // Get cross-selling products from api
                this.getProductsCrossSimilarApiCall({
                    data: this.productId,
                })
                    .then((response) => {
                        this.showProducts = !_.isEmpty(response.result.items);
                        resolve('ok');
                    })
                    .catch((error) => {
                        console.log('Failed to fetch: ', error);
                    });
            });
        },
    },
};
</script>
