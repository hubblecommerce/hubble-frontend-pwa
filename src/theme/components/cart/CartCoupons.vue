<template>
    <form class="w-full form-control" @submit.prevent="onSubmit()">
        <div class="w-full input-group">
            <label for="applyCoupon" class="sr-only">Apply Coupon</label>
            <input
                id="applyCoupon"
                v-model="code"
                :disabled="loading"
                type="text"
                placeholder="Giftcard or Couponcode"
                class="w-full input input-bordered"
            >
            <button :class="{ 'loading': loading }" class="btn">
                Apply Coupon
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCart, useNotification } from '#imports'

const { addCoupon, loading, error } = useCart()
const { showNotification } = useNotification()
const code = ref('')

async function onSubmit () {
    await addCoupon(code.value)

    if (error.value) {
        showNotification(error.value as string, 'error')
    }
}
</script>
