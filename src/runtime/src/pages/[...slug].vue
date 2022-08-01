<template>
    <main v-if="page != null" class="dynamic-page" style="border: 1px solid red;">
        <div>Page: {{ page.id }} Type: {{ page.type }}</div>

        <component :is="pageComponent" v-if="pageComponent !== null" :data="pageData" />

        <StructureSection
            v-for="(section, index) in page.structure"
            :key="section.id"
            :count="index"
            :content="section"
        />
    </main>
</template>

<script setup lang="ts">
import { computed, resolveComponent } from 'vue'
import { throwError, useRoute } from '#app'
import { usePage } from '#imports'

const route = useRoute()

const { page, getPage } = usePage()

try {
    await getPage(route.path)
} catch (e) {
    throwError(e)
}

const pageComponent = computed(() => {
    if (page.value.type === 'category') {
        return resolveComponent('PageCategory')
    }

    if (page.value.type === 'detail') {
        return resolveComponent('PageDetail')
    }

    if (page.value.type === 'cms') {
        return resolveComponent('PageCms')
    }

    return null
})

const pageData = computed(() => {
    if (page.value.type === 'category') {
        return page.value.category
    }

    if (page.value.type === 'detail') {
        return page.value.detail
    }

    if (page.value.type === 'cms') {
        return page.value.cms
    }

    return null
})
</script>
