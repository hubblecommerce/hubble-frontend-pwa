<template>
    <transition name="fade">
        <div v-if="loading" class="loader-layer" style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;">
            <loader />
        </div>

        <div v-if="!loading" class="container main-container">
            <div class="back-btn-wrp">
                <button v-if="$mq === 'sm'" class="detail-back-btn" @click="historyBack()">
                    <i class="icon icon-chevron-left" />
                    <span class="hidden-link-name">{{ $t('Back') }}</span>
                    <material-ripple />
                </button>
            </div>

            <div class="detail-wrp">
                <breadcrumbs :path="breadcrumbPath" />

                <div class="gallery bg-white">
                    <product-detail-gallery />
                </div>

                <div class="buybox-wrp container border-top border-bottom">
                    <product-detail-buybox />
                </div>

                <div v-if="$mq === 'sm'" class="product-description-container">
                    <div class="product-tabs md-elevation-2">
                        <collapsible-description id="description-anchor" :is-collapsed="false" :toggle-text="$t('Description')">
                            <div v-if="productData.description" class="tab-content">
                                <div v-html="productData.description" />
                            </div>
                        </collapsible-description>
                    </div>
                </div>

                <div v-if="$mq === 'md' || $mq === 'lg'" class="product-description-container md-elevation-2">
                    <div class="product-description-wrp">
                        <div id="description-anchor" />

                        <div class="description-title headline-4 pt-4">
                            {{ $t('Description') }}
                        </div>

                        <div v-if="productData.description" class="description-content">
                            <div v-html="productData.description" />
                        </div>
                    </div>
                </div>

                <div class="product-recommendation-wrp">
                    <product-detail-cross-selling-sw
                        v-if="productData.crossSellings !== null"
                        :product-id="productData.id"
                        :cross-sellings="productData.crossSellings"
                    />
                    <product-detail-recommendations v-if="hasProductsCrossByOrder" :product-id="productData.id" />
                </div>

                <div>
                    <last-viewed-products />
                </div>
            </div>

            <g-t-m-data-layer
                :event="'productLoaded'"
                :page-type="'product'"
                :page-title="productData.name"
                :breadcrumbs="breadcrumbPath"
                :e-commerce-detail="gtmECommerceData"
            />
        </div>
    </transition>
</template>

