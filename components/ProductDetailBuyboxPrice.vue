<template>
    <div class="product-row product-row-default">

        <!-- Price-Cart-Delivery Order -->
        <div class="delivery-info" v-if="$mq === 'sm'">
            <p class="availability bottom in-stock">
                <span>{{ $t('delivery_time') }}</span>
            </p>
            <p><span class="bold-text">{{ $t('no shipping costs') }}:</span> {{ $t('free delivery from € 24.95 in Germany') }} </p>
            <p>{{ $t('easy and') }} <span class="bold-text">{{ $t('free returns') }}</span> {{ $t('within Germany') }} </p>
        </div>

        <div v-if="$mq === 'md' || $mq === 'lg'">
            <div class="price-box price-wrp">
                <template v-if="itemIsSpecial">
                    <span class="old-price" v-html="getPriceAndCurrency('price', priceSwitcherIncludeVat)"></span>
                    <span class="sale-price" v-html="getPriceAndCurrency('special_price', priceSwitcherIncludeVat)"></span>
                    <div class="info"><span>{{ $t('incl_tax') }}</span> </div>
                </template>
                <template v-else>
                    <span class="sale-price" v-html="getPriceAndCurrency('price', priceSwitcherIncludeVat)"></span>
                    <div class="info"><span>{{ $t('incl_tax') }}</span> </div>
                </template>
            </div>
            <div class="delivery-info">
                <p class="availability bottom in-stock">
                    <span>{{ $t('delivery_time') }}</span>
                </p>
                <p><span class="bold-text">{{ $t('no shipping costs') }}:</span> {{ $t('free delivery from € 24.95 in Germany') }} </p>
                <p>{{ $t('easy and') }} <span class="bold-text">{{ $t('free returns') }}</span> {{ $t('within Germany') }} </p>
            </div>
        </div>

        <div>
            <product-detail-buybox-options v-if="itemIsConfigurable" />
        </div>

        <!-- Price-Cart-Delivery Order -->
        <div class="price-cart-wrp" v-if="$mq === 'sm'">
            <div class="price-box price-wrp">
                <template v-if="itemIsSpecial">
                    <span class="old-price" v-html="getPriceAndCurrency('price', priceSwitcherIncludeVat)"></span>
                    <span class="sale-price" v-html="getPriceAndCurrency('special_price', priceSwitcherIncludeVat)"></span>
                    <div class="info"><span>{{ $t('incl_tax') }}</span> </div>
                </template>
                <template v-else>
                    <span class="sale-price" v-html="getPriceAndCurrency('price', priceSwitcherIncludeVat)"></span>
                    <div class="info"><span>{{ $t('incl_tax') }}</span> </div>
                </template>
            </div>
            <div class="d-flex cart-button-wrp">
                <button :disabled="loaderState" type="button" @click.prevent="addToCart" :title="$t('add_to_cart')" class="add-to-cart m-0 w-100">
                    <i class="icon icon-cart" aria-hidden="true"></i>
                    <span v-if="!loaderState" class="cart-button-label headline-4">{{ $t('add_to_cart') }}</span>
                    <div v-if="loaderState" class="lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <material-ripple></material-ripple>
                </button>
            </div>
        </div>

        <div class="d-flex cart-button-wrp" v-if="$mq === 'md' || $mq === 'lg'">
            <button :disabled="loaderState" type="button" @click.prevent="addToCart" :title="$t('add_to_cart')" class="add-to-cart m-0 w-100">
                <i class="icon icon-cart" aria-hidden="true"></i>
                <span v-if="!loaderState" class="cart-button-label headline-4">{{ $t('add_to_cart') }}</span>
                <div v-if="loaderState" class="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <material-ripple></material-ripple>
            </button>
        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import QtySelector from './QtySelector';

    export default {
        components: {
            QtySelector
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

        props: {
            item: {
                type: Object,
                required: true
            }
        },

        computed: {
            // Vuex
            ...mapState({
                priceSwitcherIncludeVat: state => state.modPrices.priceSwitcherIncludeVat
            }),
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
                return this.$store.getters['modPrices/productIsSpecial'](this.item);
            },
            itemIsSimple() {
                return this.item.type === 'simple';
            },
            itemIsGrouped() {
                return this.item.type === 'grouped';
            },
            itemIsConfigurable() {
                return this.item.type === 'configurable';
            },
            itemNameText() {
                if(this.item.short_name && this.item.short_name.length) {
                    return this.item.short_name;
                }

                return this.item.name;
            },
            itemTierPrices() {
                var groupID = 0;

                return this.$store.getters['modPrices/productGetTierPricesByGroupId'](this.item, groupID);
            },
            itemTierPriceMin() {
                return _.minBy(this.itemTierPrices, 'price');
            },
            itemHasTierPrices() {
                var groupID = 0;

                return this.$store.getters['modPrices/productHasTierPricesByGroupId'](this.item, groupID);
            },
            itemHasTierPricesMore() {
                return this.itemTierPrices.length > 1;
            },
            itemTierPriceDiscount() {
                if(! this.itemHasTierPrices) {
                    return null;
                }

                var _item_min_price = this.item.final_price_item.min_price;
                var _tier_min_price = this.itemTierPriceMin.price;

                var _diff = 100 - (_tier_min_price / _item_min_price * 100);

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
                return this.$store.getters['modPrices/getTaxClassByLabel'](this.item.final_price_item.tax_class_id);
            },
            routeUrlProductImg() {
                return route('images.catalog.product', ['40x', this.item.image]);
            }
        },

        methods: {
            getPriceAndCurrency(key, addVat) {
                return this.$store.getters['modPrices/getPriceAndCurrencyDecFmt'](this.item.final_price_item[key], addVat, this.itemTaxClass);
            },
            getTierPriceAndCurrency(price, addVat) {
                return this.$store.getters['modPrices/getPriceAndCurrencyDecFmt'](price, addVat, this.itemTaxClass);
            },
            getTierPriceMinAndCurrency(addVat) {
                return this.$store.getters['modPrices/getPriceAndCurrencyDecFmt'](this.itemTierPriceMin.price, addVat, this.itemTaxClass);
            },
            getCheapPriceAndCurrency(addVat) {
                return this.$store.getters['modPrices/getPriceAndCurrencyDecFmt'](this.item.final_price_item.min_price, addVat, this.itemTaxClass);
            },
            getBasePriceAmountText(addVat) {
                var _html = [
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
                var _item = this.item.final_price_item;

                var _nBPA = this.normalizeBasePriceAmount(_item);

                var _price = _item.price / _nBPA * _item.base_price_base_amount;

                return this.$store.getters['modPrices/getPriceAndCurrencyDecFmt'](_price, addVat, this.itemTaxClass);
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
                // Add item and qty to cart store
                this.$store.dispatch('modCart/addItem', {
                    item: this.item,
                    qty: this.selectedQty
                }).then(() => {
                    // Open Minicart Context
                    this.$store.dispatch('modNavigation/toggleOffcanvasAction', {
                        component: 'TheMiniCart',
                        direction: 'rightLeft'
                    }).then(() => {
                        // Display Success Message
                        this.$store.dispatch('modFlash/flashMessage', {
                            flashType: 'success',
                            flashMessage: this.$t('Successfully added item to cart.')
                        });
                    });
                })
            },
            showLoader() {
                this.loaderState = true;
            },
            hideLoader(timeout) {
                var self = this;
                this.addToCartSuccess = true;
                this.addToCartError = '';

                setTimeout(function() {
                    self.addToCartSuccess = false;
                    self.loaderState = false;
                }, timeout);
            },
            setAddedItem(id) {
                this.addedItemId = id;
            }
        }
    }
</script>
