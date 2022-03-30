<template>
    <div class="row">
        <div class="col-12">
            <component :is="getSlot" :sizing-mode="sizingMode" :content="getContentByPosition(content.slots, 'productSlider')" />
        </div>
    </div>
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
