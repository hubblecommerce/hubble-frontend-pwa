<template>
    <div class="product-img-box">
        <div class="badge-wrp">
            <div v-if="itemIsSpecial" class="badge sale" v-text="itemDiscountPercent"/>
            <div v-if="itemIsNew" class="badge new" v-text="$t('New')"/>
            <add-to-wishlist v-if="$mq === 'sm' || $mq === 'md' " :item="productData"/>
        </div>

        <div class="product-img-container media">
            <div class="media-content product-pics">
                <client-only>
                    <slider v-if="productData.media_gallery != null"
                            ref="productGallery"
                            :mouse-drag="true"
                            :loop="true"
                            :controls="true"
                            :controls-text="controls"
                            :nav="false"
                            items="1"
                            gutter="0"
                    >
                        <div v-for="(image, index) in allProductImages" :key="index" class="gallery-item">
                            <a class="fancybox-trigger" onclick="return false;" @click="modalGalleryShow(index)">
                                <img :src="routeUrlSmallGallery(image)"
                                     :alt="productData.name"
                                     :title="productData.name"
                                >
                            </a>
                        </div>
                    </slider>
                </client-only>

                <div v-if="($mq === 'md' || $mq === 'lg') && allProductImages.length > 1">
                    <client-only>
                        <slider v-if="productData.media_gallery != null"
                                ref="thumbnailsGallery"
                                class="d-flex pt-4 image-thumbnails-container"
                                :mouse-drag="true"
                                :loop="false"
                                :controls="true"
                                :controls-text="controls"
                                :nav="false"
                                gutter="0"
                                :responsive="responsive"
                        >
                            <div v-for="(image, index) in allProductImages" :key="index">
                                <div class="thumbnail-image-wrp d-flex"
                                     :class="{selected: index === currentIndex}"
                                     @click="goToGallery(index)"
                                >
                                    <img class="thumbnail-img"
                                         :src="routeUrlGalleryThumbnail(image)"
                                         :alt="productData.name"
                                         :title="productData.name"
                                    >
                                </div>
                            </div>
                        </slider>
                    </client-only>
                </div>

                <div v-if="productData.media_gallery == null && productData.image">
                    <div class="gallery-item">
                        <a class="fancybox-trigger">
                            <img :src="routeUrlSmallGallery(productData.image)"
                                 :alt="productData.name"
                                 :title="productData.name"
                            >
                        </a>
                    </div>
                </div>

                <div v-if="productData.media_gallery == null && productData.image == null">
                    <div class="gallery-item"/>
                </div>
            </div>
        </div>

        <client-only>
            <vue-modal name="detail-image-gallery" @opened="goToModal(currentIndex)">
                <div class="detail-gallery carousel-container">
                    <button class="button-icon close" @click="modalGalleryHide()">
                        <div class="hidden-link-name">
                            {{ $t('close') }}
                        </div>
                        <i class="icon icon-close"/>
                        <material-ripple/>
                    </button>

                    <slider ref="gallerySlider"
                            :speed="200"
                            :loop="true"
                            :gutter="0"
                            :mouse-drag="true"
                            :controls-text="controls"
                            items="1"
                    >
                        <div v-for="(image, index) in allProductImages"
                             :key="index"
                             class="gallery-item"
                        >
                            <img :src="routeOriginalImage(image)"
                                 :alt="productData.name"
                                 :title="productData.name"
                            >
                        </div>
                    </slider>
                </div>
            </vue-modal>
        </client-only>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';
    import AddToWishlist from "../productutils/AddToWishlist";
    import Vue from "vue";
    import VModal from 'vue-js-modal/dist/ssr.index';
    import 'vue-js-modal/dist/styles.css';
    import _ from 'lodash';


    export default {
        components: {
            AddToWishlist,
            Slider: () => { if(process.client) { return import('vue-tiny-slider') } },
        },

        data() {
            return {
                name: 'ProductDetailGallery',
                showFavoriteHint: false,
                responsive: {
                    0: {
                        items: 3
                    },
                    768: {
                        items: 7,
                    }
                },
                currentImage: '',
                startIndex: 0,
                currentIndex: 0,
                tempIndex: 0,
                indexBefore: 0,
                controls: [
                    '<i class="icon icon-chevron-left"></i><span class="hidden-link-name">Navigate left</span>',
                    '<i class="icon icon-chevron-right"></i><span class="hidden-link-name">Navigate right</span>'
                ],
                selected: 0,
                showVariantImage: false
            }
        },

        computed: {
            ...mapState({
                dataProduct: state => state.modApiProduct.dataProduct,
            }),
            ...mapGetters({
                allProductImages: 'modApiProduct/getMediaGalleryArray',
                productIsSpecial: 'modPrices/productIsSpecial'
            }),
            productData() {
                return this.dataProduct.result.item;
            },
            routeUrlPds() {
                return '/' + this.productData.url_pds
            },
            routeUrlProductImg() {
                return route('images.catalog.product', ['440x', this.productData.image])
            },
            itemDiscountPercent() {
                let oldPrice = this.productData.final_price_item['display_price_brutto'],
                    specialPrice = this.productData.final_price_item['display_price_brutto_special'],
                    decrease = oldPrice - specialPrice,
                    decreasePercentage = decrease / oldPrice * 100;

                return '-' + _.round(decreasePercentage) + ' %';
            },
            itemIsSpecial() {
                return this.productIsSpecial(this.productData);
            },
            itemIsNew() {
                if (this.productData.status) {
                    let td = Date.parse(Date()),
                        startDate = Date.parse(this.productData.status.is_new_from_date),
                        endDate = Date.parse(this.productData.status.is_new_to_date);

                    if (startDate <= td && td <= endDate) {
                        return true;
                    }

                    return false;
                }

                return false;
            }
        },

        watch: {
            dataProduct: function() {
                this.$refs.productGallery.slider.goTo(0)
            }
        },

        created() {
            if(process.client) {
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
                    let _letters = _.split(image, '', 2);

                    let _reference = _.join(
                        [
                            process.env.CUSTOMER_DOMAIN,
                            'images/catalog/thumbnails/cache/400',
                            // 'media/catalog/product',
                            // _letters[0],
                            // _letters[1],
                            image
                        ],
                        '/'
                    );

                    return _reference;
                }

                let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                return _path + '/images/catalog/product/40x/' + image
            },
            routeUrlSmallGallery(image) {
                if (process.env.API_TYPE === 'sw') {
                    return image;
                }

                // If customer domain isset get live images
                if (!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                    let _letters = _.split(image, '', 2)

                    let _reference = _.join(
                        [
                            process.env.CUSTOMER_DOMAIN,
                            'images/catalog/thumbnails/cache/400',
                            // 'media/catalog/product',
                            // _letters[0],
                            // _letters[1],
                            image
                        ],
                        '/'
                    );

                    return _reference;
                }

                let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                return _path + '/images/catalog/product/295x/' + image
            },
            routeUrlGallery(image) {
                // If customer domain isset get live images
                if (!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                    let _letters = _.split(image, '', 2);

                    let _reference = _.join(
                        [
                            process.env.CUSTOMER_DOMAIN,
                            'images/catalog/thumbnails/cache/400',
                            // 'media/catalog/product',
                            // _letters[0],
                            // _letters[1],
                            image
                        ],
                        '/'
                    );

                    return _reference;
                }

                let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                return _path + '/images/catalog/product/pds/' + image
            },
            routeOriginalImage(image) {
                if (process.env.API_TYPE === 'sw') {
                    return image;
                }

                // If customer domain isset get live images
                if (!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                    let _letters = _.split(image, '', 2);

                    let _reference = _.join(
                        [
                            process.env.CUSTOMER_DOMAIN,
                            'images/product_images/original_images',
                            // 'media/catalog/product',
                            // _letters[0],
                            // _letters[1],
                            image
                        ],
                        '/'
                    );

                    return _reference;
                }

                let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                return _path + '/images/catalog/product/pds/' + image
            },
            setDefaultProductImage() {
                if (process.env.API_TYPE === 'sw') {
                    this.currentImage = this.productData.image;
                }

                // If customer domain isset get live images
                if (!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                    let image = this.productData.image;

                    let _letters = _.split(image, '', 2);

                    let _reference = _.join(
                        [
                            process.env.CUSTOMER_DOMAIN,
                            'images/catalog/thumbnails/cache/400',
                            // 'media/catalog/product',
                            // _letters[0],
                            // _letters[1],
                            image
                        ],
                        '/'
                    );

                    this.currentImage = _reference;
                } else {
                    let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                    this.currentImage = _path + '/images/catalog/product/440x/' + this.productData.image
                }
            },
            modalGalleryHide() {
                this.$modal.hide('detail-image-gallery')
            },
            modalGalleryShow(slideIndex) {
                this.currentIndex = slideIndex;
                this.$modal.show('detail-image-gallery', {
                    imageGallery: this.productData.media_gallery
                });
            },
            goToGallery: function(slideIndex) {
                this.currentIndex = slideIndex;

                this.$refs.thumbnailsGallery.slider.goTo(this.currentIndex);
                this.$refs.productGallery.slider.goTo(this.currentIndex);
            },
            goToModal: function(slideIndex) {
                this.currentIndex = slideIndex;
                this.$refs.gallerySlider.slider.goTo(this.currentIndex);
            }
        }
    };
</script>
