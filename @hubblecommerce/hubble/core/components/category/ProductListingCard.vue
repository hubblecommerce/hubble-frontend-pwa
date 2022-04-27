<template>
    <div class="product-card">
        <nuxt-link :to="routeUrlPds" @click.ctrl.exact="gtmProductClick()">
            <div class="card-media">
                <div class="actions">
                    <div class="badge-wrp">
                        <span
                            v-if="itemData.calculatedPrice.listPrice"
                            class="product-badge badge-danger"
                            v-text="'Sale'"
                        />
                        <span
                            v-if="itemData.isNew"
                            class="product-badge badge-secondary"
                            v-text="'new'"
                        />
                        <span
                            v-if="itemData.markAsTopseller"
                            class="product-badge badge-success"
                            v-text="'Bestseller'"
                        />
                    </div>
                </div>

                <template v-if="index < 4">
                    <img
                        class="product-image"
                        :src="getMediaUrl(800)"
                        :alt="itemData.name"
                        :title="itemData.name"
                    />
                </template>
                <img
                    v-else
                    v-lazy-load
                    :src="getMediaUrl(800)"
                    :alt="itemData.name"
                    :title="itemData.name"
                    class="product-image"
                />
            </div>

            <div class="product-card-info-wrp-link">
                <div class="product-card-info-wrp">
                    <div v-if="itemData.name !== null" class="product-name" v-text="itemData.name" />

                    <div class="price-box price-excluding-tax product-price">
                        <span
                            :class="{'sale-price': itemData.calculatedPrice.listPrice}"
                            v-text="formatPrice(itemData.final_price_item.display_price_brutto)"
                        />
                        <span
                            v-if="itemData.calculatedPrice.listPrice"
                            class="old-price"
                            v-text="formatPrice(itemData.calculatedPrice.listPrice.price)"
                        />
                    </div>
                </div>
            </div>
        </nuxt-link>
    </div>
</template>

