<template>
    <div :class="elementClass">
        <div :class="getGalleryPositionClass" class="is-cover" :style="getVerticalAlignStyle" style="min-height: 270px">
            <div class="image-gallery__grid">
                <!--                <slider-->
                <!--                    ref="tinySlider"-->
                <!--                    :controls="true"-->
                <!--                    :gutter="15"-->
                <!--                    :controls-text="controls"-->
                <!--                    :edge-padding="10"-->
                <!--                    :nav="false"-->
                <!--                    :loop="true"-->
                <!--                    :mouse-drag="true"-->
                <!--                    :lazyload="true"-->
                <!--                    :items="1"-->
                <!--                    :auto-height="false"-->
                <!--                >-->
                <!--                    <template v-for="item in images" class="image-gallery__grid__container">-->
                <!--                        <img-lazy :key="item.mediaId" :src="item.mediaUrl" />-->
                <!--                    </template>-->
                <!--                </slider>-->
            </div>

            <div v-if="$mq !== 'sm'" class="image-gallery__preview">
                <!--                <slider-->
                <!--                    ref="tinySliderPreview"-->
                <!--                    :controls="true"-->
                <!--                    :gutter="0"-->
                <!--                    :loop="false"-->
                <!--                    :mouse-drag="true"-->
                <!--                    :controls-text="getGalleryPosition === 'underneath' ? controls : controlsLeft"-->
                <!--                    :edge-padding="2"-->
                <!--                    :nav="false"-->
                <!--                    :lazyload="true"-->
                <!--                    :responsive="getGalleryPosition === 'underneath' ? responsiveUnderneath : responsiveLeft"-->
                <!--                    :axis="getGalleryPosition === 'underneath' ? 'horizontal' : 'vertical'"-->
                <!--                >-->
                <!--                    <div v-for="(item, index) in images" :key="item.mediaId" class="image-gallery__grid__container">-->
                <!--                        <button @click.prevent="changeActiveImageToSelected(index)">-->
                <!--                            <img-lazy :src="item.mediaUrl" :class="activeImageIndex === index && 'imageWithBorder'" />-->
                <!--                        </button>-->
                <!--                    </div>-->
                <!--                </slider>-->
            </div>
        </div>
    </div>
</template>

<script>
import { slotMixins } from '../helper';

export default {
    name: 'ImageGallerySlot',
    components: {
        //Slider: () => {
        //    if (process.client) {
        //        return import('vue-tiny-slider');
        //    }
        //},
    },
    mixins: [slotMixins],
    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            images: [],

            controls: [
                '<i class="icon icon-chevron-left"></i><span class="hidden-link-name">Navigate left</span>',
                '<i class="icon icon-chevron-right"></i><span class="hidden-link-name">Navigate right</span>',
            ],

            controlsLeft: [
                '<i class="icon icon-chevron-up"></i><span class="hidden-link-name">Navigate up</span>',
                '<i class="icon icon-chevron-down"></i><span class="hidden-link-name">Navigate down</span>',
            ],

            activeImageIndex: 0,

            responsiveUnderneath: {
                0: {
                    items: 5,
                },
                768: {
                    items: 5,
                },
                1024: {
                    items: 5,
                },
            },

            responsiveLeft: {
                0: {
                    items: 3,
                },
                768: {
                    items: 3,
                },
                1024: {
                    items: 3,
                },
            },
        };
    },
    computed: {
        getDisplayMode() {
            return this.content.config.value;
        },
        getGalleryPosition() {
            return this.content.config.galleryPosition.value;
        },
        getGalleryPositionClass() {
            return `is--preview-${this.getGalleryPosition}`;
        },
        getMinHeight() {
            return this.content.config.minHeight.value;
        },
        getVerticalAlign() {
            return this.content.config.verticalAlign.value;
        },
        getVerticalAlignStyle() {
            if (!this.getVerticalAlign) return null;
            else return `justify-content: ${this.element.config.verticalAlign.value};`;
        },
    },

    watch: {
        activeImageIndex: {
            handler(newValue) {
                if (newValue === undefined) this.activeImageIndex = 0;
                else this.activeImageIndex = newValue;

                if (this.$refs.tinySliderPreview) this.$refs.tinySliderPreview.slider.goTo(newValue);
            },
        },

        $mq: {
            handler() {
                if (this.$refs.tinySliderPreview) {
                    this.$refs.tinySliderPreview.slider.goTo(this.activeImageIndex);
                }
            },
        },
    },

    created() {
        this.images = this.content.config.sliderItems.value;
    },

    mounted() {
        this.$nextTick(() => {
            this.activeImageIndex = 0;

            // @TODO replace tiny slider with hooper
            this.$refs.tinySlider.slider.events.on('indexChanged', (info) => {
                this.activeImageIndex = info.index - 2;

                if (this.$refs.tinySliderPreview) {
                    this.$refs.tinySliderPreview.slider.goTo(this.activeImageIndex === undefined ? 0 : this.activeImageIndex);
                }
            });

            this.activeImageIndex = this.$refs.tinySlider.slider.events.on('indexChanged', (info) => info.index - 2);
        });
    },

    methods: {
        changeActiveImageToSelected(selection) {
            this.activeImageIndex = selection;
            this.$refs.tinySlider.slider.goTo(this.activeImageIndex);
        },
    },
};
</script>
