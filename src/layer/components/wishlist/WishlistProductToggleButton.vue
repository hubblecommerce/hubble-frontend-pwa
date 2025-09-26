<template>
    <button class="btn btn-primary btn-circle absolute bottom-2 right-2" @click.prevent="toggleWishlist">
        <client-only>
            <ArrowPathIcon v-if="loading" class="h-5 w-5 animate-spin" />
            <HeartIcon v-else class="h-5 w-5" :class="{'fill-current': isOnWishlist }" />
            <template #fallback>
                <HeartIcon class="h-5 w-5" />
            </template>
        </client-only>
    </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ArrowPathIcon, HeartIcon } from '@heroicons/vue/24/outline'
import { useWishlist, useNuxtApp } from '#imports'
import { type HblProduct } from '../../types'

const props = defineProps<{
    product: HblProduct
}>()

const wishlistStore = useWishlist()
const { miniWishlist, error } = storeToRefs(wishlistStore)
const { addToWishlist, removeFromWishlist } = wishlistStore
const loading = ref(false)

const isOnWishlist = computed(() => {
    return miniWishlist.value?.includes(props.product.id)
})

const { $hblBus } = useNuxtApp()
async function toggleWishlist () {
    loading.value = true
    if (!miniWishlist.value?.includes(props.product.id)) {
        await addToWishlist(props.product.id)

        if (!error.value) {
            $hblBus.$emit('addToWishlist', { product: props.product })
        }
    } else {
        await removeFromWishlist(props.product.id)

        if (!error.value) {
            $hblBus.$emit('removeFromWishlist', { product: props.product })
        }
    }
    loading.value = false
}
</script>
