<template>
    <div v-if="products === null || products.length <= 0" class="catalog-search-wrp container">
        <div class="row">
            <h1 class="col-12" v-text="'Search'" />
            <div class="col-12 headline-3" v-text="'We are sorry, your search did not match any products.'" />
        </div>
    </div>
    <div v-else class="catalog-search-wrp container">
        <div class="row">
            <h1 class="col-12" v-text="'Search'" />
            <div class="col-12 headline-3" v-text="`We have found ${$data.productData.total} results for: ${$data.productData.currentFilters.search}`" />
        </div>
        <div class="row">
            <div class="toolbar-top col-12">
                <product-listing-pagination
                    :paginationItemsTotal="$data.productData.total"
                    :paginationPerPage="$data.productData.limit"
                />
            </div>
        </div>
        <product-listing
            v-if="products != null"
            :data-items="products"
            :total="$data.productData.total"
            :listing-class="'col-12 col-sm-12 col-md-4 col-lg-3'"
        />
        <div class="row">
            <div class="toolbar-bottom col-12">
                <product-listing-pagination
                    :paginationItemsTotal="$data.productData.total"
                    :paginationPerPage="$data.productData.limit"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { associations, includes } from '@/utils/api-post-body';
import ApiClient from '@/utils/api-client';
import { mappingCategoryProducts } from '@/utils/api-mapping-helper';

export default {
    name: 'Search',

    async asyncData({ $config, route, error }) {
        const term = route.query.term != null ? route.query.term : null;
        if (term === null) {
            return;
        }

        let postData = {
            associations: associations,
            includes: includes,
            search: term,
        };

        // Set GET params to POST data if set in url
        if (route.query.length > 0) {
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
                    productData: response.data,
                    products: mappingCategoryProducts(response.data.elements)
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

    watchQuery: true,
};
</script>
