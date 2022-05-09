<template>
    <div :class="elementClass">
        <div :class="getGalleryPositionClass" class="image-gallery is-cover" :style="getVerticalAlignStyle" style="min-height: 270px">
            <div v-if="$mq !== 'sm' && images.length > 1" class="image-gallery__preview">
                <hooper
                    ref="preview"
                    :group="'preview-' + content.blockId"
                    :settings="{ ...sliderSettings, ...sliderSettingsPreview }"
                    @slide="onUpdatePreviewSlider"
                >
                    <slide v-for="(image, index) in images" :key="image.media.id">
                        <button
                            class="image-gallery__preview-btn"
                            :class="{ 'is-active': activeImageIndex === index }"
                            @click="changeActiveImageToSelected(index)"
                        >
                            <plugin-slot name="product-gallery-slide-preview" :data="{hooperData, index, medium: image}">
                                <img :src="image.media.url" />
                            </plugin-slot>
                        </button>
                    </slide>

                    <navigation slot="hooper-addons" />
                </hooper>
            </div>

            <div class="image-gallery__main">
                <hooper
                    ref="main"
                    :group="'main-' + content.blockId"
                    :settings="{ ...sliderSettings, ...sliderSettingsMain }"
                    :style="{ minHeight: getMinHeight }"
                    @slide="onUpdateMainSlider"
                >
                    <slide v-for="(image, index) in images" :key="image.media.id">
                        <plugin-slot name="product-gallery-slide" :data="{ hooperData, index, medium: image}">
                            <img :src="image.media.url" />
                        </plugin-slot>
                    </slide>

                    <navigation v-if="images.length > 1" slot="hooper-addons" />
                </hooper>
            </div>
        </div>
    </div>
</template>

<script>
import { Hooper, Slide, Navigation } from 'hooper';
import 'hooper/dist/hooper.css';
import { slotMixins } from '../helper';

export default {
    name: 'ImageGallerySlot',
    components: {
        Hooper,
        Slide,
        Navigation,
    },
    mixins: [slotMixins],

    data() {
        return {
            images: [],

            hooperData: null,

            sliderSettings: {
                keysControl: false,
                mouseDrag: false,
                wheelControl: false,
            },
            sliderSettingsPreview: {
                itemsToShow: 5,
                vertical: true,
            },
            sliderSettingsMain: {
                mouseDrag: true,
            },

            activeImageIndex: 0,
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
            else return `justify-content: ${this.content.config.verticalAlign.value};`;
        },
    },

    created() {
        this.images = this.content.data.sliderItems;
    },

    methods: {
        changeActiveImageToSelected(selection) {
            this.activeImageIndex = selection;
            this.$refs.main.slideTo(this.activeImageIndex);
            this.$refs.preview.slideTo(this.activeImageIndex);
        },
        onUpdatePreviewSlider(slider) {
            const i = slider.currentSlide;

            this.activeImageIndex = i;

            if (this.$refs.main) this.$refs.main.slideTo(this.activeImageIndex);
        },
        onUpdateMainSlider(slider) {
            const i = slider.currentSlide;

            this.activeImageIndex = i;
            this.hooperData = slider;

            if (this.$refs.preview) this.$refs.preview.slideTo(this.activeImageIndex);
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.cms-element-image-gallery {
    // hides magnifier overlay because zoom container is displayed over gallery
    .magnifier-overlay {
        display: none;
    }
}

.image-gallery {
    display: flex;
    flex-direction: row;
    width: 100%;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;

        .detail-wrp & {
            object-fit: contain;
        }
    }

    .plugin-slot, .plugin-slot-entries {
        height: 100%;
    }

    &__preview {
        width: 90px;
        flex-shrink: 0;
        margin-right: 10px;

        .hooper {
            height: 100%;
        }
    }

    &__preview-btn {
        width: 100%;
        height: 100%;
        padding: 0;
        border: 2px solid white;
        background: transparent;

        &:hover, &:focus {
            background: transparent;
        }

        &.is-active {
            border-color: $green;
        }
    }

    &__main {
        width: 100%;

        @media (min-width: 768px) {
            width: calc(100% - 100px);
        }
    }
}
</style>
