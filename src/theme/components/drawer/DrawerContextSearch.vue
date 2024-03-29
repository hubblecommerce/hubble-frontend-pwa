<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
            <div class="text-2xl">
                Search
            </div>

            <div class="btn btn-ghost btn-circle" @click="closeDrawer">
                <XMarkIcon class="w-5 h-5" />
            </div>
        </div>
        <form class="form-control" @submit.prevent="submitSearch()">
            <div class="join">
                <input
                    ref="searchInput"
                    v-model="term"
                    type="text"
                    placeholder="Browse our offer"
                    class="input input-bordered w-full focus:input-primary join-item"
                >
                <button class="btn btn-square join-item">
                    <span v-if="loading" class="loading" />
                    <MagnifyingGlassIcon v-if="!loading" class="h-5 w-5" />
                </button>
            </div>
        </form>
        <div v-if="searchResult?.total > 0">
            <MiscLink :to="`/search?search=${term}`" class="w-full btn btn-sm btn-secondary mb-4">
                View all results
            </MiscLink>

            <LazyProductListing
                :data="searchResult"
                :total="false"
                :pagination="false"
                :sorting="false"
                grid-classes="grid grid-cols-2 gap-2"
            />
        </div>
        <div v-else-if="searchResult?.total <= 0">
            No search results
        </div>
        <div v-else-if="error">
            {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useDrawer, useSearch } from '#imports'

const { closeDrawer } = useDrawer()
const { search, loading, error } = useSearch()

const searchInput = ref()
const term = ref()
const searchResult = ref(null)

onMounted(() => {
    // Wait for drawer animation
    setTimeout(() => {
        searchInput.value.focus()
    }, 300)
})

watchDebounced(
    term,
    () => {
        submitSearch()
    },
    {
        debounce: 500
    }
)

const submitSearch = async function () {
    if (term.value !== '') {
        const { productListing } = await search(term.value)
        searchResult.value = productListing
    }
}
</script>
