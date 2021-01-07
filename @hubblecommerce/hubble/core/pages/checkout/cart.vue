<template>
    <div class="container">
        <client-only>
            <div v-if="getItemsInCart() > 0" class="cart-wrp">
                <div class="items-wrp">
                    <client-only>
                        <div class="headline">
                            <div class="headline-2" v-text="$t('Your Cart')" />
                            <span class="text" v-text="`(${cartItemsLabel(qty)})`" />
                        </div>
                        <cart-items-list />
                    </client-only>
                </div>

                <div class="summary-wrp">
                    <div v-if="!isApiType('sw')" class="voucher">
                        <div class="voucher-content">
                            <coupons />
                        </div>
                    </div>

                    <totals />
                </div>

                <div class="actions-wrp">
                    <nuxt-link v-if="$mq === 'md' || $mq === 'lg'" :to="localePath('index')">
                        <button class="button-secondary shopping-button">
                            <i class="icon icon-arrow-left" />
                            {{ $t('Keep shopping') }}
                            <material-ripple />
                        </button>
                    </nuxt-link>

                    <nuxt-link :to="checkoutPath()">
                        <button class="button-primary checkout-btn">
                            {{ $t('Go to checkout') }}
                            <i class="icon icon-arrow-right" />
                            <material-ripple />
                        </button>
                    </nuxt-link>
                </div>
            </div>

            <div v-else class="cart-wrp empty-cart">
                <i class="icon icon-shopping-bag" />
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
            :breadcrumbs="[{ '0': 'home' }, { '1': 'cart' }]"
        />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CartItemsList from '../../components/checkout/CartItemsList';
import Totals from '../../components/checkout/Totals';
import GTMDataLayer from '../../components/utils/GTMDataLayer';
import _ from 'lodash';

export default {
    name: 'CheckoutCart',

    components: {
        GTMDataLayer,
        Totals,
        Coupons: () => import('../../components/checkout/Coupons'),
        Collapsible: () => import('../../components/utils/Collapsible'),
        CartItemsList,
    },

    layout: 'hubble',

    middleware: ['apiAuthenticate', 'apiLocalization', 'apiResourceMenu', 'trackClickPath'],

    data() {
        return {
            subTotals: {},
            cartItemsQty: null,
        };
    },

    computed: {
        ...mapState({
            cart: (state) => state.modCart.cart,
            items: (state) => state.modCart.cart.items,
            qty: (state) => state.modCart.cart.items_qty,
            customer: (state) => state.modApiCustomer.customer,
        }),
        isLoggedIn: function () {
            if (!_.isEmpty(this.customer.customerAuth)) {
                return this.customer.customerAuth.token;
            }

            return false;
        },
        isGuest: function() {
            if (!_.isEmpty(this.customer.customerData)) {
                return this.customer.customerData.guest;
            }

            return false;
        }
    },

    mounted() {
        this.precalculateShippingCost({
            cart: this.cart,
            country: 'DE',
        });
    },

    methods: {
        ...mapActions({
            precalculateShippingCostAction: 'modCart/precalculateShippingCost',
        }),
        cartItemsLabel(qty) {
            return this.qty > 1
                ? qty + ' ' + this.$t('shopping_cart_label_items')
                : qty + ' ' + this.$t('shopping_cart_label_item');
        },
        getItemsInCart() {
            this.cartItemsQty = this.qty;
            return this.cartItemsQty;
        },
        precalculateShippingCost: function (payload) {
            let order = {
                order: JSON.stringify(payload),
            };
            this.precalculateShippingCostAction(order);
        },
        checkoutPath: function () {
            if (this.isLoggedIn || this.isGuest) {
                return this.localePath('checkout-overview');
            }

            return this.localePath('checkout-register');
        },
        isApiType: function (apiType) {
            return process.env.API_TYPE === apiType;
        },
    },

    head() {
        return {
            meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }],
        };
    },
};
</script>
