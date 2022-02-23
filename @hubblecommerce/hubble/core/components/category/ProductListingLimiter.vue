<template>
    <div class="limiter-wrp">
        <hbl-select>
            <select id="limiter" v-model="selectedLimit" @change="setLimit(selectedLimit)" class="select-text">
                <option v-for="availableLimit in availableLimits" :key="availableLimit" :value="availableLimit" v-text="availableLimit" />
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
    name: "ProductListingLimiter",

    props: {
        limit: {
            type: Number,
            required: true
        },
        currentFilters: {
            type: Object,
            required: true
        },
        sorting: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            availableLimits: [ 12, 24, 48, 96 ], // Default = 24, values have to match layout of 1, 3 and 4 products per row
            selectedLimit: null
        }
    },

    computed: {
        categoryId: function() {
            return this.currentFilters.navigationId;
        }
    },

    created() {
        this.selectedLimit = this.limit;
    },

    methods: {
        setLimit: async function(number) {
            let postData = {
                associations: associations,
                includes: includes,
                limit: number,
                order: this.sorting
            };

            Object.assign(postData, this.currentFilters);

            try {
                let response = await new ApiClient(this.$config).apiCall({
                    action: 'post',
                    endpoint: `store-api/product-listing/${this.categoryId}`,
                    data: postData,
                });

                this.$nuxt.$emit('set-limit', response.data);

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

.limiter-wrp {
    display: flex;
    justify-content: flex-start;
    order: 20;

    .hbl-select {
        width: 82px;
        margin: 0;

        .select-text {
            line-height: 32px;
            font-size: $font-size-sm;
        }
    }
}

@media(min-width: 768px) {
    .limiter-wrp {
        order: 10;
        width: 20%;
    }
}
</style>
