<template>
    <div class="row">
        <div class="col-12">
            <component :is="getSlot" :content="getContentByPosition(content.slots, 'video')" />
        </div>
    </div>
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'YoutubeVideoBlock',

    mixins: [blockMixins],

    computed: {
        getSlot() {
            return this.getSlotByPosition(this.content.slots, 'video');
        },
    },
};
</script>
