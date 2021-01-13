<template>
    <div class="options-wrp">
        <div v-for="(group, index) in groups" :key="index" :class="`group-${group.name}`" class="option-wrp">
            <div class="option-label option-label-top" v-text="group.name" />

            <div class="option-val-wrp">
                <div
                    v-for="(option, optionIndex) in group.options"
                    :key="optionIndex"
                    class="option-val"
                    :class="showActiveClass(group.id, option.id) "
                >
                    <input
                        :id="option.id"
                        v-model="selectedOptions[group.id]"
                        type="radio"
                        :name="group.id"
                        :value="option.id"
                        @change="onChange($event)"
                        :disabled="isLoading"
                    />
                    <label :for="option.id" v-text="option.name" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex';
import _ from 'lodash';

export default {
    name: 'ProductDetailBuyboxOptionsSw',

    data() {
        return {
            selectedOptions: {},
            updatedOptions: null
        };
    },

    computed: {
        ...mapState({
            dataProduct: (state) => state.modApiProduct.dataProduct,
            isLoading: (state) => state.modCart.isLoading
        }),
        groups: function () {
            return !_.isEmpty(this.dataProduct.result.item.groups) ? this.dataProduct.result.item.groups : null;
        },
    },

    created() {
        this.setInitialOptions();
    },

    methods: {
        ...mapMutations({
            setIsLoading: 'modCart/setIsLoading'
        }),
        setInitialOptions: function () {
            this.dataProduct.result.item.options.forEach((option) => {
                _.assign(this.selectedOptions, { [option.group.id]: option.id });
            });
        },
        onChange: async function(e) {
            try {
                // Deactivate add to cart button while variant is loading
                this.setIsLoading(true);

                // Clone and write options to make them reactive
                this.updatedOptions = _.clone(this.selectedOptions);

                let queries = [];
                Object.entries(this.updatedOptions).forEach(([key, option]) => {
                    queries.push({
                        "type": "contains",
                        "field": "optionIds",
                        "value": option
                    })
                });

                let filter = [
                    {
                        type: 'equals',
                        field: 'parentId',
                        value: this.dataProduct.result.item.parentId
                    },
                    {
                        type: "multi",
                        operator: "and",
                        queries: queries
                    }
                ];

                // Fetch product by current options selected
                let response = await this.$store.dispatch('modApiProduct/fetchProduct', {
                    filter: filter
                });

                // Return if no or more than one results
                if(response.data.elements.length > 1 || response.data.elements.length === 0) {
                    return false;
                }

                // Mapping response data (prepare to replace current product data)
                let mappedProduct = await this.$store.dispatch('modApiProduct/mappingProduct', {
                    product: response.data.elements[0]
                });

                // Clone to prevent direct store manipulation
                let originData = _.cloneDeep(this.dataProduct.result.item);

                // Merge Productdata of variant with current product, to update current variant data
                let mergedProduct = _.merge(originData, mappedProduct);

                let responseObj = {
                    data: {
                        result: {
                            item: mergedProduct
                        }
                    }
                };

                this.$store.commit('modApiProduct/setDataProduct', responseObj);

                // Release add to cart button
                this.setIsLoading(false);
            } catch(error) {
                // Release add to cart button
                this.setIsLoading(false);
            }
        },
        showActiveClass: function(groupId, optionId) {
            if(this.updatedOptions != null) {
                return this.updatedOptions[groupId] === optionId ? 'active' : '';
            }

            return this.selectedOptions[groupId] === optionId ? 'active' : ''
        }
    },
};
</script>
