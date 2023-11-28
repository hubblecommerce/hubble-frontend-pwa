<template>
    <main class="dynamic-page">
        <client-only>
            <div class="sr-only">
                hydration: true
            </div>
        </client-only>
        <StructureSection
            v-for="(section, index) in page?.structure"
            :key="section.id"
            :count="index"
            :content="section"
        />
    </main>
</template>

<script setup lang="ts">
import { showError, useRoute, useAsyncData, useHead } from '#app'
import { usePage } from '#imports'

/*
 * Page request and error handling
 */
const route = useRoute()

const { page, getPage } = usePage()

const { data, error } = await useAsyncData(() => getPage(route))

page.value = data.value

if (error.value) {
    showError(error.value as Error)
}

useHead({
    title: page?.value?.category?.metaTitle ? page?.value?.category?.metaTitle : page?.value?.category?.name,
    meta: [
        { name: 'description', content: page?.value?.category?.metaDescription }
    ]
})

</script>
