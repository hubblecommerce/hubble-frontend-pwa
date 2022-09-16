<template>
    <div class="flex flex-wrap items-center justify-between mb-2">
        <div v-if="total" class="w-full md:w-auto flex justify-start mb-2">
            <ProductListingLimiter
                :limit="listing.limit"
                :sorting="listing.currentSorting"
                :total="listing.total"
                :current-filters="listing.currentFilters"
                @update:listing="listing = $event"
            />
        </div>
        <div v-if="sorting" class="w-full md:w-auto lg:mr-auto lg:ml-2 flex justify-start mb-2">
            <ProductListingSorter
                :limit="listing.limit"
                :sorting="listing.currentSorting"
                :current-filters="listing.currentFilters"
                :available-sorting="listing.availableSorting"
                @update:listing="listing = $event"
            />
        </div>
        <div v-if="pagination" class="w-full md:w-auto flex justify-start mb-2">
            <ProductListingPagination
                :page="listing.page"
                :limit="listing.limit"
                :sorting="listing.currentSorting"
                :total="listing.total"
                :current-filters="listing.currentFilters"
                :scroll-top-on-change="true"
                @update:listing="listing = $event"
            />
        </div>
    </div>

    <div :class="gridClasses">
        <template v-if="listing.products.length > 0">
            <ProductListingCard v-for="product in listing.products" :key="product.id" :data="product" />
        </template>
        <template v-else>
            No Products found
        </template>
    </div>

    <portal to="productListingFilter">
        <ProductListingFilter
            :available-filters="listing.availableFilters"
            :current-filters="listing.currentFilters"
            :limit="listing.limit"
            :sorting="listing.currentSorting"
            @update:listing="listing = $event"
        />
    </portal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ProductListing } from '@hubblecommerce/hubble/commons'

interface ProductListingProps {
    data: ProductListing,
    total?: boolean,
    pagination?: boolean,
    sorting?: boolean,
    gridClasses?: string
}

const props = withDefaults(defineProps<ProductListingProps>(), {
    total: true,
    pagination: true,
    sorting: true,
    gridClasses: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'
})

const listing = ref(props.data)
</script>