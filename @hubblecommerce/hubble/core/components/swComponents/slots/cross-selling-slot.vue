<template>
    <div :class="elementClass">
        <lazy-product-detail-crosssellings v-if="crossSellings != null" :cross-sellings="crossSellings"  />
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'CrossSellingSlot',

    mixins: [slotMixins],

    computed: {
        crossSellings() {
            return this.content && this.content.data && this.content.data.crossSellings;
        }
    }
};
</script>
