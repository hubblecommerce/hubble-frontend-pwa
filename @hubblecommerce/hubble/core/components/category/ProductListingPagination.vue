<template>
    <div class="pagination-wrp">
        <button @click="selectPage(1)" :disabled="page === 1" class="btn btn-icon">
            <svg-icon icon="chevron-left" />
            <svg-icon icon="chevron-left" />
        </button>
        <button @click="selectPage(page - 1)" :disabled="(page - 1) < 1" class="btn btn-icon">
            <svg-icon icon="chevron-left" />
        </button>
        <div class="page-info" v-text="`Page ${page} of ${maxPage}`" />
        <button @click="selectPage(page + 1)" :disabled="(page + 1) > maxPage" class="btn btn-icon">
            <svg-icon icon="chevron-right" />
        </button>
        <button @click="selectPage(maxPage)" :disabled="(page + 1) > maxPage" class="btn btn-icon">
            <svg-icon icon="chevron-right" />
            <svg-icon icon="chevron-right" />
        </button>
    </div>
</template>

<script>
import apiClient from '@/utils/api-client';
import { associations, includes } from '@/utils/api-post-body';
import { buildUriWithParamsFromObject } from '@/utils/api-parse-get-params';

export default {
    name: "ProductListingPageSelect",

    props: {
        page: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        limit: {
            type: Number,
            required: true
        },
        sorting: {
            type: String,
            required: true
        },
        currentFilters: {
            type: Object,
            required: true
        },
        scrollTopOnChange: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    computed: {
        maxPage: function() {
            return Math.ceil(this.total / this.limit);
        },
        categoryId: function() {
            return this.currentFilters.navigationId;
        }
    },

    methods: {
        selectPage: async function(number) {
            let postData = {
                associations: associations,
                includes: includes,
                p: number,
                limit: this.limit,
                order: this.sorting
            };

            postData = Object.assign(postData, this.appliedFilters);

            try {
                let response = await new apiClient().apiCall({
                    action: 'post',
                    endpoint: `store-api/product-listing/${this.categoryId}`,
                    data: postData,
                });

                this.$nuxt.$emit('set-page', response.data);

                // Write parameters to current url without reloading the page
                window.history.pushState(
                    {},
                    null,
                    buildUriWithParamsFromObject(this.$router, postData)
                );

                if(this.scrollTopOnChange) {
                    window.scrollTo(0, 0);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';

.pagination-wrp {
    display: flex;
    justify-content: center;
    align-items: center;
    order: 10;
    width: 100%;

    .page-info {
        font-size: $font-size-sm;
        margin: 0 10px;
    }
}

@media(min-width: 768px) {
    .pagination-wrp {
        order: 20;
        width: 50%;
    }
}
</style>
