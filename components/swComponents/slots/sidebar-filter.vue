<template>
    <div :class="elementClass">
        <product-listing-filter />
    </div>
</template>

<script>
    import ProductListingFilter from '../../productlist/ProductListingFilter'
    import { slotMixins } from '../helper'
    export default {
        name: 'SidebarFilterSlot',
        components: { ProductListingFilter },
        mixins: [slotMixins],
        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },
    }
</script>

<style scoped>

</style>
