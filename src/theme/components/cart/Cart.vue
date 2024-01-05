<template>
    <Transition name="fade" mode="out-in">
        <div v-if="loading" class="flex flex-col gap-4">
            <MiscSkeleton color="bg-base-100" size="large" :repeat="2" />
            <MiscSkeleton color="bg-base-100" text size="small" :repeat="6" />
            <MiscSkeleton color="bg-base-100" size="large" :repeat="3" />
        </div>
        <div v-else-if="!loading && !error" class="flex flex-col gap-6">
            <div class="lg:overflow-y-auto" :class="showFullCartList ? 'lg:max-h-full' : 'lg:max-h-96'">
                <CartList :is-interactive="isInteractive" />
            </div>

            <div v-if="cart?.lineItems.length > cartDisplayLimit" class="hidden lg:block text-center -mt-1" @click="toggleCartList()">
                <div class="inline-block cursor-pointer">
                    <template v-if="!showFullCartList">
                        <span class="underline font-medium mr-2">{{ t('cart.list.show') }}</span> <span><ArrowDownIcon class="w-5 h-5 inline" /></span>
                    </template>
                    <template v-else>
                        <span class="underline font-medium mr-2">{{ t('cart.list.hide') }}</span> <span><ArrowUpIcon class="w-5 h-5 inline" /></span>
                    </template>
                </div>
            </div>

            <div v-if="cart?.lineItems.length > 0 && cart?.price?.bruttoPrice > 0">
                <CartCoupons />
            </div>

            <div v-if="cart?.price?.bruttoPrice > 0">
                <CartTotals />
            </div>

            <div v-if="cart?.lineItems.length > 0 && isInteractive" class="flex flex-col w-full gap-6">
                <MiscLink no-prefetch to="/checkout" class="btn btn-primary">
                    {{ t('cart.actions.checkout') }}
                </MiscLink>

                <MiscLink no-prefetch to="/cart" class="btn btn-outline">
                    {{ t('cart.actions.editCart') }}
                </MiscLink>
            </div>
        </div>
        <div v-else-if="error && !loading">
            {{ error }}
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/24/outline'
import { useCart, useNuxtApp } from '#imports'

const { t } = useI18n()

interface CartProps {
    isInteractive?: boolean
}

const props = withDefaults(defineProps<CartProps>(), {
    isInteractive: true
})

const cartStore = useCart()
const { cart, loading, error } = storeToRefs(cartStore)
const { getCart } = cartStore

// Set loading state to prevent flash old cart state before onMounted hook is finished
loading.value = true

onMounted(async () => {
    await getCart()
})

const cartDisplayLimit = ref(3)
const showFullCartList = ref(cart?.value?.lineItems != null && cart?.value?.lineItems.length <= cartDisplayLimit.value)

function toggleCartList () {
    showFullCartList.value = !showFullCartList.value
}

const { $hblBus } = useNuxtApp()
onMounted(() => {
    $hblBus.$emit('viewCart', { cart: cart.value })
})
</script>

<i18n>
{
    "en": {
        "cart.actions.checkout": "Checkout",
        "cart.actions.offer": "Request shopping cart",
        "cart.totals.title": "Summary",
        "cart.coupons.title": "Coupon",
        "cart.actions.editCart": "Edit Cart",
        "cart.list.show": "Show all",
        "cart.list.hide": "Don't show all"
    },
    "de": {
        "cart.actions.checkout": "Zur Kasse",
        "cart.actions.offer": "Warenkorb anfragen",
        "cart.totals.title": "Zusammenfassung",
        "cart.coupons.title": "Gutschein",
        "cart.actions.editCart": "Warekorb bearbeiten",
        "cart.list.show": "Alle anzeigen",
        "cart.list.hide": "Nicht alle anzeigen"
    }
}
</i18n>
