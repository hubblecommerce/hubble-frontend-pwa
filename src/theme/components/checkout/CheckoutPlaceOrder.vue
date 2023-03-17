<template>
    <slot name="actions" :on-submit="onSubmit" :loading="loading" />
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { navigateTo } from '#app'
import { hblUseForm } from '@/utils/helper'
import { useCheckout, useNotification } from '#imports'

const props = defineProps<{
    form: Ref
}>()

const { validateForm } = hblUseForm()
const { validateCheckout, placeOrder, handlePayment, error, loading } = useCheckout()
const { showNotification } = useNotification()

async function onSubmit () {
    const isValid = await validateForm(props.form)
    if (!isValid) {
        return
    }

    if (!validateCheckout()) {
        return
    }

    const order = await placeOrder()

    if (error.value) {
        showNotification(error.value.toString(), 'error', true)
        return
    }

    if (typeof order === 'string') {
        const payment = await handlePayment(order)

        if (typeof payment === 'string') {
            window.open(payment, '_self')
        }

        if (typeof payment === 'boolean' && payment) {
            navigateTo(
                {
                    name: 'checkout-success',
                    query: {
                        orderId: order
                    }
                }
            )
        }
    }
}
</script>
