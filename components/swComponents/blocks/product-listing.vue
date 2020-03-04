<template>
    <div class="col-12">
        <product-listing-slot />
    </div>
</template>

<script>
import ProductListingSlot from '../slots/product-listing'

    export default {
        name: 'ProductListingBlock',
        components: { ProductListingSlot },
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
