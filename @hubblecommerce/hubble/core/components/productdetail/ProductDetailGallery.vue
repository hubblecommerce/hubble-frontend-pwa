<template>
    <div class="product-detail-gallery-wrp">
        <div class="gallery-slider-wrp">
            <client-only>
                <slider
                    v-if="productData.media_gallery != null && ($mq === 'sm' || $mq === 'md')"
                    ref="productGallery"
                    :mouse-drag="true"
                    :loop="true"
                    :controls="true"
                    :controls-text="controls"
                    :nav="true"
                    items="1"
                    gutter="0"
                >
                    <div v-for="(image, index) in allProductImages" :key="index" class="gallery-item">
                        <img :src="routeUrlSmallGallery(image)"
                             :alt="productData.name"
                             :title="productData.name"
                             @click="modalGalleryShow(index)"
                        />
                    </div>
                </slider>
            </client-only>
        </div>

        <div v-if="this.$mq === 'lg'" class="gallery-scroll-wrp">
            <div v-for="(image, index) in allProductImages" :key="index" class="gallery-item">
                <img :src="routeUrlSmallGallery(image)"
                     :alt="productData.name"
                     :title="productData.name"
                     @click="modalGalleryShow(index)"
                />
            </div>
        </div>

        <client-only>
            <vue-modal name="gallery-modal" @opened="goToModal(currentIndex)">
                <div class="gallery-modal-wrp">
                    <button class="button-icon close" @click="modalGalleryHide()">
                        <span class="hidden-link-name" v-text="$t('close')" />
                        <i class="icon icon-x" />
                        <material-ripple />
                    </button>

                    <slider ref="gallerySlider" :speed="200" :loop="true" :gutter="0" :mouse-drag="true" :controls-text="controls" items="1">
                        <div v-for="(image, index) in allProductImages" :key="index" class="gallery-modal-item">
                            <img-lazy :src="routeOriginalImage(image)" :alt="productData.name" :title="productData.name" />
                        </div>
                    </slider>
                </div>
            </vue-modal>
        </client-only>

        <!-- Placeholder if no image -->
        <div v-if="productData.media_gallery == null && productData.image == null" class="gallery-item" />
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AddToWishlist from '../productutils/AddToWishlist';
import Vue from 'vue';
import VModal from 'vue-js-modal/dist/ssr.index';
import 'vue-js-modal/dist/styles.css';
import _ from 'lodash';

