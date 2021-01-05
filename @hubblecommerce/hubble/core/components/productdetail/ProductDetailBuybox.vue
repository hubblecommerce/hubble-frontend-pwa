<template>
    <div class="container product-info-wrp">
        <!-- Header -->
        <div class="product-headline">
            <product-detail-manufacturer :data-product="dataProduct" />
            <div class="product-headline-info">
                <h1 class="product-name headline-4" v-text="dataProduct.name" />
                <div v-if="dataProduct.sku" class="sku" v-text="`${$t('sku_label')}: ${dataProduct.sku} `" />
            </div>
            <add-to-wishlist v-if="$mq === 'lg'" :item="dataProduct" />
        </div>

        <!-- Price info -->
        <product-detail-price :item="dataProduct" />

        <!-- Delivery info -->
        <product-detail-delivery :item="dataProduct" />

        <!-- Variants -->
        <div class="variants-wrp">
            <product-detail-buybox-options v-if="itemIsConfigurable && !isApiType('sw')" />
            <product-detail-buybox-options-sw v-if="itemIsConfigurable && isApiType('sw')" />
            <div v-if="optionNotSelectedError" class="error-message">
                {{ $t('Please select {atrName} first', { atrName: attributeName }) }}
            </div>
        </div>

        <!-- Add to cart -->
        <div class="add-to-cart-wrp">
            <qty-selector :max-qty="dataProduct.stock_item.qty" @changeQty="onChangeQty($event)" />
            <product-detail-add-to-cart :qty="qty" :item="dataProduct" :loader-display="'ellipsis'" />
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
    components: {
        QtySelector: () => import('../../components/utils/QtySelector'),
        ProductDetailAddToCart: () => import('./ProductDetailAddToCart'),
        ProductDetailPrice: () => import('./ProductDetailPrice'),
        ProductDetailDelivery: () => import('./ProductDetailDelivery'),
        ProductDetailManufacturer: () => import('./ProductDetailManufacturer'),
        ProductDetailBuyboxOptions: () => import('./ProductDetailBuyboxOptions'),
        ProductDetailBuyboxOptionsSw: () => import('./ProductDetailBuyboxOptionsSw'),
        AddToWishlist: () => import('../../components/productutils/AddToWishlist'),
    },

    data() {
        return {
            name: 'ProductDetailBuybox',
            qty: 1,
        };
    },

    computed: {
        ...mapState({
            dataProduct: (state) => state.modApiProduct.dataProduct.result.item,
            optionNotSelectedError: (state) => state.modApiProduct.optionNotSelectedError,
        }),
        attributeName: function () {
            if (this.dataProduct.facets.string_facets[0]) {
                return this.dataProduct.facets.string_facets[0]['label'];
            }

            return null;
        },
        itemIsConfigurable: function () {
            return this.dataProduct.type === 'configurable';
        },
    },

    created() {
        this.resetSelectedVariants();
        this.removeOptionNotSelectedError();
    },

    methods: {
        ...mapMutations({
            resetSelectedVariants: 'modApiProduct/resetSelectedVariants',
            removeOptionNotSelectedError: 'modApiProduct/removeOptionNotSelectedError',
        }),
        isApiType: function (type) {
            return process.env.API_TYPE === type;
        },
        onChangeQty: function (e) {
            this.qty = e;
        },
    },
};
</script>
