<template>
    <transition name="fade">
        <div v-if="loading" class="loader-layer" style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;">
            <div class="loader lds-ring">
                <div />
                <div />
                <div />
                <div />
            </div>
        </div>
        <div v-if="!loading" class="main-container">
            <div class="container detail-container">
                <div v-if="$mq === 'sm'" v-view="viewHandler" class="back-btn-wrp">
                    <button class="detail-back-btn" @click="historyBack()">
                        <i class="icon icon-chevron-left" />
                        <span class="hidden-link-name">{{ $t('Back') }}</span>
                        <material-ripple />
                    </button>
                </div>

                <div id="messages_product_view" />

                <div class="detail-wrp" itemtype="http://schema.org/Product">

                    <breadcrumbs :path="breadcrumbPath" />

                    <transition name="product-actions-animation">
                        <div v-if="$mq === 'sm' && isSticky" ref="productActions" class="product-actions">
                            <div class="price-cart-wrp">
                                <div class="price-box price-wrp">
                                    <template v-if="itemIsSpecial">
                                        <span class="old-price" v-html="getPriceAndCurrency('display_price_brutto', priceSwitcherIncludeVat)" />
                                        <span class="sale-price" v-html="getPriceAndCurrency('display_price_brutto_special', priceSwitcherIncludeVat)" />
                                        <div class="info">
                                            <span>{{ $t('incl_tax') }}</span>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <span class="sale-price" v-html="getPriceAndCurrency('display_price_brutto', priceSwitcherIncludeVat)" />
                                        <div class="info">
                                            <span>{{ $t('incl_tax') }}</span>
                                        </div>
                                    </template>
                                </div>

                                <div class="d-flex cart-button-wrp">
                                    <button :disabled="loaderState" type="button" :title="$t('add_to_cart')" class="add-to-cart m-0 w-100" @click.prevent="addToCart">
                                        <i class="icon icon-cart" aria-hidden="true" />
                                        <span v-if="!loaderState" class="cart-button-label headline-4">{{ $t('add_to_cart') }}</span>
                                        <div v-if="loaderState" class="lds-ellipsis">
                                            <div />
                                            <div />
                                            <div />
                                            <div />
                                        </div>
                                        <material-ripple />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </transition>

                    <div class="gallery bg-white">
                        <product-detail-gallery />
                    </div>

                    <div class="buybox-wrp container border-top border-bottom">
                        <product-detail-buybox />
                    </div>

                    <div v-if="$mq === 'sm'" class="product-description-container">
                        <div class="product-tabs md-elevation-2">
                            <collapsible-description id="description-tab" :is-collapsed="false" :toggle-text="$t('Description')">
                                <div v-if="productData.description" class="tab-content">
                                    <p v-html="productData.description" />
                                </div>

                                <div v-if="!productData.description" class="description-text tab-content">
                                    <template v-if="productData.model">
                                        <p v-html="productData.model" />
                                    </template>
                                    <template v-else>
                                        <p>{{ $t('There is no data assigned to attribute \'model\'.') }}</p>
                                    </template>
                                </div>
                            </collapsible-description>
                        </div>
                    </div>

                    <div v-if="$mq === 'md' || $mq === 'lg'" class="product-description-container md-elevation-2">
                        <div class="product-description-wrp">
                            <div id="description" />
                            <div class="description-title headline-4 pt-4">
                                {{ $t('Description') }}
                            </div>
                            <client-only>
                                <div v-if="productData.description" class="description-content">
                                    <p v-html="productData.description" />
                                </div>
                            </client-only>
                            <div v-if="!productData.description" class="description-content">
                                <template v-if="productData.model">
                                    <p v-html="productData.model" />
                                </template>
                                <template v-else>
                                    <p>{{ $t('There is no data assigned to attribute \'model\'.') }}</p>
                                </template>
                            </div>
                        </div>
                    </div>

                    <div class="product-recommendation-wrp">
                        <product-detail-recommendations-similar v-if="hasProductsCrossSimilar" :product-id="productData.id" />
                    </div>

                    <div class="product-recommendation-wrp">
                        <product-detail-recommendations v-if="hasProductsCrossByOrder" :product-id="productData.id" />
                    </div>
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
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
    import ProductDetailBuybox from "./ProductDetailBuybox";
    import ProductDetailGallery from "./ProductDetailGallery";
    import CollapsibleDescription from "./CollapsibleDescription";
    import Breadcrumbs from "../utils/Breadcrumbs";
    import ProductDetailRecommendations from "./ProductDetailRecommendations";
    import ProductDetailRecommendationsSimilar from "./ProductDetailRecommendationsSimilar";
    import GTMDataLayer from "../utils/GTMDataLayer";
    import { clearDataLayer } from "@hubblecommerce/hubble/core/utils/gtmHelper";

    export default {
        name: "ViewProduct",

        components: {
            GTMDataLayer,
            Breadcrumbs,
            ProductDetailBuybox,
            ProductDetailGallery,
            CollapsibleDescription,
            ProductDetailRecommendations,
            ProductDetailRecommendationsSimilar
        },

        data() {
            return {
                loaderState: false,
                vp: '',
                selectedQty: 1,
                position: 0,
                isSticky: false,
                careProductsArr: [],
                loading: true
            }
        },

        computed: {
            ...mapState({
                openDetail: state => state.modApiResources.openDetail,
                dataProduct: state => state.modApiProduct.dataProduct,
                priceCurrency: state => state.modPrices.priceCurrency,
                priceCurrencySymbol: state => state.modPrices.priceCurrencySymbol,
                priceSwitcherIncludeVat: state => state.modPrices.priceSwitcherIncludeVat,
                clickPath: state => state.modClickPath.clickPath,
                optionIsSelected: state => state.modApiProduct.optionIsSelected,
                selectedVariants: state => state.modApiProduct.selectedVariants
            }),
            ...mapGetters({
                productIsSpecial: 'modPrices/productIsSpecial',
                getTaxClassByLabel: 'modPrices/getTaxClassByLabel',
                getPriceAndCurrencyDecFmt: 'modPrices/getPriceAndCurrencyDecFmt',
                priceDecFmt: 'modPrices/priceDecFmt',
                priceAddCur: 'modPrices/priceAddCur'
            }),
            productData() {
                if(_.isEmpty(this.dataProduct)) {
                    return this.dataProduct;
                }

                return this.dataProduct.result.item;
            },
            routeUrlPds() {
                let _path = _.trim(process.env.config.APP_BASE_URL, '/');

                return _path + '/' + this.productData.url_pds;
            },
            routeUrlProductImg() {
                // If customer domain isset get live images
                if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                    let image = this.productData.image
                    let _reference = _.join([
                        process.env.CUSTOMER_DOMAIN,
                        'images/catalog/thumbnails/cache/400',
                        image
                    ], '/');
                    return _reference;
                }

                // If no customer domain isset get images from api
                let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                return _path + '/images/catalog/product/pds/' + this.productData.image;
            },
            itemMinPriceBrutto() {
                if(!_.isEmpty(this.productData)) {
                    let _price = this.productData.final_price_item.min_price * 1.19;
                    return _.round(_price, 2);
                }
                return null;
            },
            changePosition() {
                return this.vp === 'sm'
                    ? 'fixed'
                    : 'left'
            },
            itemIsSpecial() {
                return this.productIsSpecial(this.productData);
            },
            structuredData() {
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
            itemTaxClass() {
                return this.getTaxClassByLabel(this.productData.final_price_item.tax_class_id);
            },
            breadcrumbPath() {
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
                            url: this.removeLeadingSlash(val.url)
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
            attributeName() {
                if (this.productData.facets.string_facets[0]) {
                    return this.productData.facets.string_facets[0]['label'];
                }

                return null;
            },
            gtmECommerceData: function() {

                /* let price = this.getPriceAndCurrency('display_price_brutto', this.priceSwitcherIncludeVat);

                 if(this.itemIsSpecial) {
                     price = this.getPriceAndCurrency('display_price_brutto_special', this.priceSwitcherIncludeVat);
                 }

                 return {
                     'name': this.productData.name_orig,
                     'id': this.productData.id,
                     'price': price,
                     'brand': this.productData.manufacturer_name
                 }*/

            },
            hasProductsCrossBuybox() {
                if(!_.isEmpty(this.productData)) {
                    return ! _.isEmpty(this.productData.related_product_ids.buybox);
                }
                return false;
            },
            hasProductsCrossByOrder() {
                if(!_.isEmpty(this.productData)) {
                    return ! _.isEmpty(this.productData.related_product_ids.byorder);
                }
                return false;
            },
            hasProductsCrossSimilar() {
                if(_.has(this.productData, 'statistic_item')) {
                    if(_.has(this.productData.statistic_item, 'art_category')) {
                        return /^(D|H|K)$/.test(this.productData.statistic_item.art_category);
                    }
                }

                return false;
            },
            itemHasVariants() {
                if(!_.isEmpty(this.productData.facets.string_facets)) {
                    return true;
                }
                return false;
            }
        },

        created() {
            if(this.openDetail) {
                this.getProductData({path: this.$router.history.current.params.dynamicRoute}).then(response => {
                    this.loading = false;
                    this.setOpenDetail(false);
                });
            } else {
                this.loading = false;
            }
        },

        methods: {
            ...mapMutations({
                setOptionNotSelectedError: 'modApiProduct/setOptionNotSelectedError',
                resetSelectedVariants: 'modApiProduct/resetSelectedVariants',
                setOpenDetail: 'modApiResources/setOpenDetail'
            }),
            ...mapActions({
                getProductData: 'modApiProduct/getProductData',
                flashMessage: 'modFlash/flashMessage',
                toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
                addItem: 'modCart/addItem'
            }),
            getPriceAndCurrency(key, addVat) {
                return this.getPriceAndCurrencyDecFmt(this.productData.final_price_item[key], addVat, this.itemTaxClass);
            },
            formatPrice(price) {
                let priceFrmt = this.priceDecFmt(price);
                let priceCur = this.priceAddCur(priceFrmt);
                return priceCur;
            },
            addToCart() {
                //If item has variants (size, color, ..) and none is selected
                // show error message and return
                if(this.itemHasVariants && !this.optionIsSelected) {
                    this.setOptionNotSelectedError();

                    // Display Error Message
                    this.flashMessage({
                        flashType: 'error',
                        flashMessage: this.$t('Please select {atrName} first', {atrName: this.attributeName})
                    });

                    return;
                }

                // Add selected variant to item
                this.productData.variants = this.selectedVariants;

                // Add item and qty to cart store
                this.addItem({
                    item: this.productData,
                    qty: this.selectedQty
                }).then(() => {

                    this.resetSelectedVariants();

                    // Open Minicart Context
                    this.toggleOffcanvasAction({
                        component: 'TheMiniCart',
                        direction: 'rightLeft'
                    }).then(() => {
                        // Display Success Message
                        this.flashMessage({
                            flashType: 'success',
                            flashMessage: this.$t('Successfully added item to cart.')
                        });
                    });
                    this.gtmAddToCart();
                }).catch((error) => {
                    // Display Error Message (e.g. Qty of item is at maxQty)
                    this.flashMessage({
                        flashType: 'error',
                        flashMessage: this.$t(error)
                    });
                });
            },
            gtmAddToCart: function() {
                if(this.$gtm) {
                    clearDataLayer(() => {
                        let price = this.getPriceAndCurrency('display_price_brutto', this.priceSwitcherIncludeVat);

                        if(this.itemIsSpecial) {
                            price = this.getPriceAndCurrency('display_price_brutto_special', this.priceSwitcherIncludeVat);
                        }

                        this.$gtm.pushEvent({
                            'event': 'addToCart',
                            'ecommerce': {
                                'currencyCode': 'EUR',
                                'add': {
                                    'products': [{
                                        'name': this.productData.name,
                                        'id': this.productData.id,
                                        'price': price,
                                        'brand': this.productData.manufacturer_name,
                                        'variant': this.productData.variants,
                                        'quantity': this.selectedQty
                                    }]
                                },
                                'impressions': undefined,
                                'detail': undefined,
                                'remove': undefined,
                                'click': undefined,
                                'purchase': undefined
                            }
                        });

                        console.log(window['dataLayer']);
                    });
                }
            },
            viewHandler: function(e) {
                if(e.type === 'exit') {
                    this.isSticky = true;
                }

                if(e.type === 'enter') {
                    this.isSticky = false;
                }
            },
            historyBack: function() {
                this.$router.go(-1);
            },
            removeLeadingSlash(string) {
                return string.replace(/^\/+/, '');
            },
            getPriceValidUntilDate() {
                // check if a special Price is active and has a valid Date
                if(this.productData.final_price_item.special_to_date != null) {
                    let td = Date.parse(Date()),
                        startDate = Date.parse(this.productData.final_price_item.special_from_date),
                        endDate = Date.parse(this.productData.final_price_item.special_to_date);
                    if(startDate <= td && td <= endDate) return this.productData.final_price_item.special_to_date;
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
