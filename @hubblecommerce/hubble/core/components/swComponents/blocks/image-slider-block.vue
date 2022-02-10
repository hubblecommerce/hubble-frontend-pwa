<template>
    <div>
        <div class="col-12">
            <component :is="getSlot" :content="getContentByPosition(content.slots, 'imageSlider')" />
        </div>
    </div>
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
