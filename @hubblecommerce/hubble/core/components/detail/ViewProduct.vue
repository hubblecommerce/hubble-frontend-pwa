<template>
    <div class="detail-wrp container">
        <breadcrumb v-if="product !== null" :path="breadcrumb" />

        <div class="detail-top-wrp">
            <div class="detail-left-wrp">
                <product-detail-gallery v-if="product !== null" :media="product.media" :alt="product.name" />
            </div>

            <div class="buybox-wrp">
                <product-detail-buybox v-if="product !== null" :data-product="product" />
                <product-detail-service-info />

                <tabs class="detail-tabs">
                    <tab class="description-tab" :name="'Description'">
                        <div v-if="product !== null" class="tab-content">
                            <div v-text="product.description" />
                        </div>
                    </tab>
                    <tab class="review-tab" :name="'Reviews'"> No reviews yet </tab>
                </tabs>
            </div>
        </div>

        <template v-if="product.crossSellings != null && product.crossSellings.length">
            <div class="detail-crosssellings">
                <template v-if="loadCrosssellings">
                    <lazy-product-detail-crosssellings :product-id="product.id" />
                </template>
            </div>
        </template>
    </div>
</template>

<script>
import { mappingProduct } from '@/utils/api-mapping-helper';

export default {
    name: 'ViewProduct',

    props: {
        data: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            product: null,
            loadCrosssellings: false,
        };
    },

    computed: {
        structuredData: function () {
            if (this.product === null) {
                return {};
            }

            return {
                '@context': 'http://schema.org',
                '@type': 'Product',
                'name': this.product.name,
                'image': this.product.media.url,
                'description': this.product.description,
                'sku': this.product.sku,
                'brand': {
                    '@type': 'Thing',
                    'name': this.product.manufacturer_name,
                },
                'mpn': this.product.sku,
                'offers': {
                    '@type': 'Offer',
                    'url': process.env.APP_BASE_URL.trim() + '/' + this.product.url_pds,
                    'priceCurrency': this.priceCurrency,
                    'price': this.product.final_price_item.display_price_brutto,
                    'itemCondition': 'https://schema.org/NewCondition',
                    'availability': this.product.stock_item.is_in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                },
                // More structured data...
            };
        },
        breadcrumb: function () {
            let path = [];

            if (this.data.breadcrumb != null && Object.keys(this.data.breadcrumb).length > 0) {
                Object.keys(this.data.breadcrumb).forEach((key) => {
                    path.push({
                        name: this.data.breadcrumb[key].name,
                        url: this.data.breadcrumb[key].path,
                    });
                });
            }

            path.push({
                name: this.product.name,
                url: this.product.url_pds,
            });

            return path;
        },
    },

    created() {
        this.product = mappingProduct(this.data);
    },

    mounted() {
        this.registerIntersectionObserver('.detail-crosssellings', 'loadCrosssellings');
    },

    methods: {
        registerIntersectionObserver: function (targetSelector, flag) {
            let target = document.querySelector(targetSelector);

            if (!target) return;

            let options = {
                rootMargin: '20px',
                threshold: 0.01,
            };

            let observer = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this[flag] = true;
                        observer.disconnect();
                    }
                });
            }, options);

            observer.observe(target);
        },
    },

    head() {
        let metaDescription = {},
            metaKeywords = {},
            metaTitle = '';

        if (this.product.meta_description != null) {
            metaDescription = this.product.meta_description;
        } else {
            metaDescription = process.env.meta.product.metaDescription;
        }

        if (this.product.meta_keywords != null) {
            metaKeywords = this.product.meta_keywords;
        } else {
            metaKeywords = process.env.meta.product.metaKeywords;
        }

        if (this.product.meta_title != null) {
            metaTitle = this.product.meta_title;
        } else if (this.product.name_orig != null) {
            metaTitle = this.product.name_orig;
        } else {
            metaTitle = process.env.meta.product.title;
        }

        return {
            title: metaTitle,
            meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                { hid: 'description', name: 'description', content: metaDescription },
                { hid: 'keywords', name: 'keywords', content: metaKeywords },
                { hid: 'robots', name: 'robots', content: this.product.meta_robots },
                { hid: 'og:type', name: 'og:type', content: 'product' },
            ],
            script: [{ json: this.structuredData, type: 'application/ld+json' }],
        };
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.detail-top-wrp {
    margin-bottom: 30px;

    .breadcrumbs {
        display: none;
        width: 100%;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .detail-left-wrp {
        position: relative;
        width: 100%;

        .lds-ring div {
            border-color: $secondary transparent transparent transparent;
        }

        .detail-actions-wrp {
            position: absolute;
            bottom: -20px;
            right: 20px;

            .add-to-wishlist-wrp {
                min-width: 0;
                min-height: 0;
            }

            .add-to-cart {
                width: 44px;
                height: 44px;
                border-radius: 25px;
                padding: 0;
                margin: 0;
                opacity: 1;

                i {
                    color: $secondary;
                    font-size: 24px;
                    height: 20px;
                    left: 0;
                    right: 0;
                }

                .cart-button-label {
                    font-size: 14px;
                    width: 0;
                    height: 0;
                    overflow: hidden;
                    display: block;
                }

                .lds-ring {
                    height: 25px;

                    div {
                        border-color: $secondary transparent transparent transparent;
                    }
                }
            }
        }
    }
}

.product-actions {
    position: fixed;
    z-index: 6;
    background-color: $background;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    opacity: 1;

    .lds-ring {
        margin: 0 6px;
    }
}

.product-actions-animation-enter-active,
.product-actions-animation-leave-active {
    transition: all 0.5s ease;
}

.product-actions-animation-enter,
.product-actions-animation-leave-to {
    bottom: -300px !important;
    opacity: 0;
}

.product-actions-animation-enter-to,
.product-actions-animation-leave {
    bottom: 0 !important;
    opacity: 1;
}

.product-description-container {
    &.mobile-layout {
        .tab-content p {
            @include font-size($small-text-font-sizes);
        }
    }

    button {
        padding-left: 10px;
    }

    .product-description-wrp {
        float: left;
        width: 60%;
    }

    .link-leisten {
        font-weight: bold;
        text-decoration: underline;
    }
}

@media (min-width: 768px) {
    .detail-top-wrp {
        display: flex;
        flex-wrap: wrap;
        padding: 15px;

        .breadcrumbs {
            padding-top: 0;
            padding-left: 0;
            padding-bottom: 10px;
        }

        .buybox-wrp {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 30px 0 0;
        }

        .product-description-container {
            width: 100%;
            padding-bottom: 40px;
            padding-right: 40px;
            padding-left: 40px;
            border-bottom: 1px solid $border-color;

            #description-anchor {
                position: relative;
                top: -$header-height-desktop;
                visibility: hidden;
            }
        }

        .description-content p {
            @include font-size($small-text-font-sizes);
        }

        .description-title {
            margin-bottom: 15px;
        }
    }

    .detail-container {
        position: relative;
    }

    .product-description-container {
        .product-description-wrp {
            width: 100%;
        }
    }
}

@media (min-width: 1024px) {
    .detail-top-wrp {
        display: flex;
        justify-content: space-between;

        .breadcrumbs {
            display: block;
            padding-right: 15px;
            padding-left: 15px;
            padding-bottom: 0;
            margin-bottom: 30px;
        }

        .detail-left-wrp {
            width: 50%;
        }

        .buybox-wrp {
            width: 45%;
            padding: 20px 0 0;
        }
    }
}
</style>
