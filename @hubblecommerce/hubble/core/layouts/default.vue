<template>
    <div class="app">
        <noscript>Please enable JavaScript and refresh this page, to use this application.</noscript>
        
        <plugin-slot name="global-before-header" />
        
        <header>
            <div class="nav-wrp container">
                <the-logo />

                <div class="action-wrp">
                    <div class="customer-trigger-wrp">
                        <hbl-button
                            class="button-icon"
                            @click.native="
                                toggleOffcanvasAction({
                                    component: 'TheCustomerContext',
                                    direction: {
                                        sm: 'bottomTop',
                                        md: 'rightLeft',
                                        lg: 'rightLeft',
                                    },
                                })
                            "
                        >
                            <div class="hidden-link-name" v-text="'Toggle Customer Context'" />
                            <svg-icon icon="account" />
                        </hbl-button>
                    </div>
                    <div class="search-trigger-wrp">
                        <hbl-button
                            class="button-icon"
                            @click.native="
                                toggleOffcanvasAction({
                                    component: 'TheSearchContext',
                                    direction: {
                                        sm: 'bottomTop',
                                        md: 'rightLeft',
                                        lg: 'rightLeft',
                                    },
                                })
                            "
                        >
                            <div class="hidden-link-name" v-text="'Toggle Search Context'" />
                            <svg-icon icon="search" />
                        </hbl-button>
                    </div>
                    <div class="cart-trigger-wrp">
                        <client-only>
                            <div class="cart-qty" v-if="cartQty > 0" v-text="cartQty" />
                        </client-only>
                        <hbl-button
                            class="button-icon"
                            @click.native="
                                toggleOffcanvasAction({
                                    component: 'TheCartContext',
                                     direction: {
                                        sm: 'bottomTop',
                                        md: 'rightLeft',
                                        lg: 'rightLeft',
                                    },
                                })
                            "
                        >
                            <div class="hidden-link-name" v-text="'Toggle Cart Context'" />
                            <svg-icon icon="shopping-bag" />
                        </hbl-button>
                    </div>
                    <div class="menu-trigger-wrp">
                        <hbl-button
                            class="button-icon"
                            @click.native="
                                toggleOffcanvasAction({
                                    component: 'TheMenuContext',
                                    direction: {
                                        sm: 'bottomTop',
                                        md: 'rightLeft',
                                        lg: 'rightLeft',
                                    },
                                })
                            "
                        >
                            <div class="hidden-link-name" v-text="'Toggle Menu Context'" />
                            <svg-icon icon="menu" />
                        </hbl-button>
                    </div>
                </div>
            </div>
            <nav>
                <lazy-the-mega-menu v-if="$mq === 'lg'" />
            </nav>
        </header>

        <main>
            <Nuxt />
        </main>

        <footer>
            <lazy-the-footer-context v-if="loadFooter" />
        </footer>

        <background-blur />

        <transition-expand-layer :direction="offcanvas.direction">
            <div
                v-if="offcanvas.isActive && offcanvas.component"
                :class="'sm-' + offcanvas.direction.sm + ' md-' + offcanvas.direction.md + ' lg-' + offcanvas.direction.lg"
                class="transition-expand-wrp"
            >
                <lazy-the-customer-context v-if="offcanvas.component === 'TheCustomerContext'" />
                <lazy-the-search-context v-if="offcanvas.component === 'TheSearchContext'" />
                <lazy-cart-context v-if="offcanvas.component === 'TheCartContext'" :displayInLayer="true" />
                <lazy-the-menu-context v-if="offcanvas.component === 'TheMenuContext'" />
            </div>
        </transition-expand-layer>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
    name: 'Default',
    data() {
        return {
            searchInitiated: false,
            cartInitiated: false,
            menuInitiated: false,
            showOffcanvas: false,
            offcanvasDirection: 'bottomTop',
            loadFooter: false,
        };
    },
    head() {
        return {
            bodyAttrs: {
                class: [
                    this.offcanvas.isActive ? 'scroll-block' : ''
                ]
            }
        }
    },
    computed: {
        ...mapState({
            offcanvas: (state) => state.modNavigation.offcanvas,
            cartQty: (state) => state.modCart.qty,
        }),
    },
    watch: {
        $route: function () {
            this.hideOffcanvas();
        },
    },
    mounted() {
        this.registerIntersectionObserver('footer');
    },
    methods: {
        ...mapMutations({
            hideOffcanvas: 'modNavigation/hideOffcanvas',
        }),
        ...mapActions({
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
        }),
        registerIntersectionObserver: function (targetSelector) {
            let options = {
                rootMargin: '20px',
                threshold: 0.01,
            };

            let observer = new IntersectionObserver(this.intersectionCallback, options);
            let target = document.querySelector(targetSelector);
            observer.observe(target);
        },
        intersectionCallback: function (entries, observer) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.loadFooter = true;
                    observer.disconnect();
                }
            });
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/reset';
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/buttons';
@import '~assets/scss/hubble/global';
@import '~assets/scss/hubble/typography';
@import '~assets/scss/hubble/icons';
@import '~assets/scss/hubble/bootstrap-essentials';
@import '~assets/scss/hubble/utils';
@import '~assets/scss/hubble/elevation';

.app {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    display: block;
}

header {
    position: relative;
    opacity: 1;
    background: $background;
    z-index: 60;
}

main {
    padding-bottom: 51px;
}

/* Navigation */
.nav-wrp {
    height: $header-height-mobile;
    width: 100%;
    background-color: $background;
    border-bottom: 1px solid $border-color;
    position: relative;

    display: flex;
    align-items: center;

    .header-action-icon {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 70;
        width: 100%;
    }

    .button-icon {
        font-size: 20px;
        padding: 8px;
    }

    .customer-account-wrp {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        z-index: 1;
        max-width: none;
    }

    .action-wrp {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 100;

        display: flex;
        justify-content: space-around;

        padding: 10px;
        background: $white;

        @include elevation-12;

        .cart-trigger-wrp {
            position: relative;

            .cart-qty {
                position: absolute;
                right: 0;
                top: 20px;
                width: 20px;
                height: 20px;
                line-height: 20px;
                vertical-align: middle;
                font-size: 10px;
                text-align: center;
                color: $primary;
                background: $secondary;
                border-radius: 50px;
            }
        }
    }
}

/* Tablet */
@media (min-width: 768px) {
    header {
        position: fixed;
        margin: 0 auto;
        width: 100%;
        z-index: 100;
    }

    .nav-wrp {
        height: $header-height-desktop;
    }

    main {
        padding-top: $header-height-desktop;
    }

    .nav-wrp {
        .action-wrp {
            position: relative;
            width: auto;
            margin-left: auto;
            padding-right: 0;

            @include elevation-0;

            > * {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 6px;
                cursor: pointer;

                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}

/* Tablet */
@media (min-width: 1024px) {
    .app {
        overflow: visible;

        &.active-offcanvas {
            overflow: hidden;
        }
    }
    
    .nav-wrp {
        .action-wrp {
            .menu-trigger-wrp {
                display: none;
            }
        }
    }

    main {
        padding-top: $header-height-desktop + $header-navigation-height-desktop;
    }
}
</style>
