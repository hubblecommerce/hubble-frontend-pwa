<template>
    <div>
        <component :is="leftSlot" class="col-md-4" :content="getContentByPosition(content.slots, 'left')" />
        <component :is="centerSlot" class="col-md-4" :content="getContentByPosition(content.slots, 'center')" />
        <component :is="rightSlot" class="col-md-4" :content="getContentByPosition(content.slots, 'right')" />
    </div>
</template>
<script>
import { blockMixins } from '../helper';

export default {
    name: 'CenterTextBlock',

    mixins: [blockMixins],

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        leftSlot() {
            return this.getSlotByPosition(this.content.slots, 'left');
        },
        centerSlot() {
            return this.getSlotByPosition(this.content.slots, 'center');
        },
        rightSlot() {
            return this.getSlotByPosition(this.content.slots, 'right');
        },
    },
};
</script>

<style scoped></style>
