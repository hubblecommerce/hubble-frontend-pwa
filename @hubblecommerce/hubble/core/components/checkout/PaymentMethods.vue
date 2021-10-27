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

                    <PluginSlot name="checkout-payment-methods-method" :data="method" />

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
import ApiClient from '@/utils/api-client';
import { ssrRef, useStore, watch, computed } from '@nuxtjs/composition-api';
import paymentMethodStripe from "@/composables/paymentMethodStripe";
import PluginSlot from "~~/modules/hubble-frontend-pwa/@hubblecommerce/hubble/core/components/utils/PluginSlot";

export default {
    name: 'PaymentMethods',
    components: {PluginSlot},
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

    setup(props, context) {
        let currentMethod = ssrRef(null);
        let currentMethodObj = ssrRef({});
        let paymentError = ssrRef(null); // Error that could happen on method selection
        let paymentMethods = ssrRef(null);
        let showModal = ssrRef(false);

        const store  = useStore();
        const contextToken = computed(() => store.state.modSession.contextToken);

        const {
            stripe,
            card,
            sepa,
            stripePaymentMethods,
            billingDetailsCard,
            billingDetailsSepa,
        } = paymentMethodStripe(context, contextToken, currentMethod, currentMethodObj, showModal);

        const setPaymentMethod =  async function (id) {
            return await new ApiClient().apiCall({
                action: 'patch',
                endpoint: 'store-api/context',
                contextToken: contextToken.value,
                data: {
                    paymentMethodId: id,
                },
            });
        };

        const getMethodById = async function (id) {
            let obj = {};
            paymentMethods.value.forEach((val) => {
                if (val.id === id) {
                    obj = val;
                }
            });
            return obj;
        };

        watch(currentMethod, async (id) => {
            if (id === null) {
                paymentError.value = 'Please choose a payment method.';
                context.emit('payment-error', true);
                return;
            }

            paymentError.value = null;
            context.emit('processing', true);

            try {
                await setPaymentMethod(id);

                currentMethodObj.value = await getMethodById(id);

                // Show payment method setting modal for CC and SEPA
                if (
                    currentMethodObj.value.shortName === 'stripe.shopware_payment.payment_handler.card' ||
                    currentMethodObj.value.shortName === 'stripe.shopware_payment.payment_handler.sepa'
                ) {
                    showModal.value = true;
                }

                context.emit('processing', false);
                context.emit('payment-error', false);
                context.emit('payment-changed', currentMethodObj.value);
            } catch (e) {
                paymentError.value = e.detail;
                context.emit('processing', false);
                context.emit('payment-error', true);
            }
        });

        return {
            currentMethod,
            currentMethodObj,
            paymentError,
            paymentMethods,
            contextToken,
            showModal,

            stripe,
            card,
            sepa,
            stripePaymentMethods,
            billingDetailsCard,
            billingDetailsSepa,

            setPaymentMethod,
            getMethodById
        } // anything returned here will be available for the rest of the component
    },

    data() {
        return {
            loading: false,
            apiError: false, // Error in case of api throws error
        };
    },

    async mounted() {
        this.loading = true;

        try {
            const response = await this.fetchPaymentMethods();
            this.paymentMethods = response.data.elements;

            this.currentMethod = this.sessionPaymentMethod;
            this.currentMethodObj = await this.getMethodById(this.sessionPaymentMethod);
            this.loading = false;
        } catch (e) {
            this.apiError = true;
            this.loading = false;
        }
    },

    methods: {
        fetchPaymentMethods: async function () {
            return await new ApiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/payment-method',
                contextToken: this.contextToken.value,
                data: {
                    onlyAvailable: true,
                },
            });
        }
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
