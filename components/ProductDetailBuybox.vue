<template>
  <div class="product-shop">
    <div class="product-info-wrp">
      <div class="row mb-3 product-headline">

        <!-- Product Headline -->
        <div class="product-headline-info">
          <div class="manufacturer-name headline-4" v-html="productManufacturer.name"></div>
          <h1 class="product-name text-small" v-html="productData.name">
            <span v-if="productData.mpn" class="manufacturer-number">{{ $t('manufacturer_label') }}: {{ productData.mpn }}</span>
          </h1>

          <!-- SKU -->
          <div class="sku">{{ $t('sku_label') }}: {{ productData.sku }}</div>
        </div>
        <wishlist></wishlist>
      </div>

      <!-- Sizes-->
      <div v-if="attributeName" class="size-wrp" >
        <div class="size-label headline-4">{{ attributeName }} {{ $t('select') }}: <span class="selected-size" > {{selected.processed}}  </span> </div>

        <the-size-chart></the-size-chart>

        <ul class="size-list">
          <li v-for="(size, id) in productSizesSorted"
              :key="id"
              class="option-val headline-4"
              :class="[getUnavailableClass(size), getSelectedClass(size)]"
              :value="size"
              v-text="formatSize(size.value_label)"
              @click="size.stock_qty !== 0 ? selectedSize(size.value_label): null"
          >
          </li>
        </ul>
      </div>

      <!-- Link to description: on click scroll to description and show content / Mobile view /-->
      <div class="description-link-wrp">
        <a @click="openCollapsible()" href="#description" class="description-link link-primary">{{$t('See description')}}</a>
      </div>

      <div class="price-cart-delivery-wrp mb-2">
        <div class="price-box">
          <product-detail-buybox-price :item="productData"></product-detail-buybox-price>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import ProductDetailBuybox from "@hubblecommerce/hubble/core/components/ProductDetailBuybox.js";
    import ProductDetailBuyboxPrice from "./ProductDetailBuyboxPrice";
    import { mapState } from 'vuex'
    import Wishlist from "./Wishlist";
    import TheSizeChart from "./TheSizeChart";

    export default {
        components: {Wishlist, ProductDetailBuyboxPrice, TheSizeChart},

        mixins: [ProductDetailBuybox],

        props: ['category-id'],

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
                attributeCodeSize: 'groesse'
                //categoryId: 0
                // showTierPrices: false
            }
        },

        computed: {
            // Vuex
            ...mapState({
                dataProduct: state => state.modApiResources.dataProduct,
            }),
            productData() {
                return this.dataProduct.result.item;
            },
            productManufacturer() {
                return this.productData.manufacturer_item;
            },
            productSizes() {
                return _.filter(this.productData.facets.string_facets, (facet) => {
                    return facet.code === this.attributeCodeSize;
                });
            },
            productSizesSorted() {
                if(! _.isEmpty(this.productSizes)) {

                    // dereference computed array
                    let _sizes = [].slice.call(this.productSizes);

                    // simple asc sort by property (label)
                    _sizes = _.sortBy(_sizes, function(o) {
                        return parseFloat(o.value_label);
                    });

                    return _sizes;
                }

                return null;
            },
            attributeName() {
                if(! _.isEmpty(this.productSizes)) {
                    return this.productSizes[0]['label'];
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
            }
        },

        mounted() {
            // evaludate tier price information
            //this.itemHasTierPrices = this.evalItemHasTierPrices();
            //this.itemTierPriceDiscount = this.evalItemsTierPriceDiscount();
        },

        //created() {
        //this.categoryId = this.productData.facets.category_facet[0]['facet-values'][0].id;
        //},

        methods: {
            openCollapsible: function() {
                this.$store.commit('modCollapsibleState/setCollapsed');
            },
            formatSize: function (size) {
                return size.replace('.0', '');
            },
            selectedSize: function (size) {
                this.selected.origin = size;
                this.selected.processed = size.replace('.0', '');
            },
            getSelectedClass(size) {
                return this.selected.origin == size.label ? 'selected' : '';
            },
            getUnavailableClass(size) {
                return size.stock_qty === 0 ? 'unavailable' : '';
            },
            toggle: function() {
                this.$store.dispatch('modNavigation/toggleOffcanvasAction', {
                    component: this.name,
                    direction: 'rightLeft'
                });
            },

            // evalItemHasTierPrices() {

            //     // grouped products
            //     if(this.itemIsGrouped) {
            //         var _items = this.$children.filter(child => child.itemHasTierPrices);

            //         return ! _.isEmpty(_items);
            //     }

            //     // simple product
            //     var groupID = 0;
            //     return this.$store.getters['modPrices/productHasTierPricesByGroupId'](this.item, groupID);
            // },
            // evalItemsTierPriceDiscount() {

            //     // get all child nodes with tier price items
            //     var _items = this.$children.filter(child => child.itemHasTierPrices);

            //     if(! _.isEmpty(_items)) {
            //         var _max = _.maxBy(_items, 'itemTierPriceDiscount');

            //         return _max.itemTierPriceDiscount;
            //     }

            //     return null;
            // }
        }
    };
</script>
