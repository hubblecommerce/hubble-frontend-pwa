<template>
    <Transition name="fade" mode="out-in">
        <div v-if="error">
            {{ error }}
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
                        <td>{{ formatPrice(order.totals?.bruttoPrice) }}</td>
                        <td>{{ order.status }}</td>
                        <th class="text-right">
                            <MiscLink :to="`/customer/orders/${order.id}`" class="btn btn-ghost btn-xs">
                                details
                            </MiscLink>
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
import { ref, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Order, useCurrency } from '@hubblecommerce/hubble/commons'
import { useCustomer } from '#imports'

/*
 * Fetch Orders
 */
const customerStore = useCustomer()
const { error } = storeToRefs(customerStore)
const { getOrders } = customerStore
const orders: Ref<null | Order[]> = ref(await getOrders() as Order[])

const { formatPrice } = useCurrency()
</script>
