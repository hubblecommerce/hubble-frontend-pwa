<template>
    <div class="app">
        <noscript>Please enable JavaScript and refresh this page, to use this application.</noscript>
        
        <plugin-slot name="global-before-header" />

        <header class="main-header">
            <div class="main-header-wrp">
                <div class="container">
                    <the-logo :logo-url="'/cart'" />
                </div>
            </div>
        </header>

        <main class="main-content">
            <Nuxt />
        </main>

        <footer class="checkout-footer">
            <div class="container">
                <div class="row">
                    <div class="col checkout-footer-copyright">
                        <div class="copyright-text text-small" v-text="`© ${new Date().getFullYear()} digital.manufaktur GmbH`" />
                    </div>
                    <div class="col checkout-footer-links">
                        <nuxt-link
                            :to="'/datenschutzerklaerung'"
                            target="_blank"
                            rel="noopener"
                            class="checkout-footer-item"
                            v-text="'Datenschutzerklärung'"
                        />
                        <span class="seperator"> | </span>
                        <nuxt-link :to="'/impressum'" target="_blank" rel="noopener" class="checkout-footer-item" v-text="'Impressum'" />
                    </div>
                </div>
            </div>
        </footer>

        <background-blur />
    </div>
</template>

<script>
export default {
    name: 'Checkout',
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';

.main-header {
    position: relative;
}

.main-header-wrp {
    .container {
        justify-content: center;
    }
}

.main-content {
    padding-top: 0;
}

.checkout-footer {
    border-top: 1px solid $border-color;
    padding: $base-padding-md 0;
}

.checkout-footer-links {
    text-align: right;
    // font-size: $font-size-sm;
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
    .main-content {
        margin-top: 0;
        padding-top: 10px;
    }
}
</style>
