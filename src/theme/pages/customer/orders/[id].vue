<template>
    <div class="container m-auto px-6 py-6 checkout-success lg:max-w-5xl">
        <transition name="fade" mode="out-in">
            <div v-if="order != null && !loading" class="flex flex-col gap-12">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <div class="text-2xl">
                        {{ 'Order number: ' + order.orderNumber }}
                    </div>
                    <!-- TODO: replace with date format from session -->
                    <div v-text="new Date(order.orderDate).toLocaleDateString('en-US')" />
                    <div v-text="'Status: ' + order.status" />
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
import { useAsyncData, useRoute } from '#app'
import { onMounted, ref, type Ref } from 'vue'
import { useCustomer, useLocalisation } from '#imports'
import { type HblOrder } from '@/utils/types'

/*
* Redirect to /customer/login if customer is not logged in
*/
const { getCustomer, getOrders } = useCustomer()
const { data, error } = await useAsyncData(() => getCustomer())
const route = useRoute()
const { navigateToI18n } = useLocalisation()

if (data.value == null || data.value?.isGuest || error.value != null) {
    await navigateToI18n('/customer/login')
}

const loading = ref(true)
const order: Ref<HblOrder | undefined> = ref()
onMounted(async () => {
    order.value = await getOrders({ id: route.params.id as string }).then(res => res.data) as HblOrder
    loading.value = false
})
</script>
