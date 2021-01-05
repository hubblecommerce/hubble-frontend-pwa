<template>
    <div class="cart-items-list-wrp non-interactive">
        <template v-if="cart.items.length > 0">
            <div v-for="item in cart.items" :key="item.id" class="row cart-item">
                <nuxt-link :to="'/' + item.url_pds" class="col-12">
                    <div class="row">
                        <div class="col-4">
                            <img-lazy
                                v-if="hasImage(item)"
                                :src="itemImgPath(item)"
                                class="product-img img-minicart"
                                :alt-info="'Product Image'"
                                :title-info="item.name"
                            />
                        </div>

                        <div class="col-8">
                            <div class="container">
                                <div class="row">
                                    <span class="product-name" v-text="item.name_orig" />
                                </div>

                                <div class="row">
                                    <ul class="selected-variants-wrp">
                                        <li v-for="variant in item.variants" :key="variant.id">
                                            <span
                                                class="selected-variants"
                                                v-text="`${variant.label}: ${formatSize(variant.value_label)}`"
                                            />
                                        </li>
                                    </ul>
                                </div>

                                <div class="row">
                                    <span class="qty" v-text="`${item.qty} x`" />
                                    <template v-if="itemIsSpecial(item)">
                                        <span
                                            class="product-price old-price"
                                            v-text="
                                                getPriceAndCurrency(
                                                    item,
                                                    'display_price_brutto',
                                                    priceSwitcherIncludeVat
                                                )
                                            "
                                        />
                                        <span
                                            class="product-price sale-price"
                                            v-text="
                                                getPriceAndCurrency(
                                                    item,
                                                    'display_price_brutto_special',
                                                    priceSwitcherIncludeVat
                                                )
                                            "
                                        />
                                    </template>

                                    <template v-else>
                                        <span
                                            class="product-price sale-price"
                                            v-text="
                                                getPriceAndCurrency(
                                                    item,
                                                    'display_price_brutto',
                                                    priceSwitcherIncludeVat
                                                )
                                            "
                                        />
                                    </template>
                                </div>
                            </div>
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
            priceSwitcherIncludeVat: (state) => state.modPrices.priceSwitcherIncludeVat,
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
            if (process.env.API_TYPE === 'sw') {
                return item.image;
            }

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
