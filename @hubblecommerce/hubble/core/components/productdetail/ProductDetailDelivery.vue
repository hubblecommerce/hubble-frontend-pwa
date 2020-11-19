<template>
    <div class="delivery-info">
        <p v-if="item.delivery_time" class="in-stock">
            <span>{{ $t('delivery_time') }}</span> <span v-text="item.delivery_time.name" />
        </p>
        <p v-if="item.shipping_free">
            <strong>{{ $t('no shipping costs') }}</strong>
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
