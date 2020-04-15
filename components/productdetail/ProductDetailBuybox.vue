<template>
    <div class="container product-info-wrp">
        <!-- Header -->
        <div class="row mb-3 product-headline d-flex">
            <div class="product-headline-info">
                <h1 class="product-name headline-4" v-html="dataProduct.name" />
                <div v-if="dataProduct.sku" class="sku">
                    {{ $t('sku_label') }}: {{ dataProduct.sku }}
                </div>
            </div>
            <product-detail-manufacturer :data-product="dataProduct" />
        </div>

        <!-- Variants -->
        <div class="variants-wrp">
            <product-detail-buybox-options v-if="itemIsConfigurable && !isApiType('sw')" />
            <product-detail-buybox-options-sw v-if="itemIsConfigurable && isApiType('sw')" />
            <div v-if="optionNotSelectedError" class="error-message">
                {{ $t('Please select {atrName} first', { atrName: attributeName }) }}
            </div>
        </div>

        <!-- Link to description -->
        <a href="#description" class="description-link-wrp description-link link-primary" @click="openCollapsible()">{{ $t('See description') }}</a>

        <!-- Delivery info -->
        <product-detail-delivery :item="dataProduct" />

        <!-- Price info -->
        <product-detail-price :item="dataProduct" />

        <!-- Add to cart -->
        <div v-if="$mq === 'sm'" class="row">
            <div class="col-12">
                <product-detail-add-to-cart :item="dataProduct" />
            </div>
        </div>

        <div v-if="$mq === 'md' || $mq === 'lg'" class="d-flex cart-button-wrp">
            <product-detail-add-to-cart :item="dataProduct" />
            <add-to-wishlist v-if="$mq === 'lg'" class="add-to-wishlist-button" :item="dataProduct" />
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations } from 'vuex'
    import ProductDetailBuyboxPrice from "./ProductDetailBuyboxPrice";
    import ProductDetailManufacturer from "./ProductDetailManufacturer";
    import ProductDetailDelivery from "./ProductDetailDelivery";
    import ProductDetailPrice from "./ProductDetailPrice";
    import ProductDetailAddToCart from "./ProductDetailAddToCart";
    import AddToWishlist from "../productutils/AddToWishlist";

    export default {
        components: {
            AddToWishlist,
            ProductDetailAddToCart,
            ProductDetailPrice,
            ProductDetailDelivery,
            ProductDetailManufacturer,
            ProductDetailBuyboxOptions: () => import('./ProductDetailBuyboxOptions'),
            ProductDetailBuyboxOptionsSw: () => import('./ProductDetailBuyboxOptionsSw'),
            ProductDetailBuyboxPrice
        },

        data() {
            return {
                name: 'ProductDetailBuybox',
                isActive: false,
                attributeCodeSize: 'groesse',
                attributeCodeManufacturer: 'manufacturer',
                itemData: {},
                showTierPrices: false,
            }
        },

        computed: {
            ...mapState({
                dataProduct: state => state.modApiProduct.dataProduct.result.item,
                optionIsSelected: state => state.modApiProduct.optionIsSelected,
                optionNotSelectedError: state => state.modApiProduct.optionNotSelectedError,
                selectedVariants: state => state.modApiProduct.selectedVariants
            }),
            ...mapGetters({
                productHasTierPricesByGroupId: 'modPrices/productHasTierPricesByGroupId'
            }),
            attributeName: function() {
                if (this.dataProduct.facets.string_facets[0]) {
                    return this.dataProduct.facets.string_facets[0]['label'];
                }

                return null;
            },
            itemIsConfigurable: function() {
                return this.dataProduct.type === 'configurable';
            }
        },

        created() {
            this.resetSelectedVariants();
            this.removeOptionNotSelectedError();
        },

        methods: {
            ...mapMutations({
                resetSelectedVariants: 'modApiProduct/resetSelectedVariants',
                removeOptionNotSelectedError: 'modApiProduct/removeOptionNotSelectedError',
                setCollapsed: 'modCollapsibleState/setCollapsed'
            }),
            openCollapsible: function() {
                if(this.$mq === 'sm') {
                    this.setCollapsed();
                }
            },
            isApiType: function(type) {
                return process.env.API_TYPE === type;
            }
        }
    };
</script>