export default {
    components: {
        AddToWishlist,
        Slider: () => {
            if (process.client) {
                return import('vue-tiny-slider');
            }
        },
    },

    data() {
        return {
            name: 'ProductDetailGallery',
            showFavoriteHint: false,
            responsive: {
                0: {
                    items: 3,
                },
                768: {
                    items: 7,
                },
            },
            currentImage: '',
            startIndex: 0,
            currentIndex: 0,
            tempIndex: 0,
            indexBefore: 0,
            controls: [
                '<i class="icon icon-chevron-left"></i><span class="hidden-link-name">Navigate left</span>',
                '<i class="icon icon-chevron-right"></i><span class="hidden-link-name">Navigate right</span>',
            ],
            selected: 0,
            showVariantImage: false,
        };
    },

    computed: {
        ...mapState({
            dataProduct: state => state.modApiProduct.dataProduct,
        }),
        ...mapGetters({
            allProductImages: 'modApiProduct/getMediaGalleryArray',
        }),
        productData() {
            return this.dataProduct.result.item;
        },
        routeUrlPds() {
            return '/' + this.productData.url_pds;
        },
        routeUrlProductImg() {
            return route('images.catalog.product', ['440x', this.productData.image]);
        },
    },

    watch: {
        dataProduct: function () {
            this.$refs.productGallery.slider.goTo(0);
        },
    },

    created() {
        if (process.client) {
            Vue.use(VModal, {
                componentName: 'vue-modal',
                dialog: true,
                dynamic: true,
                injectModalsContainer: true,
            });
        }
    },

    beforeMount() {
        this.setDefaultProductImage();
    },

    mounted() {
        this.$nextTick(() => {
            if (this.$refs.productGallery) {
                this.$refs.productGallery.slider.events.on('indexChanged', () => {
                    let info = this.$refs.productGallery.slider.getInfo();

                    if (info.cloneCount >= 2) {
                        // Add 1 to index to prevent division with 0
                        let index = info.index + 1;
                        let groupLength = info.slideCount;
                        let calculatedIndex;

                        // If index in first group only return index
                        if (index <= groupLength) {
                            calculatedIndex = index - 1;
                        }

                        // If index is at least in second group
                        if (index > groupLength) {
                            // Multiplikate current group number with group length to substitute with index
                            let minuent = Math.floor((index - 1) / groupLength) * groupLength;
                            calculatedIndex = index - minuent;

                            // Substitute 1 because we added one in the beginning
                            calculatedIndex = calculatedIndex - 1;
                        }

                        this.setIndex(calculatedIndex);

                        if (this.$mq === 'md' || this.$mq === 'lg') {
                            this.$refs.thumbnailsGallery.slider.goTo(this.currentIndex);
                        }
                    } else {
                        let selectedIndex = info.index - 1;
                        this.setIndex(selectedIndex);

                        if (this.$mq === 'md' || this.$mq === 'lg') {
                            this.$refs.thumbnailsGallery.slider.goTo(selectedIndex);
                        }
                    }
                });
            }
        });
    },

    methods: {
        setIndex(index) {
            this.currentIndex = index;
        },
        routeUrlGalleryThumbnail(image) {
            if (process.env.API_TYPE === 'sw') {
                return image;
            }

            // If customer domain isset get live images
            if (!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                return _.join([process.env.CUSTOMER_DOMAIN, 'images/catalog/thumbnails/cache/400', image], '/');
            }

            let path = _.trim(process.env.config.IMG_BASE_URL, '/');
            return path + '/images/catalog/product/40x/' + image;
        },
        routeUrlSmallGallery(image) {
            if (process.env.API_TYPE === 'sw') {
                return image;
            }

            // If customer domain isset get live images
            if (!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                return _.join([process.env.CUSTOMER_DOMAIN, 'images/catalog/thumbnails/cache/400', image], '/');
            }

            let path = _.trim(process.env.config.IMG_BASE_URL, '/');
            return path + '/images/catalog/product/295x/' + image;
        },
        routeUrlGallery(image) {
            // If customer domain isset get live images
            if (!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                return _.join([process.env.CUSTOMER_DOMAIN, 'images/catalog/thumbnails/cache/400', image], '/');
            }

            let path = _.trim(process.env.config.IMG_BASE_URL, '/');
            return path + '/images/catalog/product/pds/' + image;
        },
        routeOriginalImage(image) {
            if (process.env.API_TYPE === 'sw') {
                return image;
            }

            // If customer domain isset get live images
            if (!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                return _.join([process.env.CUSTOMER_DOMAIN, 'images/product_images/original_images', image], '/');
            }

            let path = _.trim(process.env.config.IMG_BASE_URL, '/');
            return path + '/images/catalog/product/pds/' + image;
        },
        setDefaultProductImage() {
            if (process.env.API_TYPE === 'sw') {
                this.currentImage = this.productData.image;
            }

            // If customer domain isset get live images
            if (!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                let image = this.productData.image;

                this.currentImage = _.join([process.env.CUSTOMER_DOMAIN, 'images/catalog/thumbnails/cache/400', image], '/');
            } else {
                let path = _.trim(process.env.config.IMG_BASE_URL, '/');
                this.currentImage = path + '/images/catalog/product/440x/' + this.productData.image;
            }
        },
        modalGalleryHide() {
            this.$modal.hide('gallery-modal');
        },
        modalGalleryShow(slideIndex) {
            if(this.$mq === 'sm' || this.$mq === 'md') {
                this.currentIndex = slideIndex;
                this.$modal.show('gallery-modal', {
                    imageGallery: this.productData.media_gallery,
                });
            }
        },
        goToGallery: function (slideIndex) {
            this.currentIndex = slideIndex;

            this.$refs.thumbnailsGallery.slider.goTo(this.currentIndex);
            this.$refs.productGallery.slider.goTo(this.currentIndex);
        },
        goToModal: function (slideIndex) {
            this.currentIndex = slideIndex;
            this.$refs.gallerySlider.slider.goTo(this.currentIndex);
        },
    },
};
</script>
