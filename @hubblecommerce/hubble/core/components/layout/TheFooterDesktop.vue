<template>
    <div class="container">
        <div class="footer-desktop">
            <div class="column">
                <div class="title">{{ 'Service' }}</div>
                <div class="links">
                    <a href="https://www.hubblecommerce.io/">{{ 'About us' }}</a>
                    <a href="https://www.hubblecommerce.io/performance">{{ 'Performance' }}</a>
                    <a href="https://www.hubblecommerce.io/progressive-web-app">{{ 'PWA' }}</a>
                    <a href="https://www.hubblecommerce.io/developer-experience">{{ 'Developer Experience' }}</a>
                </div>
            </div>
            <div class="column">
                <div class="title">{{ 'Information' }}</div>
                <div class="links">
                    <a href="https://www.hubblecommerce.io/impressum">{{ 'Imprint' }}</a>
                    <a href="https://www.hubblecommerce.io/datenschutz">{{ 'Privacy and Cookie Policy' }}</a>
                    <a href="https://www.hubblecommerce.io/blog">{{ 'Blog' }}</a>
                    <a href="https://www.hubblecommerce.io/kontakt">{{ 'Contact us' }}</a>
                </div>
            </div>
            <div class="column">
                <div class="title">{{ 'Shipping methods' }}</div>
                <a href="https://www.hubblecommerce.io/" class="logos">
                    <span class="hidden-link-name">{{ 'Shipping methods' }}</span>
                    <img :src="require('~/assets/images/shipping/dhl_200x120.png')" :alt="'DHL'" :title="'DHL'" />
                    <img :src="require('~/assets/images/shipping/gls_200x120.png')" :alt="'GLS'" :title="'GLS'" />
                </a>
            </div>
            <div class="column">
                <div class="title">{{ 'Pay easy and secure' }}</div>
                <a href="https://www.hubblecommerce.io/" class="logos">
                    <span class="hidden-link-name">{{ 'Pay easy and secure' }}</span>
                    <img :src="require('~/assets/images/payment/rechnung_200x120.png')" :alt="'Rechnung'" :title="'Rechnung'" />
                    <img :src="require('~/assets/images/payment/visa_200x120.png')" :alt="'Visa'" :title="'Visa'" />
                    <img :src="require('~/assets/images/payment/mastercard_200x120.png')" :alt="'Mastercard'" :title="'Mastercard'" />
                    <img :src="require('~/assets/images/payment/aa_200x120.png')" :alt="'American Express'" :title="'American Express'" />
                    <img :src="require('~/assets/images/payment/giropay_200x120.png')" :alt="'Giropay'" :title="'Giropay'" />
                    <img :src="require('~/assets/images/payment/paypal_200x120.png')" :alt="'Paypal'" :title="'Paypal'" />
                    <img :src="require('~/assets/images/payment/klarna_200x120.png')" :alt="'Klarna'" :title="'Klarna'" />
                    <img :src="require('~/assets/images/payment/amazon_pay_200x120.png')" :alt="'Amazon Pay'" :title="'Amazon Pay'" />
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TheFooterDesktop',
};
</script>
