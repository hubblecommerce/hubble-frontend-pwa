<template>
    <Transition name="fade" mode="out-in">
        <div v-if="loading" class="flex flex-col gap-4">
            <MiscSkeleton size="large" :repeat="2" />
            <MiscSkeleton text size="small" :repeat="6" />
            <MiscSkeleton size="large" :repeat="3" />
        </div>
        <div v-else-if="!loading && !error" class="flex flex-col gap-4">
            <CartList :is-interactive="isInteractive" />
            <CartCoupons v-if="cart?.lineItems.length > 0" />
            <CartTotals />
            <div v-if="cart?.lineItems.length > 0 && isInteractive" class="flex flex-col w-full">
                <MiscLink no-prefetch to="/checkout" class="btn btn-primary">
                    Checkout
                </MiscLink>
            </div>
        </div>
        <div v-else-if="error && !loading">
            {{ error }}
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCart } from '#imports'

interface CartProps {
    isInteractive?: boolean
}

const props = withDefaults(defineProps<CartProps>(), {
    isInteractive: true
})

const { getCart, cart, loading, error, deleteCart } = useCart()

// Set loading state to prevent flash old cart state before onMounted hook is finished
loading.value = true

onMounted(async () => {
    await getCart()
})
</script>
