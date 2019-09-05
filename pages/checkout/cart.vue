<style>
    .img-minicart {
        max-width: 60px !important;
        max-height: 60px !important;
    }
</style>

<template>
    <div class="container checkout-wrp">
        <div class="row">
            <div class="col-md-12 progress-bar-wrp">
                <div class="step active"><div class="no">1</div>{{$t('Login')}}</div>
                <div class="step"><div class="no">2</div>{{$t('Address')}}</div>
                <div class="step"><div class="no">3</div>{{$t('Payment')}}</div>
                <div class="step"><div class="no">4</div>{{$t('Summary')}}</div>
                <div class="step"><div class="no">5</div>{{$t('Complete')}}</div>
            </div>
        </div>

        <div class="row mb-4">
            <div v-if="!isLoggedIn" class="col-sm-12 col-md-6 info-wrp">
                <div class="col-wrp md-elevation-4">
                    <tabs class="customer-tabs">
                        <tab :name="$t('Login')">
                            <div class="tab-content p-2">
                                <login-form/>
                            </div>
                        </tab>
                        <tab :name="$t('Register')">
                            <div class="tab-content p-2">
                                <register-form/>
                            </div>
                        </tab>
                    </tabs>
                </div>
            </div>
            <div class="col-sm-12 col-md-6 mb-4 summary-wrp">
                <div class="col-wrp md-elevation-4">
                    <div class="cart-wrp">
                        <no-ssr>
                            <div class="counter"><strong>{{$t('Cart')}}</strong> {{ qty }} <span v-text="cartItemsLabel()"></span></div>
                            <transition-group name="list">
                                <no-ssr>
                                    <v-touch @swiperight="confirmRemoveItem(item)" v-for="item in items" :key="item.id" class="row item pt-3 pb-3 align-items-center bg-white">
                                        <div class="col-2 text-center">
                                            <i v-if="!showLoader" @click='confirmRemoveItem(item)' class="remove-item icon rct-minus-circle" aria-hidden="true"></i>
                                            <div v-if="showLoader" class="lds-ring">
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </div>
                                        <div class="col-2">
                                            <img :src="itemImgPath(item)" class="product-img" alt="Product Image" :class="classesImg" />
                                        </div>
                                        <div class="col-8">
                                            <div class="container">
                                                <div class="row mb-2">
                                                    <span class="product-name">{{item.name}}</span>
                                                </div>
                                                <div class="row">
                                                    <span class="product-qty" v-text="item.qty"></span> <span class="separator"> x </span>
                                                    <template v-if="itemIsSpecial(item)">
                                                        <span class="product-price old-price" v-html="getPriceAndCurrency(item, 'price', priceSwitcherIncludeVat)"></span>
                                                        <span class="product-price sale-price" v-html="getPriceAndCurrency(item, 'special_price', priceSwitcherIncludeVat)"></span>
                                                    </template>
                                                    <template v-else>
                                                        <span class="product-price sale-price" v-html="getPriceAndCurrency(item, 'price', priceSwitcherIncludeVat)"></span>
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </v-touch>
                                </no-ssr>
                            </transition-group>
                            <div v-if="cartItemsQty > 0" class="row totals pt-4 pb-4 bg-light">
                                <div class="col-6">{{$t('Subtotal')}}</div>
                                <div class="col-6">
                                    <span class="float-right" v-html="getSubTotal()"></span>
                                </div>
                            </div>
                            <button class="rct-button-primary checkout-btn" @click.prevent="simulatePayment">{{$t('Place Order')}}</button>
                        </no-ssr>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Tab from "../../components/Tab";
    import Tabs from "../../components/Tabs";

    export default {
        name: 'CheckoutCart',
        components: {Tabs, Tab},
        middleware: [
            // 'authRequired',
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'trackClickPath'
        ],

        layout: 'hubble',

        data() {
            return {
                curComponent: 'view-auth',

                showLoader: false,

                subTotals: {},
                dataImageFilter: null,
                origImageFilter: '60x'
            }
        },

        computed: {
            ...mapState({
                items: state => state.modCart.cartItemsObj,
                qty: state => state.modCart.cartItemsCount,
                isLoggedIn: state => state.modUser.isLoggedIn,
                priceSwitcherIncludeVat: state => state.modPrices.priceSwitcherIncludeVat
            }),
            hasItemsInCart() {
                return this.qty > 0;
            },
            imgFilter() {
                return this.dataImageFilter ? this.dataImageFilter : this.origImageFilter;
            },
            cartItemsQty() {
                return this.qty;
            },
            changePosition() {
                return this.$mq === 'sm'
                    ? 'fixed'
                    : 'left'
            },
            classesImg() {
                return 'img-minicart';
            }
        },

        methods: {
            itemIsSpecial: function(item) {
                return this.$store.getters['modPrices/productIsSpecial'](item);
            },
            getPriceAndCurrency: function(item, key, addVat) {
                // Get price incl. tax but unformatted to calc and save subtotals
                // Do it here, to prevent checking again if is sales price or not
                // let priceInclTax = this.$store.getters['modPrices/priceAddVat'](item.final_price_item[key], this.itemTaxClass(item).value);
                // this.subTotals[item.id] = _.round(priceInclTax, 2).toFixed(2) * item.qty;

                let _price = item.final_price_item[key];

                this.subTotals[item.id] = _.round(_price, 2).toFixed(2) * item.qty;

                // Return formatted price incl. tax
                return this.$store.getters['modPrices/getPriceAndCurrencyDecFmt'](_price, addVat, this.itemTaxClass(item));
            },
            itemTaxClass: function(item) {
                return this.$store.getters['modPrices/getTaxClassByLabel'](item.final_price_item.tax_class_id);
            },
            getSubTotal() {
                // Sum up all subtotals
                let subTotal = 0;
                for (let key in this.subTotals) {
                    subTotal += this.subTotals[key];
                }

                // Format subtotals
                subTotal = this.$store.getters['modPrices/priceDecFmt'](subTotal);
                subTotal = this.$store.getters['modPrices/priceAddCur'](subTotal);

                return subTotal;
            },
            itemImgPath: function(item) {
                // If customer domain isset get live images
                if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                    let image = item.image;
                    let _letters = _.split(image, '', 2);

                    let _reference = _.join(
                        [
                            process.env.CUSTOMER_DOMAIN,
                            'media/catalog/product',
                            _letters[0],
                            _letters[1],
                            image
                        ],
                        '/'
                    );

                    return _reference;
                }

                let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                return _path + '/images/catalog/product/' + this.imgFilter + '/' + item.image;
            },
            confirmRemoveItem: function(item) {
                this.$store.dispatch('modCart/delItem', {
                    data: item
                })
            },
            simulatePayment() {
                console.log("simulation payment ...");

                // save order to customer as cookie
                this.$store.dispatch('modUser/saveOrder', {
                    items: this.items,
                    subTotal: this.getSubTotal()
                });

                this.$router.push({
                    path: this.localePath('checkout-cart_payment')
                })
            },
            cartItemsLabel() {
                return this.qty > 0 ? this.$t('shopping_cart_label_items') : this.$t('shopping_cart_label_item');
            },
        }
    }
</script>
