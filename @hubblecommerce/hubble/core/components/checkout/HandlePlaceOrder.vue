<template>
    <div>
        <template v-if="defaultPaymentShortNames.includes(currentPaymentMethod.shortName) ">
            <hbl-button class="button-primary checkout-btn" :disabled="processingCheckout" @click.native="onCheckoutButtonClick()">
                <span v-if="!processingCheckout">{{ 'Place Order' }}</span>
                <loader v-if="processingCheckout" />
            </hbl-button>

            <template v-for="error in errors">
                <div class="error-message" v-text="error" />
            </template>
        </template>
    </div>
</template>

<script>
import placeOrderComposable from "@/composables/placeOrder";

export default {
    name: "HandlePlaceOrder",

    props: {
        currentPaymentMethod: {
            type: Object,
            required: false
        },
        paymentError: {
            type: Boolean,
            required: true
        },
        shippingError: {
            type: Boolean,
            required: true
        },
        processingCheckout: {
            type: Boolean,
            required: true
        }
    },

    setup(props, context) {
        const {errors, placeOrder, handlePayment} = placeOrderComposable(props, context);

        const onCheckoutButtonClick = async function() {
            const order = await placeOrder();

            if(order) {
                await handlePayment(order);
            }
        };

        return {
            errors,
            placeOrder,
            onCheckoutButtonClick
        };
    },

    data() {
        return {
            defaultPaymentShortNames: ['pre_payment', 'cash_payment', 'debit_payment', 'invoice_payment'],
        }
    }
}
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.checkout-btn {
    width: 100%;
    min-height: 42px;
    padding: 6px 30px 6px !important;

    &:disabled,
    &[disabled] {
        color: $text-primary;
    }

    .loader-wrp {
        height: auto;

        .lds-ring {
            div {
                border-color: $secondary transparent transparent transparent !important;
            }
        }
    }
}
</style>
