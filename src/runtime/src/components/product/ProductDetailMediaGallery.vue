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
import { Media } from '@hubblecommerce/hubble/commons'
import placeholderImage from '@/assets/product/placeholder-image.png'

export interface ProductDetailMediaGalleryProps {
    media?: Media[] | Media
}

withDefaults(defineProps<ProductDetailMediaGalleryProps>(), {
    media: () => {
        return {
            alt: 'Placeholder Image',
            title: 'Placeholder Image',
            url: placeholderImage,
            thumbnails: []
        }
    }
})
</script>
