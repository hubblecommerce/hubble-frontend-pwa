<template>
    <div>
        <Head>
            <Title>Module fixture</Title>
        </Head>
        <div>Composable | foo: {{ foo }}</div>
        <div>RuntimeConfig | meta.category.title: {{ config.meta.category.title }}</div>
        <TestComponent />
    </div>
</template>

<script setup>
import { useFoo } from '@/composables/useFoo'
const foo = useFoo()

const config = useRuntimeConfig()
</script>
