<template>
    <div class="container checkout-payment">
        <div class="checkout-payment-wrp checkout-summary-wrp">
            <div class="headline headline-1" v-text="'Checkout'" />
            <customer-addresses />
            <payment-methods />
            <shipping-methods />
            <div class="additional-info-wrp">
                <div class="summary-container">
                    <div class="summary-wrp">
                        <totals />
                        <div v-for="(msg, key) in checkoutError" :key="key" class="errors">
                            {{ msg }}
                        </div>
                        <payone-channel />
                        <button class="button-primary checkout-btn" :disabled="processingCheckout || !isEmpty(checkoutError)" @click="placeOrder()">
                            <span v-if="!processingCheckout">{{ $t('Place Order') }}</span>
                            <div v-if="processingCheckout" class="loader lds-ellipsis">
                                <div />
                                <div />
                                <div />
                                <div />
                            </div>
                            <material-ripple />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex';
    import Totals from "../../components/checkout/Totals";
    import CustomerAddresses from "../../components/customer/CustomerAddresses";

    export default {
        name: "ShopwareOnepage",

        components: {
            PaymentMethods: () => import('../../components/checkout/PaymentMethods'),
            ShippingMethods: () => import('../../components/checkout/ShippingMethods'),
            CustomerAddresses,
            Totals
        },

        middleware: [
            'apiCustomerAuthenticate',
            'cartValidate',
            'apiLocalization',
            'trackClickPath'
        ],

        layout: 'hubble_express',

        data() {
            return {
                isGuest: false,

                chosenPaymentMethod: '1',
                chosenShippingMethod: '1',
                checkoutError: {},
                orderObj: {
                    salutationId: "",
                    firstName: "Guest",
                    lastName: "Customer",
                    email: "",
                    billingAddress: {
                        salutationId: "",
                        street: "Test Street",
                        zipcode: "12345",
                        city: "City",
                        countryId: ""
                    }
                }
            }
        },

        computed: {
            ...mapState({
                swtc: state => state.modCart.swtc,
                order: state => state.modApiPayment.order,
                hostedIFrame: state => state.modApiPayment.hostedIFrame,
                customerAddresses: state => state.modApiPayment.customer.customerAddresses,
                customer: state => state.modApiPayment.customer,
                processingCheckout: state => state.modApiPayment.processingCheckout
            })
        },

        mounted() {
            if(this.customer.customerAuth.token === 'guest') {
                this.isGuest = true;
            }
        },

        methods: {
            ...mapMutations({
                setProcessingCheckout: 'modApiPayment/setProcessingCheckout',
                resetProcessingCheckout: 'modApiPayment/resetProcessingCheckout'
            }),
            ...mapActions({
                validateOrder: 'modApiPayment/validateOrder',
                placeOrderAction: 'modApiPayment/placeOrder',
                swStartPayment: 'modApiPayment/swStartPayment'
            }),
            isEmpty: function(val) {
                return _.isEmpty(val);
            },

            placeOrder: async function() {

                // Start loading animation
                this.setProcessingCheckout();

                try {
                    await this.validateOrder()
                } catch(error) {
                    this.resetProcessingCheckout();
                    return false;
                }

                let order = await this.placeOrderAction();

                let paymentResponse = await this.swStartPayment(order.data.data.id);

                if(paymentResponse.data.paymentUrl) {
                    this.resetProcessingCheckout();
                    window.open(paymentResponse.data.paymentUrl, "_self");
                }

                if(_.isEmpty(paymentResponse.data)) {
                    this.$router.push({
                        path: this.localePath('checkout-shopware-success')
                    }, () => {
                        this.resetProcessingCheckout();
                    });
                }

            },

            submitForm: function(isValid) {

                if(isValid && !this.processingCheckout) {
                    this.placeOrder();
                    return;
                }

                this.processingCheckout = false;
                return false;
            }
        },

        head() {
            return {
                title: 'Checkout | Hubble Demo-Shop',
                meta: [
                    { hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' },
                    { hid: 'vp', name: 'viewport', content: 'width=device-width,initial-scale=1.0, maximum-scale=1.0' }
                ]
            }
        }
    }
</script>

<style scoped>
    .summary-container {
        width: 45%;
        margin-left: auto;
    }
</style>
