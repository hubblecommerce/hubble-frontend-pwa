<template>
    <div class="container">
        <client-only>
            <div v-if="getItemsInCart() > 0" class="cart-wrp">
                <div class="items-wrp">
                    <client-only>
                        <div class="headline">
                            <h1>
                                {{ $t('Your Cart') }}
                            </h1>
                            <span v-text="cartItemsLabel(qty)" />
                        </div>
                        <cart-items-list />
                    </client-only>
                </div>
                <div class="summary-container">
                    <div v-if="$mq === 'lg'" class="headline">
                        <h1>
                            {{ $t('Summary') }}
                        </h1>
                    </div>
                    <div class="summary-wrp">
                        <totals />
                        <div v-if="$mq === 'sm'" class="voucher bg-light">
                            <collapsible :toggle-text="$t('I\'ve got a voucher')">
                                <div class="voucher-content">
                                    <coupons />
                                </div>
                            </collapsible>
                        </div>
                        <div v-if="$mq === 'md' || $mq === 'lg'" class="voucher bg-light">
                            <div class="voucher-content">
                                <coupons />
                            </div>
                        </div>

<!--                        <amazon-pay-button />-->

                        <nuxt-link :to="checkoutPath()">
                            <button class="button-primary checkout-btn">
                                {{ $t('Go to checkout') }}
                                <material-ripple />
                            </button>
                        </nuxt-link>
                        <nuxt-link :to="localePath('index')">
                            <button class="button-secondary shopping-button">
                                {{ $t('Keep shopping') }}
                                <material-ripple />
                            </button>
                        </nuxt-link>
                    </div>
                </div>
            </div>
            <div v-else class="cart-wrp empty-cart">
                <i class="icon icon-cart" />
                <div class="headline-1" v-text="$t('Your shopping cart is empty')" />
                <nuxt-link :to="localePath('index')">
                    <button class="button-primary">
                        {{ $t('Discover our products') }}
                        <material-ripple />
                    </button>
                </nuxt-link>
            </div>
        </client-only>

        <g-t-m-data-layer
            event="cartPageLoaded"
            page-type="cart"
            page-title="Warenkorb | Hubble demo"
            :breadcrumbs="[
                {'0': 'home'},
                {'1': 'cart'},
            ]"
        />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import CartItemsList from "../../components/checkout/CartItemsList";
    import Coupons from "../../components/checkout/Coupons";
    import Totals from "../../components/checkout/Totals";
    import GTMDataLayer from "../../components/utils/GTMDataLayer";

    export default {
        name: 'CheckoutCart',

        components: {GTMDataLayer, Totals, Coupons, CartItemsList},

        middleware: [
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'trackClickPath'
        ],

        layout: 'hubble',

        data() {
            return {
                curComponent: 'view-auth',
                subTotals: {},
                cartItemsQty: null
            }
        },

        computed: {
            ...mapState({
                cart: state => state.modCart.cart,
                items: state => state.modCart.cart.items,
                qty: state => state.modCart.cart.items_qty
            })
        },

        mounted() {
            this.precalculateShippingCost({
                cart: this.cart,
                country: 'DE'
            });
        },

        methods: {
            cartItemsLabel(qty) {
                return this.qty > 1 ? qty +' '+this.$t('shopping_cart_label_items') : qty +' '+this.$t('shopping_cart_label_item');
            },
            getItemsInCart() {
                this.cartItemsQty = this.qty;
                return this.cartItemsQty;
            },
            precalculateShippingCost: function(payload) {
                let order = {
                    order: JSON.stringify(payload)
                };
                this.$store.dispatch('modCart/precalculateShippingCost', order);
            },
            checkoutPath: function() {
                if(process.env.API_TYPE === 'sw') {
                    return this.localePath('checkout-shopware-onepage');
                }

                return this.localePath('checkout-payment');
            }
        },

        head() {
            return {
                meta: [
                    { hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }
                ]
            }
        }
    }
</script>
