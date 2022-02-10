<template>
    <Portal to="filters">
        <div v-for="(filter, name) in aggregations" :key="name" class="filter-wrp">
            <div v-if="name === 'manufacturer'" class="filter">
                <div class="title">Manufacturer</div>

                <div v-for="option in filter.entities" class="options-wrp">
                    <input type="checkbox" :id="option.id" :name="option.id" v-model="appliedFilters.manufacturer" :value="option.id" @change="applyFilter()" />
                    <label :for="option.id" v-text="option.translated.name"></label>
                </div>
            </div>

            <div v-if="name === 'price'" class="filter">
                <div class="title">Price</div>

                <div class="options-wrp">
                    <label for="filter_price_from">Price from</label>
                    <input type="text" id="filter_price_from" name="filter_price_from" v-model="appliedFilters['min-price']" @keyup="applyFilterWithDelay(1000)" />

                    <label for="filter_price_to">Price to</label>
                    <input type="text" id="filter_price_to" name="filter_price_to" v-model="appliedFilters['max-price']" @keyup="applyFilterWithDelay(1000)" />
                </div>
            </div>

            <div v-if="name === 'shipping-free'" class="filter">
                <div class="options-wrp">
                    <input type="checkbox" id="filter_shipping_free" name="filter_shipping_free" v-model="appliedFilters['shipping-free']" @change="applyFilter()" />
                    <label for="filter_shipping_free">Shipping Free</label>
                </div>
            </div>

            <template v-if="name === 'properties'">
                <div v-for="propertyFilter in filter.entities" class="filter" :class="{'disabled': !propertyFilter.filterable}">
                    <div class="title" v-text="propertyFilter.translated.name"></div>

                    <div v-for="option in propertyFilter.options" class="options-wrp">
                        <input type="checkbox" :id="option.id" :name="option.id" v-model="appliedFilters.properties" :value="option.id" @change="applyFilter()" />
                        <label :for="option.id" v-text="option.translated.name"></label>
                    </div>
                </div>
            </template>
        </div>
    </Portal>
</template>

<script>
import apiClient from '@/utils/api-client';
import { associations, includes } from '@/utils/api-post-body';
import { buildUriWithParamsFromObject } from '@/utils/api-parse-get-params';

export default {
    name: "ProductListingFilter",
    props: {
        aggregations: {
            type: Object,
            required: true
        },
        currentFilters: {
            type: Object,
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
    },
    data() {
        return {
            categoryId: null,
            appliedFilters: {
                manufacturer: [],
                "min-price": "",
                "max-price": "",
                "shipping-free": false,
                properties: []
            }
        }
    },
    created() {
        this.categoryId = this.currentFilters.navigationId;

        // Cannot set applied filters from currentFilters, because format of price is different
        this.appliedFilters.manufacturer = this.currentFilters.manufacturer;
        if(this.currentFilters.price.min !== 0) {
            this.appliedFilters['min-price'] = this.currentFilters.price.min;
        }
        if(this.currentFilters.price.max !== 0) {
            this.appliedFilters['max-price'] = this.currentFilters.price.max;
        }
        this.appliedFilters['shipping-free'] = this.currentFilters['shipping-free'];
        this.appliedFilters.properties = this.currentFilters.properties;
    },
    methods: {
        applyFilter: async function() {
            let postData = {
                associations: associations,
                includes: includes,
                limit: this.limit,
                sorting: this.sorting
            };

            Object.assign(postData, this.appliedFilters);

            try {
                let response = await new apiClient().apiCall({
                    action: 'post',
                    endpoint: `store-api/product-listing/${this.categoryId}`,
                    data: postData,
                });

                this.$nuxt.$emit('set-filter', response.data);

                // Write parameters to current url without reloading the page
                window.history.pushState(
                    {},
                    null,
                    buildUriWithParamsFromObject(this.$router, postData)
                );
            } catch (e) {
                console.log(e);
            }
        },
        applyFilterWithDelay: function(delay) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.timer = setTimeout(() => {
                this.applyFilter();
            }, delay);
        }
    }
}
</script>

<style scoped>
.filter {
    &.disabled {
        border: 1px solid red;
    }
}
</style>
