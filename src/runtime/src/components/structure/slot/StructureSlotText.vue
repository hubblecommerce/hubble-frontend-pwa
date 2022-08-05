<template>
    <div v-if="content.data?.content != null" v-html="content.data.content" />
</template>

<script setup lang="ts">
import { Slot } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    content: Slot
}>()
</script>
