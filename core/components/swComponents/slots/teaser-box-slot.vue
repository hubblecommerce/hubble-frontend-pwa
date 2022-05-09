<template>
    <div v-if="textPosition === 'within'" :class="[elementClass, 'is--' + textPosition]" :style="{ backgroundImage: bgImageStyle }">
        <div :class="elementClass + '__content'" v-html="content.config.content.value" />
    </div>
    <div v-else-if="textPosition === 'below'" :class="[elementClass, 'is--' + textPosition]">
        <div :class="elementClass + '__image'" :style="{ backgroundImage: bgImageStyle }" />
        <div :class="elementClass + '__content'" v-html="content.config.content.value" />
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'TeaserBoxSlot',
    mixins: [slotMixins],

    computed: {
        bgImageUrl() {
            const imageVal = this.content.config.backgroundImage.value;

            if (!imageVal) return null;

            return imageVal.url;
        },
        bgImageStyle() {
            if (!this.bgImageUrl) return null;

            return 'url("' + this.bgImageUrl + '")';
        },
        textPosition() {
            return this.content.config.textPosition.value;
        },
    },
};
</script>

<style lang="scss" scoped>
.cms-element-teaser-box {
    height: 515px;
    display: flex;
    align-items: flex-end;
    width: 100%;
    background-size: cover;
    background-position: center;
    padding: 30px;

    &.is--below {
        flex-direction: column;
        padding: 0;
        height: 760px;
    }

    &__image {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
    }

    &__content {
        width: 100%;
        background-color: white;
        padding: 30px;

        .is--below & {
            background-color: #f7f7fa;
        }
    }
}
</style>
