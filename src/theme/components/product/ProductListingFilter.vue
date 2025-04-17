<template>
    <div class="w-full flex flex-wrap gap-2">
        <template v-for="availableFilter in availableFilters">
            <div v-if="availableFilter.type === 'multi'" :key="availableFilter.id" class="dropdown">
                <div class="indicator">
                    <span
                        v-if="selectedFilters[availableFilter.id].length > 0"
                        class="indicator-item badge badge-secondary"
                    >{{ selectedFilters[availableFilter.id].length }}</span>
                    <label tabindex="0" class="btn btn-sm">{{ availableFilter.name }}</label>
                </div>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                    <li v-for="option in availableFilter.options" :key="option.id">
                        <fieldset class="fieldset">
                            <input
                                :id="option.id"
                                v-model="selectedFilters[availableFilter.id]"
                                :value="option.id"
                                type="checkbox"
                                class="checkbox checkbox-sm"
                                @change="applyFilter()"
                            >
                            <label :for="option.id" class="label cursor-pointer justify-start">{{ option.name }}</label>
                        </fieldset>

                    </li>
                </ul>
            </div>

            <div
                v-if="availableFilter.type === 'range' && Math.round(availableFilter.min) !== Math.round(availableFilter.max)"
                :key="availableFilter.id"
                class="dropdown"
            >
                <div class="indicator">
                    <span
                        v-if="selectedFilters[availableFilter.id].max > 0"
                        class="indicator-item badge badge-secondary"
                        v-text="`< ${selectedFilters[availableFilter.id].max}`"
                    />
                    <label tabindex="0" class="btn btn-sm">{{ availableFilter.name }}</label>
                </div>
                <ul tabindex="0" class="dropdown-content p-2 shadow bg-base-100 rounded-box w-52 z-10">
                    <li>
                        <fieldset class="fieldset">
                            <label :for="availableFilter.id" class="label">
                                {{ Math.round(selectedFilters[availableFilter.id].max) }}
                            </label>
                            <input
                                :id="availableFilter.id"
                                v-model="selectedFilters[availableFilter.id].max"
                                type="range"
                                :min="Math.round(availableFilter.min)"
                                :max="Math.round(availableFilter.max)"
                                class="range"
                                step="1"
                                @change="applyFilter(1000)"
                            >
                            <label :for="availableFilter.id" class="label">
                                <span>{{ Math.round(availableFilter.min) }}</span>
                                <span>{{ Math.round(availableFilter.max) }}</span>
                            </label>
                        </fieldset>

                    </li>
                </ul>
            </div>

            <fieldset v-if="availableFilter.type === 'boolean'" :key="availableFilter.id" class="fieldset btn btn-sm">
                <label :for="availableFilter.id" class="label cursor-pointer">
                    <input
                        :id="availableFilter.id"
                        v-model="selectedFilters[availableFilter.id]"
                        type="checkbox"
                        :class="{ 'toggle-secondary': selectedFilters[availableFilter.id] }"
                        class="toggle toggle-sm mr-2"
                        @change="applyFilter()"
                    >
                    <span>{{ availableFilter.name }}</span>
                </label>
            </fieldset>
        </template>

        <button v-if="filterIsset > 0" class="btn btn-sm btn-secondary" @click="resetAllFilter()">
            Reset all filter
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showError, useRouter, usePage } from '#imports'
import { type HblProductListing, type HblProductListingFilter, type HblProductListingFilterCurrent } from '@/utils/types'

const props = defineProps<{
    availableFilters: HblProductListingFilter[]
    currentFilters: HblProductListingFilterCurrent,
    limit: number,
    sorting: string
}>()

const emit = defineEmits<{(event: 'update:listing', data: HblProductListing): void}>()
const selectedFilters = ref(Object.assign(props.currentFilters, {}))
const { getProductListing, updateUri } = usePage()
const { currentRoute } = useRouter()

async function applyFilter (delay?: number) {
    if (delay) {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
        this.timer = setTimeout(() => {
            applyFilter()
        }, delay)
    } else {
        try {
            const { productListing, params } = await getProductListing(selectedFilters.value, props.limit, props.sorting)
            emit('update:listing', productListing)
            updateUri(params)
        } catch (e) {
            showError(e)
        }
    }
}

const filterIsset = computed(() => {
    let filterCount = 0

    Object.keys(selectedFilters.value).forEach((key) => {
        if (Array.isArray(selectedFilters.value[key])) {
            // @ts-ignore
            if (selectedFilters.value[key].length > 0) {
                filterCount++
            }
        }

        // @ts-ignore
        if (selectedFilters.value[key].min != null && selectedFilters.value[key].min !== '') {
            filterCount++
        }

        // @ts-ignore
        if (selectedFilters.value[key].max != null && selectedFilters.value[key].max !== '') {
            filterCount++
        }

        if (selectedFilters.value[key] === true) {
            filterCount++
        }
    })

    return filterCount
})

async function resetAllFilter (): Promise<void> {
    Object.keys(selectedFilters.value).forEach((key) => {
        if (Array.isArray(selectedFilters.value[key])) {
            selectedFilters.value[key] = []
        }

        // @ts-ignore
        if (selectedFilters.value[key].min != null) {
            // @ts-ignore
            selectedFilters.value[key].min = ''
        }

        // @ts-ignore
        if (selectedFilters.value[key].max != null) {
            // @ts-ignore
            selectedFilters.value[key].max = ''
        }

        if (selectedFilters.value[key] === true) {
            selectedFilters.value[key] = false
        }
    })

    await applyFilter()
}
</script>
