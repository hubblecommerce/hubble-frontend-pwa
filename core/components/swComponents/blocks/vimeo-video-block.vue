<template>
    <component :is="getSlot" :content="getContentByPosition(content.slots, 'video')" />
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'VimeoVideoBlock',

    mixins: [blockMixins],

    computed: {
        getSlot() {
            return this.getSlotByPosition(this.content.slots, 'video');
        },
    },
};
</script>
