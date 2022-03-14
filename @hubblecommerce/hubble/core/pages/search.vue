<template>
    <div class="catalog-search-wrp container">
        <div class="row catalog-search-header">
            <h1 class="col-12" v-text="'Search'" />
            <div class="col-12 headline-3" v-text="`We have found ${total} results for: ${currentFilters.search}`" />
        </div>
        <PortalTarget name="filters"></PortalTarget>
        <product-listing-filter
            :aggregations="aggregations"
            :current-filters="currentFilters"
            :limit="limit"
            :sorting="sorting"
            :key="$route.fullPath"
        />
        <div class="toolbar top">
            <product-listing-limiter
                :limit="limit"
                :current-filters="currentFilters"
                :sorting="sorting"
            />
            <product-listing-pagination
                v-if="total > 0"
                :page="page"
                :limit="limit"
                :total="total"
                :sorting="sorting"
                :current-filters="currentFilters"
            />
            <product-listing-sorter
                :available-sortings="availableSortings"
                :sorting="sorting"
                :current-filters="currentFilters"
                :limit="limit"
            />
        </div>
        <product-listing
            v-if="products != null"
            :data-items="products"
            :total="total"
            :listing-class="'col-12 col-sm-12 col-md-4 col-lg-3'"
        />
        <div class="toolbar bottom">
            <product-listing-pagination
                v-if="total > 0"
                :page="page"
                :limit="limit"
                :total="total"
                :sorting="sorting"
                :current-filters="currentFilters"
                :scroll-top-on-change="true"
            />
        </div>
    </div>
</template>

<script>
import { associations, includes } from '@/utils/api-post-body';
import ApiClient from '@/utils/api-client';
import { mappingCategoryProducts, mappingListingFilters } from '@/utils/api-mapping-helper';

export default {
    name: 'Search',

    async asyncData({ $config, route, error }) {
        const term = route.query.term != null ? route.query.term : null;
        if (term === null) {
            return;
        }

        let postData = {
            associations: associations,
            includes: includes
        };

        // Set GET params to POST data if set in url
        if (Object.keys(route.query).length > 0) {
            let { setReqParamFromRoute } = await import('../utils/api-parse-get-params');
            postData = setReqParamFromRoute(route, postData);
        }

        try {
            let response = await new ApiClient($config).apiCall({
                action: 'post',
                endpoint: 'store-api/search',
                headers: [{ 'sw-include-seo-urls': true }],
                data: postData,
            });

            if (response.data != null) {
                return {
                    products: mappingCategoryProducts(response.data.elements),
                    aggregations: response.data.aggregations,
                    currentFilters: mappingListingFilters(response.data.currentFilters),
                    page: response.data.page,
                    total: response.data.total,
                    limit: response.data.limit,
                    availableSortings: response.data.availableSortings,
                    sorting: response.data.sorting
                }
            }
        } catch (e) {
            error({
                statusCode: e.status,
                title: e.title,
                detail: e.detail,
            });
        }
    },

    created() {
        this.$nuxt.$on('set-filter', (data) => {
            this.products = mappingCategoryProducts(data.elements);
            this.aggregations = data.aggregations;
            this.currentFilters = mappingListingFilters(data.currentFilters);
            this.page = data.page;
            this.total = data.total;
        });

        this.$nuxt.$on('set-page', (data) => {
            this.products = mappingCategoryProducts(data.elements);
            this.page = data.page;
        });

        this.$nuxt.$on('set-limit', (data) => {
            this.products = mappingCategoryProducts(data.elements);
            this.limit = data.limit;
            this.page = data.page;
        });

        this.$nuxt.$on('set-sorting', (data) => {
            this.products = mappingCategoryProducts(data.elements);
            this.sorting = data.sorting;
            this.page = data.page;
        });
    },

    watchQuery: true,
};
</script>

<style lang="scss">
.catalog-search-wrp {
    .catalog-search-header {
        margin-bottom: 15px;
    }
}

.toolbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &.top {
        margin-bottom: 15px;

        .pagination-wrp {
            display: none;
        }
    }

    &.bottom {
        justify-content: center;
    }
}

@media(min-width: 768px) {
    .toolbar {
        &.top {
            .pagination-wrp {
                display: flex;
            }
        }
    }
}

@media (min-width: 1024px) {
    .toolbar {
        &.top {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
