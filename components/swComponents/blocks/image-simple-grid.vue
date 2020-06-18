<template>
    <div>
        <div class="col-md-6 image-simple-grid__side-images">
            <div class="image-simple-grid__side-images--top">
                <component :is="leftTopSlot" :content="getContentByPosition(content.slots, 'left-top')" />
            </div>

            <component :is="leftBottomSlot" :content="getContentByPosition(content.slots, 'left-bottom')" />
        </div>
        <div class="col-md-6">
            <component :is="rightSlot" :content="getContentByPosition(content.slots, 'right')" />
        </div>
    </div>
</template>
<script>
    import { blockMixins } from '../helper'

    export default {
        name: 'ImageSimpleGridBlock',

        mixins: [blockMixins],

        props: {
            content: {
                type: Object,
                default: () => ({})
            }
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
            }
        }
    }
</script>

<style scoped>
    .image-simple-grid__side-images {
        height: 100%;
    }

    .image-simple-grid__side-images--top {
        margin-bottom: 40px;
    }
</style>
