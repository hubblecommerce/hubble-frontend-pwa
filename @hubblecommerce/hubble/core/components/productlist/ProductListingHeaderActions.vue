<template>
    <div class="product-listing-header-actions-wrp">
        <div class="back-btn-wrp">
            <button class="button-icon" @click="historyBack()">
                <i class="icon icon-arrow-left" />
                <span class="hidden-link-name">{{ $t('Back') }}</span>
                <material-ripple />
            </button>
        </div>

        <off-canvas-filter />
    </div>
</template>

<script>
import OffCanvasFilter from './OffcanvasFilter';
export default {
    name: 'ProductListingHeaderActions.vue',
    components: { OffCanvasFilter },
    methods: {
        historyBack: function () {
            this.$router.go(-1);
        },
    },
};
</script>
