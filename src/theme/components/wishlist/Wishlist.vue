<template>
    <Transition name="fade" mode="out-in">
        <div v-if="loading" class="flex flex-col gap-4">
            <MiscSkeleton color="bg-base-100" text size="small" :repeat="6" />
        </div>
        <div v-else-if="!loading && !error" class="flex flex-col gap-6">
            <div class="lg:overflow-y-auto lg:max-h-full'">
                <WishlistProductList />
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
import { useNuxtApp } from '#app'
import { useWishlist } from '#imports'

const wishlistStore = useWishlist()
const { wishlist, loading, error } = storeToRefs(wishlistStore)
const { getWishlist } = wishlistStore

// Set loading state to prevent flash old wishlist state before onMounted hook is finished
loading.value = true

onMounted(async () => {
    await getWishlist()
})

const { $hblBus } = useNuxtApp()
onMounted(() => {
    $hblBus.$emit('viewWishlist', { wishlist: wishlist.value })
})
</script>
