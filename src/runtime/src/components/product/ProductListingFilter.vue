<template>
    <div class="w-full flex flex-wrap gap-2">
        <template v-for="availableFilter in availableFilters">
            <div v-if="availableFilter.type === 'multi'" :key="availableFilter.id" class="dropdown">
                <label tabindex="0" class="btn btn-sm">{{ availableFilter.name }}</label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li v-for="option in availableFilter.options" :key="option.id" class="form-control">
                        <label :for="option.id" class="label cursor-pointer justify-start">
                            <input
                                :id="option.id"
                                v-model="selectedFilters[availableFilter.id]"
                                :value="option.id"
                                type="checkbox"
                                class="checkbox checkbox-sm"
                                @change="applyFilter()"
                            >
                            <span class="label-text">{{ option.name }}</span>
                        </label>
                    </li>
                </ul>
            </div>

            <div v-if="availableFilter.type === 'range'" :key="availableFilter.id" class="dropdown">
                <label tabindex="0" class="btn btn-sm">{{ availableFilter.name }}</label>
                <ul tabindex="0" class="dropdown-content p-2 shadow bg-base-100 rounded-box w-52">
                    <li class="form-control">
                        <label :for="availableFilter.id" class="label">
                            <span class="label-text">{{ Math.round(selectedFilters[availableFilter.id].max) }}</span>
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
                            <span class="label-text-alt">{{ Math.round(availableFilter.min) }}</span>
                            <span class="label-text-alt">{{ Math.round(availableFilter.max) }}</span>
                        </label>
                    </li>
                </ul>
            </div>

            <div v-if="availableFilter.type === 'boolean'" :key="availableFilter.id" class="form-control btn btn-sm">
                <label :for="availableFilter.id" class="label cursor-pointer">
                    <input
                        :id="availableFilter.id"
                        v-model="selectedFilters[availableFilter.id]"
                        type="checkbox"
                        class="toggle toggle-sm mr-2"
                        @change="applyFilter()"
                    >
                    <span class="label-text">{{ availableFilter.name }}</span>
                </label>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showError, useRouter } from '#app'
import { ProductListing, ProductListingFilter, ProductListingFilterCurrent } from '@hubblecommerce/hubble/commons'
import { usePage, useRuntimeConfig } from '#imports'

const props = defineProps<{
    availableFilters: ProductListingFilter[]
    currentFilters: ProductListingFilterCurrent,
    limit: number,
    sorting: string
}>()

const emit = defineEmits<{(event: 'update:listing', data: ProductListing): void}>()
const selectedFilters = ref(Object.assign(props.currentFilters, {}))
const { getProductListing } = usePage()
const { currentRoute } = useRouter()
const runtimeConfig = useRuntimeConfig()

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

            // Write parameters to current url without reloading the page
            const url = new URL(runtimeConfig.public.appBaseUrl + currentRoute.value.path)
            url.search = new URLSearchParams(params).toString()
            window.history.pushState(
                {},
                null,
                url.href
            )
        } catch (e) {
            showError(e)
        }
    }
}
</script>
