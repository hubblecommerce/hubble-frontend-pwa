<template>
    <div :class="elementClass">
        <lazy-product-detail-crosssellings :product-id="content.config.product.value" />
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'CrossSellingSlot',

    mixins: [slotMixins],
};
</script>
