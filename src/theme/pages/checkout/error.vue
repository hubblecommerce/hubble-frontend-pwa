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
            <CheckoutPayment @update-after:payment-method="paymentMethodId = $event" />
        </client-only>

        <div v-if="error" class="alert alert-error">
            <span> {{ error }}</span>
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary"
            @click.prevent="onSubmit()"
        >
            <span v-if="loading" class="loading" />
            Reset Payment
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import { useRouter } from '#app'
import { storeToRefs } from 'pinia'
import { useCheckout, usePlatform, useLocalisation } from '#imports'

const { currentRoute } = useRouter()
const orderId = currentRoute?.value?.query?.orderId?.toString()
const { resetPayment, loading, error, handlePayment } = useCheckout()
const { navigateToI18n } = useLocalisation()

const paymentMethodId: Ref<string | null> = ref(null)
if (process.client) {
    const platformStore = usePlatform()
    const { session } = storeToRefs(platformStore)
    paymentMethodId.value = session?.value?.paymentMethod?.id != null ? session?.value?.paymentMethod?.id : null
}

async function onSubmit () {
    if (orderId != null && paymentMethodId.value != null) {
        await resetPayment(orderId, paymentMethodId.value)

        if (!error.value) {
            const payment = await handlePayment(orderId)

            if (typeof payment === 'string') {
                window.open(payment, '_self')
            }

            if (typeof payment === 'boolean') {
                navigateToI18n(
                    {
                        path: '/checkout/success',
                        query: {
                            orderId
                        }
                    }
                )
            }
        }
    }
}
</script>
