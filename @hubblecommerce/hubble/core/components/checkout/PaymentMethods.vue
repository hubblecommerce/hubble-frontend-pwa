<template>
    <div>
        <div v-if="!loading && !apiError" class="payment-methods-wrp">
            <div class="headline headline-3" v-text="'Payment'" />

            <!-- Dynamic payment methods from api -->
            <div v-for="method in paymentMethods" v-if="method.active" :key="method.id" class="method-wrp">
                <hbl-checkbox>
                    <input
                        :id="'payment-option-' + method.id"
                        v-model="currentMethod"
                        type="radio"
                        :value="method.id"
                        :disabled="processingCheckout"
                    />
                    <label :for="'payment-option-' + method.id" class="method-label">
                        <span class="name" v-text="method.name" />
                        <span class="description" v-text="method.description" />
                    </label>
                    <template v-if="method.shortName === 'stripe.shopware_payment.payment_handler.card'">
                        <div v-if="Object.keys(stripePaymentMethods.card).length > 0">
                            <span>{{ stripePaymentMethods.card.name }} | ****{{ stripePaymentMethods.card.last4 }}</span>
                        </div>
                        <span @click="editPaymentSettings(method.id)">{{ 'Edit' }}</span>
                    </template>
                    <template v-if="method.shortName === 'stripe.shopware_payment.payment_handler.sepa'">
                        <div v-if="Object.keys(stripePaymentMethods.sepaBankAccount).length > 0">
                            <span>{{ stripePaymentMethods.sepaBankAccount.name }} | ****{{ stripePaymentMethods.sepaBankAccount.last4 }}</span>
                        </div>
                        <span @click="editPaymentSettings(method.id)">{{ 'Edit' }}</span>
                    </template>
                </hbl-checkbox>
            </div>

            <!-- Error if no payment isset -->
            <div class="validation-msg" v-text="paymentError" />
        </div>

        <div v-else-if="apiError" class="payment-methods-api-error-wrp"> No payment methods found </div>

        <loader v-else />

        <div v-show="showModal" class="payment-methods-modal">
            <div v-if="Object.keys(currentMethodObj).length >= 0" class="payment-content-wrp">
                <div v-show="currentMethodObj.shortName === 'stripe.shopware_payment.payment_handler.card'" class="cc">
                    <form @submit.prevent="savePaymentSettings('card')" class="form-cc">
                        <hbl-input>
                            <input
                                id="cardHolder"
                                v-model="billingDetailsCard.name"
                                type="text"
                                name="cardHolder"
                                value=""
                                placeholder=" "
                                required
                            />
                            <label for="cardHolder" v-text="'Card Holder' + '*'" />
                        </hbl-input>
                        <div ref="card" class="card-content-wrp" />
                        <div ref="cardErrors" id="card-errors" role="alert" />
                        <button @click.prevent="savePaymentSettings('card')">Create & Save CC Payment Method (Stripe)</button>
                    </form>
                </div>

                <div v-show="currentMethodObj.shortName === 'stripe.shopware_payment.payment_handler.sepa'" class="sepa">
                    <form @submit.prevent="savePaymentSettings('sepa_debit')" class="form-cc">
                        <hbl-input>
                            <input
                                id="accountHolder"
                                v-model="billingDetailsSepa.name"
                                type="text"
                                name="accountHolder"
                                value=""
                                placeholder=" "
                                required
                            />
                            <label for="accountHolder" v-text="'Account Holder' + '*'" />
                        </hbl-input>

                        <hbl-input>
                            <input
                                id="accountHolderEmail"
                                v-model="billingDetailsSepa.email"
                                type="text"
                                name="accountHolderEmail"
                                value=""
                                placeholder=" "
                                required
                            />
                            <label for="accountHolderEmail" v-text="'Account Holder Email' + '*'" />
                        </hbl-input>

                        <div ref="sepa" id="sepa-content-wrp" />
                        <div ref="sepaErrors" id="sepa-errors" role="alert" />
                        <div class="sepa-info">
                            Ich ermächtige / Wir ermächtigen (A) Demostore sowie Stripe, den durchführenden Zahlungsdienstleister, Zahlungen von
                            meinem / unserem Konto mittels Lastschrift einzuziehen. Zugleich (B) weise ich mein / weisen wir unser Kreditinstitut an,
                            die von Demostore bzw. Stripe auf mein / unser Konto gezogenen Lastschriften einzulösen. Hinweis: Ich kann / Wir können
                            innerhalb von acht Wochen, beginnend mit dem Belastungsdatum, die Erstattung des belasteten Betrages verlangen. Es gelten
                            dabei die mit meinem / unserem Kreditinstitut vereinbarten Bedingungen.
                        </div>
                        <button @click.prevent="savePaymentSettings('sepa_debit')">Create & Save SEPA Payment Method (Stripe)</button>
                    </form>
                </div>

                <button @click.prevent="closeModal(null, currentMethodObj)">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { loadStripe } from '@stripe/stripe-js';
