<template>
    <div>
        <div class="col-md-3">
            <component :is="leftSlot" :content="getContentByPosition(content.slots, 'left')" />
        </div>
        <div class="col-md-3">
            <component :is="centerLeftSlot" :content="getContentByPosition(content.slots, 'center-left')" />
        </div>
        <div class="col-md-3">
            <component :is="centerRightSlot" :content="getContentByPosition(content.slots, 'center-right')" />
        </div>
        <div class="col-md-3">
            <component :is="rightSlot" :content="getContentByPosition(content.slots, 'right')" />
        </div>
    </div>
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'ImageFourColumnBlock',

    mixins: [blockMixins],

    computed: {
        leftSlot() {
            return this.getSlotByPosition(this.content.slots, 'left');
        },
        centerLeftSlot() {
            return this.getSlotByPosition(this.content.slots, 'center-left');
        },
        centerRightSlot() {
            return this.getSlotByPosition(this.content.slots, 'center-right');
        },
        rightSlot() {
            return this.getSlotByPosition(this.content.slots, 'right');
        },
    },
};
</script>

<style scoped></style>
