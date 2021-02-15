<template>
    <div class="container checkout-error">
        <div class="checkout-error-wrp">
            <div class="error-msg-wrp">
                <i class="icon icon-x" />
                <div class="message headline-3" v-text="'Something is wrong with your payment'" />
            </div>

            <div class="error-info">
                {{'We did receive your order, but something is wrong with your payment process.'}}
                {{'Please try a different payment method, or contact our customer service via email or hotline.'}}
            </div>

            <payment-methods
                :processing-checkout="processingCheckout"
                :session-payment-method="''"
                v-on:processing="processingCheckout = $event"
                v-on:payment-error="paymentError = $event"
                v-on:payment-changed="chosenPaymentMethod = $event"
            />

            <button @click="submit()" class="button button-primary">
                <span v-if="!processingCheckout">{{ 'Pay' }}</span>
                <loader v-if="processingCheckout" />
            </button>

            <template v-for="error in errors">
                <div class="error-message" v-text="error" />
            </template>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex';
import apiClient from "@/utils/api-client";

export default {
    name: 'CheckoutError',

    data() {
        return {
            processingCheckout: false,
            orderId: null,
            chosenPaymentMethod: null,
            errors: []
        };
    },

    created() {
        this.orderId = this.$router.currentRoute.query.orderId;
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken
        })
    },

    methods: {
        resetPayment: async function(payload) {
            return await new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/v3/order/payment',
                contextToken: this.contextToken,
                data: payload
            });
        },
        handlePayment: async function(orderId) {
            let requestData = {
                orderId: orderId,
                finishUrl: process.env.SW_PAYMENT_FINISH_URL+'?orderId='+orderId,
                errorUrl: process.env.SW_PAYMENT_ERROR_URL+'?orderId='+orderId
            };

            return await new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/v3/handle-payment',
                contextToken: this.contextToken,
                data: requestData
            });
        },
        submit: async function() {
            this.processingCheckout = true;

            // Reset payment transactions of order, set new payment method
            try {
                if(this.orderId != null && !this.paymentError) {
                    await this.resetPayment({
                        paymentMethodId: this.chosenPaymentMethod,
                        orderId: this.orderId
                    });
                } else {
                    this.processingCheckout = false;
                    this.errors.push("Please choose a payment method.");
                    return false;
                }
            } catch (e) {
                this.processingCheckout = false;
                this.errors.push(e.detail);
            }

            // Try init payment again
            try {
                let paymentResponse = await this.handlePayment(this.orderId);

                if (paymentResponse.data.redirectUrl !== null) {
                    this.processingCheckout = false;
                    window.open(paymentResponse.data.redirectUrl, '_self');
                } else {
                    this.$router.push({
                        name: 'checkout-success'
                    },
                    () => {
                        this.processingCheckout = false;
                    });
                }
            } catch (e) {
                this.processingCheckout = false;
                this.errors.push(e.detail);
            }
        }
    },

    head() {
        return {
            meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }]
        };
    }
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.checkout-error {
    .checkout-error-wrp {
        .error-msg-wrp {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            margin: 10px 0 20px;
            padding: 20px;
            border: 1px solid rgba(208, 2, 27, 1);
            background: rgba(159, 1, 12, .1);

            i {
                width: 45px;
                height: 45px;
                line-height: 42px;
                margin-bottom: 20px;
                font-size: 30px;
                color: $error-accent;
                border: 3px solid $error-accent;
                border-radius: 70px;
                text-align: center;
            }

            .message {
                color: $error-accent;
                text-align: center;
                text-transform: uppercase;
            }
        }

        .error-info {
            margin-bottom: 20px;
        }

        button {
            width: 100%;
            margin-bottom: 20px;
        }
    }
}

/* Tablet */
@media (min-width: 768px) {
    .checkout-error {
        .checkout-error-wrp {
            .error-msg-wrp {
                .message {
                    font-size: 22px;
                    line-height: 27px;
                }
            }
            button {
                width: auto;
            }
        }
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .checkout-error {
        max-width: 1080px;
    }
}
</style>
