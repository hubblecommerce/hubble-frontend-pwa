<template>
    <div :class="elementClass">
        <!--        <template v-if="$mq === 'lg'">-->
        <!--            <product-listing-filter />-->
        <!--            <selected-facets />-->
        <!--        </template>-->
        <!--        <template v-else>-->
        <!--            <off-canvas-filter :button-class="'button w-100'" />-->
        <!--        </template>-->
    </div>
</template>

<script>
//import ProductListingFilter from '../../productlist/ProductListingFilter';
import { slotMixins } from '../helper';
//import SelectedFacets from '../../productlist/toolbar/SelectedFacets';
//import OffCanvasFilter from '../../productlist/OffcanvasFilter';
export default {
    name: 'SidebarFilterSlot',
    //components: { OffCanvasFilter, SelectedFacets, ProductListingFilter },
    mixins: [slotMixins],
    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },
};
</script>
