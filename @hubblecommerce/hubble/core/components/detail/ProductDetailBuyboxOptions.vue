<template>
    <div class="options-wrp">
        <div v-for="(group, index) in groups" :key="index" :class="`group-${group.name}`" class="option-wrp">
            <div class="option-label option-label-top" v-text="group.name" />

            <div class="option-val-wrp">
                <div
                    v-for="(option, optionIndex) in group.options"
                    :key="optionIndex"
                    class="option-val"
                    :class="[{'is-color': option.colorHexCode}, showActiveClass(group.id, option.id)]"
                >
                    <input
                        :id="option.id"
                        v-model="selectedOptions[group.id]"
                        type="radio"
                        :name="group.id"
                        :value="option.id"
                        :disabled="isLoading"
                        @change="onChange($event)"
                    />
                    <label
                        :for="option.id"
                        :style="option.colorHexCode ? getColorVariant(option.colorHexCode) : null"
                        v-text="!option.colorHexCode ? option.name : null"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import ApiClient from '@/utils/api-client';
import { associations, includes } from '@/utils/api-post-body';
import { mappingProduct } from '@/utils/api-mapping-helper';

export default {
    name: 'ProductDetailBuyboxOptions',

    props: {
        dataProduct: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            selectedOptions: {},
            updatedOptions: null,
        };
    },

    computed: {
        ...mapState({
            isLoading: (state) => state.modCart.isLoading,
        }),
        groups: function () {
            return this.dataProduct.groups != null ? this.dataProduct.groups : null;
        },
    },

    created() {
        this.setInitialOptions();
    },

    methods: {
        ...mapMutations({
            setIsLoading: 'modCart/setState',
        }),

        setInitialOptions: function () {
            this.dataProduct.options.forEach((option) => {
                Object.assign(this.selectedOptions, { [option.group.id]: option.id });
            });
        },

        onChange: async function (e) {
            try {
                // Deactivate add to cart button while variant is loading
                this.setIsLoading({ name: 'isLoading', state: true });

                // Clone and write options to make them reactive
                this.updatedOptions = Object.assign({}, this.selectedOptions);

                let queries = [];
                Object.entries(this.updatedOptions).forEach(([key, option]) => {
                    queries.push({
                        type: 'contains',
                        field: 'optionIds',
                        value: option,
                    });
                });

                let filter = [
                    {
                        type: 'equals',
                        field: 'parentId',
                        value: this.dataProduct.parentId,
                    },
                    {
                        type: 'multi',
                        operator: 'and',
                        queries: queries,
                    },
                ];

                // Fetch product by current options selected
                let response = await this.fetchProduct({ filter: filter });

                // Return if no or more than one results
                if (response.data.elements.length > 1 || response.data.elements.length === 0) {
                    return false;
                }

                // Mapping response data (prepare to replace current product data)
                let mappedProduct = mappingProduct({ product: response.data.elements[0] });

                // Merge Productdata of variant with current product, to update current variant data
                let mergedProduct = Object.assign(this.dataProduct, mappedProduct);

                // Replace current url path with variant without losing optional GET params
                let newSeoUrl = window.location.href.replace(
                    window.location.pathname.replace(/^\/+/g, ''),
                    mergedProduct.url_pds
                );
                window.history.replaceState({}, mergedProduct.name, newSeoUrl);

                // Release add to cart button
                this.setIsLoading({ name: 'isLoading', state: false });
            } catch (error) {
                // Release add to cart button
                this.setIsLoading({ name: 'isLoading', state: false });
            }
        },

        showActiveClass: function (groupId, optionId) {
            if (this.updatedOptions != null) {
                return this.updatedOptions[groupId] === optionId ? 'active' : '';
            }

            return this.selectedOptions[groupId] === optionId ? 'active' : '';
        },

        fetchProduct: async function (payload) {
            try {
                return await new ApiClient(this.$config).apiCall({
                    action: 'post',
                    endpoint: 'store-api/product',
                    data: {
                        filter: payload.filter,
                        associations: associations,
                        includes: {
                            product: includes.product,
                            product_media: includes.product_media,
                            calculated_price: includes.calculated_price,
                        },
                    },
                });
            } catch (e) {
                throw e;
            }
        },

        getColorVariant: function(hex) {
            return {
                backgroundColor: hex
            }
        }
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.options-wrp {
    margin-top: 10px;
    margin-bottom: -10px;

    .option-wrp {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 10px;

        &:last-child {
            border-bottom: none;
        }

        &:last-child {
            margin-bottom: 0;
        }

        .option-label {
            font-size: 14px;
            text-transform: capitalize;
            margin-bottom: 2px;
            font-weight: bold;
        }

        .option-val-wrp {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            width: 100%;

            .option-val {
                font-size: 14px;
                margin: 0 2px 10px;
                padding: 0;
                border: 1px solid $border-color;
                background: #fff;
                width: 38px;
                height: 38px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                border-radius: 2px;

                &:first-child {
                    margin-left: 2px;
                }

                &.active {
                    border: 1px solid $secondary;
                    color: $secondary;
                    box-shadow: 0 2px 2px 0 rgba(62,62,77,0.1), 0 3px 1px -2px rgba(62,62,77,0.07), 0 1px 5px 0 rgba(62,62,77,0.15);
                    font-weight: bold;
                    // box-shadow: 0 0 0 2px #000;
                }

                input {
                    display: none;
                }

                label {
                    cursor: pointer;
                    width: 100%;
                }

                &.is-color {
                    border-radius: 50%;
                    padding: 2px;

                    label {
                        display: block;
                        border-radius: 50%;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                    }
                }
            }
        }

        .select-wrp {
            position: relative;
            margin: 0 2px 10px;
            width: 100%;

            &:after {
                font-family: 'icons' !important;
                content: '\e901';
                position: absolute;
                top: 0;
                bottom: 0;
                right: 10px;
                margin: auto;
                height: 18px;
                font-size: 13px;
            }

            select {
                width: 100%;
                height: 33px;
                font-size: 14px;
                padding: 5px 10px;
                background: #fff;
                border: 1px solid $border-color;
                border-radius: 0;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
            }
        }

        &.color {
            .option-val-wrp {
                .option-val {
                    cursor: pointer;
                    border-radius: 25px;
                    width: 25px;
                    height: 25px;

                    &.active {
                        border: 3px solid #fff;
                        box-shadow: 0 0 0 2px #000;
                    }

                    &.green {
                        background-color: green;
                    }

                    &.red {
                        background-color: red;
                    }

                    &.yellow {
                        background-color: yellow;
                    }

                    &.black {
                        background-color: black;
                    }

                    &.blue {
                        background-color: blue;
                    }

                    &.purple {
                        background-color: purple;
                    }

                    &.grey {
                        background-color: grey;
                    }

                    &.orange {
                        background-color: orange;
                    }

                    &.brown {
                        background-color: #a54412;
                    }
                }
            }
        }
    }
}

/* Different styling for color swatches on listing */
.product-card {
    .options-wrp .option-wrp {
        &.color {
            .option-val-wrp {
                .option-val {
                    border: 1px solid $border-color !important;
                    position: relative;
                    padding: 0;
                    border-radius: 0;
                    width: 25px;
                    height: 25px;

                    &.active {
                        border: 1px solid #fff !important;
                        box-shadow: 0 0 0 2px #000 !important;
                    }

                    &.no-color {
                        position: relative;

                        &:after,
                        &:before {
                            position: absolute;
                            left: 13px;
                            top: -1px;
                            content: ' ';
                            height: 30px;
                            width: 2px;
                            background-color: red;
                        }

                        &:after {
                            transform: rotate(-45deg);
                        }

                        &:before {
                            transform: rotate(45deg);
                        }
                    }

                    .option-tooltip {
                        display: none;
                        position: absolute;
                        bottom: 35px;
                        left: -4px;
                        background-color: #000;
                        z-index: 1;
                        color: #fff;
                        padding: 10px;

                        &:before {
                            top: 100%;
                            left: 10px;
                            border: solid transparent;
                            content: ' ';
                            height: 0;
                            width: 0;
                            position: absolute;
                            pointer-events: none;
                            border-top-color: #000;
                            border-width: 7px;
                        }
                    }

                    .swatchable {
                        width: 100%;
                        height: 100%;
                        .swatchable-color {
                            width: 100%;
                            height: 100%;
                            div {
                                width: 100%;
                                height: 100%;
                            }
                        }

                        img {
                            width: 100%;
                        }

                        .no-swatch {
                            position: relative;

                            &:after,
                            &:before {
                                position: absolute;
                                left: 11px;
                                top: -2px;
                                content: ' ';
                                height: 28px;
                                width: 2px;
                                background-color: red;
                            }

                            &:after {
                                transform: rotate(-45deg);
                            }

                            &:before {
                                transform: rotate(45deg);
                            }
                        }
                    }
                }
            }
        }

        .option-val-wrp {
            .option-val {
                border: none;
                padding: 5px 5px;
                color: lighten($text-primary, 15%);

                &.active {
                    border: none !important;
                    box-shadow: none !important;
                }
            }
        }
    }
}

@media (min-width: 768px) {
    .options-wrp {
        margin-bottom: 0;

        .option-wrp {
            flex-wrap: nowrap;
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;

            .option-label {
                display: block;
                font-size: 14px;
                min-width: 100px;
                padding: 5px 0;
                font-weight: normal;
            }

            .option-val-wrp {
                width: auto;

                .option-val {
                }
            }

            &.color {
                .option-val-wrp {
                    .option-val {
                        width: 30px;
                        height: 30px;
                    }
                }
            }
        }
    }
}
</style>
