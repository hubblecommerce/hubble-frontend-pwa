<template>
    <div class="menu-cpt-wrapper">
        <button class="button-icon navbar-toggler nav-icon" @click="toggle()">
            <i class="icon icon-menu" aria-hidden="true"></i>
            <span class="hidden-link-name">Toggle Navbar</span>
            <material-ripple></material-ripple>
        </button>
        <transition-expand-layer :leftRight="true">
            <div v-if="showMenu" class="menu-wrapper">
                <div class="container">
                    <div class="row overlay-header">
                        <button class="button-icon button-close-menu" @click="toggle()">
                            <i class="icon icon-close" aria-hidden="true"></i>
                            <material-ripple></material-ripple>
                        </button>
                        <div class="overlay-headline" v-text="menuTitle"></div>
                    </div>
                    <div class="row tree-wrp">
                        <mobile-categories :data-item="rootItem" :depth="0"></mobile-categories>
                    </div>
                </div>
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import MobileCategories from "./MobileCategories";
    import CustomerMenu from "./CustomerMenu";
    import TheLanguageSwitch from "./TheLanguageSwitch";
    export default {
        name: "TheMobileMenu",
        components: {TheLanguageSwitch, CustomerMenu, MobileCategories},
        data() {
            return {
                name: "TheMobileMenu",
                menuTitle: 'Navigation'
            }
        },

        computed: {
            ...mapState({
                offcanvas: state => state.modNavigation.offcanvas,
            }),
            rootItem() {
                return {
                    name: 'root',
                    children: this.dataItems
                }
            },
            showMenu: function() {
                if(this.offcanvas.component === this.name) {
                    return true;
                }

                return false;
            }
        },

        props: {
            dataItems: {
                type: Array,
                required: true
            }
        },

        watch: {
            '$route.path': function() {
                // Close menu layer if route changes
                this.$store.dispatch('modNavigation/hideOffcanvasAction');
            }
        },

        methods: {
            toggle: function(){
                this.$store.dispatch('modNavigation/toggleOffcanvasAction', {component: this.name});
            }
        }

    }
</script>
