<template>
  <div class="product-img-box">
    <div class="product-img-container media">
      <div class="media-content product-pics">
        <no-ssr>
          <slider
            ref="productGallery"
            :mouse-drag="true"
            :loop="false"
            :controls="true"
            :controls-text = "controls"
            :nav="false"
            items="1"
            gutter="0">

            <template v-if="productData.media_gallery != null">
              <div
                v-for="(image, index) in allProductImages"
                :key="index"
                class="gallery-item">
                <a
                  class="fancybox-trigger"
                  onclick="return false;"
                  @click="modalGalleryShow(index)">
                  <img
                    :src="routeUrlSmallGallery(image)"
                    alt=""
                    title="">
                </a>
              </div>
            </template>

          </slider>
        </no-ssr>

        <div v-if="($mq === 'md' || $mq === 'lg') && allProductImages.length > 1">
          <no-ssr>
            <slider class="d-flex pt-4 image-thumbnails-container"
              ref="thumbnailsGallery"
              :mouse-drag="true"
              :loop="false"
              :controls="true"
              :controls-text = "controls"
              :nav="false"
              gutter="0"
              :responsive="responsive"
            >
              <template v-if="productData.media_gallery != null">
                <div
                  v-for="(image, index) in allProductImages"
                  :key="index"
                  >
                  <div class="thumbnail-image-wrp d-flex"
                       :class="{selected: index === currentIndex}"
                  >
                    <img
                      @click="goToGallery(index)"
                      class="thumbnail-img"
                      :src="routeUrlGalleryThumbnail(image)"
                      alt=""
                      title=""
                    >
                  </div>
                </div>
              </template>
            </slider>
          </no-ssr>
        </div>

        <div v-if="productData.media_gallery == null && productData.image">
          <div class="gallery-item">
            <a
              class="fancybox-trigger">
              <img
                :src="routeUrlSmallGallery(productData.image)"
                alt=""
                title="">
            </a>
          </div>
        </div>

        <div v-if="productData.media_gallery == null && productData.image == null">
          <div class="gallery-item">

          </div>
        </div>

      </div>

    </div>
    <no-ssr>
      <vue-modal
        name="detail-image-gallery"
        @opened="goToModal(currentIndex)">
        <div class="detail-gallery carousel-container">
          <button
            class="button-icon close"
            @click="modalGalleryHide()">
            <div class="hidden-link-name">{$t('Close')}</div>
            <i class="icon icon-close"/>
            <material-ripple/>
          </button>
          <slider
            ref="gallerySlider"
            :speed="200"
            :loop="false"
            :gutter="0"
            :mouse-drag="true"
            :controls-text="controls"
            items="1"
          >
            <div
              v-for="(image, index) in allProductImages"
              :key="index"
              class="gallery-item">
              <img
                :src="routeUrlGallery(image)"
                alt=""
                title="">
            </div>
          </slider>
        </div>
      </vue-modal>
    </no-ssr>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
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
      controls: [
        '<i class="icon icon-chevron-left"></i><span class="hidden-link-name">Navigate left</span>',
        '<i class="icon icon-chevron-right"></i><span class="hidden-link-name">Navigate right</span>'
      ],
      selected: 0,
      showVariantImage: false,
    }
  },

  computed: {
    ...mapState({
      dataProduct: state => state.modApiResources.dataProduct,
    }),
    ...mapGetters({
        allProductImages: 'modApiResources/getMediaGalleryArray'
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
    currentIndexInfo() {
        let info = this.$refs.productGallery.slider.getInfo(),
            indexCurrent = info.index;
      return indexCurrent;
    }
  },

  watch: {
    dataProduct: function() {
      this.$refs.productGallery.slider.goTo(0)
    }
  },

  beforeMount() {
    this.setDefaultProductImage();
  },

  mounted() {
      this.$nextTick(() => {
          this.$refs.productGallery.slider.events.on('indexChanged', () => {
              let info = this.$refs.productGallery.slider.getInfo();
              let selectedIndex = info.index;
              this.setIndex(selectedIndex);

              if (this.$mq === 'md' || this.$mq === 'lg') {
                  this.$refs.thumbnailsGallery.slider.goTo(selectedIndex);
              }
          });
      });
  },

  methods: {
    setIndex(index) {
        this.currentIndex = index;
    },
    toggleFavoriteHint() {
      this.showFavoriteHint = !this.showFavoriteHint
    },
    routeUrlGalleryThumbnail(image) {
      // If customer domain isset get live images
      if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
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
      // If customer domain isset get live images
      if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
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
      if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
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
    // selectImage(image, position) {
    //   let _path = _.trim(process.env.config.IMG_BASE_URL, '/')

    //   this.currentImage = _path + '/images/catalog/product/pds/' + image
    //   this.startIndex = position
    // },
    setDefaultProductImage() {
      // If customer domain isset get live images
      if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
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
    goToGallery: function (slideIndex) {
        this.currentIndex = slideIndex;
        this.$refs.thumbnailsGallery.slider.goTo(this.currentIndex);
        this.$refs.productGallery.slider.goTo(this.currentIndex);
    },
    goToModal: function (slideIndex) {
        this.currentIndex = slideIndex;
        this.$refs.gallerySlider.slider.goTo(this.currentIndex);
    },
  }
};
</script>
