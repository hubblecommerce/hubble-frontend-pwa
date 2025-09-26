<template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="content.data?.content != null" v-html="content.data.content" />
</template>

<script setup lang="ts">
import { type HblSlot } from '../../../types'

const props = defineProps<{
    content: HblSlot
}>()
</script>
