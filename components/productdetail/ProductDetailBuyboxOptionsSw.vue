<template>
    <div>
        <div class="options-wrp">
            <div v-for="(group, index) in groups" class="option-wrp" :key="index" :class="group.name">
                <div class="option-label option-label-top" v-text="group.name" />
                <div class="option-val-wrp">
                    <div v-for="(option, optionIndex) in group.options" :key="optionIndex">
                        <input type="radio"
                               :name="group.id"
                               v-model="selectedOptions[index]"
                               :value="option.id"
                               :id="option.id"
                               :checked="optionIndex === 0 ? 'checked' : ''"
                        />
                        <label :for="option.id" v-text="option.name" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "ProductDetailBuyboxOptionsSw",

        data() {
            return {
                itemLoaded: {},
                selectedOptions: [],
                variants: [],
                matchingChild: null
            }
        },

        computed: {
            ...mapState({
                dataProduct: state => state.modApiResources.dataProduct
            }),
            groups() {
                let groups = null;

                if(!_.isEmpty(this.itemLoaded.groups)) {
                    groups = this.itemLoaded.groups;
                }

                return groups;
            },
        },

        watch: {
            selectedOptions: function(selectedOptions) {

                // Set options is selected flag, used to validate before add to cart action
                this.$store.commit('modApiResources/setOptionIsSelected');

                // Aggregate variants, used for display variants in cart list items component
                this.aggregateSelectedVariants(selectedOptions);
                this.$store.commit('modApiResources/setSelectedVariants', this.variants);

                // Find matching child by selected options
                this.setMatchingChildBySelectedOptions(selectedOptions);

                // Clone current product state to prevent mutation of state
                let selectedChildProduct = _.clone(this.itemLoaded);

                // Set id of children to current item data
                // TODO: Set all properies that need to be updated e.g. price, image, description, ...
                selectedChildProduct.id = this.matchingChild.id;

                // Save updated product to store
                this.$store.commit('modApiResources/setDataProductItem', {
                    data: selectedChildProduct
                });

            }
        },

        created() {
            this.itemLoaded = this.dataProduct.result.item;
            this.setInitialOptions();
        },

        methods: {
            setInitialOptions: function() {
                _.forEach(this.groups, (group) => {
                    // Set first option of each group as initial options
                    this.selectedOptions.push(group.options[0].id);
                })
            },
            aggregateSelectedVariants: function(selectedOptions) {
                this.variants = [];

                _.forEach(selectedOptions, (optionId) => {

                    _.forEach(this.groups, (group) => {

                        _.find(group.options, (o) => {

                            if(o.id === optionId) {
                                this.variants.push({
                                    label: group.name,
                                    value_label: o.name
                                });
                            }

                        })

                    });

                });
            },
            setMatchingChildBySelectedOptions: function(selectedOptions) {
                _.forEach(this.itemLoaded.children, (child) => {

                    if(this.arraysMatch(child.optionIds, selectedOptions)) {
                        this.matchingChild = child;
                    }

                });
            },
            arraysMatch: function (arr1, arr2) {

                let arr1Clone = _.clone(arr1);
                let arr2Clone = _.clone(arr2);

                // Check if the arrays are the same length
                if (arr1Clone.length !== arr2Clone.length) {
                    return false;
                }

                // Sort arrays
                arr1Clone.sort();
                arr2Clone.sort();

                // Check if arrays are not equal
                if(!_.isEqual(arr1Clone, arr2Clone)) {
                    return false;
                }

                // Otherwise, return true
                return true;

            }
        }
    };
</script>
