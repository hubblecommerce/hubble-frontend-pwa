<template>
    <div class="product-detail-service-info-wrp">
        <div class="service-wrp">
            <svg-icon icon="truck" type="nostyle"/>
            <span v-text="'Available immediately, delivery time 2-5 working days'" />
        </div>
        <div class="service-wrp">
            <svg-icon icon="package" type="nostyle"/>
            <span v-text="'Free shipping & returns'" />
        </div>
        <div class="service-wrp">
            <svg-icon icon="repeat" type="nostyle"/>
            <span v-text="'100 days right to return'" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductDetailServiceInfo',
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.product-detail-service-info-wrp {
    border: 1px solid $border-color;
    margin-bottom: 20px;

    .service-wrp {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        width: 100%;
        min-height: 65px;
        padding: 12px;

        border-bottom: 1px solid $border-color;

        svg{
            margin-right: 14px;
        }

        &:last-child {
            border-bottom: 0;
        }

        i {
            width: 40px;
            font-size: 21px;
            line-height: 22px;
            text-align: center;
            margin-right: 10px;
        }

        span {
            display: block;
            width: calc(100% - 50px);
            font-size: 14px;
            line-height: 20px;
        }
    }
}

@media (min-width: 1024px) {
    .product-detail-service-info-wrp {
        margin-bottom: 40px;

        .service-wrp {
            padding: 15px;

            span {
                font-size: 16px;
                line-height: 26px;
            }
        }
    }
}
</style>
