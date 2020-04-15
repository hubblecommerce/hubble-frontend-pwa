<template>
    <div class="toolbar-wrp" :class="extraClass">
        <product-listing-filter class="" />

        <selectable-limit :data-options="optionsLimit" />

        <selectable-order :data-options="optionsSorter" />

        <pagination />

        <selected-facets />

        <ItemCount />
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import ProductListingFilter from './ProductListingFilter'
    import SelectableLimit from './toolbar/SelectableLimit.vue';
    import SelectableOrder from './toolbar/SelectableOrder.vue';
    import Pagination from "./toolbar/Pagination";
    import ItemCount from './toolbar/ItemCount'
    import SelectedFacets from './toolbar/SelectedFacets'

    export default {
        name: 'ProductListingToolbar',

        components: {
            SelectedFacets,
            ItemCount,
            ProductListingFilter,
            Pagination,
            SelectableLimit,
            SelectableOrder
        },

        props: {
            extraClass: {
                type: Object,
                required: false,
                default: () => {}
            },
        },

        computed: {
            ...mapState({
                optionsLimit: state => state.modApiRequests.optionsLimit,
                optionsSorter: state => state.modApiRequests.optionsSorter,
            }),

        },
    }
</script>
