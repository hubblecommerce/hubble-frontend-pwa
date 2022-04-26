<template>
    <div class="row">
        <div class="col-md-6">
            <component :is="leftSlot" :content="getContentByPosition(content.slots, 'left')" />
        </div>
        <div class="col-md-6">
            <component :is="rightSlot" :content="getContentByPosition(content.slots, 'right')" />
        </div>
    </div>
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'ImageTextBlock',

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

<style scoped></style>
