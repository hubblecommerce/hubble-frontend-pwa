<template>
    <component :is="getSlot" :sizing-mode="sizingMode" :content="getContentByPosition(content.slots, 'productSlider')" />
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'ProductSliderBlock',

    mixins: [blockMixins],

    computed: {
        getSlot() {
            return this.getSlotByPosition(this.content.slots, 'productSlider');
        },
    },
};
</script>

<style scoped></style>
