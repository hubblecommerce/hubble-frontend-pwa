<template>
  <div class="product-card">
    <nuxt-link :to="routeUrlPds">
      <div class="card-media">
        <img-lazy v-if="!isSlider" :src="routeUrlProductImg" :alt-info="itemData.name" :classes="classesImg" />
        <img v-if="isSlider" :src="routeUrlProductImg" :alt="itemData.name" >
      </div>
    </nuxt-link>

    <div class="actions">
      <div class="badge-wrp">
        <div v-if="itemIsSpecial" class="badge sale" v-text="itemDiscountPercent"></div>
      </div>
      <add-to-wishlist :item="itemData" />
    </div>

    <nuxt-link class="product-card-info-wrp-link" :to="routeUrlPds">
      <div class="product-card-info-wrp">
        <div v-if="itemData.manufacturer_name !== null" class="manufacturer" v-text="itemData.manufacturer_name"></div>
        <div v-if="itemData.name !== null" class="product-name text-small" v-text="itemData.name"></div>
        <div :class="classesExcl" class="price-box price-excluding-tax product-price">
          <template v-if="itemIsSpecial">
            <span class="old-price price">
              <span v-html="getPriceAndCurrency('price', priceSwitcherIncludeVat)"/>
            </span>
            <!-- <span class="price" v-html="getPriceAndCurrency('special_price', false)"></span> -->
            <span class="sale-price grey-label bodytext2">
              <span v-html="getPriceAndCurrency('special_price', priceSwitcherIncludeVat)"/>
            </span>
          </template>

          <template v-else-if="itemHasCheapPrice">
            <span class="minimal cheapest-label">{{ $t('cheap_price_label') }}</span>
            <!-- <span class="price" v-html="getCheapPriceAndCurrency(false)"></span> -->
            <span class="grey-label bodytext2">
              <span v-html="getCheapPriceAndCurrency(priceSwitcherIncludeVat)"/>
            </span>
          </template>

          <template v-else>
            <span class="grey-label bodytext2">
              <span v-html="getPriceAndCurrency('price', priceSwitcherIncludeVat)"/>
            </span>
          </template>
        </div>
      </div>
    </nuxt-link>

    <nuxt-link class="card-expand" :to="routeUrlPds">
      <product-listing-card-options-non-interactive :item="itemOrig" :facet-codes="['groesse']"/>
    </nuxt-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProductListingCardOptionsNonInteractive from "./ProductListingCardOptionsNonInteractive";
import AddToWishlist from "./AddToWishlist";

export default {
  name: 'ProductListingCard',
  components: {AddToWishlist, ProductListingCardOptionsNonInteractive},
  props: {
    itemOrig: {
      type: Object,
      required: true
    },
    isSlider: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      productUrl: '/#/detail',
      itemData: {}
    }
  },

  computed: {
    ...mapState({
      priceSwitcherIncludeVat: state => state.modPrices.priceSwitcherIncludeVat
    }),
    classesImg() {
      return 'img-listing';
    },
    classesExcl() {
      return null
    },
    routeUrlPds() {
      let _locale = this.$store.getters['modApiResources/getApiLocale']

      // direkt url
      if (this.isSlider) {
        if (_locale !== 'de') {
          return '/' + _locale + '/' + _.join([this.itemOrig.url_pds], '/')
        }

        return '/' + _.join([this.itemOrig.url_pds], '/')
      }

      // with category level
      //if(this.session.categorySelected) {
      //    return '/' + _.join([this.session.categorySelected.url_path, this.itemOrig.url_pds], '/');
      //}

      if (_locale !== 'de') {
        return '/' + _locale + '/' + this.itemOrig.url_pds
      }

      return '/' + this.itemOrig.url_pds
    },
    routeUrlProductImg() {

      // If customer domain isset get live images
      if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
        let image = this.itemData.image
        let _letters = _.split(image, '', 2)
        let _reference = _.join([
          process.env.CUSTOMER_DOMAIN,
          'images/catalog/thumbnails/cache/400',
          // 'media/catalog/product',
          // _letters[0],
          // _letters[1],
          image
        ], '/');
        return _reference;
      }

      // If no customer domain isset get images from api
      let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
      return _path + '/images/catalog/product/180x/' + this.itemData.image;
    },
    item() {
      return this.itemOrig
    },
    itemIsSimple() {
      return this.item.type === 'simple';
    },
    itemIsGrouped() {
      return this.item.type === 'grouped';
    },
    itemIsConfigurable() {
      return this.item.type === 'configurable';
    },
    itemIsMinimal() {
      return false
    },
    itemIsSpecial() {
      return this.$store.getters['modPrices/productIsSpecial'](this.itemData)
    },
    itemDiscountPercent() {
      let oldPrice = this.itemData.final_price_item['price'],
          specialPrice = this.itemData.final_price_item['special_price'],
          decrease = oldPrice - specialPrice,
          decreasePercentage = decrease / oldPrice * 100;

      return '-'+_.round(decreasePercentage) + ' %';
    },
    itemTierPrices() {
      var groupID = 0

      return this.$store.getters['modPrices/productGetTierPricesByGroupId'](
        this.itemData,
        groupID
        )
    },
    itemTierPriceMin() {
      return _.minBy(this.itemTierPrices, 'price')
    },
    itemHasTierPrices() {
      var groupID = 0

      return this.$store.getters['modPrices/productHasTierPricesByGroupId'](
        this.itemData,
        groupID
        )
    },
    itemTierPriceDiscount() {
      if (!this.itemHasTierPrices) {
        return null
      }

      var _item_min_price = this.itemData.final_price_item.min_price
      var _tier_min_price = this.itemTierPriceMin.price

      var _diff = 100 - (_tier_min_price / _item_min_price) * 100

      return _.round(_diff) + '%'
    },
    itemHasCheapPrice() {
      return (
        this.itemData.cheap_price_item && this.itemData.cheap_price_item.status === 'OK'
        )
    },
    itemTaxClass() {
      return this.$store.getters['modPrices/getTaxClassByLabel'](
        this.itemData.final_price_item.tax_class_id
        )
    }
  },

  created() {
    // use copy of loaded item based on vuex store
    this.itemData = this.itemOrig;

    this.$on('update-item-data', function(payload) {
      this.itemData = payload;
    })
  },

  methods: {
    getPriceAndCurrency(key, addVat) {
      return this.$store.getters['modPrices/getPriceAndCurrencyDecFmt'](
        this.itemData.final_price_item[key],
        addVat,
        this.itemTaxClass
        )
    },
    getTierPriceMinAndCurrency(addVat) {
      return this.$store.getters['modPrices/getPriceAndCurrencyDecFmt'](
        this.itemTierPriceMin.price,
        addVat,
        this.itemTaxClass
        )
    },
    getCheapPriceAndCurrency(addVat) {
      return this.$store.getters['modPrices/getPriceAndCurrencyDecFmt'](
        this.item.final_price_item.min_price,
        addVat,
        this.itemTaxClass
        )
    }
  }
};
</script>
