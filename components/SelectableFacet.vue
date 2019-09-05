<!--
Component usage:
<selectable-facet :data-facet="facet" :type-checkbox="true"/>
-->

<template>
    <collapsible-filter :class="activeClass" :toggle-text="facetTitle" :max-height="maxHeight" open-icon-class="icon-chevron-down" close-icon-class="icon-chevron-up">
        <div class="action-bar">
            <div class="selected-facets" v-text="modelSelected.length+$t(' selected')"></div>
            <div class="reset-facet" @click="resetAll()" v-text="$t('Reset Filter')">Zurücksetzen</div>
        </div>

        <div class="input-wrp">
            <div class="hbl-checkbox" v-if="typeCheckbox" v-for="(option, optionIndex) in dataFacet.options" :key="optionIndex">
                <input type="checkbox" :id="dataFacet.key+option['key']" :value="option['key']" v-model="modelSelected" @change="changeFilter()">
                <label :for="dataFacet.key+option['key']">{{ option.label }}</label>
            </div>
        </div>

        <div v-if="typeSelect" class="select">
            <select :name="dataFacet.key" v-model="modelSelected" class="select-text" required>
                <option value="" disabled selected></option>
                <option v-for="(option, optionIndex) in dataFacet.options"
                    :key="optionIndex"
                    :value="option['key']">
                    {{ option.label }} <span class="count">({{ option.doc_count }})</span>
                </option>
            </select>
            <span class="select-highlight"></span>
            <span class="select-bar"></span>
            <label :for="dataFacet.key" class="select-label" v-text="dataFacet.label"></label>
        </div>
    </collapsible-filter>
</template>

<script>
import { mapState } from 'vuex'
export default {

    data() {
        return {
            name: 'SelectableFacet',
            modelSelected: []
        }
    },

    computed: {
        ...mapState({
            selectedFacets: state => state.modApiRequests.selectedFacets
        }),
        activeClass: function() {
            if(this.modelSelected.length > 0) {
                return "active";
            }

            return;
        },
        facetTitle: function() {
            let selectedOptions = '';
            if(this.modelSelected.length > 0) {
                selectedOptions = ' (' + this.modelSelected.length + ')' ;
            }
            return this.dataFacet.label + selectedOptions;
        },
        maxHeight: function() {

            if(this.$mq === 'lg') {
                return 500;
            }

            return (this.dataFacet.options.length*50)+45;
        }
    },

    props: {
        dataFacet: {
            type: Object,
            required: true
        },
        typeCheckbox: {
            type: Boolean,
            required: false
        },
        typeSelect: {
            type: Boolean,
            required: false
        },
        filterOnChange: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    created() {
        this.setSelection();
    },

    methods: {
        clearSelection: function() {
            this.modelSelected = [];
        },
        setSelection: function() {
            let currentFacetId = this.dataFacet.key;
            let selectedFacet = this.selectedFacets[currentFacetId];

            // If current facet is selected, set values to v-model
            if(selectedFacet) {
                this.modelSelected = selectedFacet.split(',');
                return;
            }

            this.clearSelection();
        },
        changeFilter: function() {
            // Parse selected options from array to comma separated string
            let selectedToString = this.modelSelected.toString();

            if(this.filterOnChange) {
                // Trigger Event to set facet and apply filter for filterOnChange
                this.$bus.$emit('selectable-facet-changed-and-applied', {
                    payload: {
                        name: this.dataFacet.key,
                        data: selectedToString
                    }
                })
            } else {
                // Trigger Event to only set facet and do not apply filter
                this.$bus.$emit('selectable-facet-changed', {
                    payload: {
                        name: this.dataFacet.key,
                        data: selectedToString
                    }
                })
            }
        },
        resetAll: function() {
            this.modelSelected = [];
            this.changeFilter();
        }
    },

    watch: {
        selectedFacets() {
            // Set selected facets if selected values in vuex store change
            this.setSelection();
        }
    }
};
</script>
