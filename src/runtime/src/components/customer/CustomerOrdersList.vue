<template>
    <Transition name="fade" mode="out-in">
        <div v-if="error">
            {{ error }}
        </div>
        <div v-else-if="loading" class="flex flex-col gap-2">
            <MiscSkeleton size="medium" :repeat="4" />
        </div>
        <div v-else-if="orders != null" class="overflow-x-auto">
            <table class="table table-compact w-full">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Date</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.id">
                        <th>{{ order.orderNumber }}</th>
                        <!-- TODO: replace with date format from session -->
                        <th>{{ new Date(order.orderDate).toLocaleDateString('en-US') }}</th>
                        <td>{{ formatPrice(order.totals.bruttoPrice) }}</td>
                        <td>{{ order.status }}</td>
                        <th class="text-right">
                            <NuxtLink :to="`/customer/orders/${order.id}`" class="btn btn-ghost btn-xs">
                                details
                            </NuxtLink>
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            No orders placed yet
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, Ref } from 'vue'
import { Order, useCurrency } from '@hubblecommerce/hubble/commons'
import { useCustomer } from '#imports'

/*
 * Fetch Orders
 */
const loading: Ref<boolean> = ref(true)
const orders: Ref<null | Order[]> = ref(null)
const { getOrders, error } = useCustomer()
onMounted(async () => {
    await nextTick(async () => {
        try {
            orders.value = await getOrders() as Order[]
        } catch (e) {} finally {
            loading.value = false
        }
    })
})

const { formatPrice } = useCurrency()
</script>
