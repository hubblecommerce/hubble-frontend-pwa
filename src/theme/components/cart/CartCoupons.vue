<template>
    <form class="w-full form-control" @submit.prevent="onSubmit()">
        <label for="applyCoupon" class="sr-only">{{ t('cart.cartCoupons.label') }}</label>
        <div class="w-full input-group">
            <input
                id="applyCoupon"
                v-model="code"
                :disabled="loading"
                required
                type="text"
                :placeholder="t('cart.cartCoupons.placeholder')"
                class="w-full input input-bordered"
            >
            <button :class="{ 'loading': loading }" class="btn">
                {{ t('cart.cartCoupons.label') }}
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useCart, useNotification } from '#imports'

const { t } = useI18n()
const cartStore = useCart()
const { loading, error } = storeToRefs(cartStore)
const { addCoupon } = cartStore
const { showNotification } = useNotification()
const code = ref('')

async function onSubmit () {
    await addCoupon(code.value)

    if (error.value) {
        showNotification(error.value as string, 'error')
    }
}
</script>

<i18n>
{
    "en": {
        "cart.cartCoupons.label": "Apply",
        "cart.cartCoupons.placeholder": "Enter coupon code"
    },
    "de": {
        "cart.cartCoupons.label": "Einlösen",
        "cart.cartCoupons.placeholder": "Gutscheincode eingeben"
    }
}
</i18n>
