<template>
    <div class="row">
        <div class="col-md-4">
            <div class="image-text-gallery-card">
                <component :is="leftImageSlot" :content="getContentByPosition(content.slots, 'left-image')" />
                <component :is="leftTextSlot" :content="getContentByPosition(content.slots, 'left-text')" />
            </div>
        </div>
        <div class="col-md-4">
            <div class="image-text-gallery-card">
                <component :is="centerImageSlot" :content="getContentByPosition(content.slots, 'center-image')" />
                <component :is="centerTextSlot" :content="getContentByPosition(content.slots, 'center-text')" />
            </div>
        </div>
        <div class="col-md-4">
            <div class="image-text-gallery-card">
                <component :is="rightImageSlot" :content="getContentByPosition(content.slots, 'right-image')" />
                <component :is="rightTextSlot" :content="getContentByPosition(content.slots, 'right-text')" />
            </div>
        </div>
    </div>
</template>
<script>
import { blockMixins } from '../helper';

export default {
    name: 'ImageTextGalleryBlock',

    mixins: [blockMixins],

    computed: {
        leftImageSlot() {
            return this.getSlotByPosition(this.content.slots, 'left-image');
        },
        leftTextSlot() {
            return this.getSlotByPosition(this.content.slots, 'left-text');
        },
        centerImageSlot() {
            return this.getSlotByPosition(this.content.slots, 'center-image');
        },
        centerTextSlot() {
            return this.getSlotByPosition(this.content.slots, 'center-text');
        },
        rightImageSlot() {
            return this.getSlotByPosition(this.content.slots, 'right-image');
        },
        rightTextSlot() {
            return this.getSlotByPosition(this.content.slots, 'right-text');
        },
    },
};
</script>

<style scoped></style>
