<template>
    <div class="wishlist-wrapper">
        <div class="container expand-content">
            <div class="row overlay-header">
                <button class="button-icon button-close-menu" @click="toggle()">
                    <i class="icon icon-x" aria-hidden="true" />

                    <material-ripple />
                </button>

                <div class="overlay-headline" v-text="$t('Wishlist')" />
            </div>

            <div class="row">
                <div v-if="qty === 1" class="col-12 qty-summary" v-text="`${qty} ${$t('wishlist_label_item')}`" />

                <div v-if="qty > 1" class="col-12 qty-summary" v-text="`${qty} ${$t('wishlist_label_items')}`" />

                <div v-if="qty <= 0" class="empty-cart">
                    <i class="icon icon-heart" />

                    <div class="text" v-text="$t('Your shopping wishlist is empty')" />

                    <nuxt-link :to="localePath('index')">
                        <button class="button-secondary">
                            {{ $t('Discover our products') }}
                            <material-ripple />
                        </button>
                    </nuxt-link>
                </div>
            </div>

            <wishlist-items-list />

            <div class="actions">
                <button v-if="qty > 0" class="wishlist-button button-primary" @click.prevent="checkoutWishlist()">
                    {{ $t('Go to wishlist') }}

                    <material-ripple />
                </button>

                <button v-if="qty > 0" class="shopping-button button-secondary" @click.prevent="hideMenu()">
                    {{ $t('Keep shopping') }}

                    <material-ripple />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    name: 'WishlistLayer',
    components: {
        WishlistItemsList: () => import('../customer/WishlistItemsList'),
    },

    data() {
        return {
            name: 'TheWishlist',
        };
    },
    computed: {
        ...mapState({
            qty: (state) => state.modWishlist.wishlistItemsCount,
        }),
    },
    methods: {
        ...mapActions({
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
        }),
        toggle: function () {
            this.toggleOffcanvasAction({
                component: this.name,
                direction: 'rightLeft',
            });
        },
        hideMenu: function () {
            this.hideOffcanvasAction();
        },
        checkoutWishlist: function () {
            this.hideMenu();

            this.$router.push({
                path: this.localePath('customer-wishlist'),
            });
        },
    },
};
</script>
