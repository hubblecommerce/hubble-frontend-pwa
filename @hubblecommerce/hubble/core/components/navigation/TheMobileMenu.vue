<template>
    <div class="menu-cpt-wrapper">
        <button class="button-icon navbar-toggler nav-icon" @click="toggle()">
            <i v-if="$mq === 'sm'" class="icon icon-search-menu" aria-hidden="true" />
            <i v-if="$mq === 'md'" class="icon icon-menu" aria-hidden="true" />
            <span class="hidden-link-name">Toggle Navbar</span>
            <material-ripple />
        </button>

        <transition-expand-layer :direction="{ sm: 'bottomTop', md: 'rightLeft', lg: 'rightLeft' }">
            <div v-if="showMenu" class="menu-wrapper transition-expand-wrp">
                <div class="container">
                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu" @click="toggle()">
                            <i class="icon icon-x" aria-hidden="true" />
                            <material-ripple />
                        </button>
                        <div class="overlay-headline" v-text="menuTitle" />
                    </div>

                    <div class="row tree-wrp">
                        <search-trigger v-if="$mq === 'sm'" />

                        <mobile-categories :data-item="rootItem" :depth="0" />
                    </div>
                </div>
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    name: 'TheMobileMenu',

    components: {
        SearchTrigger: () => import('../search/SearchTrigger'),
        MobileCategories: () => import('./MobileCategories'),
    },

    props: {
        dataItems: {
            type: Array,
            required: true,
        },
    },

    data() {
        return {
            name: 'TheMobileMenu',
            menuTitle: 'Navigation',
        };
    },

    computed: {
        ...mapState({
            offcanvas: (state) => state.modNavigation.offcanvas,
        }),
        rootItem: function () {
            return {
                name: 'root',
                children: this.dataItems,
            };
        },
        showMenu: function () {
            return this.offcanvas.component === this.name;
        },
    },

    watch: {
        '$route.path': function () {
            // Close menu layer if route changes
            this.hideOffcanvasAction();
        },
    },

    methods: {
        ...mapActions({
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
        }),
        toggle: function () {
            this.toggleOffcanvasAction({ component: this.name });
        },
    },
};
</script>
