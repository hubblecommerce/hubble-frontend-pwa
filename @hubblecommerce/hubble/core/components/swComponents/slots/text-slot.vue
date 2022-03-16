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

<style lang="scss">
.cms-element-text {
    .cms-block-center-text & {
        padding: 30px;
    }

    .cms-block-image-text-bubble &,
    .cms-block-image-text-row & {
        padding-top: 20px;
    }

    .cms-block-image-text-gallery & {
        padding: 20px;
    }

    .cms-block-text-on-image & {
        padding: 30px;
        align-items: center;
        min-height: 240px;
    }

    .cms-block-text-on-image.container & {
        padding-left: 0;
        padding-right: 0;
    }

    .cms-block-image-text-cover & {
        padding-top: 30px;
    }
}
</style>
