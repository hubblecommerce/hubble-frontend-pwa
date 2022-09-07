<template>
    <div class="container m-auto px-6 py-6 checkout-success lg:max-w-5xl">
        <div class="p-6">
            <div class="text-2xl text-center uppercase" v-text="'Thank you for your order at hubble!'" />
        </div>
        <transition name="fade" mode="out-in">
            <div v-if="order != null && !loading" class="flex flex-col gap-12">
                <div class="text-center">
                    <span>We have sent you an order confirmation by e-mail at {{ order.email }}</span>
                    <div v-text="'Your order number: ' + order.orderNumber" />
                </div>

                <CustomerOrder :order="order" />
            </div>
            <div v-else-if="loading" class="flex flex-col gap-12">
                <div class="text-center">
                    <MiscSkeleton size="medium" :repeat="2" />
                </div>
                <div class="grid grid-cols-12 gap-6 lg:gap-12">
                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <MiscSkeleton size="large" />
                        <MiscSkeleton size="medium" :repeat="3" />
                    </div>
                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <MiscSkeleton size="large" />
                        <MiscSkeleton size="medium" :repeat="3" />
                    </div>
                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <MiscSkeleton size="large" />
                        <MiscSkeleton size="medium" :repeat="2" />
                    </div>
                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <MiscSkeleton size="large" />
                        <MiscSkeleton size="medium" :repeat="2" />
                    </div>
                    <div class="col-span-12">
                        <div class="flex pb-4 mb-4">
                            <MiscSkeleton size="large" circle />
                            <MiscSkeleton size="large" />
                        </div>
                        <div class="flex pb-4 mb-4">
                            <MiscSkeleton size="large" circle />
                            <MiscSkeleton size="large" />
                        </div>
                        <div class="flex pb-4 mb-4">
                            <MiscSkeleton size="large" circle />
                            <MiscSkeleton size="large" />
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-4 md:col-start-9">
                        <MiscSkeleton size="medium" :repeat="4" />
                    </div>
                </div>
            </div>
            <div v-else-if="error" class="text-center">
                {{ error }}
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, navigateTo } from '#app'
import { useCustomer } from '#imports'

const loading = ref(true)
const { getOrders, loading: loadingOrder, error } = useCustomer()
const { currentRoute } = useRouter()
const orderId = currentRoute.value.query.orderId.toString()
const order = ref(null)

onMounted(async () => {
    if (orderId) {
        try {
            order.value = await getOrders(orderId)
            loading.value = loadingOrder.value
        } catch (e) {
            loading.value = false
            navigateTo('/')
        }
    }
})
</script>
