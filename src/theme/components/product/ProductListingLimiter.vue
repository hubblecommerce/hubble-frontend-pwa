<template>
    <div class="form-control">
        <label for="limiter" class="label sr-only">
            <span class="label-text">Show items per page</span>
        </label>
        <div class="input-group input-group-sm">
            <span>Show</span>
            <select id="limiter" v-model="selectedLimit" class="select select-sm" @change="setLimit(selectedLimit)">
                <option v-for="availableLimit in availableLimits" :key="availableLimit" :value="availableLimit" v-text="availableLimit" />
            </select>
            <span>from {{ total }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showError } from '#app'
import { HblProductListing, HblProductListingFilterCurrent } from '@/utils/types'
import { usePage } from '#imports'

const props = defineProps<{
    limit: number,
    sorting: string,
    total: number,
    currentFilters: HblProductListingFilterCurrent
}>()

const availableLimits = ref([1, 12, 24, 48, 96]) // Default = 24, values have to match layout of 1, 3 and 4 products per row
const selectedLimit = ref(props.limit)
const { getProductListing, updateUri } = usePage()
const emit = defineEmits<{(event: 'update:listing', data: HblProductListing): void}>()

async function setLimit (limit: number): Promise<void> {
    try {
        const { productListing, params } = await getProductListing(props.currentFilters, limit, props.sorting)
        emit('update:listing', productListing)
        updateUri(params)
    } catch (e) {
        showError(e)
    }
}
</script>
