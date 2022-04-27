<template>
    <component :is="contentSlot" :content="getContentByPosition(content.slots, 'content')" />
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'CrossSellingBlock',

    mixins: [blockMixins],

    computed: {
        contentSlot() {
            return this.getSlotByPosition(this.content.slots, 'content');
        },
    },
};
</script>
