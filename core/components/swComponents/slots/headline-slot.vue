<template>
    <div :class="elementClass">
        <component :is="content.config.type.value" :class="[elementClass + '__el', 'is--' + content.slot]">{{
            content.config.content.value
        }}</component>
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'HeadlineSlot',
    mixins: [slotMixins],
};
</script>
