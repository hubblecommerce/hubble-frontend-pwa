<template>
    <div class="container">
        <div class="product-detail-service-info-wrp">
            <div class="service-wrp">
                <i class="icon icon-truck" />
                <span v-text="$t('Available immediately, delivery time 2-5 working days')" />
            </div>
            <div class="service-wrp">
                <i class="icon icon-package" />
                <span v-text="$t('Free shipping & returns')" />
            </div>
            <div class="service-wrp">
                <i class="icon icon-rewind" />
                <span v-text="$t('100 days right to return')" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProductDetailServiceInfo"
}
</script>
