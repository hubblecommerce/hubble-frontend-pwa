<template>
    <div :class="[elementClass, getDisplayModeClass]">
        <iframe :src="getVideoUrl" class="cms-element-youtube-video__video" />
    </div>
</template>

<script>
import { slotMixins } from '../helper';
export default {
    name: 'YoutubeVideoSlot',

    mixins: [slotMixins],

    computed: {
        getVideoUrl() {
            return `https://www.youtube-nocookie.com/embed/${this.content.config.videoID.value}?rel=0&${this.getAutoPlay}${this.getLoop}${this.getShowControls}${this.getStart}${this.getEnd}disablekb=1`;
        },
        getAutoPlay() {
            return !this.content.config.autoPlay.value ? '' : 'autoplay=1&';
        },
        getLoop() {
            return !this.content.config.loop.value ? '' : `loop=1&playlist=${this.getVideoID}&`;
        },
        getShowControls() {
            return this.content.config.showControls.value ? '' : 'controls=0&';
        },
        getStart() {
            return !this.content.config.start.value ? '' : `start=${this.content.config.start.value}&`;
        },
        getEnd() {
            return !this.content.config.end.value ? '' : `end=${this.content.config.end.value}&`;
        },
        getDisplayMode() {
            return this.content.config.displayMode.value;
        },
        getDisplayModeClass() {
            return this.getDisplayMode === 'standard' ? '' : `is-${this.getDisplayMode}`;
        },
    },
};
</script>

<style lang="scss">
.cms-element-youtube-video {
    position: relative;
    width: 100%;

    &.is--streched {
        height: 100%;
    }

    &::before {
        display: block;
        content: '';
        width: 100%;
        padding-top: calc((9 / 16) * 100%);
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
