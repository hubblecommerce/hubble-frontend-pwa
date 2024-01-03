<template>
    <div />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead, useNuxtApp } from '#app'
import { type HblProduct } from '@/utils/types'

const props = defineProps<{
    data: HblProduct
}>()

useHead({
    title: props.data.metaTitle ? props.data.metaTitle : props.data.name,
    meta: [
        { name: 'description', content: props.data.metaDescription }
    ]
})

const { $hblBus } = useNuxtApp()
onMounted(() => {
    $hblBus.$emit('viewProductDetail', { product: props.data })
})
</script>
