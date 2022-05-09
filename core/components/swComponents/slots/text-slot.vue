<template>
    <div :class="[elementClass, { 'has-vertical-alignment': verticalAlign, 'has-data-mapping': hasProductDataMapping }]">
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
        hasProductDataMapping() {
            return this.content && this.content.config && this.content.config.content && this.content.config.content.source === 'mapped';
        },
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
@import '~assets/scss/hubble/links';

.cms-element-text {
    h2, h3, h4, h5, h6 {
        margin-bottom: 20px;
    }

    div + div {
        margin-top: 10px;
    }

    div > a {
        @include text-link;
    }

    .cms-element-alignment {
        flex-grow: 1;
    }

    .cms-block-text-on-image &.has-data-mapping {
        color: white;
        text-align: center;
        font-size: 30px;
    }

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
