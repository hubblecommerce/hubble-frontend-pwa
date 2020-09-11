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

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },
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
