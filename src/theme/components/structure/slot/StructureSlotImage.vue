<template>
    <img v-if="content.media != null" class="structure-slot-image w-full object-cover" :src="content.media.url" :alt="content.media.alt">
</template>

<script setup lang="ts">
import { Slot } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    content: Slot
}>()
</script>

<style lang="scss" scoped>
.structure-slot-image {
    min-height: 200px;
    max-height: 350px
}
</style>
