<template>
    <div class="toolbar-wrp">
        <div class="top-toolbar" :class="extraClass">
            <product-listing-filter />

            <selected-facets />
        </div>

        <div class="bottom-toolbar">
            <pagination/>
            <selectable-order class="selectable-order" :data-options="optionsSorter" />
        </div>
    </div>
</template>

<script>
import ProductListingFilter from './ProductListingFilter';
import SelectedFacets from './toolbar/SelectedFacets';
import Pagination from './toolbar/Pagination';
import SelectableOrder from './toolbar/SelectableOrder';
import { mapState } from 'vuex'

export default {
    name: 'ProductListingToolbar',

    components: {
        ProductListingFilter,
        SelectedFacets,
        Pagination,
        SelectableOrder,
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
