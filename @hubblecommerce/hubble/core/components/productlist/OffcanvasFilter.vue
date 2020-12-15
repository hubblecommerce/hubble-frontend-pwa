<template>
    <div class="offcanvas-filter-wrp">
        <button class="open-filter" :class="buttonClass" @click="toggle()">
            <i class="icon icon-sliders left" />
            <material-ripple />
        </button>

        <transition-expand-layer v-if="$mq === 'sm' || $mq === 'md'" :direction="{ sm: 'bottomTop', md: 'rightLeft', lg: 'rightLeft' }">
            <div v-if="showFilters" class="transition-expand-wrp">
                <div class="container position-static">
                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu" @click="toggle()">
                            <i class="icon icon-x" aria-hidden="true" />
                            <material-ripple />
                        </button>

                        <div class="overlay-headline" v-text="$t('filter')" />
                    </div>

                    <tabs class="filter-tabs">
                        <tab class="facets-tab" :name="$t('filter')">
                            <product-listing-filter />
                            <selected-facets />
                        </tab>
                        <tab class="sort-tab" :name="$t('sort')">
                            <div class="sort-wrp">
                                <selectable-order :data-options="optionsSorter" :instant-change="false" />
                                <selectable-limit :data-options="optionsLimit" :instant-change="false" />
                            </div>
                        </tab>
                    </tabs>

                    <div class="apply-filter-wrp">
                        <button class="button button-primary apply-filter" @click="applyFilter()">
                            <span v-text="$t('Apply & Close')" />
                            <material-ripple />
                        </button>
                    </div>
                </div>
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    name: 'OffCanvasFilter',

    components: {
        SelectableLimit: () => import('./toolbar/SelectableLimit'),
        SelectedFacets: () => import('./toolbar/SelectedFacets'),
        ProductListingFilter: () => import('./ProductListingFilter'),
        Tabs: () => import('../../components/utils/Tabs'),
        Tab: () => import('../../components/utils/Tab'),
        SelectableOrder: () => import('./toolbar/SelectableOrder')
    },

    props: {
        buttonClass: {
            type: String,
            default: 'button-icon',
            required: false,
        },
    },

    data() {
        return {
            showFilter: false
        };
    },

    computed: {
        ...mapState({
            offcanvas: state => state.modNavigation.offcanvas,
            optionsSorter: state => state.modApiRequests.optionsSorter,
            optionsLimit: state => state.modApiRequests.optionsLimit,
        }),
        showFilters: function () {
            return this.offcanvas.component === this.name;
        },
    },

    methods: {
        ...mapActions({
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
            applyFilter: 'modApiRequests/applyFilter',
        }),
        toggle: function () {
            this.showFilter = !this.showFilter;
            this.toggleOffcanvasAction({
                component: this.name,
                direction: 'rightLeft',
            });
        },
        hideFilters: function () {
            this.hideOffcanvasAction();

            return new Promise((resolve, reject) => {
                resolve();
            });
        },
    },
};
</script>
