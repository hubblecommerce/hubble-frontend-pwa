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
            <div class="input-group">
                <input
                    ref="searchInput"
                    v-model="term"
                    type="text"
                    placeholder="Browse our offer"
                    class="input input-bordered w-full focus:input-primary"
                >
                <button class="btn btn-square" :class="{'loading': loading}">
                    <MagnifyingGlassIcon v-if="!loading" class="h-5 w-5" />
                </button>
            </div>
        </form>
        <div v-if="searchResult?.total > 0">
            <LazyProductListing
                :data="searchResult"
                :total="true"
                :pagination="false"
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
        searchResult.value = await search(term.value)
    }
}
</script>
