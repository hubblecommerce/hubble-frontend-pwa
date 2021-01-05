<template>
    <div class="product-detail-header-actions-wrp">
        <div class="back-btn-wrp">
            <button class="button-icon" @click="historyBack()">
                <i class="icon icon-arrow-left" />
                <span class="hidden-link-name" v-text="$t('Back')" />
                <material-ripple />
            </button>
        </div>

        <div class="share-icon-wrp">
            <button class="button-icon">
                <i class="icon icon-share-2" />
                <span class="hidden-link-name" v-text="'Share Site'" />
                <material-ripple />
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductDetailHeaderActions',
    methods: {
        historyBack: function () {
            this.$router.go(-1);
        },
    },
};
</script>
