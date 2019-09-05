<template>
    <div v-bind:class="hasItemsInWishlist" class="wishlist-cpt-wrp" >
        <button class="button-icon wishlist-icon" v-bind:class="setButtonStates" @click="toggle()">
            <i class="icon icon-heart" aria-hidden="true"></i> <span
            class="hidden-link-name">Toggle Wishlist</span>
            <material-ripple></material-ripple>
            <no-ssr>
                <div v-if="wishlistItemsQtyAndLabel" v-text="wishlistItemsQtyAndLabel" class="item-count"></div>
            </no-ssr>
        </button>
        <transition-expand-layer :rightLeft="true">
            <div v-if="showMenu" class="transition-expand-wrp wishlist-wrapper">
                <div class="container expand-content">
                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu" @click="toggle()">
                            <i class="icon icon-close" aria-hidden="true"></i>
                            <material-ripple></material-ripple>
                        </button>
                        <div class="overlay-headline" v-text="$t('Wishlist')"></div>
                    </div>
                    <div class="row">
                        <div v-if="qty > 0" class="col-12 qty-summary">{{ qty }} {{ $t('wishlist_label_items') }}</div>
                        <div v-if="qty <= 0" class="no-items col-12 p-3 mb-2 text-center">{{ $t('Your shopping wishlist is empty') }}</div>
                    </div>
                    <transition-group name="list">
                        <v-touch @swiperight="confirmRemoveItem(item)" v-for="item in items" v-bind:key="item.id"
                            class="row item align-items-center">
                            <nuxt-link :to="'/'+item.url_pds" class="col-9">
                                <div class="row align-items-center">
                                    <div class="col-4">
                                        <img :src="itemImgPath(item)" class="product-img" alt="Product Image" :class="classesImg" />
                                    </div>
                                    <div class="col-8">
                                        <div class="container">
                                            <div class="row">
                                                <span class="product-name">{{item.name}}</span>
                                            </div>
                                            <div class="row">
                                                <template v-if="itemIsSpecial(item)">
                                                    <span class="product-price old-price" v-html="getPriceAndCurrency(item, 'price', priceSwitcherIncludeVat)"></span>
                                                    <span class="product-price sale-price" v-html="getPriceAndCurrency(item, 'special_price', priceSwitcherIncludeVat)"></span>
                                                </template>
                                                <template v-else>
                                                    <span class="product-price sale-price" v-html="getPriceAndCurrency(item, 'price', priceSwitcherIncludeVat)"></span>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </nuxt-link>
                            <div class="col-3 actions-wrp text-right">
                                <div v-if="!showLoader" @click='confirmRemoveItem(item)' class="remove-item" v-text="$t('Remove')" aria-hidden="true"></div>
                                <div v-if="showLoader" class="lds-ring">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        </v-touch>
                    </transition-group>
                    <button v-if="wishlistItemsQty > 0" class="checkout-btn button-primary" @click.prevent="checkoutWishlist">
                        {{ $t('wishlist_mini') }}
                        <material-ripple></material-ripple>
                    </button>
                    <button v-if="wishlistItemsQty > 0" class="shopping-button button-secondary" @click.prevent="hideMenu">
                        {{ $t('Keep shopping') }}
                        <material-ripple></material-ripple>
                    </button>
                </div>
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {

        name: 'TheWishlist',

        data() {
            return {
                name: "TheWishlist",
                showWishlist: false,
                item: {
                    items_qty: 0,
                    subtotal: 0
                },
                subTotals: {},
                dataImageFilter: null,
                origImageFilter: '60x',
                showLoader: false,
                selectedQty: 0,
                numbers: [1,2,3,4,5,6,7,8,9]
            }
        },

        computed: {
            ...mapState({
                items: state => state.modWishlist.wishlistItemsObj,
                qty: state => state.modWishlist.wishlistItemsCount,
                priceSwitcherIncludeVat: state => state.modPrices.priceSwitcherIncludeVat,
                offcanvas: state => state.modNavigation.offcanvas,
            }),
            hasItemsInWishlist: function() {
                return {
                    inWishlist: this.wishlistItemsQty > 0
                }
            },
            setButtonStates: function() {
                return {
                    active: this.showMenu
                }
            },
            imgFilter() {
                return this.dataImageFilter ? this.dataImageFilter : this.origImageFilter;
            },
            classesExcl() {
                return this.priceSwitcherIncludeVat ? 'decorated-thin' : 'decorated-bold';
            },
            classesIncl() {
                return this.priceSwitcherIncludeVat ? 'decorated-bold' : 'decorated-thin';
            },
            wishlistItemsQty() {
                return this.qty;
            },
            wishlistItemsLabel() {
                return this.item.items_qty > 0 ? this.$t('wishlist_label_items') : this.$t('wishlist_label_item');
            },
            wishlistItemsQtyAndLabel() {
                return this.wishlistItemsQty;
            },
            classesImg() {
                return 'img-wishlist';
            },
            showMenu: function() {
                if(this.offcanvas.component === this.name) {
                    return true;
                }

                return false;
            }
        },

        created() {
            var _vue = this;

            // init local reactive 'item'
            if (this.dataWishlistItem) {
                this.item = this.dataWishlistItem;
            }
        },

        methods: {
            onChangeQty: function(id, e) {

                let oldQty = this.items[id]['qty'];
                let newQty = e.target.value;
                let delta = newQty - oldQty;

                this.$store.commit('modWishlist/setWishlistItemsObjQty', {
                    itemId: id,
                    itemQty: newQty
                });

                this.$store.dispatch('modWishlist/updateItem', {
                    qty: delta
                });
            },
            toggle: function() {
                this.$store.dispatch('modNavigation/toggleOffcanvasAction', {
                    component: this.name,
                    direction: 'rightLeft'
                });
            },
            hideMenu() {
                this.$store.dispatch('modNavigation/hideOffcanvasAction');
            },
            itemIsSpecial: function(item) {
                return this.$store.getters['modPrices/productIsSpecial'](item);
            },
            getPriceAndCurrency: function(item, key, addVat) {
                // Get price incl. tax but unformatted to calc and save subtotals
                // Do it here, to prevent checking again if is sales price or not
                // let priceInclTax = this.$store.getters['modPrices/priceAddVat'](item.final_price_item[key], this.itemTaxClass(item).value);
                // this.subTotals[item.id] = _.round(priceInclTax, 2).toFixed(2) * item.qty;

                let _price = item.final_price_item[key];

                this.subTotals[item.id] = _.round(_price, 2).toFixed(2) * item.qty;

                // Return formatted price incl. tax
                return this.$store.getters['modPrices/getPriceAndCurrencyDecFmt'](_price, addVat, this.itemTaxClass(item));
            },
            itemTaxClass: function(item) {
                return this.$store.getters['modPrices/getTaxClassByLabel'](item.final_price_item.tax_class_id);
            },
            getSubTotal: function() {
                // Sum up all subtotals
                let subTotal = 0;
                for (let key in this.subTotals) {
                    subTotal += this.subTotals[key];
                }
                // Format subtotals
                subTotal = this.$store.getters['modPrices/priceDecFmt'](subTotal);
                subTotal = this.$store.getters['modPrices/priceAddCur'](subTotal);
                return subTotal;
            },
            itemImgPath: function(item) {
                // If customer domain isset get live images
                if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                    let image = item.image;
                    let _letters = _.split(image, '', 2);

                    let _reference = _.join(
                        [
                            process.env.CUSTOMER_DOMAIN,
                            'images/catalog/thumbnails/cache/400',
                            //'media/catalog/product',
                            //_letters[0],
                            //_letters[1],
                            image
                        ],
                        '/'
                    );

                    return _reference;
                }

                let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                return _path + '/images/catalog/product/' + this.imgFilter + '/' + item.image;
            },
            confirmRemoveItem: function(item) {
                this.$store.dispatch('modWishlist/delItem', {
                    data: item
                })
            },
            checkoutWishlist() {

                this.hideMenu();

                this.$router.push({
                    path: this.localePath('checkout-wishlist')
                });
            }
        },

        watch: {
            '$route.path': function() {
                // Close menu layer if route changes
                this.hideMenu();
            }
        },
    }
</script>
