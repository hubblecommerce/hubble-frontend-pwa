<template>
    <div class="customer-account-cpt-wrp">
        <button class="button-icon" :class="setButtonStates" @click="toggle()">
            <i class="icon icon-account" /><span class="hidden-link-name">Account</span>

            <material-ripple />
        </button>

        <transition-expand-layer :direction="{ sm: 'bottomTop', md: 'rightLeft', lg: 'rightLeft' }">
            <div v-if="showMenu" class="transition-expand-wrp">
                <customer-menu-layer v-if="initiated" />
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'CustomerMenu',

    components: {
        CustomerMenuLayer: () => import('./CustomerMenuLayer'),
    },

    data() {
        return {
            name: 'CustomerMenu',
            initiated: false,
        };
    },

    computed: {
        ...mapState({
            offcanvas: state => state.modNavigation.offcanvas,
        }),
        setButtonStates: function () {
            return {
                active: this.showMenu,
            };
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
