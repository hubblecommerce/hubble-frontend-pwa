<template>
    <div class="delivery-info">
        <p v-if="item.delivery_time" class="in-stock">
            <span>{{ 'Delivery time' }}</span> <span v-text="item.delivery_time.name" />
        </p>
        
        <p v-if="item.shipping_free">
            <strong>{{ 'No shipping costs' }}</strong>
        </p>
    </div>
</template>

<script>
export default {
    name: 'ProductDetailDelivery',

    props: {
        item: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.delivery-info {
    margin-bottom: 20px;
    color: $success-accent;
}

@media (min-width: 1024px) {
    .delivery-info {
        margin-bottom: 25px;

        * {
            font-size: 14px;
            font-weight: normal;
        }
    }
}
</style>
