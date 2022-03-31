<template>
    <div :class="elementClass">
        <product-detail-buybox v-if="getProduct !== null" :data-product="getProduct" />
    </div>
</template>

<script>
import { slotMixins } from '../helper';
import { mappingProduct } from '@/utils/api-mapping-helper';

export default {
    name: 'BuyBoxSlot',
    mixins: [slotMixins],

    computed: {
        getProduct() {
            if (this.product) return this.product;

            return this.content && this.content.data && this.content.data.product && mappingProduct({ product: this.content.data.product });
        },
    },
};
</script>
