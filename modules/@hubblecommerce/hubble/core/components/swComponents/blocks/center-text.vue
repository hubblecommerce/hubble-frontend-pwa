<template>
    <div>
        <div class="col-md-4">
            <component :is="leftSlot" :content="getContentByPosition(content.slots, 'left')" />
        </div>

        <div class="col-md-4">
            <component :is="centerSlot" :content="getContentByPosition(content.slots, 'center')" />
        </div>

        <div class="col-md-4">
            <component :is="rightSlot" :content="getContentByPosition(content.slots, 'right')" />
        </div>
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
