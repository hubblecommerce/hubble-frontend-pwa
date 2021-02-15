<template>
    <div class="container">
        <div class="row footer-link-wrp">
            <collapsible :toggle-text="'Newsletter'">
                <div class="content-wrp">
                    <Newsletter />
                </div>
            </collapsible>
            <collapsible :toggle-text="'Service'">
                <div class="content-wrp">
                    <div class="links">
                        <a href="https://www.hubblecommerce.io/">{{ 'About us' }}</a>
                        <a href="https://www.hubblecommerce.io/performance">{{ 'Performance' }}</a>
                        <a href="https://www.hubblecommerce.io/progressive-web-app">{{ 'PWA' }}</a>
                        <a href="https://www.hubblecommerce.io/developer-experience">{{
                            'Developer Experience'
                        }}</a>
                    </div>
                </div>
            </collapsible>
            <collapsible :toggle-text="'Information'">
                <div class="content-wrp">
                    <div class="links">
                        <a href="https://www.hubblecommerce.io/impressum">{{ 'Imprint' }}</a>
                        <a href="https://www.hubblecommerce.io/datenschutz">{{ 'Privacy and Cookie Policy' }}</a>
                        <a href="https://www.hubblecommerce.io/blog">{{ 'Blog' }}</a>
                        <a href="https://www.hubblecommerce.io/kontakt">{{ 'Contact us' }}</a>
                    </div>
                </div>
            </collapsible>
            <collapsible :toggle-text="'Shipping methods'">
                <div class="content-wrp">
                    <a href="#" class="logos">
                        <span class="hidden-link-name">{{ 'Shipping methods' }}</span>
                        <img
                            :alt="'DHL'"
                            :title="'DHL'"
                            :src="require('~/assets/images/shipping/dhl_200x120.png')"
                            :widht="200"
                            :height="120"
                            :background-color="'rgba(255, 255, 255, 0)'"
                        />
                        <img
                            :alt="'GLS'"
                            :title="'GLS'"
                            :src="require('~/assets/images/shipping/gls_200x120.png')"
                            :widht="200"
                            :height="120"
                            :background-color="'rgba(255, 255, 255, 0)'"
                        />
                    </a>
                </div>
            </collapsible>
            <collapsible :toggle-text="'Pay easy and secure'">
                <div class="content-wrp">
                    <a href="https://www.hubblecommerce.io/" class="logos">
                        <span class="hidden-link-name">{{ 'Payment methods' }}</span>
                        <img
                            :alt="'Rechnung'"
                            :title="'Rechnung'"
                            :src="require('~/assets/images/payment/rechnung_200x120.png')"
                            :widht="200"
                            :height="120"
                            :background-color="'rgba(255, 255, 255, 0)'"
                        />
                        <img
                            :alt="'Visa'"
                            :title="'Visa'"
                            :src="require('~/assets/images/payment/visa_200x120.png')"
                            :widht="200"
                            :height="120"
                            :background-color="'rgba(255, 255, 255, 0)'"
                        />
                        <img
                            :alt="'Mastercard'"
                            :title="'Mastercard'"
                            :src="require('~/assets/images/payment/mastercard_200x120.png')"
                            :widht="200"
                            :height="120"
                            :background-color="'rgba(255, 255, 255, 0)'"
                        />
                        <img
                            :alt="'American Express'"
                            :title="'American Express'"
                            :src="require('~/assets/images/payment/aa_200x120.png')"
                            :widht="200"
                            :height="120"
                            :background-color="'rgba(255, 255, 255, 0)'"
                        />
                        <img
                            :alt="'Giropay'"
                            :title="'Giropay'"
                            :src="require('~/assets/images/payment/giropay_200x120.png')"
                            :widht="200"
                            :height="120"
                            :background-color="'rgba(255, 255, 255, 0)'"
                        />
                        <img
                            :alt="'Paypal'"
                            :title="'Paypal'"
                            :src="require('~/assets/images/payment/paypal_200x120.png')"
                            :widht="200"
                            :height="120"
                            :background-color="'rgba(255, 255, 255, 0)'"
                        />
                        <img
                            :alt="'Klarna'"
                            :title="'Klarna'"
                            :src="require('~/assets/images/payment/klarna_200x120.png')"
                            :widht="200"
                            :height="120"
                            :background-color="'rgba(255, 255, 255, 0)'"
                        />
                        <img
                            :alt="'Amazon Pay'"
                            :title="'Amazon Pay'"
                            :src="require('~/assets/images/payment/amazon_pay_200x120.png')"
                            :widht="200"
                            :height="120"
                            :background-color="'rgba(255, 255, 255, 0)'"
                        />
                    </a>
                </div>
            </collapsible>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TheFooterMobile'
};
</script>
