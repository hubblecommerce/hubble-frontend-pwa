<template>
    Category Page
</template>

<script setup lang="ts">
import { Category } from '../../../commons'

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
