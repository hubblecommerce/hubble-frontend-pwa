<template>
    <div class="post-footer-wrp">
        <div class="container">
            <div class="row">
                <div class="col-md-2 col-lg-3">
                    <div class="follow-us-wrp">
                        <div class="follow-us-icons">
                            <a href="https://www.facebook.com/digital.manufaktur/" target="_blank" rel="noopener">
                                <div class="hidden-link-name">Visit us on Facebook</div>
                                <i class="icon icon-facebook" />
                            </a>
                            <a href="https://www.instagram.com/hubblecommerce/" target="_blank" rel="noopener">
                                <div class="hidden-link-name">Follow us on Instagram</div>
                                <i class="icon icon-instagram1" />
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-8 col-lg-6">
                    <div class="copyright-wrp">
                        <div class="copyright-text text-small" v-text="$t('copyright_footer')" />
                    </div>
                </div>
                <div class="col-md-2 col-lg-3">
                    <the-logo />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TheLogo from "../../components/navigation/TheLogo";
export default {
    name: 'ThePostFooter',
    components: {TheLogo},
};
</script>
