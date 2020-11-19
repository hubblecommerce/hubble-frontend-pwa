<template>
    <component class="mobile-header-actions-wrp" :is="currentComponent" v-if="currentComponent !== ''" />
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: "TheMobileHeaderActions",
    components: {
        ProductListingFilter: () => import('../productlist/ProductListingFilter'),
        ProductDetailHeaderActions: () => import('../productdetail/ProductDetailHeaderActions'),
    },
    data() {
        return {
            currentComponent: '',
        };
    },
    computed: {
        ...mapState({
            pageType: state => state.modApiResources.pageType,
        }),
    },
    created() {
        if(this.pageType === 'category') {
            this.currentComponent = 'product-listing-filter';
        }
        if(this.pageType === 'product') {
            this.currentComponent = 'product-detail-header-actions';
        }
    }
}
</script>
