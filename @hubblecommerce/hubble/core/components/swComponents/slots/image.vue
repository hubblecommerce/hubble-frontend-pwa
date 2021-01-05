<template>
    <div :class="elementClass">
        <div v-if="verticalAlign" class="cms-element-alignment" :class="verticalAlign">
            <div class="cms-image-container" :class="setDisplayMode" :style="minHeight">
                <img-lazy
                    v-if="imgUrl != null"
                    class="cms-image"
                    :classes="`cms-image ${setDisplayMode}`"
                    :src="imgUrl"
                    :alt-info="alt"
                    :alt="alt"
                    :title-info="title"
                />
            </div>
        </div>

        <template v-else>
            <div class="cms-image-container" :class="setDisplayMode" :style="minHeight">
                <img-lazy
                    v-if="imgUrl != null"
                    class="cms-image"
                    :classes="`cms-image ${setDisplayMode}`"
                    :src="imgUrl"
                    :alt-info="alt"
                    :alt="alt"
                    :title-info="title"
                />
            </div>
        </template>
    </div>
</template>

<script>
import { slotMixins } from '../helper';
export default {
    name: 'ImageSlot',
    mixins: [slotMixins],
    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            sm: 'sm',
        };
    },
    computed: {
        getMedia() {
            return this.content && this.content.data && this.content.data.media;
        },
        imgUrl() {
            return this.getMedia && this.getMedia.url;
        },
        imgTypeSvg() {
            this.imgUrl && this.imgUrl.includes('svg');
        },
        alt() {
            return this.getMedia && this.getMedia.alt;
        },
        title() {
            return this.getMedia && this.getMedia.title;
        },
        displayMode() {
            return `is-${this.content.config.displayMode.value}`;
        },
        setDisplayMode() {
            if (this.$mq !== this.sm || this.imgTypeSvg) {
                return this.displayMode;
            }
            return '';
        },
        minHeight() {
            if (this.content.config.displayMode.value === 'cover') {
                return {
                    minHeight: `${this.content.config.minHeight.value}${
                        this.content.config.minHeight.value.includes('px') ? '' : 'px'
                    }`,
                };
            }

            return {};
        },
        verticalAlign() {
            if (this.content.config && this.content.config.verticalAlign) {
                if (this.content.config.verticalAlign.value === 'center') {
                    return 'align-self-center';
                }
                if (this.content.config.verticalAlign.value === 'flex-end') {
                    return 'align-self-end';
                }
                if (this.content.config.verticalAlign.value === 'flex-end') {
                    return 'align-self-start';
                }
            }
            return '';
        },
    },
};
</script>
