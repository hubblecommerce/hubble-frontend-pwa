<template>
    <Transition name="fade" mode="out-in">
        <div v-if="error">
            {{ error }}
        </div>
        <div v-else-if="orders != null" class="space-y-4">
            <div class="flex justify-center">
                <div class="join flex-nowrap">
                    <button :disabled="orderListing.page === 1" class="btn btn-sm join-item" @click="selectPage(1)">
                        <ChevronDoubleLeftIcon class="h-5 w-5" />
                    </button>
                    <button :disabled="orderListing.page - 1 < 1" class="btn btn-sm join-item" @click="selectPage(orderListing.page - 1)">
                        <ChevronLeftIcon class="h-5 w-5" />
                    </button>
                    <button class="btn btn-sm btn-ghost normal-case no-animation join-item" v-text="`Page ${orderListing.page} of ${maxPage}`" />
                    <button class="btn btn-sm join-item" :disabled="orderListing.page + 1 > maxPage" @click="selectPage(orderListing.page + 1)">
                        <ChevronRightIcon class="h-5 w-5" />
                    </button>
                    <button :disabled="orderListing.page + 1 > maxPage" class="btn btn-sm join-item" @click="selectPage(maxPage)">
                        <ChevronDoubleRightIcon class="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div class="overflow-x-auto">
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
        </div>
        <div v-else>
            No orders placed yet
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed, ref, type Ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import {
    ChevronLeftIcon,
    ChevronDoubleLeftIcon,
    ChevronRightIcon,
    ChevronDoubleRightIcon
} from '@heroicons/vue/20/solid'
import { type HblOrder } from '@/utils/types'
import { useCustomer, useCurrency, showError } from '#imports'

/*
 * Fetch Orders
 */
const customerStore = useCustomer()
const { error } = storeToRefs(customerStore)
const { getOrders } = customerStore
let orderListing = reactive(await getOrders())
const orders: Ref<null | HblOrder[]> = ref(orderListing.data as HblOrder[])

const { formatPrice } = useCurrency()

const maxPage = computed(() => {
    return Math.ceil(orderListing.total / orderListing.limit)
})

async function selectPage (page: number): Promise<void> {
    try {
        orderListing = await getOrders({ page })
        orders.value = orderListing.data as HblOrder[]
    } catch (e) {
        // @ts-ignore
        showError(e)
    }
}
</script>
