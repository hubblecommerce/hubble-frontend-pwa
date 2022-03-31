<template>
    <div class="row">
        <div class="col-md-10">
            <component :is="leftSlot" :product="product" :content="getContentByPosition(content.slots, 'left')" />
        </div>
        <div class="col-md-2">
            <component :is="rightSlot" :product="product" :content="getContentByPosition(content.slots, 'right')" />
        </div>
    </div>
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'ProductHeadingBlock',

    mixins: [blockMixins],

    computed: {
        leftSlot() {
            return this.getSlotByPosition(this.content.slots, 'left');
        },
        rightSlot() {
            return this.getSlotByPosition(this.content.slots, 'right');
        },
    },
};
</script>
