<template>
    <div :class="elementClass">
        <lazy-product-detail-crosssellings :product-id="productId" />
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'CrossSellingSlot',

    mixins: [slotMixins],

    computed: {
        getProduct() {
            return this.content && this.content.config && this.content.config.product;
        },
        productId() {
            if (this.product) return this.product.id;
            
            return this.getProduct && this.getProduct.value;
        }
    }
};
</script>
