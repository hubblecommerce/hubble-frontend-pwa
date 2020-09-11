<template>
    <div class="menu-cpt-wrapper">
        <button class="button-icon navbar-toggler nav-icon" @click="toggle()">
            <i class="icon icon-menu" aria-hidden="true" />

            <span class="hidden-link-name">Toggle Navbar</span>

            <material-ripple />
        </button>
        <transition-expand-layer :left-right="true">
            <div v-if="showMenu" class="menu-wrapper">
                <div class="container">
                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu" @click="toggle()">
                            <i class="icon icon-close" aria-hidden="true" />

                            <material-ripple />
                        </button>

                        <div class="overlay-headline" v-text="menuTitle" />
                    </div>
                    <div class="row tree-wrp">
                        <mobile-categories :data-item="rootItem" :depth="0" />
                    </div>
                </div>
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import MobileCategories from './MobileCategories';
export default {
    name: 'TheMobileMenu',

    components: { MobileCategories },

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
            offcanvas: state => state.modNavigation.offcanvas,
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
    /*created() {
        console.log("this.dataItems: ", this.dataItems)
    }*/
};
</script>
