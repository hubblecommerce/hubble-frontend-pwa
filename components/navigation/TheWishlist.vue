<template>
    <div :class="hasItemsInWishlist" class="wishlist-cpt-wrp">
        <button class="button-icon wishlist-icon"
                :class="setButtonStates"
                @click="toggle()">
            <i class="icon icon-heart" aria-hidden="true" />

            <span class="hidden-link-name">Toggle Wishlist</span>

            <material-ripple />

            <client-only>
                <div v-if="wishlistItemsQtyAndLabel" class="item-count" v-text="wishlistItemsQtyAndLabel" />
            </client-only>
        </button>

        <transition-expand-layer :right-left="true">
            <div v-if="showMenu"
                 class="transition-expand-wrp wishlist-wrapper"
            >
                <div class="container expand-content">
                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu" @click="toggle()">
                            <i class="icon icon-close" aria-hidden="true" />

                            <material-ripple />
                        </button>

                        <div class="overlay-headline" v-text="$t('Wishlist')" />
                    </div>

                    <div class="row">
                        <div v-if="qty === 1" class="col-12 qty-summary">
                            {{ qty }} {{ $t('wishlist_label_item') }}
                        </div>

                        <div v-if="qty > 1" class="col-12 qty-summary">
                            {{ qty }} {{ $t('wishlist_label_items') }}
                        </div>

                        <div v-if="qty <= 0" class="empty-cart">
                            <i class="icon icon-heart" />

                            <div class="headline-1" v-text="$t('Your shopping wishlist is empty')" />

                            <nuxt-link :to="localePath('index')">
                                <button class="button-primary">
                                    {{ $t('Discover our products') }}
                                    <material-ripple />
                                </button>
                            </nuxt-link>
                        </div>
                    </div>

                    <wishlist-items-list />

                    <div class="actions">
                        <button v-if="wishlistItemsQty > 0"
                                class="wishlist-button button-primary"
                                @click.prevent="checkoutWishlist()"
                        >
                            {{ $t('Go to wishlist') }}

                            <material-ripple />
                        </button>

                        <button v-if="wishlistItemsQty > 0"
                                class="shopping-button button-secondary"
                                @click.prevent="hideMenu()"
                        >
                            {{ $t('Keep shopping') }}
                            
                            <material-ripple />
                        </button>
                    </div>
                </div>
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import WishlistItemsList from "../customer/WishlistItemsList";

    export default {
        name: 'TheWishlist',

        components: {WishlistItemsList},

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
                selectedQty: 0
            }
        },

        computed: {
            ...mapState({
                qty: state => state.modWishlist.wishlistItemsCount,
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
            classesExcl: function() {
                return this.priceSwitcherIncludeVat ? 'decorated-thin' : 'decorated-bold';
            },
            classesIncl: function() {
                return this.priceSwitcherIncludeVat ? 'decorated-bold' : 'decorated-thin';
            },
            wishlistItemsQty: function() {
                return this.qty;
            },
            wishlistItemsLabel: function() {
                return this.item.items_qty > 0 ? this.$t('wishlist_label_items') : this.$t('wishlist_label_item');
            },
            wishlistItemsQtyAndLabel: function() {
                if(this.wishlistItemsQty > 99) return '99+';
                return this.wishlistItemsQty;
            },
            classesImg: function() {
                return 'img-wishlist';
            },
            showMenu: function() {
                return this.offcanvas.component === this.name;
            }
        },

        watch: {
            '$route.path': function() {
                // Close menu layer if route changes
                this.hideMenu();
            }
        },

        created() {
            // init local reactive 'item'
            if (this.dataWishlistItem) {
                this.item = this.dataWishlistItem;
            }
        },

        methods: {
            ...mapActions({
                toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
                hideOffcanvasAction: 'modNavigation/hideOffcanvasAction'
            }),
            toggle: function() {
                this.toggleOffcanvasAction({
                    component: this.name,
                    direction: 'rightLeft'
                });
            },
            hideMenu: function() {
                this.hideOffcanvasAction();
            },
            checkoutWishlist: function() {
                this.hideMenu();

                this.$router.push({
                    path: this.localePath('customer-wishlist')
                });
            }
        },
    }
</script>
