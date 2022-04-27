<template>
    <component :is="getSlot" :content="getContentByPosition(content.slots, 'imageSlider')" />
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'ImageSliderBlock',

    mixins: [blockMixins],

    computed: {
        getSlot() {
            return this.getSlotByPosition(this.content.slots, 'imageSlider');
        },
    },
};
</script>

<style scoped></style>
