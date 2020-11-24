<template>
    <component :is="currentComponent" v-if="currentComponent !== ''" />
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: "TheMobileHeaderActions",
    components: {
        ProductDetailHeaderActions: () => import('../productdetail/ProductDetailHeaderActions'),
        ProductListingHeaderActions: () => import('../productlist/ProductListingHeaderActions'),
    },
    computed: {
        ...mapState({
            pageType: state => state.modApiResources.pageType,
        }),
        currentComponent: function() {
            if(this.pageType === 'category') {
                return 'product-listing-header-actions';
            }
            if(this.pageType === 'product') {
                return 'product-detail-header-actions';
            }
        }
    },
}
</script>
