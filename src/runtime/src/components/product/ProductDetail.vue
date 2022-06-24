<template>
    <div>
        Product Detail Component auto imported by nuxt

        session: {{ sessionToken }}
    </div>
</template>

<script setup>
import { usePlatform } from '#imports'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { sessionToken } = usePlatform()
</script>

<style scoped>

</style>
