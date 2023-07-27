<template>
    <div class="grid grid-cols-12 gap-6 lg:gap-12">
        <div v-if="order.shippingAddress" class="col-span-12 md:col-span-6 flex flex-col gap-2">
            <div class="text-2xl">
                Shipping Address
            </div>
            <div>
                <CustomerAddressRenderer :address="order.shippingAddress" />
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
            <div class="text-2xl">
                Billing Address
            </div>
            <div>
                <CustomerAddressRenderer :address="order.billingAddress" />
            </div>
        </div>
        <div v-if="order.shippingMethod" class="col-span-12 md:col-span-6 flex flex-col gap-2">
            <div class="text-2xl">
                Shipping Method
            </div>
            <div>
                <div>{{ order.shippingMethod.name }} - {{ formatPrice(order.shippingMethod.price) }}</div>
                <div>Delivery Time: {{ order.shippingMethod.deliveryTime }}</div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
            <div class="text-2xl">
                Payment Method
            </div>
            <div>
                <div>{{ order.paymentMethod.name }}</div>
                <div>{{ order.paymentMethod.description }}</div>
            </div>
        </div>
        <div class="col-span-12">
            <div
                v-for="item in order.lineItems"
                :key="item.id"
                class="flex pb-4 mb-4 border border-base-content border-l-0 border-r-0 border-t-0"
            >
                <div class="avatar indicator mr-4">
                    <span class="indicator-item indicator-bottom badge badge-secondary">{{ item.quantity }}</span>
                    <div class="w-20">
                        <img v-if="item?.media?.url" :src="item.media.url" :alt="item.name">
                        <img v-else src="~/assets/product/placeholder-image.png" class="d-block h-auto" :alt="item.name">
                    </div>
                </div>

                <div class="flex flex-col justify-between w-full px-2">
                    <div class="w-full flex justify-between gap-2">
                        <div class="w-full">
                            {{ item.name }}
                        </div>
                    </div>
                    <div class="self-end w-full text-right text-sm">
                        <div v-if="item.price">
                            {{ formatPrice(item.price) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-4 md:col-start-9">
            <table class="table table-compact table-zebra w-full">
                <tbody>
                    <tr>
                        <td>Subtotal</td>
                        <td class="text-right">
                            {{ formatPrice(order.totals.subTotal) }}
                        </td>
                    </tr>
                    <tr v-if="order.shippingMethod">
                        <td>Shipping</td>
                        <td class="text-right">
                            {{ formatPrice(order.shippingMethod.price) }}
                        </td>
                    </tr>
                    <tr>
                        <td>Total (netto)</td>
                        <td class="text-right">
                            {{ formatPrice(order.totals.nettoPrice) }}
                        </td>
                    </tr>
                    <tr>
                        <td>Tax {{ order.totals.taxRate }}%</td>
                        <td class="text-right">
                            {{ formatPrice(order.totals.tax) }}
                        </td>
                    </tr>
                    <tr>
                        <td>Total (brutto)</td>
                        <td class="text-right">
                            {{ formatPrice(order.totals.bruttoPrice) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCurrency } from '#imports'
import { HblOrder } from '@/utils/types'

const props = defineProps<{
    order: HblOrder
}>()

const { formatPrice } = useCurrency()
</script>
