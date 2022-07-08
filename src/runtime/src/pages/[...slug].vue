<template>
    <main v-if="page != null" class="dynamic-page" style="border: 1px solid red;">
        <div>Page: {{ page.id }} Type: {{ page.type }}</div>

        <StructureSection
            v-for="(section, index) in page.structure"
            :key="section.id"
            :count="index"
            :content="section"
        />
    </main>
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
