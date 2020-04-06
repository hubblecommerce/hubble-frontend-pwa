<template>
    <div class="product-shop">
        <div class="product-info-wrp">
            <div class="row mb-3 product-headline d-flex">
                <!-- Product Headline -->
                <div class="product-headline-info">
                    <h1>
                        <div v-if="productManufacturer" class="manufacturer-name headline-4" v-html="productManufacturer.name" />
                        <div class="product-name text-small" v-html="dataProduct.name" />
                    </h1>

                    <!-- SKU -->
                    <div v-if="dataProduct.sku" class="sku">
                        {{ $t('sku_label') }}: {{ dataProduct.sku }}
                    </div>
                </div>
                <div v-if="logoPath !== null" class="brand-logo-wrp">
                    <img :src="logoPath"
                         :alt="dataProduct.manufacturer_item.name"
                         :title="dataProduct.manufacturer_item.name"
                    >
                </div>
            </div>

            <!-- Variants -->
            <div class="variants-wrp">
                <product-detail-buybox-options v-if="itemIsConfigurable && !isApiType('sw')" />

                <product-detail-buybox-options-sw v-if="itemIsConfigurable && isApiType('sw')" />

                <div v-if="optionNotSelectedError" class="error-message">
                    {{ $t('Please select {atrName} first', { atrName: attributeName }) }}
                </div>
            </div>

            <!-- Link to description-tab: on click scroll to description and show content / Mobile view /-->
            <div v-if="$mq === 'sm'" class="description-link-wrp">
                <a href="#description-tab" class="description-link link-primary" @click="openCollapsible()">{{ $t('See description') }}</a>
            </div>
            <div v-if="$mq === 'md' || $mq === 'lg'" class="description-link-wrp">
                <a href="#description" class="description-link link-primary">{{ $t('See description') }}</a>
            </div>

            <div class="price-cart-delivery-wrp mb-2">
                <div class="price-box">
                    <product-detail-buybox-price :item="dataProduct" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions} from 'vuex'
    import ProductDetailBuyboxPrice from "./ProductDetailBuyboxPrice";

    export default {
        components: {
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

                logoPath: null
            }
        },

        computed: {
            ...mapState({
                dataProduct: state => state.modApiProduct.dataProduct.result.item,
                productManufacturer: state => state.modApiProduct.dataProduct.result.item.manufacturer_item,
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

        mounted() {
            this.getLogoPath();
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
            ...mapActions({
                toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction'
            }),
            openCollapsible: function() {
                this.setCollapsed();
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
            getSelectedClass: function(option) {
                if(!_.isEmpty(this.selectedVariants[0])) {
                    return this.selectedVariants[0].value_label === option.value_label ? 'selected' : '';
                }
            },
            getUnavailableClass: function(option) {
                return option.stock_qty === 0 ? 'unavailable' : '';
            },
            toggle: function() {
                this.toggleOffcanvasAction( {
                    component: this.name,
                    direction: 'rightLeft'
                });
            },
            getLogoPath: function() {
                let logoPath = null;

                if(this.dataProduct.manufacturer_item.logo) {
                    logoPath = this.dataProduct.manufacturer_item.logo;
                }

                this.logoPath = logoPath;
            },
            isApiType: function(type) {
                return process.env.API_TYPE === type;
            }
        }
    };
</script>
