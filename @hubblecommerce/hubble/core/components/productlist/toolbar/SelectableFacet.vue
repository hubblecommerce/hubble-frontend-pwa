<!--
Component usage:
<selectable-facet :data-facet="facet" :type-checkbox="true"/>
-->

<template>
    <collapsible-filter
        :toggle-text="dataFacet.label"
        :toggle-amount="modelSelected.length"
        :max-height="maxHeight"
        open-icon-class="icon-chevron-down"
        close-icon-class="icon-chevron-up"
    >
        <div class="action-bar">
            <div class="selected-facets" v-text="modelSelected.length + $t(' selected')" />
            <div class="reset-facet" @click="resetAll()" v-text="$t('Reset Filter')" />
        </div>

        <div v-if="typeCheckbox" class="input-wrp">
            <div v-for="(option, optionIndex) in dataFacet.options" :key="optionIndex" class="hbl-checkbox">
                <input :id="dataFacet.key + option['key']" v-model="modelSelected" type="checkbox" :value="option['key']" @change="changeFilter()" />
                <label :for="dataFacet.key + option['key']">{{ option.label }}</label>
            </div>
        </div>

        <div v-if="typeSelect" class="select">
            <div class="hbl-select">
                <select class="select-text" required>
                    <option v-for="(option, optionIndex) in dataFacet.options" :key="optionIndex" :value="option['key']">
                        {{ option.label }} <span class="count">({{ option.doc_count }})</span>
                    </option>
                </select>
                <span class="select-highlight"></span>
                <span class="select-bar"></span>
                <label :for="dataFacet.key" class="select-label" v-text="dataFacet.label" />
            </div>
        </div>
    </collapsible-filter>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    name: 'SelectableFacet',

    components: {
        CollapsibleFilter: () => import('./CollapsibleFilter'),
    },
//ellapsed property
    props: {
        dataFacet: {
            type: Object,
            required: true,
        },
        typeCheckbox: {
            type: Boolean,
            required: false,
        },
        typeSelect: {
            type: Boolean,
            required: false,
        },
        filterOnChange: {
            type: Boolean,
            required: false,
            default: false,
        },
        collapsible: {
            type: Boolean,
            required: false,
            default: false,
        }
    },

    data() {
        return {
            name: 'SelectableFacet',
            modelSelected: [],
        };
    },

    computed: {
        ...mapState({
            selectedFacets: state => state.modApiRequests.selectedFacets,
        }),
        maxHeight: function () {
            if (this.$mq === 'lg') {
                return 500;
            }

            return this.dataFacet.options.length * 50 + 45;
        },
    },

    watch: {
        selectedFacets() {
            // Set selected facets if selected values in vuex store change
            this.setSelection();
        },
    },

    created() {
        this.setSelection();
    },

    methods: {
        ...mapMutations({
            setSelectedFacetsParam: 'modApiRequests/setSelectedFacetsParam',
        }),
        ...mapActions({
            applyFilter: 'modApiRequests/applyFilter',
        }),
        clearSelection: function () {
            this.modelSelected = [];
        },
        setSelection: function () {
            let currentFacetId = this.dataFacet.key;
            let selectedFacet = this.selectedFacets[currentFacetId];

            // If current facet is selected, set values to v-model
            if (selectedFacet) {
                this.modelSelected = selectedFacet.split(',');
                return;
            }

            this.clearSelection();
        },
        changeFilter: function () {
            // Parse selected options from array to comma separated string
            let selectedToString = this.modelSelected.toString();

            if (this.filterOnChange) {
                this.setSelectedFacetsParam({
                    name: this.dataFacet.key,
                    data: selectedToString,
                });
                this.applyFilter();
            } else {
                this.setSelectedFacetsParam({
                    name: this.dataFacet.key,
                    data: selectedToString,
                });
            }
        },
        resetAll: function () {
            this.modelSelected = [];
            this.changeFilter();
        },
    },
};
</script>
