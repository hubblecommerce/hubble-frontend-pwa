<template>
    <div class="search-page container m-auto p-6 flex flex-col gap-4">
        <div class="flex flex-col lg:flex-row gap-2 justify-center items-center">
            <label for="search" class="text-2xl">Search for:</label>
            <form class="form-control" @submit.prevent="submitSearch()">
                <div class="input-group">
                    <input id="search" v-model="term" type="text" class="input input-bordered lg:input-lg">
                    <button class="btn lg:btn-lg" :class="{'loading': loading}">
                        <MagnifyingGlassIcon v-if="!loading" class="h-5 lg:h-6 h-5 lg:w-6" />
                    </button>
                </div>
            </form>
        </div>

        <template v-if="searchResult?.total > 0">
            <portal-target name="productListingFilter" />
            <ProductListing :key="resultKey" :data="searchResult" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue'
import { showError, useRouter } from '#app'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { usePage, useSearch } from '#imports'

const { currentRoute } = useRouter()
const { updateUri, loading, error, parseParamsFromQuery } = usePage()
const { search } = useSearch()

const term: Ref<string> = ref(currentRoute.value.query.search as string)
const searchResult = ref(null)
const resultKey = ref(0)

onMounted(async () => {
    if (term.value != null) {
        const paramsFromQuery = parseParamsFromQuery(currentRoute.value)
        const { productListing } = await search(term.value, paramsFromQuery)
        searchResult.value = productListing
    }
})

const submitSearch = async function () {
    try {
        const { productListing } = await search(term.value)
        searchResult.value = productListing
        resultKey.value++
        updateUri({ term: term.value })
    } catch (e) {
        showError(e)
    }
}
</script>