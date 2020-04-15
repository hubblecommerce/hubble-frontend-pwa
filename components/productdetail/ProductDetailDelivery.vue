<template>
    <div class="delivery-info">
        <p v-if="item.delivery_time" class="availability bottom in-stock">
            <span>{{ $t('delivery_time') }}</span> <span v-text="item.delivery_time.name"></span>
        </p>
        <p v-if="item.shipping_free">
            <span class="bold-text">{{ $t('no shipping costs') }}</span>
        </p>
    </div>
</template>

<script>
    export default {
        name: "ProductDetailDelivery",

        props: {
            item: {
                type: Object,
                required: true
            }
        }
    }
</script>
