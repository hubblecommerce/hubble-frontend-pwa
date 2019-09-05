<template>
    <div class="container pre-footer-wrp">
        <div class="follow-us-wrp">
            <div class="follow-us-label headline-1" v-text="$t('Follow us:')"></div>
            <div class="follow-us-icons">
                <a href="https://www.facebook.com/digital.manufaktur/" target="_blank" rel="noopener">
                    <div class="hidden-link-name">Visit us on Facebook</div>
                    <i class="icon icon-facebook"></i>
                </a>
                <a href="https://www.instagram.com/hubblecommerce/" target="_blank" rel="noopener">
                    <div class="hidden-link-name">Follow us on Instagram</div>
                    <i class="icon icon-instagram"></i>
                </a>
            </div>
        </div>
        <div class="newsletter-wrp">
            <div class="text-wrp">
                <div class="newsletter-headline headline-1" v-text="$t('Subscribe our Newsletter')"></div>
                <div class="newsletter-subline text" v-text="$t('Ensure regular benefits!')"></div>
            </div>
            <button class="button button-primary">
                {{$t('Subscribe now')}}
                <material-ripple/>
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TheFooterSocial"
    }
</script>
