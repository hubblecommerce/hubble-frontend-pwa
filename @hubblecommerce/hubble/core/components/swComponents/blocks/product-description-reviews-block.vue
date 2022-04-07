<template>
    <div class="row">
        <div class="col-12">
            <component :is="contentSlot" :content="getContentByPosition(content.slots, 'content')" />
        </div>
    </div>
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'ProductDescriptionReviewsBlock',

    mixins: [blockMixins],

    computed: {
        contentSlot() {
            return this.getSlotByPosition(this.content.slots, 'content');
        },
    },
};
</script>
