<template>
    <div class="row">
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
import { blockMixins } from '../helper';

export default {
    name: 'ImageSimpleGridBlock',

    mixins: [blockMixins],

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

<style lang="scss">
@import '~assets/scss/hubble/variables';

.cms-block-image-simple-grid {
    .image-simple-grid__side-images {
        height: 100%;
    }

    .right {
        height: 100%;
    }

    .image-simple-grid__side-images--top {
        margin-bottom: $grid-gutter-width;
    }

    .left-top {
        margin-bottom: $grid-gutter-width;
    }
}

@media (max-width: 768px) {
    .cms-block-image-simple-grid {
        .left-bottom {
            margin-bottom: $grid-gutter-width;
        }
    }
}
</style>
