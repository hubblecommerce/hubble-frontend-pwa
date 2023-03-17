<template>
    <div class="form-control">
        <label for="sorter" class="label sr-only">
            <span class="label-text">Sort by</span>
        </label>
        <div class="input-group input-group-sm">
            <span>Sort by</span>
            <select id="sorter" v-model="selectedSorting" class="select select-sm" @change="setSorting(selectedSorting)">
                <option
                    v-for="item in availableSorting"
                    :key="item.id"
                    :value="item.id"
                    v-text="item.name"
                />
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showError } from '#app'
import { HblProductListing, HblProductListingFilterCurrent } from '@/utils/types'
import { usePage } from '#imports'

const props = defineProps<{
    limit: number
    sorting: string,
    currentFilters: HblProductListingFilterCurrent,
    availableSorting: string[]
}>()

const selectedSorting = ref(props.sorting)
const { getProductListing, updateUri } = usePage()
const emit = defineEmits<{(event: 'update:listing', data: HblProductListing): void}>()

async function setSorting (sorting: string): Promise<void> {
    try {
        const { productListing, params } = await getProductListing(props.currentFilters, props.limit, sorting)
        emit('update:listing', productListing)
        updateUri(params)
    } catch (e) {
        showError(e)
    }
}
</script>
