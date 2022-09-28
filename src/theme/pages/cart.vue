<template>
    <div class="container m-auto p-6 lg:py-16 lg:max-w-5xl">
        <div class="text-2xl mb-6">
            Cart
        </div>

        <Transition name="fade" mode="out-in">
            <div v-if="loading" class="grid grid-cols-12 gap-6">
                <div class="col-span-12 lg:col-span-8">
                    <MiscSkeleton text size="medium" :repeat="6" />
                </div>
                <div class="col-span-12 lg:col-span-4">
                    <MiscSkeleton size="large" :repeat="2" />
                    <MiscSkeleton size="large" :repeat="3" />
                </div>
            </div>
            <div v-else-if="!loading && !error" class="grid grid-cols-12 gap-6">
                <div class="col-span-12 lg:col-span-8">
                    <CartList />
                </div>
                <div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
                    <CartCoupons v-if="cart?.lineItems.length > 0" />
                    <CartTotals />
                    <div v-if="cart?.lineItems.length > 0" class="flex flex-col w-full">
                        <MiscLink to="/checkout" class="btn btn-primary">
                            Checkout
                        </MiscLink>
                    </div>
                </div>
            </div>
            <div v-else-if="error && !loading">
                {{ error }}
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCart } from '#imports'

const { getCart, cart, loading, error, deleteCart } = useCart()

loading.value = true

onMounted(async () => {
    await getCart()
})
</script>
