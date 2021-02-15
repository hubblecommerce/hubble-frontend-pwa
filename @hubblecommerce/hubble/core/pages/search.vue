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
            <div class="col-12 headline-3" v-text="`We have found ${$data.total} results for: ${$data.currentFilters.search}`" />
        </div>
        <div class="row">
            <div class="toolbar-top col-12">
                <product-listing-pagination :paginationItemsTotal="$data.total" :paginationPerPage="$data.limit" />
            </div>
        </div>
        <product-listing
            v-if="products != null"
            :data-items="products"
            :total="$data.total"
            :listing-class="'col-12 col-sm-12 col-md-4 col-lg-3'"
        />
        <div class="row">
            <div class="toolbar-bottom col-12">
                <product-listing-pagination :paginationItemsTotal="$data.total" :paginationPerPage="$data.limit" />
            </div>
        </div>
    </div>
</template>

<script>
import {associations, includes} from "@/utils/api-post-body";
import apiClient from "@/utils/api-client";
import {mappingCategoryProducts} from "@/utils/api-mapping-helper";

export default {
    name: 'Search',

    async asyncData({ route, error }) {
        const term = route.query.term != null ? route.query.term : null;
        if(term === null) {
            return;
        }

        let postData = {
            associations: associations,
            includes: includes,
            search: term
        };

        // Set GET params to POST data if set in url
        if(route.query.length > 0) {
            let { setReqParamFromRoute } = await import('../utils/api-parse-get-params');
            postData = setReqParamFromRoute(route, postData);
        }

        try {
            let response = await new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/v3/search',
                data: postData
            });

            if(response.data != null) {
                return response.data;
            }
        } catch (e) {
            error({
                statusCode: e.status,
                title: e.title,
                detail: e.detail
            });
        }
    },

    data() {
        return {
            products: null
        };
    },

    created() {
        if(this.$data.elements != null) {
            this.products = mappingCategoryProducts(this.$data.elements);
        }
    }
};
</script>
