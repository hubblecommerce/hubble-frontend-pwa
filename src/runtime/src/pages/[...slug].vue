<template>
    <div v-if="page != null">
        <div>ID: {{ page.id }}</div>
        <div>Type: {{ page.type }}</div>
    </div>
</template>

<script setup lang="ts">
import { throwError, clearError, useRoute } from '#app'
import { usePage } from '#imports'

const route = useRoute()

const { page, getPage } = usePage()

try {
    await getPage(route.path)
} catch (e) {
    throwError(e)
}
</script>

<style scoped>

</style>
