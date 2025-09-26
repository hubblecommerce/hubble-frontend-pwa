<template>
    <fieldset class="fieldset">
        <label for="sorter" class="label sr-only">Sort by</label>
        <div class="join">
            <span class="btn btn-sm no-animation join-item">Sort by</span>
            <select id="sorter" v-model="selectedSorting" class="select select-ghost select-sm" @change="setSorting(selectedSorting)">
                <option
                    v-for="item in availableSorting"
                    :key="item.id"
                    :value="item.id"
                    v-text="item.name"
                />
            </select>
        </div>
    </fieldset>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showError, usePage } from '#imports'
import { type HblProductListing, type HblProductListingFilterCurrent } from '../../types'

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
