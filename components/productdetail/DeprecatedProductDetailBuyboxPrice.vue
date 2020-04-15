<template>
    <div class="product-row product-row-default">

        <!-- Price-Cart-Delivery Order -->
        <div v-if="$mq === 'sm'" class="delivery-info">
            <p class="availability bottom in-stock">
                <span>{{ $t('delivery_time') }}</span>
            </p>
            <p>
                <span class="bold-text">{{ $t('no shipping costs') }}</span>
            </p>
            <p>{{ $t('easy and') }} <span class="bold-text">{{ $t('free returns') }}</span> {{ $t('within Germany') }} </p>
        </div>

        <div v-if="$mq === 'md' || $mq === 'lg'">

            <product-detail-price :item="item" />

            <div class="delivery-info">
                <p v-if="item.delivery_time" class="availability bottom in-stock">
                    <span>{{ $t('delivery_time') }}</span> <span v-text="item.delivery_time.name"></span>
                </p>
                <p v-if="item.shipping_free">
                    <span class="bold-text">{{ $t('no shipping costs') }}</span>
                </p>
            </div>
        </div>

        <!-- Price-Cart-Delivery Order -->
        <div v-if="$mq === 'sm'" class="price-cart-wrp">

            <product-detail-price :item="item" />

            <div class="d-flex cart-button-wrp">
                <button :disabled="loaderState" type="button" :title="$t('add_to_cart')" class="add-to-cart m-0 w-100" @click.prevent="addToCart">
                    <i class="icon icon-cart" aria-hidden="true" />
                    <span v-if="!loaderState" class="cart-button-label headline-4">{{ $t('add_to_cart') }}</span>
                    <div v-if="loaderState" class="lds-ellipsis">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                    <material-ripple />
                </button>
            </div>
        </div>

        <div v-if="$mq === 'md' || $mq === 'lg'" class="d-flex cart-button-wrp">
            <button :disabled="loaderState" type="button" :title="$t('add_to_cart')" class="add-to-cart m-0 w-100" @click.prevent="addToCart">
                <i class="icon icon-cart" aria-hidden="true" />
                <span v-if="!loaderState" class="cart-button-label headline-4">{{ $t('add_to_cart') }}</span>
                <div v-if="loaderState" class="lds-ellipsis">
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
                <material-ripple />
            </button>
            <add-to-wishlist v-if="$mq === 'lg'" class="add-to-wishlist-button" :item="productData" />
        </div>

    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
    import AddToWishlist from "../productutils/AddToWishlist";
    import { clearDataLayer } from "@hubblecommerce/hubble/core/utils/gtmHelper";
    import ProductDetailPrice from "./ProductDetailPrice";

    export default {

        components: {
            ProductDetailPrice,
            AddToWishlist
        },

        props: {
            item: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                name: 'ProductDetailBuyboxPrice',
                selectedQty: 1,
                showTierPrices: false,
                addedItemId: '',
                loaderState: false,
                addToCartSuccess: false,
                addToCartError: ''
            }
        },

        computed: {
            ...mapState({
                priceSwitcherIncludeVat: state => state.modPrices.priceSwitcherIncludeVat,
                selectedVariants: state => state.modApiProduct.selectedVariants,
                dataProduct: state => state.modApiProduct.dataProduct,
                cart: state => state.modCart.cart,
            }),
            ...mapGetters({
                productIsSpecial: 'modPrices/productIsSpecial',
                productGetTierPricesByGroupId: 'modPrices/productGetTierPricesByGroupId',
                productHasTierPricesByGroupId: 'modPrices/productHasTierPricesByGroupId',
                getTaxClassByLabel: 'modPrices/getTaxClassByLabel',
                getPriceAndCurrencyDecFmt: 'modPrices/getPriceAndCurrencyDecFmt'
            }),
            productData() {
                if(_.isEmpty(this.dataProduct)) {
                    return this.dataProduct;
                }

                return this.dataProduct.result.item;
            },
            classesExcl() {
                return this.priceSwitcherIncludeVat ? 'decorated-thin' : 'decorated-bold';
            },
            classesIncl() {
                return this.priceSwitcherIncludeVat ? 'decorated-bold' : 'decorated-thin';
            },
            classesPriceBox() {
                return [
                    this.itemIsSpecial ? 'special-price' : '',
                    this.itemIsMinimal ? 'minimal-price' : ''
                ];
            },
            itemIsMinimal() {
                return false;
            },
            itemIsSpecial() {
                return this.productIsSpecial(this.item);
            },
            itemNameText() {
                if(this.item.short_name && this.item.short_name.length) {
                    return this.item.short_name;
                }

                return this.item.name;
            },
            itemTierPrices() {
                let groupID = 0;

                return this.productGetTierPricesByGroupId(this.item, groupID);
            },
            itemTierPriceMin() {
                return _.minBy(this.itemTierPrices, 'display_price_brutto');
            },
            itemHasTierPrices() {
                var groupID = 0;

                return this.productHasTierPricesByGroupId(this.item, groupID);
            },
            itemHasTierPricesMore() {
                return this.itemTierPrices.length > 1;
            },
            itemTierPriceDiscount() {
                if(! this.itemHasTierPrices) {
                    return null;
                }

                let _item_min_price = this.item.final_price_item.min_price;
                let _tier_min_price = this.itemTierPriceMin.price;

                let _diff = 100 - (_tier_min_price / _item_min_price * 100);

                return _.round(_diff);
            },
            itemHasBasePriceAmount() {
                if(! this.item.final_price_item.base_price_amount) { return false; }
                if(! this.item.final_price_item.base_price_base_amount) { return false; }
                if(! this.item.final_price_item.base_price_amount.length) { return false; }
                if(! this.item.final_price_item.base_price_base_amount.length) { return false; }

                return this.item.final_price_item.base_price_amount !== this.item.final_price_item.base_price_base_amount;
            },
            itemTaxClass() {
                return this.getTaxClassByLabel(this.item.final_price_item.tax_class_id);
            },
            routeUrlProductImg() {
                return route('images.catalog.product', ['40x', this.item.image]);
            },
            attributeName() {
                if (this.productData.facets.string_facets[0]) {
                    return this.productData.facets.string_facets[0]['label'];
                }

                return null;
            }
        },

        methods: {
            ...mapMutations({
                resetSelectedVariants: 'modApiProduct/resetSelectedVariants'
            }),
            ...mapActions({
                flashMessage: 'modFlash/flashMessage',
                addItem: 'modCart/addItem',
                toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction'
            }),
            getPriceAndCurrency(key, addVat) {
                return this.getPriceAndCurrencyDecFmt(this.item.final_price_item[key], addVat, this.itemTaxClass);
            },
            getTierPriceAndCurrency(price, addVat) {
                return this.getPriceAndCurrencyDecFmt(price, addVat, this.itemTaxClass);
            },
            getTierPriceMinAndCurrency(addVat) {
                return this.getPriceAndCurrencyDecFmt(this.itemTierPriceMin.price, addVat, this.itemTaxClass);
            },
            getCheapPriceAndCurrency(addVat) {
                return this.getPriceAndCurrencyDecFmt(this.item.final_price_item.min_price, addVat, this.itemTaxClass);
            },
            getBasePriceAmountText(addVat) {
                let _html = [
                    this.$t('eq'),
                    ' ',
                    '<span class="price">',
                    this.getBasePriceAmountPrice(addVat),
                    '</span>',
                    ' ',
                    this.$t('je'),
                    ' ',
                    this.item.final_price_item.base_price_base_amount,
                    ' ',
                    this.$t('magento_base_price_amounts.' + this.item.final_price_item.base_price_unit)
                ];

                return _.join(_html, '');
            },
            getBasePriceAmountPrice(addVat) {
                let _item = this.item.final_price_item;

                let _nBPA = this.normalizeBasePriceAmount(_item);

                let _price = _item.price / _nBPA * _item.base_price_base_amount;

                return this.getPriceAndCurrencyDecFmt(_price, addVat, this.itemTaxClass);
            },
            normalizeBasePriceAmount(priceItem) {
                // handle just a few and only parent -> child units
                if(priceItem.base_price_unit == 'KG' && priceItem.base_price_base_unit == 'G') {
                    return priceItem.base_price_amount * 1000;
                }
                if(priceItem.base_price_unit == 'G' && priceItem.base_price_base_unit == 'MG') {
                    return priceItem.base_price_amount * 1000;
                }
                if(priceItem.base_price_unit == 'L' && priceItem.base_price_base_unit == 'ML') {
                    return priceItem.base_price_amount * 1000;
                }
                if(priceItem.base_price_unit == 'M' && priceItem.base_price_base_unit == 'CM') {
                    return priceItem.base_price_amount * 1000;
                }
                if(priceItem.base_price_unit == 'CM' && priceItem.base_price_base_unit == 'MM') {
                    return priceItem.base_price_amount * 1000;
                }

                return priceItem.base_price_amount;
            },
            toggleTierPrices() {
                this.showTierPrices = ! this.showTierPrices;
            },
            shouldShowTierPrice(index) {
                return index === 0 || this.showTierPrices;
            },
            addToCart() {
                // Add selected variant to item
                this.item.variants = this.selectedVariants;

                // Add item and qty to cart store
                this.addItem({
                    item: this.item,
                    qty: this.selectedQty
                }).then(() => {

                    if(process.env.API_TYPE === 'api') {
                        this.resetSelectedVariants();
                    }

                    // Open Minicart Context
                    this.toggleOffcanvasAction({
                        component: 'TheMiniCart',
                        direction: 'rightLeft'
                    }).then(() => {
                        // Display Success Message
                        this.flashMessage({
                            flashType: 'success',
                            flashMessage: this.$t('Successfully added item to cart.')
                        });
                    });
                    this.gtmAddToCart();
                }).catch((error) => {
                    // Display Error Message (eg. Qty of item is at maxQty)
                    this.flashMessage({
                        flashType: 'error',
                        flashMessage: this.$t(error)
                    });
                });
            },
            gtmAddToCart: function() {
                if(this.$gtm) {

                    clearDataLayer().then(() => {
                        let price = this.getPriceAndCurrency('display_price_brutto', this.priceSwitcherIncludeVat);

                        if(this.itemIsSpecial) {
                            price = this.getPriceAndCurrency('display_price_brutto_special', this.priceSwitcherIncludeVat);
                        }

                        this.$gtm.pushEvent({
                            'event': 'addToCart',
                            'ecommerce': {
                                'currencyCode': 'EUR',
                                'add': {
                                    'products': [{
                                        'name': this.item.name,
                                        'id': this.item.id,
                                        'price': price,
                                        'brand': this.item.manufacturer_name,
                                        'variant': this.item.variants,
                                        'quantity': this.selectedQty
                                    }]
                                },
                                'impressions': undefined,
                                'detail': undefined,
                                'remove': undefined,
                                'click': undefined,
                                'purchase': undefined
                            }
                        });

                    })

                }
            }
        }
    }
</script>
