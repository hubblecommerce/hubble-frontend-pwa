<template>
    <div class="container checkout-payment">
        <div class="checkout-payment-wrp">
            <div class="headline headline-1" v-text="$t('Payment')" />
            <customer-addresses />
            <payment-methods v-if="addressesLoaded || isGuest" />
            <shipping-methods v-if="addressesLoaded || isGuest" />
            <div class="additional-info-wrp">
                <coupons />
                <order-comment />
            </div>
            <div class="checkout-toolbar">
                <nuxt-link :to="localePath('checkout-login')">
                    <button class="button-secondary">
                        {{ $t('Back') }}
                        <material-ripple />
                    </button>
                </nuxt-link>
                <button class="button-primary" @click="createOrder()">
                    {{ $t('Continue') }}
                    <material-ripple />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex';
    import Coupons from "../../components/checkout/Coupons";
    import OrderComment from "../../components/checkout/OrderComment";
    import CustomerAddresses from "../../components/customer/CustomerAddresses";
    import _ from 'lodash';
    import cartValidate from '@hubblecommerce/hubble/core/anonymous-middleware/cartValidate';
    import apiCustomerAuthenticate from '@hubblecommerce/hubble/core/anonymous-middleware/apiCustomerAuthenticate'
    import apiPaymentAuthenticate from '@hubblecommerce/hubble/core/anonymous-middleware/apiPaymentAuthenticate'

    export default {
        name: "Payment",

        components: {
            OrderComment,
            Coupons,
            PaymentMethods: () => import('../../components/checkout/PaymentMethods'),
            ShippingMethods: () => import('../../components/checkout/ShippingMethods'),
            CustomerAddresses
        },

        middleware: [
            apiPaymentAuthenticate,
            apiCustomerAuthenticate,
            cartValidate,
            'apiLocalization',
            'trackClickPath'
        ],

        layout: 'hubble_light',

        data() {
            return {
                isGuest: false
            }
        },

        computed: {
            ...mapState({
                order: state => state.modApiPayment.order,
                hostedIFrame: state => state.modApiPayment.hostedIFrame,
                customerAddresses: state => state.modApiCustomer.customer.customerAddresses,
                customer: state => state.modApiCustomer.customer
            }),
            addressesLoaded: function () {
                // Dynamically load payment methods when addresses are set, because getAllowedPayments request requires address information
                return !_.isEmpty(this.customerAddresses)
            }
        },

        mounted() {
            if(this.customer.customerAuth.token === 'guest') {
                this.isGuest = true;
            }
        },

        methods: {
            ...mapMutations({
                setIbanError: 'modApiPayment/setIbanError',
                setBicError: 'modApiPayment/setBicError',
                setOrderId: 'modApiPayment/setOrderId'
            }),
            ...mapActions({
                flashMessage: 'modFlash/flashMessage',
                getUuid: 'modApiPayment/getUuid',
                createOrderAction: 'modApiPayment/createOrder'
            }),
            createOrder: function() {

                if(this.order.chosenPaymentMethod.key === 'payone_cc') {
                    if (this.hostedIFrame.isComplete()) {
                        // Perform "CreditCardCheck" to create and get a PseudoCardPan; then call your function "hostedIFramePayCallback"
                        this.hostedIFrame.creditCardCheck('hostedIFramePayCallback');
                    } else {
                        this.flashMessage({
                            flashType: 'error',
                            flashMessage: this.$t('Please complete your credit card information')
                        });
                        console.log("Not complete. Nothing done.");
                    }
                    return;
                }

                // Errorhandling for iban and bic inputs for payments like sb or elv
                if(this.order.chosenPaymentMethod.key === 'payone_sb') {

                    let error = false;

                    this.setIbanError(false);
                    this.setBicError(false);

                    if(_.isEmpty(this.order.chosenPaymentMethod.payload.iban)) {
                        this.setIbanError(true);
                        error = true;

                        this.flashMessage({
                            flashType: 'error',
                            flashMessage: this.$t('Please insert valid IBAN')
                        });
                    }

                    if(_.isEmpty(this.order.chosenPaymentMethod.payload.bic)) {
                        this.setBicError(true);
                        error = true;

                        this.flashMessage({
                            flashType: 'error',
                            flashMessage: this.$t('Please insert valid BIC')
                        });
                    }

                    if(error) {
                        return;
                    }
                }

                // Get uuid from api
                this.getUuid().then((response) => {

                    // Store uuid as orderId to order in store
                    this.setOrderId(response.data.substring(0, 20));

                    // Validate order and save to cookie then redirect to summary page
                    this.createOrderAction().then(() => {
                        this.$router.push({
                            path: this.localePath('checkout-summary')
                        });
                    }).catch((error) => {
                        this.flashMessage({
                            flashType: 'error',
                            flashMessage: this.$t(error)
                        });
                        //console.log(error);
                    });
                });

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
