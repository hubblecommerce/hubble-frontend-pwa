<template>
    <div class="container">
        <div class="row footer-link-wrp">
            <collapsible :toggle-text="$t('Service')">
                <div class="content-wrp">
                    <div class="links">
                        <a href="https://www.hubblecommerce.io/">{{$t('About us')}}</a>
                        <a href="https://www.hubblecommerce.io/performance">{{$t('Performance')}}</a>
                        <a href="https://www.hubblecommerce.io/progressive-web-app">{{$t('PWA')}}</a>
                        <a href="https://www.hubblecommerce.io/developer-experience">{{$t('Developer Experience')}}</a>
                    </div>
                </div>
            </collapsible>
            <collapsible :toggle-text="$t('Information')">
                <div class="content-wrp">
                    <div class="links">
                        <a href="https://www.hubblecommerce.io/impressum">{{$t('Imprint')}}</a>
                        <a href="https://www.hubblecommerce.io/datenschutz">{{$t('Privacy and Cookie Policy')}}</a>
                        <a href="https://www.hubblecommerce.io/blog">{{$t('Blog')}}</a>
                        <a href="https://www.hubblecommerce.io/kontakt">{{$t('Contact us')}}</a>
                    </div>
                </div>
            </collapsible>
            <collapsible :toggle-text="$t('Shipping methods')">
                <div class="content-wrp">
                    <a href="#" class="logos">
                        <span class="hidden-link-name">{{$t('Shipping methods')}}</span>
                        <img alt="DHL" src="~/assets/images/shipping/dhl_200x120.png" />
                        <img alt="GLS" src="~/assets/images/shipping/gls_200x120.png" />
                    </a>
                </div>
            </collapsible>
            <collapsible :toggle-text="$t('Pay easy and secure')">
                <div class="content-wrp">
                    <a href="https://www.hubblecommerce.io/" class="logos">
                        <span class="hidden-link-name">{{ $t('Payment methods') }}</span>
                        <img alt="Rechnung" src="~/assets/images/payment/rechnung_200x120.png">
                        <img alt="Visa" src="~/assets/images/payment/visa_200x120.png">
                        <img alt="Mastercard" src="~/assets/images/payment/mastercard_200x120.png">
                        <img alt="American Express" src="~/assets/images/payment/aa_200x120.png">
                        <img alt="Giropay" src="~/assets/images/payment/giropay_200x120.png">
                        <img alt="Paypal" src="~/assets/images/payment/paypal_200x120.png">
                        <img alt="Klarna" src="~/assets/images/payment/klarna_200x120.png">
                        <img alt="Amazon Pay" src="~/assets/images/payment/amazon_pay_200x120.png">
                    </a>
                </div>
            </collapsible>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TheFooterMobile"
    }
</script>
