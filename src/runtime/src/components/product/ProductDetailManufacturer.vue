<template>
    <a v-if="manufacturer.media" :href="manufacturer.link" target="_blank" rel="noopener">
        <img :src="manufacturer.media.url" :alt="manufacturer.name" class="ml-auto" :style="`width: ${logoWidth}px; height: auto;`">
    </a>
</template>

<script setup lang="ts">
import { Manufacturer } from '@hubblecommerce/hubble/commons'

export interface ProductDetailManufacturerProps {
    manufacturer: Manufacturer,
    logoWidth?: number
}

withDefaults(defineProps<ProductDetailManufacturerProps>(), {
    logoWidth: 80
})
</script>
