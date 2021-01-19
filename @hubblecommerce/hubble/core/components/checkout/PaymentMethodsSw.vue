<template>
    <div v-if="!loading && !apiError" class="payment-methods-wrp">
        <div class="headline headline-3" v-text="$t('Payment')" />

        <!-- Dynamic payment methods from api -->
        <div v-for="method in paymentMethods" v-if="method.active" :key="method.id" class="method-wrp">
            <div class="hbl-checkbox">
                <input :id="'payment-option-' + method.id" v-model="chosenMethod" type="radio" :value="method.id" />
                <label :for="'payment-option-' + method.id" class="method-label">
                    <span class="name" v-text="method.name" />
                    <span class="description" v-text="method.description" />
                    <span :class="'method-image-' + method.id" />
                </label>
            </div>

            <!-- sub contexts for specific payment methods like CC iFrame, Sofortüberweisung etc...  -->
            <div v-show="chosenMethod === method.id" class="payment-content-wrp">
                <!-- CC -->
                <div v-if="method.shortName === 'stripe.shopware_payment.payment_handler.card'" class="payment-content-wrp">
                    <form id="payment-form">
                        <div ref="card" class="card-content-wrp" />
                        <div ref="cardErrors" id="card-errors" role="alert" />
                    </form>
                </div>
            </div>
        </div>

        <!-- Error if no payment isset -->
        <div class="validation-msg" v-text="$t(paymentError)" />

        <button @click="purchase()">Create Payment Method (Stripe) and then set payment method settings (SW)</button>
    </div>
    <div v-else-if="apiError" class="payment-methods-api-error-wrp"> No payment methods found </div>
    <div v-else class="payment-methods-placeholder">
        <div class="loader lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { loadStripe } from '@stripe/stripe-js';
import _ from 'lodash';

export default {
    name: 'PaymentMethodsSw',

    data() {
        return {
            loading: false,
            apiError: false, // Error in case of api throws error
            chosenMethod: null, // ID
            chosenMethodObj: {}, // Full Method Object
            stripe: null,
            card: null
        };
    },

    computed: {
        ...mapState({
            paymentMethods: (state) => state.modApiPayment.paymentMethods,
            chosenPaymentMethod: (state) => state.modApiPayment.order.chosenPaymentMethod,
            paymentError: (state) => state.modApiPayment.paymentError,
        }),
        ...mapGetters({
            getChosenPaymentMethod: 'modApiPayment/getChosenPaymentMethod',
        }),
    },

    watch: {
        chosenMethod: function (newValue) {
            // Start Checkout loader
            this.setProcessingCheckout();

            // Set method by id
            this.setMethodById(newValue);

            if (!_.isEmpty(this.chosenMethodObj)) {
                this.storeChosenPaymentMethod(this.chosenMethodObj)
                    .then(() => {
                        this.recalculateCart().then(() => {
                            this.resetProcessingCheckout();
                        });
                    })
                    .catch((err) => {
                        this.flashMessage({
                            flashType: 'error',
                            flashMessage: err === 'No network connection' ? this.$t(err) : this.$t('An error occurred'),
                        });
                    });
            } else {
                this.resetProcessingCheckout();
            }
        },
    },

    mounted() {
        this.loading = true;

        // Init Stripe Elements
        loadStripe("pk_test_51I6yFaC3x1kKCxA799g5L2fn9Td1RIRgNbSeZpPhL0tmUs8xczyj9imk4iK3R70AJ6EGeQtkX7Sxpu3GOr9geHqr00pwXTLhBG").then((response) => {
            this.stripe = response;

            // Fetch payment methods from api
            if (_.isEmpty(this.paymentMethods)) {
                this.getPaymentMethods().then(() => {
                    this.loading = false;
                    this.setChosenPaymentMethod();

                    // Wait until payment input is rendered before render stripe elements
                    setTimeout(() => {
                        const cardStyle = {
                            base: {
                                color: "#32325d",
                            }
                        };
                        this.card = this.initStripeElement("card", this.$refs.card[0], this.$refs.cardErrors[0], cardStyle);
                    }, 50);
                }).catch((error) => {
                    this.apiError = true;
                    this.loading = false;
                    console.log(error);
                });
            } else {
                this.loading = false;
            }
        });
    },

    methods: {
        ...mapActions({
            storeChosenPaymentMethod: 'modApiPayment/storeChosenPaymentMethod',
            getPaymentMethodsAction: 'modApiPayment/getPaymentMethods',
            recalculateCart: 'modCart/recalculateCart',
            flashMessage: 'modFlash/flashMessage',
        }),
        ...mapMutations({
            setProcessingCheckout: 'modApiPayment/setProcessingCheckout',
            resetProcessingCheckout: 'modApiPayment/resetProcessingCheckout',
            setPaymentError: 'modApiPayment/setPaymentError',
            setShippingError: 'modApiPayment/setShippingError'
        }),
        initStripeElement: function(elementName, targetElement, errorTargetElement, style) {
            let elements = this.stripe.elements();
            let element = elements.create(elementName, { style: style });
            element.mount(targetElement);

            element.on('change', ({error}) => {
                let displayError = errorTargetElement;
                if (error) {
                    displayError.textContent = error.message;
                } else {
                    displayError.textContent = '';
                }

                console.log(element);
            });

            return element;
        },
        purchase: function () {
            // TODO: Set full name from customer.billingaddress
            let paymentMethodData = {type:"card", card: this.card, billing_details: { name: 'Test Name' }};

            this.stripe.createPaymentMethod(paymentMethodData).then((result) => {
                console.log(result.paymentMethod);

                let payload = null;
                if(result.paymentMethod.card != null) {
                    payload = {
                        card: result.paymentMethod.card,
                        saveCardForFutureCheckouts: null
                    }
                    _.assign(payload.card, { id: result.paymentMethod.id });
                    _.assign(payload.card, { name: result.paymentMethod.billing_details.name });
                }

                this.$store.dispatch('modApiPayment/swSetPaymentMethodSettings', payload);
            });
        },
        getPaymentMethods: function () {
            return new Promise((resolve, reject) => {
                // Get payment methods from api
                this.getPaymentMethodsAction()
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        setChosenPaymentMethod: function () {
            if (this.getChosenPaymentMethod) {
                this.chosenMethod = this.getChosenPaymentMethod.id;
            }
        },
        setMethodById: function (key) {
            _.forEach(this.paymentMethods, (val) => {
                if (val.id === key) {
                    this.chosenMethodObj = val;
                }
            });
        }
    }
};
</script>
