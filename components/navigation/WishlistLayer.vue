<template>
        <div class="wishlist-wrapper">
            <div class="container expand-content">
                <div class="row overlay-header">
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
                    <button v-if="qty > 0"
                            class="wishlist-button button-primary"
                            @click.prevent="checkoutWishlist()"
                    >
                        {{ $t('Go to wishlist') }}

                        <material-ripple />
                    </button>

                    <button v-if="qty > 0"
                            class="shopping-button button-secondary"
                            @click.prevent="hideMenu()"
                    >
                        {{ $t('Keep shopping') }}

                        <material-ripple />
                    </button>
                </div>
            </div>
        </div>
</template>

<script>
    import WishlistItemsList from "../customer/WishlistItemsList";
    import {mapState,mapActions} from "vuex";
    export default {
        name: "WishlistLayer",
        components: { WishlistItemsList },
        data() {
            return {
                name: "TheWishlist",
            }
        },
        computed: {
            ...mapState({
                qty: state => state.modWishlist.wishlistItemsCount,
            }),
        },
        methods: {
            ...mapActions({
                hideOffcanvasAction: 'modNavigation/hideOffcanvasAction'
            }),
            hideMenu: function() {
                this.hideOffcanvasAction();
            },
            checkoutWishlist: function() {
                this.hideMenu();

                this.$router.push({
                    path: this.localePath('customer-wishlist')
                });
            },
        }
    }
</script>
