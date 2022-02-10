<template>
    <div>
        <div class="col-12">
            <component :is="getSlot" :content="getContentByPosition(content.slots, 'content')" />
        </div>
    </div>
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'FormBlock',

    mixins: [blockMixins],

    computed: {
        getSlot() {
            return this.getSlotByPosition(this.content.slots, 'content');
        },
    },
};
</script>
