<template>
    <div class="container footer-desktop">
        <div class="column">
            <div class="title">{{ $t('Service') }}</div>
            <div class="links">
                <a href="https://www.hubblecommerce.io/">{{ $t('About us') }}</a>
                <a href="https://www.hubblecommerce.io/performance">{{ $t('Performance') }}</a>
                <a href="https://www.hubblecommerce.io/progressive-web-app">{{ $t('PWA') }}</a>
                <a href="https://www.hubblecommerce.io/developer-experience">{{ $t('Developer Experience') }}</a>
            </div>
        </div>
        <div class="column">
            <div class="title">{{ $t('Information') }}</div>
            <div class="links">
                <a href="https://www.hubblecommerce.io/impressum">{{ $t('Imprint') }}</a>
                <a href="https://www.hubblecommerce.io/datenschutz">{{ $t('Privacy and Cookie Policy') }}</a>
                <a href="https://www.hubblecommerce.io/blog">{{ $t('Blog') }}</a>
                <a href="https://www.hubblecommerce.io/kontakt">{{ $t('Contact us') }}</a>
            </div>
        </div>
        <div class="column">
            <div class="title">{{ $t('Shipping methods') }}</div>
            <a href="https://www.hubblecommerce.io/" class="logos">
                <span class="hidden-link-name">{{ $t('Shipping methods') }}</span>
                <img-lazy :src="require('~/assets/images/shipping/dhl_200x120.png')" alt="DHL" />
                <img-lazy :src="require('~/assets/images/shipping/gls_200x120.png')" alt="GLS" />
            </a>
        </div>
        <div class="column">
            <div class="title">{{ $t('Pay easy and secure') }}</div>
            <a href="https://www.hubblecommerce.io/" class="logos">
                <span class="hidden-link-name">{{ $t('Pay easy and secure') }}</span>
                <img-lazy :src="require('~/assets/images/payment/rechnung_200x120.png')" alt-info="Rechnung" />
                <img-lazy :src="require('~/assets/images/payment/visa_200x120.png')" alt-info="Visa" />
                <img-lazy :src="require('~/assets/images/payment/mastercard_200x120.png')" alt-info="Mastercard" />
                <img-lazy :src="require('~/assets/images/payment/aa_200x120.png')" alt-info="American Express" />
                <img-lazy :src="require('~/assets/images/payment/giropay_200x120.png')" alt-info="Giropay" />
                <img-lazy :src="require('~/assets/images/payment/paypal_200x120.png')" alt-info="Paypal" />
                <img-lazy :src="require('~/assets/images/payment/klarna_200x120.png')" alt-info="Klarna" />
                <img-lazy :src="require('~/assets/images/payment/amazon_pay_200x120.png')" alt-info="Amazon Pay" />
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TheFooterDesktop',
};
</script>
