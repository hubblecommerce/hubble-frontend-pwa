<template>
    <div>
        <template v-if="cart.items.length > 0">
            <div v-for="item in cart.items" :key="item.id" class="cart-items-list non-interactive item align-items-center">
                <nuxt-link :to="'/' + hasLink(item)">
                    <img v-if="hasImage(item)" :src="itemImgPath(item)" class="product-img img-minicart" alt="Product Image" :title="item.name" />
                    <div class="product-info">
                        <div>
                            <span class="product-name">{{ item.name_orig }}</span>
                            <div v-for="variant in item.variants" :key="variant.id">
                                <span class="selected-variants">{{ variant.label + ': ' + formatSize(variant.value_label) }}</span>
                            </div>
                        </div>
                        <div class="price-wrp">
                            <span class="qty">{{ item.qty }} x </span>
                            <template v-if="itemIsSpecial(item)">
                                <span
                                    class="product-price old-price"
                                    v-html="getPriceAndCurrency(item, 'display_price_brutto', priceSwitcherIncludeVat)"
                                />
                                <span
                                    class="product-price sale-price"
                                    v-html="getPriceAndCurrency(item, 'display_price_brutto_special', priceSwitcherIncludeVat)"
                                />
                            </template>
                            <template v-else>
                                <span
                                    class="product-price sale-price"
                                    v-html="getPriceAndCurrency(item, 'display_price_brutto', priceSwitcherIncludeVat)"
                                />
                            </template>
                        </div>
                    </div>
                </nuxt-link>
            </div>
        </template>
        <div v-if="!isEmpty(cart.coupons)">
            <template v-for="(coupon, key) in cart.coupons">
                <div :key="key" class="cart-items-list item coupon align-items-center">
                    <div>
                        <span class="coupon text-small" v-text="$t('Voucher / Coupon') + ':'" />
                        <span class="coupon-name text-small" v-text="coupon.code" />
                    </div>
                    <div class="coupon-val" v-text="getCouponVal(coupon.payload.value)" />
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import _ from 'lodash';

export default {
    name: 'CartItemsListNonInteractive',

    props: {
        cart: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            dataImageFilter: null,
            origImageFilter: '60x',
        };
    },

    computed: {
        ...mapState({
            priceSwitcherIncludeVat: state => state.modPrices.priceSwitcherIncludeVat,
        }),
        ...mapGetters({
            productIsSpecial: 'modPrices/productIsSpecial',
            getPriceAndCurrencyDecFmt: 'modPrices/getPriceAndCurrencyDecFmt',
            getTaxClassByLabel: 'modPrices/getTaxClassByLabel',
            priceDecFmt: 'modPrices/priceDecFmt',
            priceAddCur: 'modPrices/priceAddCur',
        }),
        imgFilter() {
            return this.dataImageFilter ? this.dataImageFilter : this.origImageFilter;
        },
    },

    methods: {
        itemImgPath: function (item) {
            let image = this.hasImage(item);

            // If customer domain isset get live images
            if (!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                return _.join([process.env.CUSTOMER_DOMAIN, 'images/catalog/thumbnails/cache/400', image], '/');
            }

            let path = _.trim(process.env.config.IMG_BASE_URL, '/');
            return path + '/images/catalog/product/' + this.imgFilter + '/' + item.image;
        },
        hasImage: function (item) {
            let image;

            // Check if media gallery isset
            // because object structure of item from shop is different than from data API
            if (!_.isEmpty(item.media_gallery)) {
                image = item.media_gallery[0].value;
            } else {
                image = item.image;
            }

            return image;
        },
        hasLink: function (item) {
            let link;

            // Check if url isset
            // because object structure of item from shop is different than from data API
            if (!_.isEmpty(item.url_pds)) {
                link = item.url_pds;
            } else {
                link = '#';
            }

            return link;
        },
        itemIsSpecial: function (item) {
            return this.productIsSpecial(item);
        },
        getPriceAndCurrency: function (item, key, addVat) {
            let price = item.final_price_item[key];

            // Return formatted price incl. tax
            return this.getPriceAndCurrencyDecFmt(price, addVat, this.itemTaxClass(item));
        },
        itemTaxClass: function (item) {
            return this.getTaxClassByLabel(item.final_price_item.tax_class_id);
        },
        getCouponVal: function (value) {
            return this.priceAddCur(value);
        },
        formatSize: function (size) {
            return size.replace('.0', '');
        },
        isEmpty: function (obj) {
            return _.isEmpty(obj);
        },
    },
};
</script>
