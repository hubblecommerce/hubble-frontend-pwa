<template>
    <div>

        <noscript>Please enable JavaScript and refresh this page, to use this application.</noscript>

        <div v-if="$mq === 'sm' || $mq === 'md'" class="mobile-layout hubble-light">
            <background-blur />
            <div class="header-wrp">
                <div class="nav-wrp">
                    <button v-if="$mq === 'sm'" class="button button-icon" @click="historyBack()">
                        <i class="icon icon-arrow-left" />
                        <div class="hidden-link-name">{{ $t('Back to shop') }}</div>
                        <material-ripple />
                    </button>
                    <the-logo />
                    <div v-if="$mq === 'md'" class="action-wrp d-flex align-items-center">
                        <nuxt-link :to="localePath('index')">
                            <button class="button-secondary">
                                {{ $t('Back to shop') }}
                                <material-ripple />
                            </button>
                        </nuxt-link>
                    </div>
                </div>
                <flash-message />
            </div>

            <main>
                <nuxt />
            </main>

            <div class="footer hubble-light">
                <the-footer-copyright-light />
            </div>

            <scroll-to-top />
        </div>

        <div v-if="$mq === 'lg'" class="desktop-layout hubble-light">
            <background-blur />
            <div class="header-wrp">
                <div class="nav-wrp">
                    <the-logo />
                    <div class="action-wrp d-flex align-items-center ml-auto">
                        <nuxt-link :to="localePath('index')">
                            <button class="button-secondary">
                                {{ $t('Back to shop') }}
                                <material-ripple />
                            </button>
                        </nuxt-link>
                    </div>
                    <flash-message />
                </div>
            </div>

            <main>
                <checkout-progress-bar />
                <nuxt />
            </main>

            <div class="footer hubble-light">
                <the-footer-copyright-light />
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

    import BackgroundBlur from "../components/utils/BackgroundBlur";
    import TheFooterCopyrightLight from "../components/footer/TheFooterCopyrightLight";
    import CheckoutProgressBar from "../components/checkout/CheckoutProgressBar";
    import CookieNotice from "../components/utils/CookieNotice";

    export default {
        components: {
            CheckoutProgressBar,
            TheFooterCopyrightLight,
            BackgroundBlur,
            ScrollToTop,
            TheLogo,
            CookieNotice
        },
        computed: {
            ...mapState({
                showCookieNotice: state => state.modCookie.showCookieNotice
            })
        },
        methods: {
            historyBack: function() {
                this.$router.go(-1);
            }
        },

        head () {
            return this.$nuxtI18nSeo()
        }
    }
</script>
