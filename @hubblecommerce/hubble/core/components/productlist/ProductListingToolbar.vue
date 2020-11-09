<template>
    <div class="toolbar-wrp" :class="extraClass">
        <product-listing-filter />

        <selected-facets />
    </div>
</template>

<script>
import { mapState } from 'vuex';
import ProductListingFilter from './ProductListingFilter';
import SelectedFacets from './toolbar/SelectedFacets';

export default {
    name: 'ProductListingToolbar',

    components: {
        ProductListingFilter,
        SelectedFacets,
    },

    props: {
        extraClass: {
            type: Object,
            required: false,
            default: () => {},
        },
    },
};
</script>
