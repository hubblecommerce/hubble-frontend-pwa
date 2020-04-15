<template>
    <div :class="elementClass">
        <product-listing-filter />
        <selected-facets />
    </div>
</template>

<script>
    import ProductListingFilter from '../../productlist/ProductListingFilter'
    import { slotMixins } from '../helper'
    import SelectedFacets from '../../productlist/toolbar/SelectedFacets'
    export default {
        name: 'SidebarFilterSlot',
        components: { SelectedFacets, ProductListingFilter },
        mixins: [slotMixins],
        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },
    }
</script>
