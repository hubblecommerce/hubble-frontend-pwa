<template>
    <div :class="[elementClass, { 'has-vertical-alignment': verticalAlign }]">
        <template v-if="verticalAlign">
            <div class="cms-element-alignment" :class="verticalAlign" v-html="rawHtml" />
        </template>

        <template v-else>
            <div v-html="rawHtml" />
        </template>
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'TextSlot',
    mixins: [slotMixins],
    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        rawHtml() {
            return this.content && this.content.data && this.content.data.content;
        },
        verticalAlign() {
            if (this.content.config && this.content.config.verticalAlign) {
                if (this.content.config.verticalAlign.value === 'center') {
                    return 'align-self-center';
                }
                if (this.content.config.verticalAlign.value === 'flex-end') {
                    return 'align-self-end';
                }
                if (this.content.config.verticalAlign.value === 'flex-start') {
                    return 'align-self-start';
                }
            }

            return '';
        },
    },
};
</script>
