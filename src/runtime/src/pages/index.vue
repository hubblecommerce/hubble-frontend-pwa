<template>
    <div>
        Hello
        {{ config.meta.category.title }}
        <TestComponent />
        <ProductDetail />
    </div>
</template>

<script setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const config = useRuntimeConfig().public
</script>

<style scoped>

</style>
