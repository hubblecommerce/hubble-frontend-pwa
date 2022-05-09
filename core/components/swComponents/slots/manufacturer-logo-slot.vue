<template>
    <div :class="elementClass">
        <div v-if="verticalAlign" class="cms-element-alignment" :class="verticalAlign">
            <div class="cms-image-container" :class="setDisplayMode" :style="minHeight">
                <component
                    :is="linkUrl ? 'a' : 'div'"
                    :href="linkUrl || null"
                    :target="linkNewTab ? '_blank' : null"
                    :class="linkUrl ? 'cms-image-link' : 'cms-image-wrp'"
                >
                    <img v-if="imgUrl != null" class="cms-image" :class="`cms-image ${setDisplayMode}`" :src="imgUrl" :alt="alt" />
                </component>
            </div>
        </div>

        <template v-else>
            <div class="cms-image-container" :class="setDisplayMode" :style="minHeight">
                <component
                    :is="linkUrl ? 'a' : 'div'"
                    :href="linkUrl || null"
                    :target="linkNewTab ? '_blank' : null"
                    :class="linkUrl ? 'cms-image-link' : 'cms-image-wrp'"
                >
                    <img v-if="imgUrl != null" class="cms-image" :class="`cms-image ${setDisplayMode}`" :src="imgUrl" :alt="alt" />
                </component>
            </div>
        </template>
    </div>
</template>

<script>
import { slotMixins } from '../helper';
export default {
    name: 'ManufacturerLogoSlot',
    mixins: [slotMixins],

    data() {
        return {
            sm: 'sm',
        };
    },
    computed: {
        getMedia() {
            return this.content && this.content.data && this.content.data.media;
        },
        linkUrl() {
            return (this.content && this.content.data && this.content.data.url) ||
                (this.content.data.manufacturer &&  this.content.data.manufacturer.link);
        },
        linkNewTab() {
            return this.content && this.content.data && this.content.data.newTab;
        },
        imgUrl() {
            return this.getMedia && this.getMedia.url;
        },
        imgTypeSvg() {
            return this.imgUrl && this.imgUrl.includes('svg');
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
                    minHeight: `${this.content.config.minHeight.value}${this.content.config.minHeight.value.includes('px') ? '' : 'px'}`,
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

<style lang="scss">
@import '~assets/scss/hubble/variables';

.cms-element-manufacturer-logo {
    position: relative;
    height: 100%;

    .cms-image {
        display: block;
        max-width: 100%;
        margin: 0 auto;
        width: 100%;
    }

    .cms-image-container {
        @media (max-width: 767px) {
            min-height: auto !important;
        }

        max-width: 100%;
        position: relative;
        display: flex;

        &.is-cover {
            height: 100%;

            .cms-image {
                object-fit: cover;
                height: 100%;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
        }

        &.is-cover,
        &.is-stretch {
            .cms-image {
                width: 100%;
            }
        }

        &.is-standard {
            height: 100%;
            object-fit: cover;
        }
    }

    .cms-image-link,
    .cms-image-wrp {
        width: 100%;
        display: block;
    }
}
</style>
