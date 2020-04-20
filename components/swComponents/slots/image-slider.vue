<template>
    <div :class="elementClass" class="sw-image-slider">
        <div class="cms-element-alignment" :class="verticalAlign">
            <client-only>
                <slider
                    :controls="true"
                    :gutter="10"
                    :controls-text="controls"
                    :edge-padding="10"
                    :nav="false"
                    :lazyload="true"
                    :items="1"
                >
                    <template v-for="item in imageItems">
                        <img-lazy :src="item.media.url" :alt-info="item.media.alt" :title-info="item.media.title" />
                    </template>
                </slider>
            </client-only>
        </div>
    </div>
</template>

<script>
    import { slotMixins } from '../helper'
    export default {
        name: 'ImageSliderSlot',
        components: { },
        mixins: [slotMixins],
        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return{
                imageItems: [],
                controls: [
                    '<i class="icon icon-chevron-left"></i><span class="hidden-link-name">Navigate left</span>',
                    '<i class="icon icon-chevron-right"></i><span class="hidden-link-name">Navigate right</span>'
                ]
            }
        },

        computed: {
            verticalAlign() {
                if(this.content.config && this.content.config.verticalAlign) {
                    if(this.content.config.verticalAlign.value === "center") {
                        return 'align-self-center'
                    }
                    if(this.content.config.verticalAlign.value === "flex-end") {
                        return 'align-self-end'
                    }
                    if(this.content.config.verticalAlign.value === "flex-end") {
                        return 'align-self-start'
                    }
                }
                return '';
            }
        },

        created() {
            this.imageItems = this.content.data.sliderItems;
        }
    };
</script>

<style lang="scss">
    .sw-image-slider {
        .img-lazy-wrp {
            .LazyImage {
                width: 100% !important;
            }
        }
    }
</style>
