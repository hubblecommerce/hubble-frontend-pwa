<template>
    <div class="container">
        <div class="row">
            <div class="col-12 sub-footer">
                <div class="copyright">
                    <div class="copyright-text text-small" v-text="$t('copyright_footer')" />
                </div>
                <div class="footer-hint text-small">
                    <a href="https://www.hubblecommerce.io/impressum">{{ $t('Imprint') }}</a> -
                    <a href="https://www.hubblecommerce.io/datenschutz">{{ $t('Privacy and Cookie Policy') }}</a> -
                    <a href="https://www.hubblecommerce.io/blog">{{ $t('Blog') }}</a> -
                    <a href="https://www.hubblecommerce.io/kontakt">{{ $t('Contact us') }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TheFooterCopyrightLight"
    }
</script>
