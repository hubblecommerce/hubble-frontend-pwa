<template>
    <div @mouseenter="startUserInteraction()">

        <noscript>Please enable JavaScript and refresh this page, to use this application.</noscript>

        <client-only>
            <trusted-shops-badge v-if="userInteraction" />
        </client-only>

        <layout-wrapper>
            <div :class="{'mobile-layout': $mq === 'sm' || $mq === 'md', 'desktop-layout': $mq === 'lg'}">
                <background-blur />
                <div class="header-wrp">
                    <div class="nav-wrp">
                        <the-mobile-menu v-if="($mq === 'sm' || $mq === 'md') && !isEmpty(menu)" :data-items="menu" />
                        <the-logo />
                        <the-mega-menu v-if="$mq === 'lg' && !isEmpty(menu)" :data-items="menu" />
                        <the-search-direct />
                        <div class="action-wrp d-flex align-items-center">
                            <the-wishlist />
                            <customer-menu />
                            <the-mini-cart />
                        </div>
                    </div>
                    <flash-messages v-if="!activeOffCanvas" />
                </div>

                <main>
                    <nuxt />
                </main>

                <div class="footer" v-view.once="onceHandler">
                    <template v-if="$mq === 'sm' || $mq === 'md'">
                        <div class="white-border" />
                        <the-footer-social v-if="inView" />
                        <the-footer-mobile v-if="inView" />
                        <the-footer-copyright v-if="inView" />
                    </template>

                    <template v-if="$mq === 'lg'">
                        <the-footer-social v-if="inView" />
                        <div class="white-border" />
                        <the-footer-desktop v-if="inView" />
                        <the-footer-copyright v-if="inView" />
                    </template>
                </div>
                <scroll-to-top v-if="$mq === 'sm' || $mq === 'md'" />
            </div>
        </layout-wrapper>

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
    import FlashMessages from "../components/utils/FlashMessages";
    import LayoutWrapper from "../components/utils/LayoutWrapper";
    import _ from 'lodash';

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
            CookieNotice,
            FlashMessages,
            LayoutWrapper
        },
        data() {
            return {
                menu: {},
                userInteraction: false,
                inView: false
            }
        },
        computed: {
            ...mapState({
                dataMenu: state => state.modApiMenu.dataMenu,
                showCookieNotice: state => state.modCookieNotice.showCookieNotice,
                activeOffCanvas: state => state.modNavigation.offcanvas.isActive
            })
        },
        created() {
            this.setMenuItems();
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
        head() {
            const i18nSeo = this.$nuxtI18nSeo();
            return {
                title: i18nSeo.title,
                bodyAttrs: {
                    class: this.activeOffCanvas ? 'disable-scroll' : '' ,
                    ...i18nSeo.bodyAttrs
                }
            }
        }
    }
</script>
