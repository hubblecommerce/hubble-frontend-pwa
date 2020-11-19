<template>
    <div @mouseenter="startUserInteraction()">
        <noscript>Please enable JavaScript and refresh this page, to use this application.</noscript>

        <client-only>
            <trusted-shops-badge v-if="userInteraction" />
        </client-only>

        <layout-wrapper>
            <div :class="{ 'mobile-layout': $mq === 'sm' || $mq === 'md', 'desktop-layout': $mq === 'lg' }">
                <background-blur />

                <header class="header-wrp">
                    <div class="nav-wrp container">
                        <the-logo />
                        <div class="action-wrp d-flex align-items-center">
                            <search-trigger v-if="($mq === 'md' || $mq === 'lg')" />
                            <the-mobile-menu v-if="($mq === 'sm' || $mq === 'md') && !isEmpty(menu)" :data-items="menu" />
                            <the-wishlist />
                            <customer-menu />
                            <the-mini-cart />
                        </div>
                        <the-mobile-header-actions v-if="$mq === 'sm'" />
                    </div>
                    <nav>
                        <the-mega-menu v-if="$mq === 'lg' && !isEmpty(menu)" :data-items="menu" />
                    </nav>
                    <flash-messages v-if="!activeOffCanvas" />
                </header>

                <main>
                    <nuxt />
                </main>

                <div class="footer">
                    <div v-if="$mq === 'lg'" class="newsletter-footer-wrp">
                        <newsletter />
                    </div>
                    <client-only>
                        <the-footer-mobile v-if="$mq === 'sm' || $mq === 'md'" />
                        <the-footer-desktop v-if="$mq === 'lg'" />
                    </client-only>
                    <the-post-footer />
                </div>

                <scroll-to-top v-if="$mq === 'sm' || $mq === 'md'" />
            </div>
        </layout-wrapper>

        <the-search-context />

        <client-only>
            <div v-if="showCookieNotice" class="cookie-notice">
                <cookie-notice />
            </div>
        </client-only>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import ScrollToTop from '../components/utils/ScrollToTop';
import TheLogo from '../components/navigation/TheLogo';
import TheSearchContext from '../components/search/TheSearchContext';
import TheMiniCart from '../components/navigation/TheMiniCart';
import CustomerMenu from '../components/navigation/CustomerMenu';
import TheMobileMenu from '../components/navigation/TheMobileMenu';
import TheMegaMenu from '../components/navigation/TheMegaMenu';
import BackgroundBlur from '../components/utils/BackgroundBlur';
import TheWishlist from '../components/navigation/TheWishlist';
import CookieNotice from '../components/utils/CookieNotice';
import FlashMessages from '../components/utils/FlashMessages';
import LayoutWrapper from '../components/utils/LayoutWrapper';
import SearchTrigger from "../components/search/SearchTrigger";
import Newsletter from "../components/utils/Newsletter";
import _ from 'lodash';

export default {
    components: {
        Newsletter,
        SearchTrigger,
        TheMobileHeaderActions: () => import('../components/navigation/TheMobileHeaderActions'),
        TrustedShopsBadge: () => import('../components/utils/TrustedShopsBadge'),
        TheFooterMobile: () => import('../components/footer/TheFooterMobile'),
        ThePostFooter: () => import('../components/footer/ThePostFooter'),
        TheFooterDesktop: () => import('../components/footer/TheFooterDesktop'),
        TheWishlist,
        BackgroundBlur,
        TheMegaMenu,
        ScrollToTop,
        TheMiniCart,
        TheSearchContext,
        TheMobileMenu,
        TheLogo,
        CustomerMenu,
        CookieNotice,
        FlashMessages,
        LayoutWrapper,
    },
    data() {
        return {
            menu: {},
            userInteraction: false,
            inView: false,
        };
    },
    computed: {
        ...mapState({
            dataMenu: state => state.modApiMenu.dataMenu,
            showCookieNotice: state => state.modCookieNotice.showCookieNotice,
            activeOffCanvas: state => state.modNavigation.offcanvas.isActive,
        }),
    },
    created() {
        this.setMenuItems();
    },
    methods: {
        setMenuItems: function () {
            if (!_.isEmpty(this.dataMenu.result)) {
                this.menu = this.dataMenu.result.items;
            }
        },
        startUserInteraction: function () {
            // Track userinteraction to lazy load some components like trusted shops
            this.userInteraction = true;
        },
        onceHandler: function () {
            this.inView = true;
        },
        isEmpty: function (obj) {
            return _.isEmpty(obj);
        },
    },
    head() {
        const i18nSeo = this.$nuxtI18nSeo();
        return {
            title: i18nSeo.title,
            bodyAttrs: {
                class: this.activeOffCanvas ? 'disable-scroll' : '',
                ...i18nSeo.bodyAttrs,
            },
        };
    },
};
</script>
