<template>
    <div :class="elementClass">
        <nuxt-link class="button button-primary" :to="content.config.url.value">{{ content.config.linkText.value }}</nuxt-link>
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'ExtendedLinkSlot',
    mixins: [slotMixins],
    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
    },
};
</script>
