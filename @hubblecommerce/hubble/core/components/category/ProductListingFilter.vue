<template>
    <Portal to="filters">
        <div class="filter-wrp">
            <template v-for="(filter, name) in aggregations">
                <div v-if="name === 'manufacturer'" :key="name" class="filter" :class="{'active': showOptions === name}">
                    <div class="title" @click="toggleOptions(name, $event)">
                        <span>Manufacturer</span>
                        <span class="count" v-if="appliedFilters.manufacturer.length > 0" v-text="appliedFilters.manufacturer.length" />
                        <svg-icon v-show="showOptions === name" icon="chevron-up" />
                        <svg-icon v-show="showOptions !== name" icon="chevron-down" />
                    </div>

                    <div v-if="showOptions === name" class="filter-options-wrp">
                        <div v-for="option in filter.entities" class="option">
                            <input type="checkbox" :id="option.id" :name="option.id" v-model="appliedFilters.manufacturer" :value="option.id" @change="applyFilter()" />
                            <label :for="option.id" v-text="option.translated.name"></label>
                        </div>
                    </div>
                </div>

                <div v-if="name === 'price'" :key="name" class="filter" :class="{'active': showOptions === name}">
                    <div class="title" @click="toggleOptions(name, $event)">
                        <span>Price</span>
                        <span class="count" v-if="appliedFilters['min-price'] > 0 || appliedFilters['max-price'] > 0" v-text="'✓'" />
                        <svg-icon v-show="showOptions === name" icon="chevron-up" />
                        <svg-icon v-show="showOptions !== name" icon="chevron-down" />
                    </div>

                    <div v-if="showOptions === name" class="filter-options-wrp range">
                        <div class="option">
                            <label for="filter_price_from">Price from</label>
                            <input type="number" id="filter_price_from" name="filter_price_from" v-model="appliedFilters['min-price']" @keyup="applyFilterWithDelay(1000)" />
                        </div>

                        <div class="option">
                            <label for="filter_price_to">Price to</label>
                            <input type="number" id="filter_price_to" name="filter_price_to" v-model="appliedFilters['max-price']" @keyup="applyFilterWithDelay(1000)" />
                        </div>
                    </div>
                </div>

                <div v-if="name === 'shipping-free'" :key="name" class="filter">
                    <div class="title option">
                        <input type="checkbox" id="filter_shipping_free" name="filter_shipping_free" v-model="appliedFilters['shipping-free']" @change="applyFilter()" />
                        <label for="filter_shipping_free">Shipping Free</label>
                    </div>
                </div>

                <template v-if="name === 'properties'">
                    <div
                        v-for="propertyFilter in filter.entities"
                        :key="name+propertyFilter.id"
                        class="filter" :class="{'disabled': !propertyFilter.filterable, 'active': showOptions === name+propertyFilter.id}">
                        <div class="title" @click="toggleOptions(name+propertyFilter.id, $event)">
                            <span v-text="propertyFilter.translated.name" />
                            <span class="count" v-if="showSelectedPropertiesCount(propertyFilter.options)" v-text="showSelectedPropertiesCount(propertyFilter.options)" />
                            <svg-icon v-show="showOptions === name+propertyFilter.id" icon="chevron-up" />
                            <svg-icon v-show="showOptions !== name+propertyFilter.id" icon="chevron-down" />
                        </div>

                        <div v-if="showOptions === name+propertyFilter.id" class="filter-options-wrp">
                            <div v-for="option in propertyFilter.options" class="option">
                                <input type="checkbox" :id="option.id" :name="option.id" v-model="appliedFilters.properties" :value="option.id" @change="applyFilter()" />
                                <label :for="option.id" v-text="option.translated.name"></label>
                            </div>
                        </div>
                    </div>
                </template>
            </template>
        </div>

        <div v-if="atLeastOneFilterIsset" class="tags-wrp">
            <div class="title">Your choice:</div>

            <template v-for="option in appliedFilters.manufacturer" v-if="appliedFilters.manufacturer.length > 0">
                <div :key="option" class="tag" @click="removeOption(option)">
                    <span v-text="getOptionName('manufacturer', option)" />
                    <svg-icon icon="x" />
                </div>
            </template>

            <template v-if="appliedFilters['min-price'] !== '' && appliedFilters['min-price'] != null">
                <div :key="`from_${appliedFilters['min-price']}`" class="tag" @click="removeOption('min-price')">
                    <span v-text="`Price from: ${formatPrice(appliedFilters['min-price'])}`" />
                    <svg-icon icon="x" />
                </div>
            </template>

            <template v-if="appliedFilters['max-price'] !== '' && appliedFilters['max-price'] != null">
                <div :key="`to_${appliedFilters['max-price']}`" class="tag" @click="removeOption('max-price')">
                    <span v-text="`Price to: ${formatPrice(appliedFilters['max-price'])}`" />
                    <svg-icon icon="x" />
                </div>
            </template>

            <template v-if="appliedFilters['shipping-free']">
                <div :key="appliedFilters['shipping-free']" class="tag" @click="removeOption('shipping-free')">
                    <span v-text="`Shipping free`" />
                    <svg-icon icon="x" />
                </div>
            </template>

            <template v-for="option in appliedFilters.properties" v-if="appliedFilters.properties.length > 0">
                <div :key="option" class="tag" @click="removeOption(option)">
                    <span v-text="getOptionName('properties', option)" />
                    <svg-icon icon="x" />
                </div>
            </template>

            <div class="tag reset" @click="removeAllOptions()">
                <span>Reset all</span>
            </div>
        </div>
    </Portal>
</template>

