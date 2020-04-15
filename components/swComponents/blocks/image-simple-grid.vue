<template>
    <div>
        <div class="col-md-6">
            <component :is="leftTopSlot" class="col-md-4" :content="getContentByPosition(content.slots, 'left-top')" />
            <component :is="leftBottomSlot" class="col-md-4" :content="getContentByPosition(content.slots, 'left-bottom')" />
        </div>
        <div class="col-md-6">
            <component :is="rightSlot" class="col-md-4" :content="getContentByPosition(content.slots, 'right')" />
        </div>
    </div>
</template>
<script>
import { blockMixins } from '../helper';

export default {
    name: 'ImageSimpleGridBlock',

    mixins: [blockMixins],

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        leftTopSlot() {
            return this.getSlotByPosition(this.content.slots, 'left-top');
        },
        leftBottomSlot() {
            return this.getSlotByPosition(this.content.slots, 'left-bottom');
        },
        rightSlot() {
            return this.getSlotByPosition(this.content.slots, 'right');
        },
    },
};
</script>

<style scoped></style>
