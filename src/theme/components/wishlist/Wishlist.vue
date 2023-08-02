<template>
    <Transition name="fade" mode="out-in">
        <div v-if="loading" class="flex flex-col gap-4">
            <MiscSkeleton color="bg-base-100" text size="small" :repeat="6" />
        </div>
        <div v-else-if="!loading && !error" class="flex flex-col gap-6">
            <div class="lg:overflow-y-auto" :class="showFullWishlistList ? 'lg:max-h-full' : 'lg:max-h-96'">
                <WishlistProductList />
            </div>
            <div v-if="wishlist?.products?.length > wishlistDisplayLimit" class="hidden lg:block text-center -mt-1" @click="toggleWishlistList()">
                <div class="inline-block cursor-pointer">
                    <template v-if="!showFullWishlistList">
                        <span class="underline font-medium mr-2">{{ t('wishlist.list.show') }}</span> <span><ArrowDownIcon class="w-5 h-5 inline" /></span>
                    </template>
                    <template v-else>
                        <span class="underline font-medium mr-2">{{ t('wishlist.list.hide') }}</span> <span><ArrowUpIcon class="w-5 h-5 inline" /></span>
                    </template>
                </div>
            </div>

            <div v-if="wishlist?.products.length > 0 && isInteractive" class="flex flex-col w-full gap-6">
                <MiscLink no-prefetch to="/wishlist" class="btn btn-outline">
                    {{ t('wishlist.actions.editWishlist') }}
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
import { useNuxtApp } from '#app'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/24/outline'
import { useWishlist } from '#imports'

const { t } = useI18n()

interface WishlistProps {
    isInteractive?: boolean
}

const props = withDefaults(defineProps<WishlistProps>(), {
    isInteractive: true
})

const wishlistStore = useWishlist()
const { wishlist, loading, error } = storeToRefs(wishlistStore)
const { getWishlist } = wishlistStore

// Set loading state to prevent flash old wishlist state before onMounted hook is finished
loading.value = true

onMounted(async () => {
    await getWishlist()
})

const wishlistDisplayLimit = ref(3)
const showFullWishlistList = ref(wishlist?.value?.products != null && wishlist?.value?.products.length <= wishlistDisplayLimit.value)

function toggleWishlistList () {
    showFullWishlistList.value = !showFullWishlistList.value
}

const { $hblBus } = useNuxtApp()
onMounted(() => {
    $hblBus.$emit('viewWishlist', { wishlist: wishlist.value })
})
</script>

<i18n>
{
    "en": {
        "wishlist.actions.checkout": "Checkout",
        "wishlist.actions.offer": "Request shopping wishlist",
        "wishlist.totals.title": "Summary",
        "wishlist.coupons.title": "Coupon",
        "wishlist.actions.editWishlist": "Edit Wishlist",
        "wishlist.list.show": "Show all",
        "wishlist.list.hide": "Don't show all",
        "wishlist.product.articleNumber": "Article no.:",
        "wishlist.empty": "Your wishlist is empty"
    },
    "de": {
        "wishlist.actions.checkout": "Zur Kasse",
        "wishlist.actions.offer": "Warenkorb anfragen",
        "wishlist.totals.title": "Zusammenfassung",
        "wishlist.coupons.title": "Gutschein",
        "wishlist.actions.editWishlist": "Warekorb bearbeiten",
        "wishlist.list.show": "Alle anzeigen",
        "wishlist.list.hide": "Nicht alle anzeigen",
        "wishlist.product.articleNumber": "Artikel-Nr.:",
        "wishlist.empty": "Ihr Warenkorb ist leer"
    }
}
</i18n>
