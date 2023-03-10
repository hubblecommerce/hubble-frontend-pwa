<template>
    <div class="container m-auto px-6 py-6 checkout-success lg:max-w-5xl">
        <div class="p-6">
            <div class="text-2xl text-center uppercase" v-text="'Thank you for your order at hubble!'" />
        </div>
        <transition name="fade" mode="out-in">
            <div v-if="order != null && !loading" class="flex flex-col gap-12">
                <div class="text-center">
                    <span>We have sent you an order confirmation by e-mail at {{ order?.email }}</span>
                    <div v-text="'Your order number: ' + order?.orderNumber" />
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
import { ref, onMounted, Ref } from 'vue'
import { useRouter, navigateTo, useNuxtApp } from '#app'
import { storeToRefs } from 'pinia'
import { useCustomer } from '#imports'
import { Order } from '@hubblecommerce/hubble/commons'

const loading = ref(true)
const customerStore = useCustomer()
const { loading: loadingOrder, error } = storeToRefs(customerStore)
const { getOrders } = customerStore
const { currentRoute, replace } = useRouter()
const orderId = currentRoute?.value?.query?.orderId?.toString()
const order: Ref<Order | null> = ref(null)
const { $hblBus } = useNuxtApp()

onMounted(async () => {
    if (orderId != null) {
        try {
            const { data } = await getOrders({ id: orderId })
            order.value = data as Order
            loading.value = loadingOrder.value

            // Make sure to emit placeOrder event only once by removing query param orderId
            await replace({ query: {} })
            $hblBus.$emit('placeOrder', { order: order.value })
        } catch (e) {
            loading.value = false
            navigateTo('/')
        }
    }
})
</script>
