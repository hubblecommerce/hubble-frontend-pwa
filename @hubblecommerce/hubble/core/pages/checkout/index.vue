<template>
    <div class="container checkout-overview-wrp">
        <client-only>
            <hbl-button class="cart-toggle-wrp" @click.native="toggleCart()">
                <span v-text="!showCart ? 'Show Cart' : 'Hide Cart'" />
                <i class="icon" :class="!showCart ? 'icon-chevron-down' : 'icon-chevron-up'" />
            </hbl-button>

            <transition name="fade">
                <div v-if="showCart || $mq === 'lg'" class="cart-wrp">
                    <div class="items-wrp">
                        <client-only>
                            <div class="headline">
                                <div class="headline-5" v-text="'Your Cart'" />
                            </div>
                            <cart-context :recalculate-cart="cartKey" :interactive="false" />
                        </client-only>
                    </div>
                </div>
            </transition>
        </client-only>

        <div class="register-options-wrp">
            <div class="checkout-configs-wrp">
                <customer-addresses />

                <shipping-methods
                    :processing-checkout="processingCheckout"
                    :session-shipping-method="shippingMethod.id"
                    v-on:shipping-changed="recalculateCart()"
                    v-on:processing="processingCheckout = $event"
                    v-on:shipping-error="shippingError = $event"
                />

                <payment-methods
                    :processing-checkout="processingCheckout"
                    :session-payment-method="paymentMethod.id"
                    v-on:payment-changed="onPaymentChanged($event)"
                    v-on:processing="processingCheckout = $event"
                    v-on:payment-error="paymentError = $event"
                />
            </div>

            <div class="checkout-actions-wrp">
                <handle-place-order
                    :current-payment-method="currentPaymentMethod"
                    :payment-error="paymentError"
                    :shipping-error="shippingError"
                    :processing-checkout="processingCheckout"
                    v-on="placeOrderHandleEvents"
                />
                <plugin-slot
                    name="checkout-index-place-order-handle"
                    :data="{
                        currentPaymentMethod: currentPaymentMethod,
                        paymentError: paymentError,
                        shippingError: shippingError,
                        processingCheckout: processingCheckout
                    }"
                    :events="placeOrderHandleEvents"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ApiClient from '@/utils/api-client';

export default {
    name: 'Checkout',

    layout: 'checkout',

    middleware: ['cartValidate'],

    async asyncData({ app, $config, store, redirect }) {
        // Check for contextToken either as cookie or set in vuex store
        let contextToken = null;

        if (process.server) {
            contextToken = app.$cookies.get(store.state.modSession.cookieName);
        } else {
            contextToken = store.state.modSession.contextToken;
        }

        if (contextToken === null) {
            return redirect('/customer/login');
        }

        // Fetch context for current contextToken to verify customer is logged in and not a guest
        try {
            let response = await new ApiClient($config).apiCall({
                action: 'get',
                endpoint: 'store-api/context',
                contextToken: contextToken,
            });

            if (response.data.customer != null) {
                if (response.data.customer.active) {
                    return response.data;
                }
            }

            return redirect('/customer/login');
        } catch (e) {
            return redirect('/customer/login');
        }
    },

    data() {
        return {
            processingCheckout: false,
            showCart: false,
            shippingError: false,
            paymentError: false,
            currentPaymentMethod: {},
            cartKey: 0, // Raise on every config change to trigger recalculate cart
            placeOrderHandleEvents: {
                'processing': (bool) => { this.processingCheckout = bool; }
            }
        };
    },

    methods: {
        recalculateCart: function () {
            this.cartKey += 1;
        },
        toggleCart: function () {
            return (this.showCart = !this.showCart);
        },
        onPaymentChanged: function (paymentMethod) {
            this.recalculateCart();
            this.currentPaymentMethod = paymentMethod;
        }
    },

    head() {
        return {
            title: 'Checkout',
            meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }],
        };
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.checkout-overview-wrp {
    margin: 0 auto;

    .cart-toggle-wrp {
        width: 100%;

        + .cart-wrp {
            padding-top: 20px;
        }
    }

    .register-options-wrp {
        padding: 20px 0;
    }
}

@media (min-width: 1024px) {
    .checkout-overview-wrp {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .cart-toggle-wrp {
            display: none;
        }

        .cart-wrp {
            order: 20;
            width: calc(50% - 10px);
            padding: 40px 0 0 10px;

            display: flex;
            flex-direction: column;
            max-width: 480px;

            .items-wrp,
            .summary-wrp {
                width: 100%;
                overflow: hidden;
            }
        }

        .register-options-wrp {
            order: 10;
            width: 560px;
            padding: 20px 10px 0 0;

            .customer-register-wrp {
                max-width: 560px;
                margin: 0;

                .register-form {
                    max-width: none;
                    margin: 20px 0;
                }
            }
        }
    }
}
</style>
