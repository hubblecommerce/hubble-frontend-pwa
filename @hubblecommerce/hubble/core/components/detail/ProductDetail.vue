<template>
    <div class="product-detail">
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

        <div class="detail-crosssellings">
            <template v-if="loadCrosssellings">
                <lazy-product-detail-crosssellings :product-id="product.id" :cross-sellings="product.crossSellings" />
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductDetail',

    props: {
        product: {
            type: Object,
            default: () => {}
        }
    },

    data() {
        return {
            loadCrosssellings: false,
        }
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
}
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
