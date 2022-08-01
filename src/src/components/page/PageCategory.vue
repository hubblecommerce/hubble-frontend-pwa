<template>
    Category Page
</template>

<script setup lang="ts">
import { useHead } from '#app'
import { Category } from '@hubblecommerce/hubble/dist/commons'

const props = defineProps<{
    data: Category
}>()

useHead({
    title: props.data.metaTitle ? props.data.metaTitle : props.data.name,
    meta: [
        { name: 'description', content: props.data.metaDescription }
    ]
})
</script>
