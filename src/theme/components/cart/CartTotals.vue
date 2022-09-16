<template>
    <template v-if="cart?.lineItems.length > 0">
        <table class="table table-compact table-zebra w-full">
            <tbody>
                <tr>
                    <td>Subtotal</td>
                    <td class="text-right">
                        {{ formatPrice(cart.price?.subTotal) }}
                    </td>
                </tr>
                <tr>
                    <td>Shipping</td>
                    <td class="text-right">
                        {{ formatPrice(cart.shippingCosts) }}
                    </td>
                </tr>
                <tr>
                    <td>Total (netto)</td>
                    <td class="text-right">
                        {{ formatPrice(cart.price?.nettoPrice) }}
                    </td>
                </tr>
                <tr>
                    <td>Tax {{ cart.price.taxRate }}%</td>
                    <td class="text-right">
                        {{ formatPrice(cart.price?.tax) }}
                    </td>
                </tr>
                <tr>
                    <td>Total (brutto)</td>
                    <td class="text-right">
                        {{ formatPrice(cart.price?.bruttoPrice) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </template>
</template>

<script setup lang="ts">
import { useCart } from '#imports'
import { useCurrency } from '@hubblecommerce/hubble/commons'

const { cart, loading, error, deleteCart } = useCart()
const { formatPrice } = useCurrency()
</script>
