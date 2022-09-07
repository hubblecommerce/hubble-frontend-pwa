<template>
    <div class="container lg:max-w-5xl m-auto grid grid-cols-2 gap-6 p-6 mb-20">
        <div class="col-span-2 flex flex-col md:flex-row justify-between items-center space-x-4 pb-4 border-b">
            <div class="text-4xl">
                My Account
            </div>
            <div v-if="loading">
                <MiscSkeleton size="small" width="150px" />
            </div>
            <div v-else-if="customer != null">
                Welcome {{ customer.name }}
            </div>
        </div>

        <div class="col-span-2 lg:col-span-1 grid grid-cols-2 gap-4" style="grid-template-rows: auto 1fr auto;">
            <div class="col-span-2 w-full text-2xl">
                Address-book
            </div>

            <CustomerAddressBook />
        </div>

        <div class="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <div class="col-span-2 w-full text-2xl">
                Orders
            </div>

            <CustomerOrdersList />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { navigateTo, useAsyncData } from '#app'
import { useCustomer } from '#imports'

/*
 * Redirect to /customer/login if customer is not logged in
 */
const { getCustomer, customer } = useCustomer()
const { data, error } = await useAsyncData(() => getCustomer(), { initialCache: false })

if (data.value == null || data.value?.isGuest || error.value != null) {
    await navigateTo('/customer/login')
}

/*
 * Wait for init-session.client
 */
const loading = ref(true)
onMounted(() => {
    loading.value = false
})
</script>
