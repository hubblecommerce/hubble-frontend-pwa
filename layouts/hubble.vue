<template>
    <div>

        <noscript>Please enable JavaScript and refresh this page, to use this application.</noscript>

        <div class="mobile-layout" v-if="$mq === 'sm' || $mq === 'md'">
            <background-blur/>
            <div class="header-wrp">
                <div class="nav-wrp">
                    <the-mobile-menu :data-items="menuItems"></the-mobile-menu>
                    <the-logo></the-logo>
                    <template v-if="$mq === 'md'">
                        <the-search-direct></the-search-direct>
                    </template>
                    <the-wishlist/>
                    <customer-menu></customer-menu>
                    <the-mini-cart></the-mini-cart>
                </div>
                <template v-if="$mq === 'sm'">
                    <the-search-direct></the-search-direct>
                </template>
                <flash-message/>
            </div>

            <main>
                <nuxt/>
            </main>

            <div class="footer">
                <the-footer-social/>
                <the-footer-mobile></the-footer-mobile>
                <the-footer-copyright/>
            </div>

            <scroll-to-top/>
        </div>

        <div class="desktop-layout" v-if="$mq === 'lg'">
            <background-blur/>
            <div class="header-wrp">
                <div class="nav-wrp">
                    <the-logo></the-logo>
                    <the-mega-menu :data-items="menuItems" />
                    <the-search-direct></the-search-direct>
                    <div class="action-wrp d-flex align-items-center">
                        <the-wishlist/>
                        <customer-menu></customer-menu>
                        <the-mini-cart></the-mini-cart>
                    </div>
                    <flash-message/>
                </div>
            </div>

            <main>
                <nuxt/>
            </main>

            <div class="footer">
                <the-footer-social/>
                <div class="white-border"/>
                <the-footer-desktop></the-footer-desktop>
                <the-footer-copyright/>
            </div>
        </div>

    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import LayoutMobile from '@hubblecommerce/hubble/core/layouts/mobile';
    import ScrollToTop from "../components/ScrollToTop";
    import TheLogo from "../components/TheLogo";
    import TheSearch from "../components/TheSearch";
    import TheSearchDirect from "../components/TheSearchDirect";
    import TheMiniCart from "../components/TheMiniCart";
    import CustomerMenu from '../components/CustomerMenu';
    import TheLanguageSwitch from "../components/TheLanguageSwitch";

    import TheFooterMobile from "../components/TheFooterMobile";
    import TheMobileMenu from "../components/TheMobileMenu";

    import TheFooterDesktop from "../components/TheFooterDesktop";
    import TheDesktopMenu from "../components/TheDesktopMenu";
    import TheMegaMenu from "../components/TheMegaMenu";
    import BackgroundBlur from "../components/BackgroundBlur";
    import TheFooterSocial from "../components/TheFooterSocial";
    import TheFooterCopyright from "../components/TheFooterCopyright";
    import TheWishlist from "../components/TheWishlist";

    export default {
        components: {
            TheWishlist,
            TheFooterCopyright,
            TheFooterSocial,
            BackgroundBlur,
            TheMegaMenu,
            ScrollToTop,
            TheMiniCart,
            TheSearch,
            TheSearchDirect,
            TheMobileMenu,
            TheFooterMobile,
            TheLogo,
            TheLanguageSwitch,
            TheDesktopMenu,
            TheFooterDesktop,
            CustomerMenu
        },
        mixins: [LayoutMobile],
        computed: {
            ...mapState({
                apiAuthResponse: state => state.modApiResources.apiAuthResponse,
                dataMenu: state => state.modApiResources.dataMenu,
                isHubble: state => state.modHubbleSwitch.isHubble
            }),
            menuItems() {
                return this.dataMenu.result.items;
            }
        }
    }
</script>
