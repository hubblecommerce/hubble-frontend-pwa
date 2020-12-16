<template>
    <div class="toolbar-wrp">
        <div class="top-toolbar" :class="extraClass">
            <product-listing-filter v-if="$mq === 'lg'"/>
            <off-canvas-filter v-if="$mq === 'md'"/>
            <selected-facets v-if="$mq === 'lg'"/>
        </div>

        <div class="bottom-toolbar">
            <pagination/>
            <selectable-order class="selectable-order" :data-options="optionsSorter" />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'ProductListingToolbar',

    components: {
        OffCanvasFilter: () => ('./OffcanvasFilter'),
        ProductListingFilter: () => ('./ProductListingFilter'),
        SelectedFacets: () => ('./toolbar/SelectedFacets'),
        Pagination: () => ('./toolbar/Pagination'),
        SelectableOrder: () => ('./toolbar/SelectableOrder'),
    },

    props: {
        extraClass: {
            type: Object,
            required: false,
            default: () => {},
        },
    },

    computed: {
        ...mapState({
            optionsSorter: state => state.modApiRequests.optionsSorter,
        }),
    }
};
</script>