<script>
export default {
    name: 'ProductListingCard',

    props: {
        itemData: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: false,
        },
        showBadges: {
            type: Boolean,
            value: true,
        }
    },

    data() {
        return {
            productUrl: `detail/${this.itemData.id}`,
        };
    },

    computed: {
        routeUrlPds: function () {
            let url_pds = this.productUrl;

            if (this.itemData.seoUrls != null) {
                this.itemData.seoUrls.forEach((seoUrl) => {

                    if (seoUrl.isCanonical) {
                        url_pds = seoUrl.seoPathInfo;
                    } else {
                        url_pds = seoUrl.pathInfo;
                    }
                });
            }

            return '/' + url_pds;
        },
    },

    methods: {
        getMediaUrl: function (width) {
            if (this.itemData.cover === null) {
                return require('~/assets/images/hubble/placeholder.gif');
            }

            let image = this.itemData.cover.media.url;

            if (width != null) {
                this.itemData.cover.media.thumbnails.forEach((thumbnail) => {
                    if (thumbnail.width === width) {
                        image = thumbnail.url;
                    }
                });
            }

            return image;
        },
        formatPrice: function (price) {
            const formatter = new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
            });

            return formatter.format(price);
        },
        gtmProductClick: function () {
            if (this.$gtm) {
                let price = this.getPriceAndCurrency('display_price_brutto', this.priceSwitcherIncludeVat);

                if (this.itemIsSpecial) {
                    price = this.getPriceAndCurrency('display_price_brutto_special', this.priceSwitcherIncludeVat);
                }

                this.$gtm.pushEvent({
                    event: 'productClick',
                    ecommerce: {
                        click: {
                            actionField: {
                                list: this.list,
                            },
                            products: [
                                {
                                    name: this.itemData.name,
                                    id: this.itemData.id,
                                    price: price,
                                    brand: this.itemData.manufacturer_name,
                                },
                            ],
                        },
                        impressions: undefined,
                        detail: undefined,
                        add: undefined,
                        remove: undefined,
                        purchase: undefined,
                    },
                });
            }
        },
    },
    head() {
        // Preload first image of listing to improve performance of hero element
        if (this.index < 2) {
            return {
                link: [
                    {
                        rel: 'preload',
                        as: 'image',
                        href: this.getMediaUrl(800),
                    },
                ],
            };
        }
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';
@import '~assets/scss/hubble/badges';
@import '~assets/scss/hubble/elevation';

.product-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    background-color: $background;
    transition: all 0.2s ease-in;
    border: 1px solid $gray;
    cursor: pointer;

    .card-media {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;

        .img-listing img {
            padding: 6px 6px 0 6px;
            max-width: 150px;
            max-height: 150px;
        }
    }

    .product-image {
        display: block;
        width: 100%;
        height: 100%;
        -o-object-fit: contain;
        object-fit: contain;
        max-height: 200px;
    }

    .actions {
        position: absolute;
        left: 3px;
        top: 3px;

        display: flex;
        align-items: center;
    }

    .add-to-wishlist-wrp {
        margin-left: 1px;
    }

    .product-card-info-wrp {
        padding: 12px;
        text-align: left;
        min-height: 120px;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .price-box {
        font-weight: $font-weight-bold;
        .old-price {
            font-size: 12px;
            line-height: 14px;
            font-weight: $font-weight-regular;
            text-decoration: line-through;
            color: $dark-gray;
        }

        .sale-price {
            color: $error-accent;
            margin-right: 8px;
        }

        .unit-price-wrp {
            @include font-size($text-font-sizes);
            color: $text-light;
        }
    }

    .card-expand {
        display: none;
        position: absolute;
        top: 98%;
        left: 0;
        right: 0;
        margin: auto;
        width: calc(100% - 10px);
        padding: 10px 15px 30px;
        z-index: 0;
        background: $background;
        box-shadow: 0 10px 10px 0 rgba(41, 40, 47, 0.1);
        border: 1px solid $border-color;
        border-top: 0;

        opacity: 0;

        transition: opacity 0.2s ease-out;
    }

    .manufacturer {
        @include font-size($text-font-sizes);
        font-weight: $font-weight-bold;
        margin-bottom: 5px;
    }

    .product-name {
        font-size: 14px;
        line-height: 17px;
        margin-bottom: 5px;

        .cms-block-product-slider & {
            height: 34px;
            overflow: hidden;
        }
    }

    .product-price {
        @include font-size($h5-font-sizes);
        font-weight: $font-weight-bold;
        color: $text-primary;
        margin-bottom: 10px;
        margin-top: auto;
    }
}

// global Slider styles
.sw-product-slider {
    display: flex;
    flex-wrap: wrap;
    padding-top: 60px;
}

.sw-product-slider-item {
    padding: 10px;
}

.sw-product-slider-title {
    text-align: center;
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
}

@media (min-width: 768px) {
    .product-card {
        .price-box {
            display: block;
            line-height: inherit;

            .old-price {
                width: auto;
                vertical-align: middle;
            }

            .sale-price {
                vertical-align: middle;
            }
        }
        .manufacturer {
            font-size: 16px;
            font-weight: $font-weight-bold;
            margin-bottom: 5px;
        }
        .product-name {
            margin-bottom: 14px;
        }
    }
}

@media (min-width: 1024px) {
    .product-card {
        &:hover {
            box-shadow: 0 2px 5px 0 rgba(41, 40, 47, 0.1);
            border: 1px solid $border-color;

            .card-expand {
                display: block;
                opacity: 1;
                top: 98%;
                z-index: 1;
            }
        }

        .product-card-info-wrp {
            padding: 20px;
        }

        .actions {
            left: 5px;
            top: 5px;
        }
    }
}

@media (min-width: 1200px) {
    .product-card {
        .card-media {
            min-height: 265px;

            .img-listing img {
                max-width: 200px;
                max-height: 200px;
            }
        }

        .product-image {
            max-height: 265px;
        }
    }
}

@media (min-width: 1600px) {
    .product-card {
        .card-media {
            min-height: 330px;

            .img-listing img {
                max-width: 250px;
                max-height: 200px;
            }
        }

        .product-image {
            max-height: 330px;
        }
    }
}
</style>
