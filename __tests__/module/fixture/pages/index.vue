<template>
    <div>
        <Head>
            <Title>Module fixture</Title>
        </Head>
        <div>Load composable from appropriate platform: {{ apiUrl }}</div>
        <div>Load overridden composable from project root: {{ cart }}</div>
        <div>RuntimeConfig | meta.category.title: {{ config.meta.category.title }}</div>
        <MiscModuleTestComponent />
        <ProductDetail />
    </div>
</template>

<script setup>
import { useCart, usePlatform } from '#imports'

const { apiUrl } = usePlatform()
const { cart } = useCart()
const config = useRuntimeConfig().public
</script>
