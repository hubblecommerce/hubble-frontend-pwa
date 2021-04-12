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
                                <div class="headline-2" v-text="'Your Cart'" />
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
                    v-on:payment-changed="recalculateCart()"
                    v-on:processing="processingCheckout = $event"
                    v-on:payment-error="paymentError = $event"
                />
            </div>

            <div class="checkout-actions-wrp">
                <hbl-button
                    class="button-primary checkout-btn"
                    :disabled="processingCheckout"
                    @click.native="placeOrder()"
                >
                    <span v-if="!processingCheckout">{{ 'Place Order' }}</span>
                    <loader v-if="processingCheckout" />
                </hbl-button>
            </div>

            <template v-for="error in errors">
                <div class="error-message" v-text="error" />
            </template>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import apiClient from '@/utils/api-client';

export default {
    name: 'Checkout',

    middleware: ['cartValidate'],

    async asyncData({ app, store, redirect }) {
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
            let response = await new apiClient().apiCall({
                action: 'get',
                endpoint: 'store-api/v3/context',
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
            cartKey: 0, // Raise on every config change to trigger recalculate cart
            errors: [],
        };
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
    },

    methods: {
        ...mapMutations({
            resetCart: 'modCart/resetCart',
        }),
        recalculateCart: function () {
            this.cartKey += 1;
        },
        toggleCart: function () {
            return (this.showCart = !this.showCart);
        },
        historyBack: function () {
            this.$router.go(-1);
        },
        placeOrderCall: async function () {
            return await new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/v3/checkout/order',
                contextToken: this.contextToken,
            });
        },
        handlePayment: async function (payload) {
            let requiredData = {
                orderId: payload.orderId,
                finishUrl: process.env.SW_PAYMENT_FINISH_URL + '?orderId=' + payload.orderId,
                errorUrl: process.env.SW_PAYMENT_ERROR_URL + '?orderId=' + payload.orderId,
            };

            const requestData = Object.assign(requiredData, payload.dataBag);

            return await new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/v3/handle-payment',
                contextToken: this.contextToken,
                data: requestData,
            });
        },
        placeOrder: async function () {
            if (this.paymentError || this.shippingError) {
                return;
            }

            // Start loading animation
            this.processingCheckout = true;

            let order;
            let paymentResponse;

            try {
                // Place order
                order = await this.placeOrderCall();

                // Clear cart
                this.resetCart();
            } catch (err) {
                this.processingCheckout = false;
                this.errors.push(err.detail);
                return false;
            }

            try {
                // Get params of current route, for extra payment info. E.g. used by paypal express etc.
                let dataBag = this.$router.currentRoute.query;

                // Init payment
                paymentResponse = await this.handlePayment({ orderId: order.data.id, dataBag: dataBag });

                if (paymentResponse.data.redirectUrl !== null) {
                    this.processingCheckout = false;
                    window.open(paymentResponse.data.redirectUrl, '_self');
                } else {
                    this.$router.push(
                        {
                            name: 'checkout-success',
                            params: {
                                order: order,
                            },
                        },
                        () => {
                            this.processingCheckout = false;
                        }
                    );
                }
            } catch (err) {
                console.log(err);
                // Redirect to error page
                this.$router.push(
                    {
                        name: 'checkout-error',
                        query: {
                            orderId: order.data.id,
                        },
                    },
                    () => {
                        this.processingCheckout = false;
                    }
                );
            }
        },
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

    .checkout-btn {
        width: 100%;

        &:disabled,
        &[disabled] {
            color: $text-primary;
        }

        .loader-wrp {
            .lds-ring {
                div {
                    border-color: $secondary transparent transparent transparent !important;
                }
            }
        }
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
            padding: 40px 10px 0 0;

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
