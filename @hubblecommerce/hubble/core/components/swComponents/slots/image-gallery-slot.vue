<template>
    <div :class="elementClass">
        <div :class="getGalleryPositionClass" class="image-gallery is-cover" :style="getVerticalAlignStyle" style="min-height: 270px">
            <div v-if="$mq !== 'sm'" class="image-gallery__preview">
                <hooper ref="preview" group="preview" :settings="{ ...sliderSettings, ...sliderSettingsPreview }" @slide="onUpdatePreviewSlider">
                    <slide v-for="(image, index) in images" :key="image.media.id">
                        <button class="image-gallery__preview-btn" @click="changeActiveImageToSelected(index)">
                            <img :src="image.media.url" />
                        </button>
                    </slide>

                    <navigation slot="hooper-addons" />
                </hooper>
            </div>

            <div class="image-gallery__main">
                <hooper
                    ref="main"
                    group="main"
                    :settings="{ ...sliderSettings, ...sliderSettingsMain }"
                    :style="{ height: getMinHeight }"
                    @slide="onUpdateMainSlider"
                >
                    <slide v-for="image in images" :key="image.media.id">
                        <img :src="image.media.url" />
                    </slide>

                    <navigation slot="hooper-addons" />
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
            else return `justify-content: ${this.element.config.verticalAlign.value};`;
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

            if (this.$refs.preview) this.$refs.preview.slideTo(this.activeImageIndex);
        },
    },
};
</script>

<style lang="scss" scoped>
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
    }

    &__preview {
        width: 90px;
        flex-shrink: 0;
        margin-right: 10px;
    }

    &__preview-btn {
        width: 100%;
        height: 100%;
        padding: 0;
        border: 2px solid white;

        .is-current & {
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
