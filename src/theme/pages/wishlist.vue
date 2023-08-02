<template>
    <div class="container m-auto p-6 lg:py-16 lg:max-w-5xl">
        <div class="text-2xl mb-6">
            Wishlist
        </div>

        <Transition name="fade" mode="out-in">
            <div v-if="loading" class="grid grid-cols-12 gap-6">
                <div class="col-span-12 lg:col-span-8">
                    <MiscSkeleton text size="medium" :repeat="6" />
                </div>
            </div>
            <div v-else-if="!loading && !error" class="grid grid-cols-12 gap-6">
                <div class="col-span-12 lg:col-span-8">
                    <WishlistProductList />
                </div>
            </div>
            <div v-else-if="error && !loading">
                {{ error }}
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNuxtApp } from '#app'
import { useWishlist } from '#imports'

const wishlistStore = useWishlist()
const { wishlist, loading, error } = storeToRefs(wishlistStore)
const { getWishlist } = wishlistStore
const { $hblBus } = useNuxtApp()

loading.value = true

onMounted(async () => {
    await getWishlist()
    $hblBus.$emit('viewWishlist', { wishlist: wishlist.value })
})
</script>
