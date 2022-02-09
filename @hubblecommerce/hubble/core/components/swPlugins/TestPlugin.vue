<template>
    <div>
        <template v-if="data.shortName === 'stripe.shopware_payment.payment_handler.card'">
            <div v-if="Object.keys(stripePaymentMethods.card).length > 0">
                <span>{{ stripePaymentMethods.card.name }} | ****{{ stripePaymentMethods.card.last4 }}</span>
            </div>
            <span @click="editPaymentSettings(data.id)">{{ 'Edit' }}</span>
        </template>
        <template v-if="data.shortName === 'stripe.shopware_payment.payment_handler.sepa'">
            <div v-if="Object.keys(stripePaymentMethods.sepaBankAccount).length > 0">
                <span>{{ stripePaymentMethods.sepaBankAccount.name }} | ****{{ stripePaymentMethods.sepaBankAccount.last4 }}</span>
            </div>
            <span @click="editPaymentSettings(data.id)">{{ 'Edit' }}</span>
        </template>
    </div>
</template>

<script>
import paymentMethodStripe from "@/composables/paymentMethodStripe";

export default {
    name: 'TestPlugin',

    props: {
        data: {
            type: Object,
            required: false,
            default: () => {},
        },
    },

    setup(props, context) {
        const {
            stripePaymentMethods,
        } = paymentMethodStripe();

        return {
            stripePaymentMethods
        }
    },


};
</script>

<style scoped>

</style>
