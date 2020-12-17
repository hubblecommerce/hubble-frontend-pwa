<template>
    <div class="container checkout-register-wrp">
        <client-only>
            <button @click="toggleCart()" class="button cart-toggle-wrp">
                <span v-text="!showCart ? $t('Show Cart') : $t('Hide Cart')" />
                <i class="icon" :class="!showCart ? 'icon-chevron-down' : 'icon-chevron-up'"/>
            </button>

            <transition name="fade">
                <div v-if="showCart || ($mq === 'lg')" class="cart-wrp">
                    <div class="items-wrp">
                        <client-only>
                            <div class="headline">
                                <div class="headline-2" v-text="$t('Your Cart')" />
                                <span class="text" v-text="`(${cartItemsLabel(qty)})`" />
                            </div>
                            <cart-items-list-non-interactive :cart="cart" />
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
                </div>
            </transition>
        </client-only>

        <div class="register-options-wrp">
            <!-- Placeholder for express checkouts as paypal express, amazon pay etc. -->
            <div class="express-checkout-wrp" />

            <div class="customer-register-wrp">
                <div class="headline headline-2" v-text="$t('Contact Information')" />
                <div class="text">
                    {{$t('I am not having an account yet')}}
                    <nuxt-link :to="localePath('checkout-login')" v-text="$t('Login')" />
                </div>
                <register-form />
            </div>
        </div>
    </div>
</template>

<script>
import CartItemsListNonInteractive from "../../components/checkout/CartItemsListNonInteractive";
import Coupons from "../../components/checkout/Coupons";
import Totals from "../../components/checkout/Totals";
import cartValidate from '~/anonymous-middleware/cartValidate';
import RegisterForm from "../../components/customer/RegisterForm";
import {mapState} from "vuex";

export default {
    name: "CheckoutRegister",

    components: {RegisterForm, Totals, Coupons, CartItemsListNonInteractive},

    middleware: [cartValidate, 'apiLocalization', 'trackClickPath'],

    layout: 'hubble_light',

    data() {
        return {
            showCart: false
        }
    },

    computed: {
        ...mapState({
            cart: state => state.modCart.cart,
            qty: state => state.modCart.cart.items_qty,
        }),
    },

    methods: {
        cartItemsLabel(qty) {
            return this.qty > 1 ? qty + ' ' + this.$t('shopping_cart_label_items') : qty + ' ' + this.$t('shopping_cart_label_item');
        },
        isApiType: function (apiType) {
            return process.env.API_TYPE === apiType;
        },
        toggleCart: function() {
            return this.showCart = !this.showCart;
        }
    }
}
</script>
