<template>
    <component :is="getSlot" :content="getContentByPosition(content.slots, 'content')" />
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'TextOnImageBlock',

    mixins: [blockMixins],

    computed: {
        getSlot() {
            return this.getSlotByPosition(this.content.slots, 'content');
        },
    },
};
</script>

<style scoped></style>
