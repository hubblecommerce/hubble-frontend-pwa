<template>
    <component :is="currentComponent" v-if="currentComponent !== ''" />
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: "TheActionHeaderIcon",
    components: {
        ProductListingFilter: () => import('../productlist/ProductListingFilter'),
        ShareIcon: () => import('../utils/ShareIcon'),
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
            this.currentComponent = 'share-icon';
        }
    }
}
</script>

<style scoped>

</style>