import ApiClient from '@/utils/api-client';

export default {
    name: 'PaymentMethods',

    props: {
        processingCheckout: {
            type: Boolean,
            required: true,
        },
        sessionPaymentMethod: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            loading: false,
            apiError: false, // Error in case of api throws error
            paymentError: null, // Error that could happen on method selection
            paymentMethods: null,
            currentMethod: null,
            currentMethodObj: {},

            stripe: null, // Stripe.js
            card: null, // Stripe.js elements: card
            sepa: null, // Stripe.js elements: iban
            stripePaymentMethods: {
                // Stripe result of createPayment function
                card: {},
                sepaBankAccount: {},
            },
            billingDetailsCard: {
                // Stripe required customer info
                name: '',
            },
            billingDetailsSepa: {
                // Stripe required customer info
                name: '',
                email: '',
            },
            showModal: false,
        };
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
    },

    async mounted() {
        this.loading = true;

        try {
            // Init Stripe.js
            this.stripe = await loadStripe(process.env.SW_STRIPE_PUBLIC_KEY);

            // Init Stripe Elements: Card
            const cardOptions = {
                style: {
                    base: {
                        color: '#32325d',
                    },
                },
            };
            this.card = this.initStripeElement('card', this.$refs.card, this.$refs.cardErrors, cardOptions);

            // Init Stripe Elements: Iban
            const sepaOptions = {
                style: {},
                supportedCountries: ['SEPA'],
                placeholderCountry: 'DE',
            };
            this.sepa = this.initStripeElement('iban', this.$refs.sepa, this.$refs.sepaErrors, sepaOptions);
        } catch (e) {
            console.log('Failed to init Stripe.js');
        }

        try {
            const response = await this.fetchPaymentMethods();
            this.paymentMethods = response.data;

            this.currentMethod = this.sessionPaymentMethod;
            this.currentMethodObj = await this.getMethodById(this.sessionPaymentMethod);
            this.loading = false;
        } catch (e) {
            this.apiError = true;
            this.loading = false;
        }
    },

    watch: {
        currentMethod: async function (id) {
            if (id === null) {
                this.paymentError = 'Please choose a payment method.';
                this.$emit('payment-error', true);
                return;
            }

            this.paymentError = null;
            this.$emit('processing', true);

            try {
                await this.setPaymentMethod(id);

                this.currentMethodObj = await this.getMethodById(id);

                // Show payment method setting modal for CC and SEPA
                if (
                    this.currentMethodObj.shortName === 'stripe.shopware_payment.payment_handler.card' ||
                    this.currentMethodObj.shortName === 'stripe.shopware_payment.payment_handler.sepa'
                ) {
                    this.showModal = true;
                }

                this.$emit('processing', false);
                this.$emit('payment-error', false);
                this.$emit('payment-changed', this.currentMethodObj);
            } catch (e) {
                this.paymentError = e.detail;
                this.$emit('processing', false);
                this.$emit('payment-error', true);
            }
        },
    },

    methods: {
        fetchPaymentMethods: async function () {
            return await new ApiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/v3/payment-method',
                contextToken: this.contextToken,
                data: {
                    onlyAvailable: true,
                },
            });
        },
        setPaymentMethod: async function (id) {
            return await new ApiClient().apiCall({
                action: 'patch',
                endpoint: 'store-api/v3/context',
                contextToken: this.contextToken,
                data: {
                    paymentMethodId: id,
                },
            });
        },
        getMethodById: async function (id) {
            let obj = {};
            this.paymentMethods.forEach((val) => {
                if (val.id === id) {
                    obj = val;
                }
            });
            return obj;
        },
        initStripeElement: function (elementName, targetElement, errorTargetElement, options) {
            let elements = this.stripe.elements();
            let element = elements.create(elementName, options);
            element.mount(targetElement);

            element.on('change', ({ error }) => {
                let displayError = errorTargetElement;
                if (error) {
                    displayError.textContent = error.message;
                } else {
                    displayError.textContent = '';
                }
            });

            return element;
        },
        savePaymentSettings: async function (type) {
            let paymentMethodData = {};

            if (type === 'card') {
                if (!this.card._complete || this.card._empty || this.card._invalid) {
                    return;
                }

                paymentMethodData = {
                    type: 'card',
                    card: this.card,
                    billing_details: this.billingDetailsCard,
                };
            }

            if (type === 'sepa_debit' && !this.sepa._invalid) {
                if (!this.sepa._complete || this.sepa._empty || this.sepa._invalid) {
                    return;
                }

                paymentMethodData = {
                    type: 'sepa_debit',
                    sepa_debit: this.sepa,
                    billing_details: this.billingDetailsSepa,
                };
            }

            if (Object.keys(paymentMethodData).length >= 0) {
                try {
                    let result = await this.stripe.createPaymentMethod(paymentMethodData);
                    let payload = null;

                    if (result.paymentMethod.card != null) {
                        this.stripePaymentMethods.card = result.paymentMethod.card;

                        payload = {
                            card: result.paymentMethod.card,
                            saveCardForFutureCheckouts: null,
                        };
                        Object.assign(payload.card, { id: result.paymentMethod.id });
                        Object.assign(payload.card, { name: result.paymentMethod.billing_details.name });

                        await this.setPaymentMethodSettings(payload);
                        this.closeModal(this.card);
                    }

                    if (result.paymentMethod.sepa_debit != null) {
                        this.stripePaymentMethods.sepaBankAccount = result.paymentMethod.sepa_debit;

                        payload = {
                            sepaBankAccount: result.paymentMethod.sepa_debit,
                            saveSepaBankAccountForFutureCheckouts: null,
                        };
                        Object.assign(payload.sepaBankAccount, { id: result.paymentMethod.id });
                        Object.assign(payload.sepaBankAccount, { name: result.paymentMethod.billing_details.name });

                        await this.setPaymentMethodSettings(payload);
                        this.closeModal(this.sepa);
                    }
                } catch (e) {
                    if (e.message != null) {
                        this.paymentError = e.message;
                    }

                    if (e.detail != null) {
                        this.paymentError = e.detail;
                    }

                    this.closeModal();
                    this.resetChosenPaymentMethod();
                }
            }
        },
        setPaymentMethodSettings: async function (payload) {
            return await new ApiClient().apiCall({
                action: 'patch',
                endpoint: 'store-api/v3/stripe-payment/payment-method-settings',
                contextToken: this.contextToken,
                data: payload,
            });
        },
        closeModal: function (element, currentMethodObj) {
            // Reset chosen method if iframe error
            if (element != null) {
                if (!element._complete || element._empty || element._invalid) {
                    this.resetChosenPaymentMethod();
                }
            }

            if (currentMethodObj != null) {
                if (currentMethodObj.shortName === 'stripe.shopware_payment.payment_handler.card') {
                    if (!this.card._complete || this.card._empty || this.card._invalid) {
                        this.resetChosenPaymentMethod();
                    }
                }

                if (currentMethodObj.shortName === 'stripe.shopware_payment.payment_handler.sepa') {
                    if (!this.sepa._complete || this.sepa._empty || this.sepa._invalid) {
                        this.resetChosenPaymentMethod();
                    }
                }
            }

            this.showModal = false;
        },
        resetChosenPaymentMethod: function () {
            this.currentMethod = null;
            this.currentMethodObj = {};
        },
        editPaymentSettings: function (id) {
            // Set currentMethod to trigger watcher
            // Set currentMethod + open related modal
            if (this.currentMethod !== id) {
                this.currentMethod = id;
            } else {
                this.showModal = true;
            }
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.loader-wrp {
    width: 100%;
    height: 400px;

    display: flex;
    justify-content: center;
    align-items: center;
}

.payment-methods-wrp {
    margin-bottom: 30px;

    .headline {
        margin-bottom: 20px;
    }

    .method-wrp {
        padding: 0 15px;
        background: $background-light;
        border: 1px solid $border-color;
        margin-bottom: 5px;

        .hbl-checkbox {
            margin: 0;
        }

        .method-label {
            width: 100%;
            padding-top: 20px;
            padding-bottom: 20px;
            padding-right: 130px;
        }

        .name {
            font-size: 16px;
        }

        .description {
            display: none;
        }
    }
}

.payment-methods-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);

    .payment-content-wrp {
        margin: auto;
        max-width: 100%;
        width: 450px;
        background: $white;
        padding: 40px;
    }
}

.payment-methods-placeholder {
    height: 260px;

    display: flex;
    justify-content: center;
    align-items: center;
}

.payment-methods-api-error-wrp {
    color: $error-accent;
    margin: 20px 0;
}

/* Tablet */
@media (min-width: 768px) {
    .payment-methods-wrp {
        .method-wrp {
            .description {
                display: inline;
                margin-left: 20px;
            }
        }
    }

    .payment-methods-modal {
        .payment-content-wrp {
            margin: 40px auto auto;
        }
    }
}
</style>
