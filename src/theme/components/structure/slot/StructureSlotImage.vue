<template>
    <img v-if="content.media != null" class="structure-slot-image w-full object-cover" :src="content.media.url" :alt="content.media.alt">
</template>

<script setup lang="ts">
import { HblSlot } from '@/utils/types'

const props = defineProps<{
    content: HblSlot
}>()
</script>

<style lang="postcss" scoped>
.structure-slot-image {
    min-height: 200px;
    max-height: 470px
}
</style>
