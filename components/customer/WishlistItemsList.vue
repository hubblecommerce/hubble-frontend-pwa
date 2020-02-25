<template>
    <transition-group class="wishlist-item-list-wrapper " name="list">
        <div v-for="item in items" :key="item.id" class="row item align-items-center">
            <nuxt-link :to="'/'+item.url_pds" class="col-9">
                <div class="row align-items-center">
                    <div class="col-4">
                        <img :src="itemImgPath(item)" alt="Product Image" :title="item.name" :class="classesImg">
                    </div>
                    <div class="col-8">
                        <div class="container">
                            <div class="row">
                                <span class="product-name">{{ item.name }}</span>
                            </div>
                            <div v-for="variant in item.variants" :key="variant.id" class="row selected-variants">
                                <span>{{ variant.label + ": " + formatSize(variant.value_label) }}</span>
                            </div>
                            <div class="row">
                                <template v-if="itemIsSpecial(item)">
                                    <span class="product-price old-price" v-html="getPriceAndCurrency(item, 'display_price_brutto', priceSwitcherIncludeVat)" />
                                    <span class="product-price sale-price" v-html="getPriceAndCurrency(item, 'display_price_brutto_special', priceSwitcherIncludeVat)" />
                                </template>
                                <template v-else>
                                    <span class="product-price sale-price" v-html="getPriceAndCurrency(item, 'display_price_brutto', priceSwitcherIncludeVat)" />
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </nuxt-link>
            <div class="col-3 actions-wrp text-right">
                <div class="action-top">
                    <div v-if="itemHasOptions(item)">
                        <div v-if="itemIsAvailable(item)" class="remove-item" v-text="$t('Add to Cart')" />
                        <div v-else v-text="$t('Sold Out')" />
                    </div>
                    <nuxt-link v-else :to="'/'+item.url_pds">
                        <div class="details-item" v-text="$t('details')" />
                    </nuxt-link>
                </div>
                <div class="remove-item" aria-hidden="true" @click="confirmRemoveItem(item)" v-text="$t('Remove')" />
            </div>
        </div>
    </transition-group>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
		name: "WishlistItemsList",


        data() {
            return {
                showWishlist: false,
                item: {
                    items_qty: 0,
                    subtotal: 0
                },
                subTotals: {},
                dataImageFilter: null,
                origImageFilter: '60x',
                showLoader: false,
                selectedQty: 0
            }
        },


        computed: {
            ...mapState({
                items: state => state.modWishlist.wishlistItemsObj,
                qty: state => state.modWishlist.wishlistItemsCount,
                priceSwitcherIncludeVat: state => state.modPrices.priceSwitcherIncludeVat,
                offcanvas: state => state.modNavigation.offcanvas,
                customer: state => state.modApiPayment.customer,
                wishlistState: state => state.modWishlist.wishlistItemsObj,
                wishlistId: state => state.modWishlist.wishlistId,
                wishlistQty: state => state.modWishlist.wishlistItemsCount,
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
            }
        },

        created() {
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

                if(process.env.API_TYPE === 'sw') {
                    return item.image;
                }

                // If customer domain isset get live images
                if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                    let image = item.image;

                    let _reference = _.join(
                        [
                            process.env.CUSTOMER_DOMAIN,
                            'images/catalog/thumbnails/cache/400',
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

                // Remove wishlist completely from store
                // Delete wishlist as well from api if customer is logged in
                // ELSE: Just remove item from wishlist and update wishlist to api if user is logged in
                if(this.wishlistQty === 1) {
                    if(this.isLoggedIn()) {
                        this.$store.dispatch('modApiPayment/deleteWishlist', {
                            user_id: this.customer.customerData.id,
                            id: this.wishlistId
                        }).then(() => {
                            this.$store.dispatch('modWishlist/deleteWishlist');
                        })
                    } else {
                        this.$store.dispatch('modWishlist/deleteWishlist');
                    }
                } else {
                    this.$store.dispatch('modWishlist/delItem', {
                        data: item
                    }).then(() => {
                        // Update wishlist via api
                        if(this.isLoggedIn()) {
                            this.$store.dispatch('modApiPayment/updateWishlist', {
                                user_id: this.customer.customerData.id,
                                id: this.wishlistId,
                                wishlist: {
                                    qty: this.wishlistQty,
                                    items: this.wishlistState
                                }
                            })
                        }
                    })
                }
            },
            isLoggedIn: function() {
                if(!_.isEmpty(this.customer.customerAuth) && this.customer.customerAuth.token !== 'guest') {
                    return this.customer.customerAuth.token;
                }

                return false;
            },
            checkoutWishlist() {

                this.hideMenu();

                this.$router.push({
                    path: this.localePath('customer-wishlist')
                });
            },
            // Check if Item is available
            itemIsAvailable: function (item) {
                return true;
            },
            // Check if Item has Options
            // to do: Check if Item needs options (e.g.: some dont need options Care Products)
            itemHasOptions: function (item) {
                return !_.isEmpty(item.options);
            },
            formatSize: function (size) {
                return size.replace('.0', '');
            }
        },
	}
</script>

