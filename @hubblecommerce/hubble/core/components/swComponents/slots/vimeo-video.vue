<template>
    <div :class="elementClass">
        <iframe :src="getVideoUrl" class="cms-element-vimeo-video__video" />
    </div>
</template>

<script>
import { slotMixins } from '../helper';
import _ from 'lodash';

export default {
    name: 'VimeoVideoSlot',

    mixins: [slotMixins],

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },
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
            return !this.content.config.color.value
                ? ''
                : _.replace(`color=${this.content.config.color.value}&`, '#', '');
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
