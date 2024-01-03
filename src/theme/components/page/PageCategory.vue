<template>
    <div />
</template>

<script setup lang="ts">
import { useHead } from '#app'
import { type HblCategory } from '@/utils/types'

const props = defineProps<{
    data: HblCategory
}>()

useHead({
    title: props.data.metaTitle ? props.data.metaTitle : props.data.name,
    meta: [
        { name: 'description', content: props.data.metaDescription }
    ]
})
</script>
