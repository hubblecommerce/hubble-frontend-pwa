<template>
    <div class="row">
        <div class="col-md-10">
            <component :is="leftSlot" :content="getContentByPosition(content.slots, 'left')" />
        </div>
        <div class="col-md-2">
            <component :is="rightSlot" act-as-type="image" :content="getContentByPosition(content.slots, 'right')" />
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
            return this.getSlotByType('text');
        },
        rightSlot() {
            return this.getSlotByType('image');
        },
    },
};
</script>
