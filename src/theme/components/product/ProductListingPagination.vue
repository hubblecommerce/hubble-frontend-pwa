<template>
    <div class="btn-group flex-nowrap">
        <button :disabled="page === 1" class="btn btn-sm" @click="selectPage(1)">
            <ChevronDoubleLeftIcon class="h-5 w-5" />
        </button>
        <button :disabled="page - 1 < 1" class="btn btn-sm" @click="selectPage(page - 1)">
            <ChevronLeftIcon class="h-5 w-5" />
        </button>
        <button class="btn btn-sm btn-ghost normal-case" v-text="`Page ${page} of ${maxPage}`" />
        <button class="btn btn-sm" :disabled="page + 1 > maxPage" @click="selectPage(page + 1)">
            <ChevronRightIcon class="h-5 w-5" />
        </button>
        <button :disabled="page + 1 > maxPage" class="btn btn-sm" @click="selectPage(maxPage)">
            <ChevronDoubleRightIcon class="h-5 w-5" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    ChevronLeftIcon,
    ChevronDoubleLeftIcon,
    ChevronRightIcon,
    ChevronDoubleRightIcon
} from '@heroicons/vue/20/solid'
import { showError } from '#app'
import { usePage } from '#imports'
import { HblProductListing, HblProductListingFilterCurrent } from '@/utils/types'

interface ProductListingPaginationProps {
    page: number,
    limit: number,
    sorting: string,
    total: number,
    currentFilters: HblProductListingFilterCurrent,
    scrollTopOnChange?: boolean,
}

const props = withDefaults(defineProps<ProductListingPaginationProps>(), {
    scrollTopOnChange: false
})

const maxPage = computed(() => {
    return Math.ceil(props.total / props.limit)
})

const { getProductListing, updateUri } = usePage()
const emit = defineEmits<{(event: 'update:listing', data: HblProductListing): void}>()

async function selectPage (page: number): Promise<void> {
    try {
        const { productListing, params } = await getProductListing(props.currentFilters, props.limit, props.sorting, page)
        emit('update:listing', productListing)
        updateUri(params)

        if (props.scrollTopOnChange) {
            window.scrollTo(0, 0)
        }
    } catch (e) {
        showError(e)
    }
}
</script>
