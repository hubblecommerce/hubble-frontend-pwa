<template>
    Detail Page
</template>

<script setup lang="ts">
import { useHead } from '#app'
import { Product } from '../../../commons'

const props = defineProps<{
    data: Product
}>()

useHead({
    title: props.data.metaTitle ? props.data.metaTitle : props.data.name,
    meta: [
        { name: 'description', content: props.data.metaDescription }
    ]
})
</script>