<script>
    import {mapActions, mapMutations, mapState} from 'vuex';
    import ProductDetailBuybox from "./ProductDetailBuybox";
    import ProductDetailGallery from "./ProductDetailGallery";
    import CollapsibleDescription from "./CollapsibleDescription";
    import Breadcrumbs from "../utils/Breadcrumbs";
    import ProductDetailRecommendations from "./ProductDetailRecommendations";
    import GTMDataLayer from "../utils/GTMDataLayer";
    import _ from 'lodash';
    import LastViewedProducts from "../productutils/LastViewedProducts";

    export default {
        name: "ViewProduct",

        components: {
            ProductDetailCrossSellingSw: () => import('./ProductDetailCrossSellingSw'),
            Loader: () => import('../utils/Loader'),
            GTMDataLayer,
            Breadcrumbs,
            ProductDetailBuybox,
            ProductDetailGallery,
            CollapsibleDescription,
            ProductDetailRecommendations,
            LastViewedProducts
        },

        data() {
            return {
                loading: true
            }
        },

        computed: {
            ...mapState({
                openDetail: state => state.modApiProduct.openDetail,
                dataProduct: state => state.modApiProduct.dataProduct,
                priceCurrency: state => state.modPrices.priceCurrency,
                clickPath: state => state.modClickPath.clickPath
            }),
            productData: function() {
                if(_.isEmpty(this.dataProduct)) {
                    return this.dataProduct;
                }

                return this.dataProduct.result.item;
            },
            routeUrlPds: function() {
                let _path = _.trim(process.env.config.APP_BASE_URL, '/');

                return _path + '/' + this.productData.url_pds;
            },
            routeUrlProductImg: function() {
                // If customer domain isset get live images
                if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                    let image = this.productData.image;
                    return _.join([
                        process.env.CUSTOMER_DOMAIN,
                        'images/catalog/thumbnails/cache/400',
                        image
                    ], '/');
                }

                // If no customer domain isset get images from api
                let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                return _path + '/images/catalog/product/pds/' + this.productData.image;
            },
            itemMinPriceBrutto: function() {
                if(!_.isEmpty(this.productData)) {
                    let _price = this.productData.final_price_item.min_price * 1.19;
                    return _.round(_price, 2);
                }
                return null;
            },
            structuredData: function() {
                if(_.isEmpty(this.productData)) return {};

                return  {
                    "@context": "http://schema.org",
                    "@type": "Product",
                    "name": this.productData.name,
                    "image": [
                        this.routeUrlProductImg
                    ],
                    "description": this.productData.description,
                    "sku": this.productData.sku,
                    "brand": {
                        "@type": "Thing",
                        "name": this.productData.manufacturer_name
                    },
                    "mpn": this.productData.sku,
                    "offers": {
                        "@type": "Offer",
                        "url": this.routeUrlPds,
                        "priceCurrency": this.priceCurrency,
                        "price": this.itemMinPriceBrutto,
                        "priceValidUntil": this.getPriceValidUntilDate(),
                        "itemCondition": "https://schema.org/NewCondition",
                        "availability": this.productData.stock_item.is_in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                    }
                    // More structured data...
                };
            },
            breadcrumbPath: function() {
                let path = [];
                let lastPathElement = this.clickPath.slice(-2)[0];

                // If last visited page was a category then push category path of this category to breadcrumbs
                if(lastPathElement.pageType === 'category') {
                    _.forEach(lastPathElement.categoryPath, (val, key) => {
                        path.push(val);
                    });
                }

                // If last visited page was search result, aggregate data for display link to search result set
                if(lastPathElement.pageType === 'search') {
                    _.forEach(lastPathElement.categoryPath, (val, key) => {
                        path.push({
                            id: val.id,
                            name: this.$t('Search for: ') + val.name,
                            url: val.url.replace(/^\/+/, '')
                        });
                    });
                }

                // Set current product as tailing breadcrumb object
                path.push({
                    "name": this.productData.name_orig,
                    "url": this.productData.url_pds,
                });

                return path;
            },
            gtmECommerceData: function() {
                 //let price = this.getPriceAndCurrency('display_price_brutto');
                 //
                 //if(this.itemIsSpecial) {
                 //    price = this.getPriceAndCurrency('display_price_brutto_special');
                 //}
                 //
                 //return {
                 //    'name': this.productData.name_orig,
                 //    'id': this.productData.id,
                 //    'price': price,
                 //    'brand': this.productData.manufacturer_name
                 //}
            },
            hasProductsCrossByOrder: function() {
                if(!_.isEmpty(this.productData)) {
                    return ! _.isEmpty(this.productData.related_product_ids.byorder);
                }
                return false;
            }
        },

        created() {
            if(this.openDetail) {
                this.getProductData({path: this.$router.history.current.params.dynamicRoute})
                    .then(response => {
                        this.loading = false;
                        this.setOpenDetail(false);
                    })
                    .catch((err) => {
                        console.log("getProductData error: ", err);
                    });
            } else {
                this.loading = false;
            }
        },

        methods: {
            ...mapMutations({
                setOpenDetail: 'modApiProduct/setOpenDetail'
            }),
            ...mapActions({
                getProductData: 'modApiProduct/getProductData'
            }),
            historyBack: function() {
                this.$router.go(-1);
            },
            getPriceValidUntilDate: function() {
                // check if a special Price is active and has a valid Date
                if(this.productData.final_price_item.special_to_date != null) {
                    let td = Date.parse(Date()),
                        startDate = Date.parse(this.productData.final_price_item.special_from_date),
                        endDate = Date.parse(this.productData.final_price_item.special_to_date);

                    if(startDate <= td && td <= endDate) {
                        return this.productData.final_price_item.special_to_date;
                    }
                }
                // if not, return price Valid Until today + 1 month
                let priceValidUntil = new Date();
                priceValidUntil.getDate();
                priceValidUntil.setMonth(priceValidUntil.getMonth()+1);

                return priceValidUntil.toISOString();
            },
            empty: function(p) {
                return _.isEmpty(p);
            }
        },

        head () {
            let metaDescription = {},
                metaKeywords = {},
                metaTitle = '';

            if(!_.isEmpty(this.productData.meta_description)) {
                metaDescription = this.productData.meta_description;
            } else {
                metaDescription = process.env.meta.product.metaDescription;
            }

            if(!_.isEmpty(this.productData.meta_keywords)) {
                metaKeywords = this.productData.meta_keywords;
            } else {
                metaKeywords = process.env.meta.product.metaKeywords;
            }

            if(!_.isEmpty(this.productData.meta_title)) {
                metaTitle = this.productData.meta_title;
            }
            else if(!_.isEmpty(this.productData.name_orig)) {
                metaTitle = this.productData.name_orig;
            } else {
                metaTitle = process.env.meta.product.title;
            }

            return {
                title: metaTitle,
                meta: [
                    // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                    { hid: 'description', name: 'description', content: metaDescription},
                    { hid: 'keywords', name: 'keywords', content: metaKeywords },
                    { hid: 'robots', name: 'robots', content: this.productData.meta_robots },
                    { hid: 'og:type', name: 'og:type', content: 'product'}
                ],
                script: [
                    { json: this.structuredData, type: 'application/ld+json' }
                ]
            }
        }
    };
</script>
