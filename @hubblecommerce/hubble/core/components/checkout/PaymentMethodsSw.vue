<template>
    <div>
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
                <div  class="payment-content-wrp" />
            </div>

            <!-- Error if no payment isset -->
            <div class="validation-msg" v-text="$t(paymentError)" />
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

        <div v-show="showModal" class="payment-methods-modal">
            <div class="payment-content-wrp">
                <form id="payment-form">
                    <div v-show="chosenMethodObj.shortName === 'stripe.shopware_payment.payment_handler.card'" class="cc">
                        <div ref="card" class="card-content-wrp" />
                        <div ref="cardErrors" id="card-errors" role="alert" />
                    </div>

                    <div v-show="chosenMethodObj.shortName === 'stripe.shopware_payment.payment_handler.sepa'" class="iban">
                        <div ref="iban" id="iban-content-wrp" />
                        <div ref="ibanErrors" id="iban-errors" role="alert" />
                    </div>

                    <button @click.prevent="savePaymentSettings()">Create Payment Method (Stripe) and then set payment method settings (SW)</button>
                    <button @click.prevent="closeModal()">Close</button>
                </form>
            </div>
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
            chosenMethodObj: {}, // Full Method Object from API
            stripe: null, // Stripe.js
            card: null, // Stripe.js elements: card
            iban: null, // Stripe.js elements: iban
            showModal: false,
            stripePaymentMethod: null // Stripe result of createPayment function
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
            // Set method by id
            this.setMethodById(newValue);

            this.saveChosenPaymentMethodToApi();

            // Show payment method setting modal for CC and SEPA
            if(this.chosenMethodObj.shortName === 'stripe.shopware_payment.payment_handler.card' ||
                this.chosenMethodObj.shortName ==='stripe.shopware_payment.payment_handler.sepa') {
                this.showModal = true;
            }
        }
    },

    async mounted() {
        this.loading = true;

        try {
            // Init Stripe.js
            this.stripe = await loadStripe("pk_test_51I6yFaC3x1kKCxA799g5L2fn9Td1RIRgNbSeZpPhL0tmUs8xczyj9imk4iK3R70AJ6EGeQtkX7Sxpu3GOr9geHqr00pwXTLhBG");

            // Init Stripe Elements: Card
            const cardOptions = {
                style: {
                    base: {
                        color: "#32325d",
                    }
                }
            };
            this.card = this.initStripeElement("card", this.$refs.card, this.$refs.cardErrors, cardOptions);

            // Init Stripe Elements: Iban
            const ibanOptions = {
                style: {},
                supportedCountries: ["SEPA"],
                // If you know the country of the customer, you can optionally pass it to
                // the Element as placeholderCountry. The example IBAN that is being used
                // as placeholder reflects the IBAN format of that country.
                placeholderCountry: "DE"
            };
            this.iban = this.initStripeElement("iban", this.$refs.iban, this.$refs.ibanErrors, ibanOptions);
        } catch (e) {
            console.log("Failed to init Stripe.js");
        }

        // Fetch payment methods from api
        if (_.isEmpty(this.paymentMethods)) {
            this.getPaymentMethods().then(() => {
                this.loading = false;
                //this.setChosenPaymentMethod();
            }).catch((error) => {
                this.apiError = true;
                this.loading = false;
                console.log(error);
            });
        } else {
            this.loading = false;
        }
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
        initStripeElement: function(elementName, targetElement, errorTargetElement, options) {
            let elements = this.stripe.elements();
            let element = elements.create(elementName, options);
            element.mount(targetElement);

            element.on('change', ({error}) => {
                let displayError = errorTargetElement;
                if (error) {
                    displayError.textContent = error.message;
                } else {
                    displayError.textContent = '';
                }
            });

            return element;
        },
        savePaymentSettings: function () {
            // TODO: Set full name from customer.billingaddress
            let paymentMethodData = {type:"card", card: this.card, billing_details: { name: 'Test Name' }};

            this.stripe.createPaymentMethod(paymentMethodData).then((result) => {
                this.stripePaymentMethod = result;
                let payload = null;

                if(result.paymentMethod.card != null) {
                    payload = {
                        card: result.paymentMethod.card,
                        saveCardForFutureCheckouts: null
                    }
                    _.assign(payload.card, { id: result.paymentMethod.id });
                    _.assign(payload.card, { name: result.paymentMethod.billing_details.name });
                }

                // TODO: save stripePaymentMethod to vuex
                // TODO: on order submit:  !this.chosenMethodObj.shortName.includes(this.stripePaymentMethod.paymentMethod.type)
                this.$store.dispatch('modApiPayment/swSetPaymentMethodSettings', payload);

                this.closeModal();
            });
        },
        closeModal: function() {
            // Reset chosen method if iframe error
            if(this.card != null) {
                if(this.card._empty || this.card._invalid) {
                    this.resetChosenPaymentMethod();
                }
            }

            this.showModal = false;
        },
        resetChosenPaymentMethod: function() {
            return new Promise((resolve, reject) => {
                this.setProcessingCheckout();
                this.chosenMethod = null;
                this.chosenMethodObj = {};

                this.storeChosenPaymentMethod(this.chosenMethodObj)
                    .then(() => {
                        this.recalculateCart().then(() => {
                            this.resetProcessingCheckout();
                            resolve();
                        });
                    })
                    .catch((err) => {
                        this.flashMessage({
                            flashType: 'error',
                            flashMessage: err === 'No network connection' ? this.$t(err) : this.$t('An error occurred'),
                        });
                        reject();
                    });
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
            return new Promise((resolve, reject) => {
                this.chosenMethodObj = {};

                _.forEach(this.paymentMethods, (val) => {
                    if (val.id === key) {
                        this.chosenMethodObj = val;
                        resolve(this.chosenMethodObj);
                    }
                });
            });
        },
        saveChosenPaymentMethodToApi: function() {
            return new Promise((resolve, reject) => {
                // Start Checkout loader
                this.setProcessingCheckout();

                if (!_.isEmpty(this.chosenMethodObj)) {
                    this.storeChosenPaymentMethod(this.chosenMethodObj)
                        .then(() => {
                            this.recalculateCart().then(() => {
                                this.resetProcessingCheckout();
                                resolve();
                            });
                        })
                        .catch((err) => {
                            this.flashMessage({
                                flashType: 'error',
                                flashMessage: err === 'No network connection' ? this.$t(err) : this.$t('An error occurred'),
                            });
                            reject();
                        });
                } else {
                    this.resetProcessingCheckout();
                    resolve();
                }
            });
        }
    }
};
</script>
