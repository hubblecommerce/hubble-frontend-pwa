<template>
    <div class="default-layout">
        <LayoutHeader />
        <slot />
        <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'

const nuxtApp = useNuxtApp()

nuxtApp.hook('page:finish', () => {
    window.scrollTo(0, 0)
})
</script>

<style scoped>

</style>
