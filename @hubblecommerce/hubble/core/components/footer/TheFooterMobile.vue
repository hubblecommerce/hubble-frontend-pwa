<template>
    <div class="container">
        <div class="row footer-link-wrp">
            <collapsible :toggle-text="$t('Newsletter')">
                <div class="content-wrp">
                    <Newsletter />
                </div>
            </collapsible>
            <collapsible :toggle-text="$t('Service')">
                <div class="content-wrp">
                    <div class="links">
                        <a href="https://www.hubblecommerce.io/">{{ $t('About us') }}</a>
                        <a href="https://www.hubblecommerce.io/performance">{{ $t('Performance') }}</a>
                        <a href="https://www.hubblecommerce.io/progressive-web-app">{{ $t('PWA') }}</a>
                        <a href="https://www.hubblecommerce.io/developer-experience">{{ $t('Developer Experience') }}</a>
                    </div>
                </div>
            </collapsible>
            <collapsible :toggle-text="$t('Information')">
                <div class="content-wrp">
                    <div class="links">
                        <a href="https://www.hubblecommerce.io/impressum">{{ $t('Imprint') }}</a>
                        <a href="https://www.hubblecommerce.io/datenschutz">{{ $t('Privacy and Cookie Policy') }}</a>
                        <a href="https://www.hubblecommerce.io/blog">{{ $t('Blog') }}</a>
                        <a href="https://www.hubblecommerce.io/kontakt">{{ $t('Contact us') }}</a>
                    </div>
                </div>
            </collapsible>
            <collapsible :toggle-text="$t('Shipping methods')">
                <div class="content-wrp">
                    <a href="#" class="logos">
                        <span class="hidden-link-name">{{ $t('Shipping methods') }}</span>
                        <img-lazy :alt-info="'DHL'" :title-info="'DHL'" :src="require('~/assets/images/shipping/dhl_200x120.png')" :widht="200" :height="120" :backgroundColor="'rgba(255, 255, 255, 0)'" />
                        <img-lazy :alt-info="'GLS'" :title-info="'GLS'" :src="require('~/assets/images/shipping/gls_200x120.png')" :widht="200" :height="120" :backgroundColor="'rgba(255, 255, 255, 0)'" />
                    </a>
                </div>
            </collapsible>
            <collapsible :toggle-text="$t('Pay easy and secure')">
                <div class="content-wrp">
                    <a href="https://www.hubblecommerce.io/" class="logos">
                        <span class="hidden-link-name">{{ $t('Payment methods') }}</span>
                        <img-lazy :alt-info="'Rechnung'" :title-info="'Rechnung'" :src="require('~/assets/images/payment/rechnung_200x120.png')" :widht="200" :height="120" :backgroundColor="'rgba(255, 255, 255, 0)'" />
                        <img-lazy :alt-info="'Visa'" :title-info="'Visa'" :src="require('~/assets/images/payment/visa_200x120.png')" :widht="200" :height="120" :backgroundColor="'rgba(255, 255, 255, 0)'" />
                        <img-lazy :alt-info="'Mastercard'" :title-info="'Mastercard'" :src="require('~/assets/images/payment/mastercard_200x120.png')" :widht="200" :height="120" :backgroundColor="'rgba(255, 255, 255, 0)'" />
                        <img-lazy :alt-info="'American Express'" :title-info="'American Express'" :src="require('~/assets/images/payment/aa_200x120.png')" :widht="200" :height="120" :backgroundColor="'rgba(255, 255, 255, 0)'" />
                        <img-lazy :alt-info="'Giropay'" :title-info="'Giropay'" :src="require('~/assets/images/payment/giropay_200x120.png')" :widht="200" :height="120" :backgroundColor="'rgba(255, 255, 255, 0)'" />
                        <img-lazy :alt-info="'Paypal'" :title-info="'Paypal'" :src="require('~/assets/images/payment/paypal_200x120.png')" :widht="200" :height="120" :backgroundColor="'rgba(255, 255, 255, 0)'" />
                        <img-lazy :alt-info="'Klarna'" :title-info="'Klarna'" :src="require('~/assets/images/payment/klarna_200x120.png')" :widht="200" :height="120" :backgroundColor="'rgba(255, 255, 255, 0)'" />
                        <img-lazy :alt-info="'Amazon Pay'" :title-info="'Amazon Pay'" :src="require('~/assets/images/payment/amazon_pay_200x120.png')" :widht="200" :height="120" :backgroundColor="'rgba(255, 255, 255, 0)'" />
                    </a>
                </div>
            </collapsible>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TheFooterMobile',

    components: {
        Newsletter: () => import('../../components/utils/Newsletter'),
        Collapsible: () => import('../utils/Collapsible'),
    },
};
</script>
