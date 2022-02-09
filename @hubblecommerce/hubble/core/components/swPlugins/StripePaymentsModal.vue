<template>
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
</template>

<script>
import paymentMethodStripe from "@/composables/paymentMethodStripe";
export default {
    name: "StripePaymentsModal",

    props: {
        data: {
            type: Object,
            required: false,
            default: () => {},
        },
    },

    setup(props, context) {
        const {
            stripe,
            card,
            sepa,
            stripePaymentMethods,
            billingDetailsCard,
            billingDetailsSepa,
            savePaymentSettings
        } = paymentMethodStripe(context, props.data.contextToken, props.data.currentMethod, props.data.currentMethodObj, props.data.showModal);

        return {
            savePaymentSettings,
            stripePaymentMethods
        }
    },

    created() {
        this.$root.$on('payment-changed', (method) => {
            // Show payment method setting modal for CC and SEPA
            if (
                method.shortName === 'stripe.shopware_payment.payment_handler.card' ||
                method.shortName === 'stripe.shopware_payment.payment_handler.sepa'
            ) {
                showModal.value = true;
            }
        })
    }
}
</script>

<style scoped>

</style>
