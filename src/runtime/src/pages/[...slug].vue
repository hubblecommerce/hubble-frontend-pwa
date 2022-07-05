<template>
    <div v-if="page != null">
        <div>ID: {{ page.id }}</div>
        <div>Type: {{ page.type }}</div>

        <StructureSection
            v-for="(section, index) in page.structure"
            :key="section.id"
            :count="index"
            :content="section"
        />
    </div>
</template>

<script setup lang="ts">
import { throwError, useRoute } from '#app'
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
