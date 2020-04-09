<template>
    <div>
        <transition-group name="list">
            <div v-for="item in items" v-if="qty > 0" :key="item.id" class="cart-items-list row item align-items-center">
                <nuxt-link :to="'/'+item.url_pds" class="col-9">
                    <div class="row align-items-center">
                        <div class="col-4">
                            <img :src="itemImgPath(item)" class="product-img" alt="Product Image" :title="item.name_orig" :class="classesImg" />
                        </div>

                        <div class="col-8">
                            <div class="container">
                                <div class="row">
                                    <span class="product-name">{{ item.name_orig }}</span>
                                </div>

                                <div class="row">
                                    <ul class="selected-variants-wrp">
                                        <li v-for="(variant, key) in item.variants" :key="key" class="selected-variants">
                                            {{ variant.label }}: {{ formatSize(variant.value_label) }}
                                        </li>
                                    </ul>
                                </div>

                                <div class="row">
                                    <template v-if="itemIsSpecial(item)">
                                        <span class="product-price old-price" v-html="getPriceAndCurrency(item, 'display_price_brutto', priceSwitcherIncludeVat)" />

                                        <span class="product-price sale-price" v-html="getPriceAndCurrency(item, 'display_price_brutto_special', priceSwitcherIncludeVat)" />
                                    </template>

                                    <template v-else>
                                        <span class="product-price sale-price" v-html="getPriceAndCurrency(item, 'display_price_brutto', priceSwitcherIncludeVat)"></span>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </nuxt-link>

                <div class="col-3 actions-wrp text-right">
                    <qty-selector :qty="item.qty" :max-qty="getStockQtyOfVariant(item)" @changeQty="onChangeQty(item.id, $event)" />

                    <div v-if="!showLoader" aria-hidden="true" class="remove-item" @click="confirmRemoveItem(item)" v-text="$t('Remove')" />

                    <div v-if="showLoader" class="lds-ring">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
            </div>
        </transition-group>

        <div v-if="!isEmpty(cart.coupons)">
            <template v-for="(coupon, key) in cart.coupons">
                <div :key="key" class="cart-items-list row item coupon align-items-center">
                    <div>
                        <span class="coupon text-small" v-text="$t('Voucher / Coupon')+':'" />

                        <span class="coupon-name text-small" v-text="coupon.code" />
                    </div>

                    <div class="coupon-val" v-text="getCouponVal(coupon.payload.value)" />
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
    import QtySelector from "../utils/QtySelector";
    import {clearDataLayer} from "@hubblecommerce/hubble/core/utils/gtmHelper";

    export default {
        name: "CartItemsList",

        components: {
            QtySelector
        },

        data() {
            return {
                showLoader: false,
                selectedQty: 0,
                dataImageFilter: null,
                origImageFilter: '60x'
            }
        },

        computed: {
            ...mapState({
                cart: state => state.modCart.cart,
                items: state => state.modCart.cart.items,
                qty: state => state.modCart.cart.items_qty,
                priceSwitcherIncludeVat: state => state.modPrices.priceSwitcherIncludeVat
            }),
            ...mapGetters({
                productIsSpecial: 'modPrices/productIsSpecial',
                getPriceAndCurrencyDecFmt: 'modPrices/getPriceAndCurrencyDecFmt',
                getTaxClassByLabel: 'modPrices/getTaxClassByLabel',
                priceDecFmt: 'modPrices/priceDecFmt',
                priceAddCur: 'modPrices/priceAddCur'
            }),
            classesImg() {
                return 'img-minicart';
            },
            imgFilter() {
                return this.dataImageFilter ? this.dataImageFilter : this.origImageFilter;
            }
        },

        methods: {
            ...mapActions({
                updateItem: 'modCart/updateItem',
                precalculateShippingCostAction: 'modCart/precalculateShippingCost',
                resetMessage: 'modFlash/resetMessage',
                delItem: 'modCart/delItem',
                removeCouponAction: 'modCart/removeCoupon',
                flashMessage: 'modFlash/flashMessage'
            }),
            ...mapMutations({
                setCartItemsObjQty: 'modCart/setCartItemsObjQty'
            }),
            itemImgPath: function(item) {

                if(process.env.API_TYPE === 'sw') {
                    return item.image;
                }

                // If customer domain isset get live images
                if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                    let image = item.image;

                    return _.join(
                        [
                            process.env.CUSTOMER_DOMAIN,
                            'images/catalog/thumbnails/cache/400',
                            image
                        ],
                        '/'
                    );
                }

                let _path = _.trim(process.env.config.IMG_BASE_URL, '/');

                return _path + '/images/catalog/product/' + this.imgFilter + '/' + item.image;
            },
            itemIsSpecial: function(item) {
                return this.productIsSpecial(item);
            },
            getPriceAndCurrency: function(item, key, addVat) {
                let _price = item.final_price_item[key];

                // Return formatted price incl. tax
                return this.getPriceAndCurrencyDecFmt(_price, addVat, this.itemTaxClass(item));
            },
            itemTaxClass: function(item) {
                return this.getTaxClassByLabel(item.final_price_item.tax_class_id);
            },
            onChangeQty: function(id, e) {

                let storeItem = _.find(this.items, (o) => { return o.id === id; });

                let oldQty = storeItem.qty;
                let newQty = e;
                let delta = newQty - oldQty;

                this.setCartItemsObjQty({
                    itemId: id,
                    itemQty: newQty
                });

                this.updateItem({
                    qty: delta
                }).then(() => {
                    this.precalculateShippingCost({
                        cart: this.cart,
                        country: 'DE'
                    });
                });
            },
            precalculateShippingCost: function(payload) {
                let order = {
                    order: JSON.stringify(payload)
                };

                this.precalculateShippingCostAction(order);
            },
            confirmRemoveItem: function(item) {
                this.resetMessage();
                this.delItem({
                    data: item
                }).then(() => {
                    this.precalculateShippingCost({
                        cart: this.cart,
                        country: 'DE'
                    });

                    this.gtmRemoveFromCart(item);
                });
            },
            gtmRemoveFromCart: function(item) {
                if(this.$gtm) {
                    clearDataLayer().then(() => {
                        let price = this.getPriceAndCurrency(item, 'display_price_brutto', this.priceSwitcherIncludeVat);

                        if(this.itemIsSpecial(item)) {
                            price = this.getPriceAndCurrency(item, 'display_price_brutto_special', this.priceSwitcherIncludeVat);
                        }

                        this.$gtm.pushEvent({
                            'event': 'removeFromCart',
                            'ecommerce': {
                                'remove': {
                                    'products': [{
                                        'name': item.name,
                                        'id': item.id,
                                        'price': price,
                                        'brand': item.manufacturer_name,
                                        'variant': item.variants,
                                        'quantity': item.qty
                                    }]
                                },
                                'impressions': undefined,
                                'detail': undefined,
                                'add': undefined,
                                'click': undefined,
                                'purchase': undefined
                            }
                        });
                    });
                }
            },
            getCouponVal: function(value) {
                let val;

                val = this.priceDecFmt(value);

                val = this.priceAddCur(value);
                
                return val;
            },
            formatSize: function (size) {
                return size.replace('.0', '');
            },
            removeCoupon: function(couponCode) {
                this.removeCouponAction(couponCode).then(() => {
                    this.flashMessage({
                        flashType: 'success',
                        flashMessage: 'Removed coupon from cart.'
                    });
                });
            },
            // Return highest stock qty of all variants of given item
            getStockQtyOfVariant: function(item) {

                // If product has no variants return 10
                if(_.isEmpty(item.variants) || process.env.API_TYPE === 'sw') {
                    return 10;
                }

                // Check stock qty of selected variant and build qty select depending on stock qty
                // stop after qty of 10 to prevent building to many option nodes
                let highestQty = 0;
                _.forEach(item.variants, variant => {
                    if(variant.stock_qty > 10) {
                        highestQty = 10;
                        return 10;
                    }

                    if (variant.stock_qty > highestQty) {
                        highestQty = variant.stock_qty;
                    }
                });

                return highestQty;
            },
            isEmpty: function(obj) {
                return _.isEmpty(obj);
            }
        }
    }
</script>
