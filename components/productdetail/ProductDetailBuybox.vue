<template>
    <div class="product-shop">
        <div class="product-info-wrp">
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

            <!-- Price -->
            <div class="price-cart-delivery-wrp mb-2">
                <div class="price-box">
                    <product-detail-buybox-price :item="dataProduct" />
                </div>
            </div>

            <!-- Delivery -->

            <!-- Add to ca -->

        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations } from 'vuex'
    import ProductDetailBuyboxPrice from "./ProductDetailBuyboxPrice";
    import ProductDetailManufacturer from "./ProductDetailManufacturer";

    export default {
        components: {
            ProductDetailManufacturer,
            ProductDetailBuyboxOptions: () => import('./ProductDetailBuyboxOptions'),
            ProductDetailBuyboxOptionsSw: () => import('./ProductDetailBuyboxOptionsSw'),
            ProductDetailBuyboxPrice
        },

        data() {
            return {
                name: 'ProductDetailBuybox',
                selected: {
                    origin: null,
                    processed: null
                },
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
            attributeName() {
                if (this.dataProduct.facets.string_facets[0]) {
                    return this.dataProduct.facets.string_facets[0]['label'];
                }

                return null;
            },
            itemIsSimple() {
                return this.dataProduct.type === 'simple';
            },
            itemIsGrouped() {
                return this.dataProduct.type === 'grouped';
            },
            itemIsConfigurable() {
                return this.dataProduct.type === 'configurable';
            },
            showSelectedOption: function () {
                // Store issert
                if(!_.isEmpty(this.selectedVariants[0])) {
                    return this.selectedVariants[0].value_label.replace('.0', '');
                }
                return null;
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
                setOptionIsSelected: 'modApiProduct/setOptionIsSelected',
                setCollapsed: 'modCollapsibleState/setCollapsed'
            }),
            openCollapsible: function() {
                if(this.$mq === 'sm') {
                    this.setCollapsed();
                }
            },
            formatSize: function (size) {
                return size.replace('.0', '');
            },
            selectedOption: function (option) {
                if(option.stock_qty > 0 ) {
                    this.setOptionIsSelected(option);
                    this.removeOptionNotSelectedError();
                    this.selected.origin = option.value_label;
                    this.selected.processed = option.value_label.replace('.0', '');
                }
                return null;
            },
            getUnavailableClass: function(option) {
                return option.stock_qty === 0 ? 'unavailable' : '';
            },

            isApiType: function(type) {
                return process.env.API_TYPE === type;
            }
        }
    };
</script>
