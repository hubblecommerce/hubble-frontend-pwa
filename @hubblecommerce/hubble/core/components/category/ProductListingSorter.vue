<template>
    <div class="sorter-wrp">
        <hbl-select>
            <select id="limiter" v-model="selectedSorting" @change="setSorting(selectedSorting)" class="select-text">
                <option
                    v-for="availableSorting in availableSortings"
                    :key="availableSorting.key"
                    :value="availableSorting.key"
                    v-text="availableSorting.translated.label"
                />
            </select>
            <label class="select-label" v-text="'Limiter'" />
        </hbl-select>
    </div>
</template>

<script>
import ApiClient from '@/utils/api-client';
import { associations, includes } from '@/utils/api-post-body';
import { buildUriWithParamsFromObject } from '@/utils/api-parse-get-params';

export default {
    name: "ProductListingSorter",

    props: {
        availableSortings: {
            type: Array,
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
        limit: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            selectedSorting: null,
        }
    },

    created() {
        this.selectedSorting = this.sorting;
    },

    methods: {
        setSorting: async function(sorting) {
            let postData = {
                associations: associations,
                includes: includes,
                limit: this.limit,
                order: sorting
            };

            Object.assign(postData, this.currentFilters);

            let route;
            if(this.currentFilters.navigationId) {
                route = `store-api/product-listing/${this.currentFilters.navigationId}`
            }

            if(this.currentFilters.search) {
                route = 'store-api/search';
            }

            try {
                let response = await new ApiClient(this.$config).apiCall({
                    action: 'post',
                    endpoint: route,
                    data: postData,
                });

                this.$nuxt.$emit('set-sorting', response.data);

                // Write parameters to current url without reloading the page
                window.history.pushState(
                    {},
                    null,
                    buildUriWithParamsFromObject(this.$router, postData)
                );
            } catch (e) {
                console.log(e);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';

.sorter-wrp {
    display: flex;
    justify-content: flex-end;
    order: 30;

    .hbl-select {
        width: 225px;
        margin: 0;

        .select-text {
            line-height: 32px;
            color: $dark-gray;
        }
    }
}

@media(min-width: 768px) {
    .sorter-wrp {
        order: 30;
        width: 20%;
    }
}
</style>
