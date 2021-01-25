<template>
    <div class="container checkout-error">
        <div class="checkout-error-wrp">
            <div class="error-msg-wrp">
                <i class="icon icon-x" />
                <div class="message headline-3" v-text="$t('Something is wrong with your payment')" />
            </div>

            <div class="error-info">
                {{$t('We did receive your order, but something is wrong with your payment process.')}}
                {{$t('Please try a different payment method, or contact our customer service via email or hotline.')}}
            </div>

            <payment-methods-sw />

            <button @click="submit()" class="button button-primary">
                <span v-if="!processingCheckout">{{ $t('Pay') }}</span>
                <div v-if="processingCheckout" class="loader lds-ellipsis">
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
                <material-ripple />
            </button>

            <template v-for="error in errors">
                <div class="error-message" v-text="error" />
            </template>
        </div>
    </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex';
import _ from "lodash";
import { addBackendErrors } from '../../utils/formMixins';

export default {
    name: 'CheckoutError',

    components: {
        PaymentMethodsSw: () => import('../../components/checkout/PaymentMethodsSw'),
    },

    layout: 'hubble_light',

    middleware: ['apiLocalization', 'trackClickPath'],

    mixins: [addBackendErrors],

    data() {
        return {
            orderId: null,
            errors: []
        };
    },

    created() {
        this.orderId = this.$router.currentRoute.query.orderId;

        // Reset chosen payment method
        // because method chosen on checkout page obviously didn't work
        this.$store.commit('modApiPayment/setChosenPaymentMethod', {});
    },

    computed: {
        ...mapState({
            swtc: (state) => state.modCart.swtc,
            processingCheckout: (state) => state.modApiPayment.processingCheckout,
            chosenPaymentMethod: (state) => state.modApiPayment.order.chosenPaymentMethod,
        }),
    },

    methods: {
        ...mapMutations({
            setProcessingCheckout: 'modApiPayment/setProcessingCheckout',
            resetProcessingCheckout: 'modApiPayment/resetProcessingCheckout'
        }),
        ...mapActions({
            swStartPayment: 'modApiPayment/swStartPayment',
            swResetPayment: 'modApiPayment/swResetPayment'
        }),
        submit: async function() {
            this.setProcessingCheckout();

            // Reset payment transactions of order, set new payment method
            try {
                if(this.orderId != null && this.chosenPaymentMethod.id != null) {
                    await this.swResetPayment({
                        paymentMethodId: this.chosenPaymentMethod.id,
                        orderId: this.orderId
                    });
                } else {
                    this.resetProcessingCheckout();
                    this.errors.push("Please choose a payment method.");
                    return false;
                }
            } catch (e) {
                this.resetProcessingCheckout();
                _.forEach(this.addBackendErrors(e), (error) => {
                    this.errors.push(error);
                });
            }

            // Try init payment again
            try {
                let paymentResponse = await this.swStartPayment(this.orderId);

                if (paymentResponse.data.redirectUrl !== null) {
                    this.resetProcessingCheckout();
                    window.open(paymentResponse.data.redirectUrl, '_self');
                } else {
                    this.$router.push(
                        {
                            path: this.localePath('checkout-shopware-success')
                        },
                        () => {
                            this.resetProcessingCheckout();
                        }
                    );
                }
            } catch (e) {
                this.resetProcessingCheckout();
                _.forEach(this.addBackendErrors(e), (error) => {
                    this.errors.push(error);
                });
            }
        }
    },

    head() {
        return {
            meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }],
        };
    }
};
</script>
