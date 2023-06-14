<template>
    <template v-if="cart?.lineItems.length > 0">
        <div class="w-full p-3 border rounded border-base-300 bg-base-100 text-sm text-gray-500 font-light">
            <div class="flex justify-between items-center pb-3 border-b border-base-300">
                <div>{{ t('cart.cartTotals.total') }}</div>
                <div>
                    {{ formatPrice(cart.price?.subTotal) }}
                </div>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-base-300">
                <div>{{ t('cart.cartTotals.shipping') }}</div>
                <div>{{ formatPrice(cart.shippingCosts) }}</div>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-base-300">
                <div>{{ t('cart.cartTotals.totalCost') }} ({{ t('cart.cartTotals.net') }})</div>
                <div>
                    {{ formatPrice(cart.price?.nettoPrice) }}
                </div>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-base-300">
                <div>{{ t('cart.cartTotals.excl') }} {{ cart.price.taxRate }}% {{ t('cart.cartTotals.tax') }}</div>
                <div>
                    {{ formatPrice(cart.price?.tax) }}
                </div>
            </div>
            <div class="flex justify-between items-center pt-3 text-base font-bold text-base-content">
                <div>{{ t('cart.cartTotals.totalCost') }}</div>
                <div>
                    {{ formatPrice(cart.price?.bruttoPrice) }}
                </div>
            </div>
        </div>
    </template>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useCart, useCurrency } from '#imports'

const cartStore = useCart()
const { cart, loading, error } = storeToRefs(cartStore)
const { formatPrice } = useCurrency()

const { t } = useI18n()
</script>

<i18n>
{
    "en": {
        "cart.cartTotals.total": "Total",
        "cart.cartTotals.shipping": "Shipping",
        "cart.cartTotals.totalCost": "Total Cost",
        "cart.cartTotals.net": "net",
        "cart.cartTotals.gross": "gross",
        "cart.cartTotals.excl": "plus",
        "cart.cartTotals.tax": "tax",
        "cart.cartTotals.forFree": "for free"
    },
    "de": {
        "cart.cartTotals.total": "Summe",
        "cart.cartTotals.shipping": "Versandkosten",
        "cart.cartTotals.totalCost": "Gesamtsumme",
        "cart.cartTotals.net": "netto",
        "cart.cartTotals.gross": "brutto",
        "cart.cartTotals.excl": "zzgl.",
        "cart.cartTotals.tax": "Mwst.",
        "cart.cartTotals.forFree": "kostenlos"
    }
}
</i18n>
