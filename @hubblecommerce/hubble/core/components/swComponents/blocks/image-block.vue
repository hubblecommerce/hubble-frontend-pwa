<template>
    <component :is="getSlot" :content="getContentByPosition(content.slots, 'image')" />
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'ImageBlock',

    mixins: [blockMixins],

    computed: {
        getSlot() {
            return this.getSlotByPosition(this.content.slots, 'image');
        },
    },
};
</script>

<style scoped></style>
