<template>
    <a :href="manufacturer.link" target="_blank" rel="noopener">
        <img :src="manufacturer.media.url" :alt="manufacturer.name" class="ml-auto" style="width: 80px; height: auto;">
    </a>
</template>

<script setup lang="ts">
import { Manufacturer } from '@hubblecommerce/hubble/commons'

defineProps<{
    manufacturer: Manufacturer
}>()
</script>
