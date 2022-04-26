<template>
    <div class="post-footer-wrp">
        <div class="container">
            <div class="row">
                <div class="col-md-2 col-lg-3">
                    <div class="follow-us-wrp">
                        <div class="follow-us-icons">
                            <a href="" target="_blank" rel="noopener">
                                <div class="hidden-link-name">Visit us on Facebook</div>
                                <img src="~/assets/icons/facebook.svg" alt="Facebook" />
                            </a>
                            <a href="" target="_blank" rel="noopener">
                                <div class="hidden-link-name">Follow us on Instagram</div>
                                <img src="~/assets/icons/instagram.svg" alt="Facebook" />
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-8 col-lg-6">
                    <div class="copyright-wrp">
                        <div
                            class="copyright-text text-small"
                            v-text="`Copyright © ${new Date().getFullYear()} digital.manufaktur GmbH. All rights reserved`"
                        />
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
export default {
    name: 'ThePostFooter',
};
</script>
