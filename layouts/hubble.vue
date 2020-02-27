<template>
    <div @mouseenter="startUserInteraction()">
        <img-lazy v-if="load && $mq === 'sm'" src="//:0" style="background: #fff;
                         height: 100vh;
                         position: sticky;
                         top: 0;
                         left: 0;
                         z-index: 100;"
        />

        <noscript>Please enable JavaScript and refresh this page, to use this application.</noscript>

        <client-only>
            <trusted-shops-badge v-if="userInteraction" />
        </client-only>

        <div v-if="$mq === 'sm' || $mq === 'md'" class="mobile-layout">
            <background-blur />
            <div class="header-wrp">
                <div class="nav-wrp">
                    <the-mobile-menu v-if="!isEmpty(menu)" :data-items="menu" />
                    <the-logo />
                    <template v-if="$mq === 'md'">
                        <the-search-direct />
                    </template>
                    <div class="action-wrp d-flex">
                        <the-wishlist />
                        <customer-menu />
                        <the-mini-cart />
                    </div>
                </div>
                <template v-if="$mq === 'sm'">
                    <the-search-direct />
                </template>
                <flash-message />
            </div>

            <main>
                <nuxt />
            </main>

            <div class="footer" v-view.once="onceHandler">
                <div class="white-border" />
                <the-footer-social v-if="inView" />
                <the-footer-mobile v-if="inView" />
                <the-footer-copyright v-if="inView" />
            </div>
            <scroll-to-top />
        </div>

        <div v-if="$mq === 'lg'" class="desktop-layout">
            <background-blur />
            <div class="header-wrp">
                <div class="nav-wrp">
                    <the-logo />
                    <the-mega-menu v-if="!isEmpty(menu)" :data-items="menu" />
                    <the-search-direct />
                    <div class="action-wrp d-flex align-items-center">
                        <the-wishlist />
                        <customer-menu />
                        <the-mini-cart />
                    </div>
                    <flash-message />
                </div>
            </div>

            <main>
                <nuxt />
            </main>

            <div class="footer" v-view.once="onceHandler">
                <the-footer-social v-if="inView" />
                <div class="white-border" />
                <the-footer-desktop v-if="inView" />
                <the-footer-copyright v-if="inView" />
            </div>
        </div>
        <client-only>
            <div v-if="showCookieNotice" class="cookie-notice">
                <cookie-notice />
            </div>
        </client-only>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import ScrollToTop from "../components/utils/ScrollToTop";
    import TheLogo from "../components/navigation/TheLogo";
    import TheSearchDirect from "../components/search/TheSearchDirect";
    import TheMiniCart from "../components/navigation/TheMiniCart";
    import CustomerMenu from '../components/navigation/CustomerMenu';

    import TheMobileMenu from "../components/navigation/TheMobileMenu";

    import TheMegaMenu from "../components/navigation/TheMegaMenu";
    import BackgroundBlur from "../components/utils/BackgroundBlur";
    import TheWishlist from "../components/navigation/TheWishlist";
    import CookieNotice from "../components/utils/CookieNotice";

    export default {
        components: {
            TrustedShopsBadge: () => import('../components/utils/TrustedShopsBadge'),
            TheFooterSocial: () => import('../components/footer/TheFooterSocial'),
            TheFooterMobile: () => import('../components/footer/TheFooterMobile'),
            TheFooterCopyright: () => import('../components/footer/TheFooterCopyright'),
            TheFooterDesktop: () => import('../components/footer/TheFooterDesktop'),
            TheWishlist,
            BackgroundBlur,
            TheMegaMenu,
            ScrollToTop,
            TheMiniCart,
            TheSearchDirect,
            TheMobileMenu,
            TheLogo,
            CustomerMenu,
            CookieNotice
        },

        data() {
          return {
              load: true,
              menu: {},
              userInteraction: false,
              inView: false
          }
        },

        computed: {
            ...mapState({
                apiAuthResponse: state => state.modApiResources.apiAuthResponse,
                dataMenu: state => state.modApiResources.dataMenu,
                showCookieNotice: state => state.modCookie.showCookieNotice
            })
        },

        created() {
            this.setMenuItems();
        },

        mounted() {
            this.load = false;
        },

        methods: {
            setMenuItems: function() {
                if(! _.isEmpty(this.dataMenu.result)) {
                    this.menu = this.dataMenu.result.items;
                }
            },
            startUserInteraction: function() {
                // Track userinteraction to lazy load some components like trusted shops
                this.userInteraction = true;
            },
            onceHandler: function() {
                this.inView = true;
            },
            isEmpty: function(obj) {
                return _.isEmpty(obj);
            }
        },

        head () {
            return this.$nuxtI18nSeo()
        }
    }
</script>
