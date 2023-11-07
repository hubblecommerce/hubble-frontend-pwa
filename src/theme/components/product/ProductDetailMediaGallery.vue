<template>
    <template v-if="!Array.isArray(media)">
        <div class="carousel carousel-center max-w-md p-4 space-x-4 bg-neutral rounded-box">
            <div class="carousel-item">
                <img :src="media.url" :alt="media.alt">
            </div>
        </div>
    </template>

    <template v-if="Array.isArray(media)">
        <div class="carousel carousel-center rounded-box bg-neutral">
            <div v-for="(medium, index) in media" :key="index" class="carousel-item w-full bg-neutral">
                <img :src="medium.url" :alt="medium.alt" class="m-auto">
            </div>
        </div>
    </template>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, Ref } from 'vue'
import { useNuxtApp } from '#imports'
import { HblMedia } from '@/utils/types'
import placeholderImage from '@/assets/product/placeholder-image.png'

interface ProductDetailMediaGalleryProps {
    mediaData?: HblMedia[] | HblMedia
}

const props = withDefaults(defineProps<ProductDetailMediaGalleryProps>(), {
    mediaData: () => {
        return {
            alt: 'Placeholder Image',
            title: 'Placeholder Image',
            url: placeholderImage,
            thumbnails: []
        }
    }
})

const media: Ref<HblMedia[] | HblMedia> = ref(props.mediaData)

const { $hblBus } = useNuxtApp()
$hblBus.$on('productVariantChanged', eventListenerMediaGallery)

function eventListenerMediaGallery ({ data }) {
    // Override media data
    const { media: mediaData } = data
    media.value = mediaData
}

onBeforeUnmount(() => {
    $hblBus.$off('productVariantChanged', eventListenerMediaGallery)
})
</script>
