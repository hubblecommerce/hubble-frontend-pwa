<template>
    <div class="media-gallery-wrp" @click="media.length > 1 ? lazyLoadImage() : false">
        <transition name="fade">
            <div v-if="loading" class="loader" />
        </transition>
        <hooper :class="{ loading: loading }" :settings="hooperSettings" @slide="onHooperSlide" @updated="onHooperUpdated()">
            <slide v-for="(medium, index) in media" :key="index" :index="index">
                <plugin-slot name="product-gallery-slide" :data="{alt, hooperData, index, medium}">
                    <template v-if="index === 0">
                        <img data-not-lazy :class="'slide-img'" :src="getMediaUrl(medium, 800)" :alt="`${alt} - Image Gallery Item ${index}`" />
                    </template>
                    <img
                        v-else
                        ref="data-manual-lazy"
                        data-manual-lazy
                        :class="'slide-img'"
                        :src="getMediaUrl(medium, 800)"
                        :alt="`${alt} - Image Gallery Item ${index}`"
                    />
                </plugin-slot>
            </slide>
            <hooper-navigation slot="hooper-addons"></hooper-navigation>
        </hooper>
    </div>
</template>

<script>
import { Hooper, Slide, Navigation as HooperNavigation } from 'hooper';
import 'hooper/dist/hooper.css';

export default {
    name: 'ProductDetailGallery',

    components: {
        Hooper,
        Slide,
        HooperNavigation,
    },

    props: {
        media: {
            type: Array,
            required: true,
        },
        alt: {
            type: String,
            required: false,
            default: 'Image',
        },
    },

    data() {
        return {
            loading: true,
            hooperData: null,
            hooperSettings: {
                itemsToShow: 1,
                wheelControl: false,
                transition: 200,
            },
        };
    },

    methods: {
        getMediaUrl: function (medium, width) {
            let url = medium.media.url;

            if (width != null) {
                medium.media.thumbnails.forEach((thumbnail) => {
                    if (thumbnail.width === width) {
                        url = thumbnail.url;
                    }
                });
            }

            return url;
        },
        lazyLoadImage() {
            let media = this.$refs['data-manual-lazy'];
            if (media) [...media].forEach((m) => this.$lazyLoad(m));
        },
        onHooperSlide(hooper) {
            this.hooperData = hooper;
        },
        onHooperUpdated: function () {
            setTimeout(() => {
                this.loading = false;
            }, 300);
        },
    },
    head() {
        // Preload first image of gallery to improve performance of hero element
        if (this.media.length > 0) {
            return {
                link: [
                    {
                        rel: 'preload',
                        as: 'image',
                        href: this.getMediaUrl(this.media[0], 800),
                    },
                ],
            };
        }
    },
};
</script>

<style lang="scss">
$gallery-width: 100%;
$gallery-height: 270px;

.media-gallery-wrp {
    position: relative;
    height: $gallery-height !important;
    width: $gallery-width;
    margin: 0 auto;

    .plugin-slot {
        height: 100%;
    }

    .hooper {
        position: relative;
        height: $gallery-height !important;
        width: $gallery-width;
        overflow: hidden;
        visibility: visible;
        opacity: 1;
        transition: opacity ease-in-out 0.2s;

        &.loading {
            visibility: hidden;
            opacity: 0;
        }
    }

    .loader {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        background-color: #fff;
    }

    .slide-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

@media (min-width: 768px) {
    $gallery-width: 738px;
    $gallery-height: 554px;

    .media-gallery-wrp {
        height: $gallery-height !important;
        width: $gallery-width;

        .hooper {
            height: $gallery-height !important;
            width: $gallery-width;
        }
    }
}

@media (min-width: 1024px) {
    $gallery-width: 497px;
    $gallery-height: 373px;

    .media-gallery-wrp {
        height: $gallery-height !important;
        width: $gallery-width;
        margin: 0;

        .hooper {
            height: $gallery-height !important;
            width: $gallery-width;
        }

        .hooper-prev {
            left: 5px;
        }

        .hooper-next {
            right: 5px;
        }
    }
}
</style>
