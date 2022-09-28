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
import { computed, resolveComponent, provide, onBeforeUnmount, onMounted } from 'vue'
import { showError, useRoute, useAsyncData } from '#app'
import { useLocalisation, usePage } from '#imports'
import { detailData } from '@hubblecommerce/hubble/commons'

/*
 * Page request and error handling
 */
const route = useRoute()
const { page, getPage } = usePage()

const { data, error } = await useAsyncData(() => getPage(route), { initialCache: false })
page.value = data.value

if (error.value) {
    showError(error.value as Error)
}

/*
 * Page components and data used for SEO / Head
 */
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

/*
 * Provide detail data to inject in detail structure (has no data)
 */
if (page.value?.type === 'detail' && page.value?.detail !== undefined) {
    provide(detailData, page.value.detail)
}

/*
 * i18n
 */
const { entityPathInfo } = useLocalisation()

onMounted(() => {
    if (page.value?.type === 'category' && page.value.category !== undefined) {
        entityPathInfo.value = page.value.category.pathInfo
    }

    if (page.value?.type === 'detail' && page.value?.detail !== undefined) {
        entityPathInfo.value = page.value.detail.pathInfo
    }
})

onBeforeUnmount(() => {
    entityPathInfo.value = null
})
</script>
