<template>
    <div :class="elementClass">
        <div :class="getGalleryPositionClass" class="is-cover" :style="getVerticalAlignStyle" style="min-height: 270px">
            <div class="image-gallery__grid">
                <slider
                    ref="tinySlider"
                    :controls="true"
                    :gutter="15"
                    :controls-text="controls"
                    :edge-padding="10"
                    :nav="false"
                    :loop="true"
                    :mouse-drag="true"
                    :lazyload="true"
                    :items="1"
                    :auto-height="false"
                >
                    <template v-for="item in images" class="image-gallery__grid__container">
                        <img-lazy :key="item.mediaId" :src="item.mediaUrl" />
                    </template>
                </slider>
            </div>

            <div v-if="$mq !== 'sm'" class="image-gallery__preview">
                <slider
                    ref="tinySliderPreview"
                    :controls="true"
                    :gutter="0"
                    :loop="false"
                    :mouse-drag="true"
                    :controls-text="getGalleryPosition === 'underneath' ? controls : controlsLeft"
                    :edge-padding="2"
                    :nav="false"
                    :lazyload="true"
                    :items="getGalleryPosition === 'underneath' ? 5 : getPreviewImageCount"
                    :axis="getGalleryPosition === 'underneath' ? 'horizontal' : 'vertical'"
                    :auto-height="false"
                >
                    <div v-for="(item, index) in images" :key="item.mediaId" class="image-gallery__grid__container">
                        <button @click.prevent="changeActiveImageToSelected(index)">
                            <img-lazy :src="item.mediaUrl"
                                      :class="(activeImageIndex === index) && 'imageWithBorder'"
                            />
                        </button>
                    </div>
                </slider>
            </div>


        </div>
    </div>
</template>

<script>
    import { slotMixins } from '../helper'

    export default {
        name: "ImageGallerySlot",
        mixins: [slotMixins],
        props: {
            content: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                images: [],

                controls: [
                    '<i class="icon icon-chevron-left"></i><span class="hidden-link-name">Navigate left</span>',
                    '<i class="icon icon-chevron-right"></i><span class="hidden-link-name">Navigate right</span>'
                ],

                controlsLeft: [
                    '<i class="icon icon-chevron-up"></i><span class="hidden-link-name">Navigate up</span>',
                    '<i class="icon icon-chevron-down"></i><span class="hidden-link-name">Navigate down</span>'
                ],

                activeImageIndex: 0
            }
        },
        computed: {
            getPreviewImageCount () {
                return (this.$mq === 'sm' || this.$mq === 'md') ? 3 : 4;
            },
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
              else return `justify-content: ${this.element.config.verticalAlign.value};`
            }
        },

        watch: {
            activeImageIndex: {
                immediate: true,
                handler(newValue) {
                    if (newValue === undefined) this.activeImageIndex = 0;
                }
            }
        },

        created() {
            this.images = this.content.config.sliderItems.value;
        },

        mounted() {
            this.activeImageIndex = 0;

            if (this.$mq !== 'sm') this.$refs.tinySliderPreview.slider.goTo(this.activeImageIndex);

            if (this.$mq !== 'sm') {
                this.$refs.tinySlider.slider.events.on('indexChanged', (info) => {

                    this.activeImageIndex = info.index - 2;

                    this.$refs.tinySliderPreview.slider.goTo(this.activeImageIndex === undefined ? 0 : this.activeImageIndex);
                })
            }

            this.activeImageIndex =  this.$refs.tinySlider.slider.events.on('indexChanged', (info) => info.index - 2);
        },

        methods: {
            changeActiveImageToSelected (selection) {
                this.activeImageIndex = selection;
                this.$refs.tinySlider.slider.goTo(this.activeImageIndex);
            }
        }

    }
</script>

<style lang="scss">
    .image-gallery__grid {
        max-width: 100%;
        .img-lazy-wrp {
            .LazyImage {
                min-height: 340px;

                width: 100%;
                object-fit: cover;
            }
        }
    }

    @media(min-width: 768px) {
        .image-gallery__grid {
            max-width: 70%;
        }
    }


    .image-gallery__preview {
        max-width: 30%;

        .img-lazy-wrp {
            .LazyImage {
                object-fit: cover;
                height: 150px;
                width: 150px;
            }
        }
    }

    .image-gallery__grid__container {
        display: flex;
        flex-direction: column;
    }

    .is--preview-underneath {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image-gallery__preview {
            max-width: 100%;
            padding-bottom: 20px;
            padding-top: 20px;
        }
    }

    .is--preview-left {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .image-gallery__grid {
            order: 2;
        }
    }

    .imageWithBorder {
        border: #880E4F 4px solid;
    }
</style>
