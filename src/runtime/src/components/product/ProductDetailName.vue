<template>
    <h1 class="text-4xl mb-2" v-text="name" />
</template>

<script setup lang="ts">
defineProps<{
    name: string
}>()
</script>
