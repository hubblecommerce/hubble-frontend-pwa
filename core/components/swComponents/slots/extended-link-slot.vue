<template>
    <div :class="elementClass">
        <nuxt-link :class="content.config.linkCssClasses.value" :to="content.config.url.value">{{ content.config.linkText.value }}</nuxt-link>
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'ExtendedLinkSlot',
    mixins: [slotMixins],
};
</script>
