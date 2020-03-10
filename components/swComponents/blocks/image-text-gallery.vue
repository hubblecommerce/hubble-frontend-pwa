<template>
    <div>
        <div class="col-md-4">
            <div class="image-text-gallery-card">
                <component :is="leftImageSlot" class="col-md-4" :content="getContentByPosition(content.slots, 'left-image')" />
                <component :is="leftTextSlot" class="col-md-4" :content="getContentByPosition(content.slots, 'left-text')" />
            </div>
        </div>
        <div class="col-md-4">
            <div class="image-text-gallery-card">
                <component :is="centerImageSlot" class="col-md-4" :content="getContentByPosition(content.slots, 'center-image')" />
                <component :is="centerTextSlot" class="col-md-4" :content="getContentByPosition(content.slots, 'center-text')" />
            </div>
        </div>
        <div class="col-md-4">
            <div class="image-text-gallery-card">
                <component :is="rightImageSlot" class="col-md-4" :content="getContentByPosition(content.slots, 'right-image')" />
                <component :is="rightTextSlot" class="col-md-4" :content="getContentByPosition(content.slots, 'right-text')" />
            </div>
        </div>
    </div>
</template>
<script>
    import { blockMixins } from '../helper'

    export default {
        name: 'ImageTextGalleryBlock',

        mixins: [blockMixins],

        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },
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
        }
    }
</script>

<style scoped>

</style>
