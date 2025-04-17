<template>
    <div v-if="availableLanguages != null && availableLanguages.length > 0" class="dropdown dropdown-end hidden md:block">
        <label tabindex="0" class="btn btn-ghost btn-circle">
            <div class="indicator">
                <LanguageIcon class="h-5 w-5" fill="none" />
            </div>
        </label>
        <div tabindex="0" class="card card-sm dropdown-content w-52 mt-3 bg-base-100 shadow">
            <div class="card-body">
                <select v-model="selectedLanguage" class="select select-ghost select-primary max-w-xs">
                    <option disabled selected>
                        Language
                    </option>
                    <option v-for="language of availableLanguages" :key="language.id" :value="language.route">
                        {{ language.name }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import { LanguageIcon } from '@heroicons/vue/24/outline'
import { useLocalisation, usePage, usePlatform, useNuxtApp } from '#imports'

const { vueApp } = useNuxtApp()
const { platformLanguages } = usePlatform()
const selectedLanguage = ref(vueApp.config.globalProperties.$i18n.locale)
const { entityPathInfo } = useLocalisation()
const { getPage } = usePage()

const availableLanguages = computed(() => {
    return platformLanguages?.filter((platformLang) => {
        // Intlify transforms platformLanguages.json to platformLanguages.json?import
        // @ts-ignore
        return vueApp.config.globalProperties.$i18n.availableLocales.includes(platformLang.route)
    })
})

watch(selectedLanguage, async (newLang: string) => {
    let route = ''

    vueApp.config.globalProperties.$i18n.locale = newLang

    // Route has a SEO url
    if (entityPathInfo.value != null) {
        try {
            // @ts-ignore
            const response = await getPage({ path: entityPathInfo.value, query: {} })
            const query = new URLSearchParams(window.location.search).toString()

            route += `/${newLang}`

            if (response.type === 'category') {
                route += response?.category?.url
            }

            if (response.type === 'detail') {
                route += response?.detail?.url
            }

            if (query !== '') {
                route += '?' + query
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e)
        }
    } else {
        const currentPath = window.location.pathname.substring(1)
        const routeParts = currentPath?.split('/')

        const match = platformLanguages?.find((lang) => {
            // @ts-ignore
            return lang.route === routeParts[0]
        })

        if (match) {
            // domain.com/en/some/path
            route = window.location.href.replace(routeParts[0], newLang)
        } else if (currentPath !== '') {
            // domain.com/some/path
            route = window.location.href.replace(currentPath, `${newLang}/${currentPath}`)
        } else {
            // domain.com
            route = window.location.href.replace(window.location.origin, `${window.location.origin}/${newLang}`)
        }
    }

    window.location.href = route
})

useHead({
    htmlAttrs: {
        lang: selectedLanguage?.value
    }
})
</script>
