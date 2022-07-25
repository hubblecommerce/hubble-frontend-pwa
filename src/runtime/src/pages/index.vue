<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                Runtime config loaded: {{ config.meta.category.title }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRuntimeConfig } from '#imports'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const config = useRuntimeConfig().public
</script>

<style scoped>

</style>
