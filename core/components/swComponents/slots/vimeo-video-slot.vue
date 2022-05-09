<template>
    <div :class="elementClass">
        <iframe :src="getVideoUrl" class="cms-element-vimeo-video__video" />
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'VimeoVideoSlot',

    mixins: [slotMixins],

    computed: {
        getVideoID() {
            return this.content.config.videoID.value;
        },
        getVideoUrl() {
            return `https://player.vimeo.com/video/${this.getVideoID}?${this.getAutoPlay}${this.getByLine}${this.getColor}${this.getDoNotTrack}${this.getLoop}${this.getControls}${this.getTitle}${this.getPortrait}`;
        },
        getAutoPlay() {
            return !this.content.config.autoplay.value ? '' : `autoplay=true&`;
        },
        getByLine() {
            return this.content.config.byLine.value ? '' : `byline=false&`;
        },
        getColor() {
            return !this.content.config.color.value ? '' : `color=${this.content.config.color.value}&`.replace('#', '');
        },
        getControls() {
            return this.content.config.controls.value ? '' : `controls=false`;
        },

        getDoNotTrack() {
            // vimeo default === false
            return !this.content.config.doNotTrack.value ? '' : `dnt=true&`;
        },
        getLoop() {
            return !this.content.config.loop.value ? '' : `loop=true&`;
        },
        getPortrait() {
            return this.content.config.portrait.value ? '' : `portrait=false`;
        },
        getTitle() {
            return this.content.config.title.value ? '' : `title=false&`;
        },
    },
};
</script>

<style lang="scss">
.cms-element-vimeo-video {
    position: relative;
    width: 100%;

    &::before {
        display: block;
        content: '';
        width: 100%;
        padding-top: 56.25%;
    }

    &__video {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border: 0 none;
    }
}
</style>
