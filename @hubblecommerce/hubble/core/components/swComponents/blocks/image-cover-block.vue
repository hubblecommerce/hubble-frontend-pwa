<template>
    <div class="row">
        <div class="col-12">
            <component :is="getSlot" :content="getContentByPosition(content.slots, 'image')" />
        </div>
    </div>
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'ImageCoverBlock',

    mixins: [blockMixins],

    computed: {
        getSlot() {
            return this.getSlotByPosition(this.content.slots, 'image');
        },
    },
};
</script>

<style scoped></style>
