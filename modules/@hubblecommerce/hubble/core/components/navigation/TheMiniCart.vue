<template>
    <div :class="hasItemsInCart" class="minicart-cpt-wrp">
        <button class="button-icon cart-icon" :class="setButtonStates" @click="toggle()">
            <i class="icon icon-cart" aria-hidden="true" />

            <span class="hidden-link-name">Toggle Cart</span>

            <material-ripple />

            <client-only>
                <div v-if="cartItemsQtyAndLabel" class="item-count" v-text="cartItemsQtyAndLabel" />
            </client-only>
        </button>

        <transition-expand-layer :right-left="true">
            <div v-if="showMenu" class="transition-expand-wrp">
                <cart-layer v-if="initiated" />
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
    name: 'TheMiniCart',
    components: {
        CartLayer: () => import('./CartLayer'),
    },
    data() {
        return {
            name: 'TheMiniCart',
        };
    },

    computed: {
        ...mapState({
            initiated: state => state.modCart.layerInitiated,
            qty: state => state.modCart.cart.items_qty,
            offcanvas: state => state.modNavigation.offcanvas,
        }),
        hasItemsInCart: function () {
            return {
                inCart: this.qty > 0,
            };
        },
        setButtonStates: function () {
            return {
                active: this.showMenu,
            };
        },
        cartItemsQtyAndLabel: function () {
            if (this.qty > 99) {
                return '99+';
            }

            return this.qty;
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
        ...mapMutations({
            initiateCartLayer: 'modCart/initiateLayer',
        }),
        ...mapActions({
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
        }),
        toggle: function () {
            this.initiateCartLayer();

            this.toggleOffcanvasAction({
                component: this.name,
                direction: 'rightLeft',
            });
        },
        hideMenu: function () {
            this.hideOffcanvasAction();
        },
    },
};
</script>
