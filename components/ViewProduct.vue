<template>
    <div class="main-container">
        <div class="container detail-container">
<!--            <div class="back-btn-wrp">-->
<!--                <button class="detail-back-btn" @click="historyBack()">-->
<!--                    <i class="icon chevron-left"></i>-->
<!--                    <span class="hidden-link-name">{{$t('Back')}}</span>-->
<!--                    <material-ripple></material-ripple>-->
<!--                </button>-->
<!--            </div>-->

            <div id="messages_product_view"></div>

            <div class="detail-wrp" itemtype="http://schema.org/Product">

                <breadcrumbs :path="breadcrumbPath"/>

                <transition name="product-actions-animation">
                    <div ref="productActions" v-if="$mq === 'sm' && isSticky" class="product-actions">
                        <div class="price-cart-wrp">
                            <div class="price-box price-wrp">
                              <template v-if="itemIsSpecial">
                                <span class="old-price" v-html="getPriceAndCurrency('price', priceSwitcherIncludeVat)"></span>
                                <span class="sale-price" v-html="getPriceAndCurrency('special_price', priceSwitcherIncludeVat)"></span>
                                <div class="info"><span>{{ $t('incl_tax') }}</span> </div>
                              </template>
                              <template v-else>
                                <span class="sale-price" v-html="getPriceAndCurrency('price', priceSwitcherIncludeVat)"></span>
                                <div class="info"><span>{{ $t('incl_tax') }}</span> </div>
                              </template>
                            </div>
                            <div class="d-flex cart-button-wrp">
                                <button :disabled="loaderState" type="button" @click.prevent="addToCart" :title="$t('add_to_cart')" class="add-to-cart m-0 w-100">
                                    <i class="icon icon-cart" aria-hidden="true"></i>
                                    <span v-if="!loaderState" class="cart-button-label headline-4">{{ $t('add_to_cart') }}</span>
                                    <div v-if="loaderState" class="lds-ellipsis">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <material-ripple></material-ripple>
                                </button>
                            </div>
                        </div>
                    </div>
                </transition>

                <div class="gallery bg-white">
                      <div class="badge-wrp">
                          <div v-if="itemIsSpecial" class="badge sale">Sale</div>
                      </div>
                      <product-detail-gallery></product-detail-gallery>
                  </div>

                <div class="buybox-wrp container border-top border-bottom">
                    <product-detail-buybox></product-detail-buybox>
                </div>

                <!-- Use collapsible in Mobile view -->
                <div class="product-description-container" v-if="$mq === 'sm'">
                    <div class="product-tabs md-elevation-2">
                        <collapsible-description :toggle-text="$t('Description')" :isCollapsed="false">
                            <div class="tab-content" v-if="productData.description">
                                <p v-html="productData.description" ></p>
                            </div>

                            <div id="description" class="description-text tab-content" v-if="!productData.description">
                                <template v-if="productData.model">
                                    <p v-html="productData.model"></p>
                                </template>
                                <template v-else>
                                    <p>{{$t('There is no data assigned to attribute \'model\'.')}}</p>
                                </template>
                            </div>
                        </collapsible-description>
                        <collapsible :toggle-text="$t('Our care recommendation')">
                            <div class="tab-content p-3">
                                <care-recommendation :product-id="productData.id"></care-recommendation>
                            </div>
                        </collapsible>
                    </div>
                </div>

                <!-- Remove Tabs in Tablet/Desktop view -->
                <div class="product-description-container md-elevation-2" v-if="$mq === 'md' || $mq === 'lg'">
                    <div class="product-description-wrp">
                        <h1 class="description-title headline-4 pt-4">{{$t('Description')}}</h1>
                        <div class="description-content" v-if="productData.description">
                            <p v-html="productData.description"></p>
                        </div>
                        <div class="description-content" v-if="!productData.description">
                            <template v-if="productData.model">
                                <p v-html="productData.model"></p>
                            </template>
                            <template v-else>
                                <p>{{$t('There is no data assigned to attribute \'model\'.')}}</p>
                            </template>
                        </div>
                    </div>
                    <div class="product-description-wrp care-products-wrp">
                        <h1 class="description-title headline-4 pt-4">{{$t('Our care recommendation')}}</h1>
                        <div class="description-content">
                            <care-recommendation :product-id="productData.id"></care-recommendation>
                        </div>
                    </div>
                </div>

            </div>

            <product-detail-recommandations :product-id="productData.id"></product-detail-recommandations>

        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    import ProductDetailBuybox from "./ProductDetailBuybox";
    import ProductDetailGallery from "./ProductDetailGallery";
    import ProductDetailRecommandations from "./ProductDetailRecommendations";
    import Tabs from "./Tabs";
    import Tab from "./Tab";
    import CollapsibleDescription from "./CollapsibleDescription";
    import Breadcrumbs from "./Breadcrumbs";
    import CareRecommendation from "./CareRecommendation";

    export default {
        name: "ViewProduct",

        components: {
            Breadcrumbs,
            Tab,
            Tabs,
            ProductDetailRecommandations,
            ProductDetailBuybox,
            ProductDetailGallery,
            CollapsibleDescription,
            CareRecommendation
        },

        data() {
            return {
                loaderState: false,
                vp: '',
                selectedQty: 1,
                position: 0,
                isSticky: false
            }
        },


        computed: {
            ...mapState({
                dataProduct: state => state.modApiResources.dataProduct,
                priceCurrency: state => state.modPrices.priceCurrency,
                priceCurrencySymbol: state => state.modPrices.priceCurrencySymbol,
                priceSwitcherIncludeVat: state => state.modPrices.priceSwitcherIncludeVat,
                clickPath: state => state.modClickPath.clickPath,
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
                return _path + '/images/catalog/product/pds/' + this.productData.image;
            },
            itemMinPriceBrutto() {
                let _price = this.productData.final_price_item.min_price * 1.19;
                return _.round(_price, 2);
            },
            emitAddToCart() {
                //this.$bus.$emit('add-to-cart-event', {
                //    item: this.dataItem,
                //    qty: this.selectedQty
                //});
                return true;
            },
            changePosition() {
                return this.vp === 'sm'
                    ? 'fixed'
                    : 'left'
            },
            itemIsSpecial() {
                return this.$store.getters['modPrices/productIsSpecial'](this.productData);
            },
            structuredData() {
                let data = {
                    "@context": "http://schema.org",
                    "@type": "Product",
                    "name": this.productData.name,
                    "brand": {
                        "@type": "Thing",
                        "name": "ACME"
                    },
                    "description": this.productData.model,
                    "image": [
                        this.routeUrlProductImg
                    ],
                    "sku": this.productData.sku,
                    "gtin8": "4251619566685",
                    "offers": {
                        "@type": "Offer",
                        "url": this.routeUrlPds,
                        "priceCurrency": "EUR",
                        "price": this.itemMinPriceBrutto,
                        "priceValidUntil": "2020-11-05",
                        "itemCondition": "https://schema.org/UsedCondition",
                        "availability": "https://schema.org/InStock"
                    }
                    // More structured data...
                };
                return data;
            },
            itemTaxClass() {
                return this.$store.getters['modPrices/getTaxClassByLabel'](this.productData.final_price_item.tax_class_id);
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
                    "name": this.productData.name,
                    "url": this.productData.url_pds,
                });

                return path;
            }
        },
        methods: {
            getPriceAndCurrency(key, addVat) {
                return this.$store.getters['modPrices/getPriceAndCurrencyDecFmt'](this.productData.final_price_item[key], addVat, this.itemTaxClass);
            },
            formatPrice(price) {
                let priceFrmt = this.$store.getters['modPrices/priceDecFmt'](price);
                let priceCur = this.$store.getters['modPrices/priceAddCur'](priceFrmt);
                return priceCur;
            },
            addToCart() {
                this.$store.dispatch('modCart/addItem', {
                    item: this.productData,
                    qty: this.selectedQty
                }).then(() => {
                    this.$store.dispatch('modFlash/flashMessage', {
                        flashType: 'success',
                        flashMessage: this.$t('Successfully added item to cart.')
                    });
                })
            },
            handleScroll: function (event) {
                this.setStickyFlag();
            },
            setStickyFlag() {
                if(window.pageYOffset > this.position) {
                    this.isSticky = true;
                } else {
                    this.isSticky = false;
                }
            },
            historyBack: function() {
                this.$router.go(-1);
            },
            removeLeadingSlash(string) {
                return string.replace(/^\/+/, '');
            },
        },
        mounted: function() {
            // Set position data for sticky elements
            if(this.$mq === 'sm') {
                var bodyRect = document.body.getBoundingClientRect(),
                    elemRect = document.getElementsByClassName("main-container")[0].getBoundingClientRect();

                this.position = elemRect.top - bodyRect.top;
            }

            if(this.$mq === 'sm') {
                window.addEventListener('scroll', this.handleScroll);
            }
        },

        head () {
            let metaDescription = {};

            if(!_.isEmpty(this.productData.meta_description)) {
                metaDescription = { hid: 'description', name: 'description', content: this.productData.meta_description }
            }

            return {
                title: this.productData.name,
                meta: [
                    // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                    metaDescription,
                    { hid: 'robots', name: 'robots', content: this.productData.meta_robots },
                    { hid: 'keywords', name: 'keywords', content: this.productData.meta_keyword }
                ],
                __dangerouslyDisableSanitizers: ['script'],
                script: [
                    { innerHTML: JSON.stringify(this.structuredData), type: 'application/ld+json' }
                ]
            }
        }
    };
</script>
