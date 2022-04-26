<template>
    <div :class="elementClass">
        <product-detail-buybox v-if="product !== null" :data-product="product" />
    </div>
</template>

<script>
import { slotMixins } from '../helper';
import { mappingProduct } from '@/utils/api-mapping-helper';

export default {
    name: 'BuyBoxSlot',
    mixins: [slotMixins],

    computed: {
        product() {
            return this.content && this.content.data && this.content.data.product && mappingProduct({ product: this.content.data.product, configurator: this.content.data.configuratorSettings });
        },
    },
};
</script>
