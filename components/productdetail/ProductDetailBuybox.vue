<template>
    <div class="product-shop">
        <div class="product-info-wrp">
            <div class="row mb-3 product-headline d-flex">
                <!-- Product Headline -->
                <div class="product-headline-info">
                    <h1>
                        <div v-if="productManufacturer" class="manufacturer-name headline-4" v-html="productManufacturer.name" />
                        <div class="product-name text-small" v-html="productData.name" />
                    </h1>

                    <!-- SKU -->
                    <div v-if="productData.sku" class="sku">
                        {{ $t('sku_label') }}: {{ productData.sku }}
                    </div>
                </div>
                <div v-if="logoPath !== null" class="brand-logo-wrp">
                    <img :src="logoPath"
                         :alt="productData.manufacturer_item.name"
                         :title="productData.manufacturer_item.name"
                    >
                </div>
            </div>

            <!-- Colors -->
            <product-detail-buybox-color-select v-if="productHasSizeVariant" :product-id="productData.id" />

            <!-- Variants -->
            <div class="variants-wrp">
                <div v-if="attributeName" class="variant-label headline-4">
                    {{ attributeName }} {{ $t('select') }}:
                    <span class="selected-variant" v-text="showSelectedOption"></span>
                </div>

                <ul class="variant-list">
                    <li v-for="(option, id) in productHasSizeVariant ? productSizesSorted : productOptions"
                        :key="id"
                        class="option-val headline-4"
                        :class="[getUnavailableClass(option), getSelectedClass(option)]"
                        :value="option"
                        @click="selectedOption(option)"
                        v-text="productHasSizeVariant ? formatSize(option.value_label) : option.value_label"
                    />
                </ul>

                <div v-if="optionNotSelectedError" class="error-message">
                    {{ $t('Please select {atrName} first', { atrName: attributeName }) }}
                </div>
            </div>

            <!-- Link to description-tab: on click scroll to description and show content / Mobile view /-->
            <div v-if="$mq === 'sm'" class="description-link-wrp">
                <a href="#description-tab" class="description-link link-primary" @click="openCollapsible()">{{ $t('See description') }}</a>
            </div>
            <div v-if="$mq === 'md' || $mq === 'lg'" class="description-link-wrp">
                <a href="#description" class="description-link link-primary">{{ $t('See description') }}</a>
            </div>

            <div class="price-cart-delivery-wrp mb-2">
                <div class="price-box">
                    <product-detail-buybox-price :item="productData" />
                </div>
            </div>

            <!-- Links to filtered products -->
            <div v-if="productHasSizeVariant" class="filtered-products-link-wrp">
                <nuxt-link :to="manufacturerLink()" class="filtered-products-link link-primary">
                    {{ $t('All') }} {{ productManufacturer.name }} {{ productCategory }}
                </nuxt-link>
                <nuxt-link :to="filterLink()" class="filtered-products-link link-primary">
                    {{ $t('More') }} {{ productCategory }} {{ $t('in') }} {{ productColor }}
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import ProductDetailBuyboxPrice from "./ProductDetailBuyboxPrice";

    import AddToWishlist from "../productutils/AddToWishlist";
    import ProductDetailBuyboxColorSelect from "./ProductDetailBuyboxColorSelect";

    export default {
        components: {ProductDetailBuyboxColorSelect, AddToWishlist, ProductDetailBuyboxPrice},

        data() {
            return {
                name: 'ProductDetailBuybox',
                itemHasTierPrices: false,
                itemTierPriceDiscount: null,
                selected: {
                    origin: null,
                    processed: null
                },
                isActive: false,
                attributeCodeSize: 'groesse',
                attributeCodeManufacturer: 'manufacturer',
                itemData: {},
                showTierPrices: false,

                logoPath: null
            }
        },

        computed: {
            // Vuex
            ...mapState({
                dataProduct: state => state.modApiResources.dataProduct,
                optionIsSelected: state => state.modApiResources.optionIsSelected,
                optionNotSelectedError: state => state.modApiResources.optionNotSelectedError,
                selectedVariants: state => state.modApiResources.selectedVariants
            }),
            productData() {
                return this.dataProduct.result.item;
            },
            productManufacturer() {
                if(_.isEmpty(this.productData.manufacturer_item)) {
                    return false;
                }
                return this.productData.manufacturer_item;
            },
            productCategory() {
                return this.nearestCategory.value_label;
            },
            productColor() {
                return this.productData.statistic_item.color_label
            },
            productSizes() {
                return _.filter(this.productData.facets.string_facets, (facet) => {
                    return facet.code === this.attributeCodeSize;
                });
            },
            productOptions() {
                return _.filter(this.productData.facets.string_facets, (facet) => {
                    return facet.code !== this.attributeCodeManufacturer;
                });
            },
            productHasSizeVariant() {
                if (this.productData.facets.string_facets[0]) {
                    if(this.productData.facets.string_facets[0]['label'] === "Größe") {
                        return true
                    }
                    return false;
                }
                return false;
            },
            productSizesSorted() {
                if(! _.isEmpty(this.productSizes)) {

                    // Add half sizes ".5" only if is in stock
                    let filterdProductSizes = this.productSizes.filter( size => size.value_label.includes('.0') || (size.value_label.includes('.5') && size.stock_qty > 0));

                    // dereference computed array
                    let _sizes = [].slice.call(filterdProductSizes);

                    // simple asc sort by property (label)
                    _sizes = _.sortBy(_sizes, function(o) {
                        return parseFloat(o.value_label);
                    });

                    return _sizes;
                }

                return null;
            },
            attributeName() {
                if (this.productData.facets.string_facets[0]) {
                    return this.productData.facets.string_facets[0]['label'];
                }

                return null;
            },
            itemIsSimple() {
                return this.productData.type === 'simple';
            },
            itemIsGrouped() {
                return this.productData.type === 'grouped';
            },
            itemIsConfigurable() {
                return this.productData.type === 'configurable';
            },
            nearestCategory: function() {
                return this.productData.facets.category_facets.slice(-1)[0]
            },
            showSelectedOption: function () {
                // Store issert
                if(!_.isEmpty(this.selectedVariants[0])) {
                    return this.selectedVariants[0].value_label.replace('.0', '');
                }
                return null;
            }
        },

        mounted() {
            // evaluate tier price information
            //this.itemHasTierPrices = this.evalItemHasTierPrices();
            //this.itemTierPriceDiscount = this.evalItemsTierPriceDiscount();

            this.getLogoPath();
        },

        created() {
            this.$store.commit('modApiResources/resetSelectedVariants');
            this.$store.commit('modApiResources/removeOptionNotSelectedError');
        },

        methods: {
            openCollapsible: function() {
                this.$store.commit('modCollapsibleState/setCollapsed');
            },
            formatSize: function (size) {
                return size.replace('.0', '');
            },
            selectedOption: function (option) {
                if(option.stock_qty > 0 ) {
                    this.$store.commit('modApiResources/setOptionIsSelected', option);
                    this.$store.commit('modApiResources/removeOptionNotSelectedError');
                    this.selected.origin = option.value_label;
                    this.selected.processed = option.value_label.replace('.0', '');
                }
                return null;
            },
            getSelectedClass: function(option) {
                if(!_.isEmpty(this.selectedVariants[0])) {
                    return this.selectedVariants[0].value_label === option.value_label ? 'selected' : '';
                }
            },
            getUnavailableClass: function(option) {
                return option.stock_qty === 0 ? 'unavailable' : '';
            },
            toggle: function() {
                this.$store.dispatch('modNavigation/toggleOffcanvasAction', {
                    component: this.name,
                    direction: 'rightLeft'
                });
            },
            evalItemHasTierPrices: function() {
                // grouped products
                if(this.itemIsGrouped) {
                    let _items = this.$children.filter(child => child.itemHasTierPrices);
                    return ! _.isEmpty(_items);
                }
                // simple product
                let groupID = 0;
                return this.$store.getters['modPrices/productHasTierPricesByGroupId'](this.item, groupID);
            },
            evalItemsTierPriceDiscount: function() {
                // get all child nodes with tier price items
                let _items = this.$children.filter(child => child.itemHasTierPrices);
                if(! _.isEmpty(_items)) {
                    let _max = _.maxBy(_items, 'itemTierPriceDiscount');
                    return _max.itemTierPriceDiscount;
                }
                return null;
            },
            manufacturerLink: function() {
                return _.join([
                    this.productManufacturer.url,
                    this.nearestCategory.value_path
                ], '/');
            },
            filterLink: function() {
                return this.nearestCategory.value_path + '?color=' + this.productData.statistic_item.color_id;
            },
            getLogoPath: function() {
                let logoPath = null;

                if(this.productData.manufacturer_item.logo) {
                    logoPath = this.productData.manufacturer_item.logo;
                }

                this.logoPath = logoPath;
            }
        }
    };
</script>
