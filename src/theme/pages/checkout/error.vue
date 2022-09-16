<template>
    <div class="checkout-error container m-auto px-6 py-6 lg:max-w-5xl flex flex-col gap-6">
        <div class="p-6">
            <div class="text-2xl text-center uppercase" v-text="'Something is wrong with your payment'" />
        </div>

        <div class="error-info text-center">
            We did receive your order, but something is wrong with your payment process.
            Please try a different payment method, or contact our customer service via email or hotline.
        </div>

        <client-only>
            <CheckoutPayment @update-after:paymentMethod="paymentMethodId = $event" />
        </client-only>

        <div v-if="error" class="alert alert-error">
            <div>
                <span> {{ error }}</span>
            </div>
        </div>

        <button
            type="submit"
            :disabled="loading"
            :class="{ 'loading': loading }"
            class="btn btn-primary"
            @click.prevent="onSubmit()"
        >
            Reset Payment
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#app'
import { useCheckout, usePlatform } from '#imports'

const { currentRoute } = useRouter()
const orderId = currentRoute.value.query.orderId.toString()
const { resetPayment, loading, error, handlePayment } = useCheckout()

const paymentMethodId = ref(null)
if (process.client) {
    const { session } = usePlatform()
    paymentMethodId.value = session.value.paymentMethod.id
}

async function onSubmit () {
    if (orderId != null && paymentMethodId.value != null) {
        await resetPayment(orderId, paymentMethodId.value)

        if (!error.value) {
            await handlePayment(orderId)
        }
    }
}
</script>