<script>
import ApiClient from '@/utils/api-client';
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
            appliedFilters: null,
            filterTemplate: {
                manufacturer: [],
                'min-price': '',
                'max-price': '',
                'shipping-free': false,
                properties: []
            },
            showOptions: null
        }
    },
    computed: {
        atLeastOneFilterIsset: function () {
            return this.appliedFilters.manufacturer.length > 0 ||
                (this.appliedFilters['min-price'] !== '' && this.appliedFilters['min-price'] != null) ||
                (this.appliedFilters['max-price'] !== '' && this.appliedFilters['max-price'] != null) ||
                this.appliedFilters['shipping-free'] ||
                this.appliedFilters.properties.length > 0;
        }
    },
    created() {
        this.setInitialAppliedFilters();
    },
    methods: {
        setInitialAppliedFilters: function () {
            this.appliedFilters = Object.assign({}, this.filterTemplate);
            this.appliedFilters = this.currentFilters;
        },
        applyFilter: async function() {
            let postData = {
                associations: associations,
                includes: includes,
                limit: this.limit,
                order: this.sorting
            };

            Object.assign(postData, this.appliedFilters);

            // Remove applied filters with empty string values because shop system
            // returns 0 e.g. price filter which leads to wrong result sets
            const asArray = Object.entries(postData);
            const filtered = asArray.filter(([key, value]) => value !== '');
            postData = Object.fromEntries(filtered);

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
        },
        showSelectedPropertiesCount: function(propertyOptions) {
            let count = 0;

            this.appliedFilters.properties.forEach((appliedOption) => {
                propertyOptions.forEach((propertyOption) => {
                    if(propertyOption.id === appliedOption) {
                        count++;
                    }
                })
            });

            if(count > 0) {
                return count;
            }

            return false;
        },
        toggleOptions: function(filterName = null, event) {
            if(this.showOptions !== filterName) {
                this.showOptions = filterName;
            } else {
                this.showOptions = null;
            }
        },
        formatPrice: function (price) {
            const formatter = new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
            });

            return formatter.format(price);
        },
        removeOption: function(option) {
            if(option === 'min-price') {
                this.appliedFilters['min-price'] = '';
            }

            if(option === 'max-price') {
                this.appliedFilters['max-price'] = '';
            }

            if(option === 'shipping-free') {
                this.appliedFilters['shipping-free'] = false;
            }

            this.appliedFilters.manufacturer = this.appliedFilters.manufacturer.filter((value) => {
                return option !== value;
            });

            this.appliedFilters.properties = this.appliedFilters.properties.filter((value) => {
                return option !== value;
            });

            this.applyFilter();
        },
        removeAllOptions: function () {
            this.appliedFilters = Object.assign({}, this.filterTemplate);

            if(this.currentFilters.search) {
                this.appliedFilters = Object.assign(this.appliedFilters, { search: this.currentFilters.search });
            }

            this.applyFilter();
        },
        getOptionName: function(filter, option) {
            let optionName = false;

            this.aggregations[filter].entities.forEach((filterOption) => {
                if(filter === 'manufacturer') {
                    if(option === filterOption.id) {
                        optionName = filterOption.translated.name;
                    }
                }

                if(filter === 'properties') {
                    filterOption.options.forEach((propertyOption) => {
                        if(option === propertyOption.id) {
                            optionName = propertyOption.translated.name;
                        }
                    });
                }
            })

            if(optionName) {
                return optionName;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/elevation';

.filter-wrp {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 5px;

    .filter {
        position: relative;
        margin: 0 5px 10px 0;

        &.disabled {
            border: 1px solid red;
        }

        &.active {
            .title {
                background-color: $primary;
                color: $secondary;
            }
        }

        .title {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px 10px 4px 14px;
            background-color: $background-light;
            font-size: $font-size-sm;
            transition: all .1s ease-in-out;

            &:hover {
                background-color: $gray;
            }

            .count {
                margin-left: 5px;
                margin-right: -6px;
                padding: 7px;
                border-radius: 50px;
                color: $primary;
                background-color: $secondary;
                font-weight: bold;
                height: 22px;
                line-height: 8px;
            }

            .icon {
                margin-left: 16px;
            }
        }

        .filter-options-wrp {
            position: absolute;
            z-index: 15;
            min-width: 240px;
            padding: 15px;
            margin-top: 8px;
            background-color: $background;

            @include elevation-2;

            .option {
                input[type='checkbox'] {
                   width: 20px;
                   height: 20px;
                }
            }

            &.range {
                display: flex;
                justify-content: space-between;

                .option {
                    align-items: flex-start;
                    flex-direction: column;
                    max-width: 48%;

                    input {
                        width: 100%;
                    }
                }
            }
        }

        .option {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: $font-size-sm;

            &:last-child {
                margin-bottom: 0;
            }

            label, input {
                cursor: pointer;
            }

            input {
                margin-right: 10px;
            }
        }
    }
}

.tags-wrp {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .title {
        font-size: $font-size-sm;
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .tag {
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-right: 10px;
        margin-bottom: 10px;
        padding: 5px 11px;
        background-color: $background-light;
        font-size: $font-size-xs;
        line-height: 16px;
        border-radius: 24px;
        transition: all .1s ease-in-out;

        &:hover {
            background-color: $gray;
        }

        &.reset {
            margin-right: 0;
            background-color: transparent;
            text-decoration: underline;
            font-size: $font-size-sm;
            color: $blue;

            &:hover {
                background-color: transparent;
            }

            span {
                margin: 0;
            }
        }

        span {
            margin-right: 18px;
        }

        .icon {
            width: 12px;
            height: 12px;
        }
    }
}
</style>
