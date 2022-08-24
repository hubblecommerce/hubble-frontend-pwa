<template>
    <main v-if="page != null" class="dynamic-page">
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
import { computed, resolveComponent, provide } from 'vue'
import { showError, useRoute, useAsyncData } from '#app'
import { usePage } from '#imports'
import { detailData } from '@hubblecommerce/hubble/commons'

const route = useRoute()
const { page, getPage } = usePage()

const { data, error } = await useAsyncData(() => getPage(route.path), { initialCache: false })
page.value = data.value

if (error.value) {
    showError(error.value as Error)
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

if (page.value?.type === 'detail' && page.value?.detail !== undefined) {
    provide(detailData, page.value.detail)
}
</script>
