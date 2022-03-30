<template>
    <div class="row">
        <div :class="'col-' + leftColumnCount">
            <component :is="leftSlot" :content="getContentByPosition(content.slots, 'left')" />
        </div>
        <div :class="'col-' + rightColumnCount">
            <component :is="rightSlot" :content="getContentByPosition(content.slots, 'right')" />
        </div>
    </div>
</template>

<script>
import { blockMixins } from '../helper';

export default {
    name: 'TwoColumnGridBlock',

    mixins: [blockMixins],

    computed: {
        leftColumnCount() {
            return this.content.customFields.division.split('/')[0];
        },
        rightColumnCount() {
            return this.content.customFields.division.split('/')[1];
        },
        leftSlot() {
            return this.getSlotByPosition(this.content.slots, 'left');
        },
        rightSlot() {
            return this.getSlotByPosition(this.content.slots, 'right');
        },
    },
};
</script>

<style scoped></style>
