<template>
    <div :class="hasItemsInWishlist" class="wishlist-cpt-wrp">
        <button class="button-icon wishlist-icon" :class="setButtonStates" @click="toggle()">
            <i class="icon icon-heart" aria-hidden="true" />

            <span class="hidden-link-name">Toggle Wishlist</span>

            <material-ripple />

            <client-only>
                <div v-if="wishlistItemsQtyAndLabel" class="item-count" v-text="wishlistItemsQtyAndLabel" />
            </client-only>
        </button>

        <transition-expand-layer :right-left="true">
            <div v-if="showMenu" class="transition-expand-wrp">
                <wishlist-layer v-if="initiated" />
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'TheWishlist',

    components: {
        WishlistLayer: () => import('./WishlistLayer'),
    },

    data() {
        return {
            name: 'TheWishlist',
            initiated: false,
        };
    },

    computed: {
        ...mapState({
            qty: state => state.modWishlist.wishlistItemsCount,
            offcanvas: state => state.modNavigation.offcanvas,
        }),
        hasItemsInWishlist: function () {
            return {
                inWishlist: this.wishlistItemsQty > 0,
            };
        },
        setButtonStates: function () {
            return {
                active: this.showMenu,
            };
        },
        wishlistItemsQty: function () {
            return this.qty;
        },
        wishlistItemsQtyAndLabel: function () {
            if (this.wishlistItemsQty > 99) {
                return '99+';
            }

            return this.wishlistItemsQty;
        },
        showMenu: function () {
            return this.offcanvas.component === this.name;
        },
    },

    watch: {
        '$route.path': function () {
            // Close menu layer if route changes
            this.hideMenu();
        },
    },

    methods: {
        ...mapActions({
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
        }),
        toggle: function () {
            this.init();

            this.toggleOffcanvasAction({
                component: this.name,
                direction: 'rightLeft',
            });
        },
        hideMenu: function () {
            this.hideOffcanvasAction();
        },
        init: function () {
            if (this.initiated) {
                return;
            }

            this.initiated = true;
        },
    },
};
</script>
