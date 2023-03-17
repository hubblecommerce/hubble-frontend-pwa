<template>
    <a v-if="manufacturer.media" :href="manufacturer.link" target="_blank" rel="noopener">
        <img :src="manufacturer.media.url" :alt="manufacturer.name" class="ml-auto" :style="`width: ${logoWidth}px; height: auto;`">
    </a>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, Ref } from 'vue'
import { useNuxtApp } from '#app'
import { HblManufacturer } from '@/utils/types'

interface ProductDetailManufacturerProps {
    manufacturerData: HblManufacturer,
    logoWidth?: number
}

const props = withDefaults(defineProps<ProductDetailManufacturerProps>(), {
    logoWidth: 80
})

const manufacturer: Ref<HblManufacturer> = ref(props.manufacturerData)

const { $hblBus } = useNuxtApp()
$hblBus.$on('productVariantChanged', eventListenerManufacturer)

function eventListenerManufacturer ({ data }) {
    // Override manufacturer data
    const { manufacturer: manufacturerData } = data
    manufacturer.value = manufacturerData
}

onBeforeUnmount(() => {
    $hblBus.$off('productVariantChanged', eventListenerManufacturer)
})
</script>
