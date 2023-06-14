<template>
    <div v-if="content.data?.content != null" v-html="content.data.content" />
</template>

<script setup lang="ts">
import { HblSlot } from '@/utils/types'

const props = defineProps<{
    content: HblSlot
}>()
</script>
