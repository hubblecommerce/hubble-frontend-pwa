<template>
    <div class="offcanvas-filter-wrp">
        <button class="button-icon open-filter" @click="toggle()">
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
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

import Tabs from '../../components/utils/Tabs';
import Tab from '../../components/utils/Tab';
import SelectableOrder from './toolbar/SelectableOrder';
import ProductListingFilter from './ProductListingFilter';
import SelectedFacets from './toolbar/SelectedFacets';
import SelectableLimit
    from '@@/modules/hubble-frontend-pwa/@hubblecommerce/hubble/core/components/productlist/toolbar/SelectableLimit'

export default {
    name: 'OffCanvasFilter',

    components: {
        SelectableLimit,
        SelectedFacets,
        ProductListingFilter,
        Tabs,
        Tab,
        SelectableOrder
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
        ...mapMutations({
            setPaginationPage: 'modApiRequests/setPaginationPage',
            setSelectedFacetsParam: 'modApiRequests/setSelectedFacetsParam',
            resetSelectedFacetsParam: 'modApiRequests/resetSelectedFacetsParam',
        }),
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
                //this.showFilter = false;
                resolve();
            });
        },
    },
};
</script>
