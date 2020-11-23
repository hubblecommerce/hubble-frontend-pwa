<!--
Usage with:  v-if="$mq === 'md' || $mq === 'lg'"
-->
<template>
    <div class="newsletter-wrp">
        <div class="newsletter-headline">
            <div class="headline-1 newsletter-title" v-text="$t('Newsletter registration')" />
        </div>
        <div class="newsletter-box">
            <div class="newsletter-info text-small" v-text="$t('We regularly send you carefully selected offers from our range of products by email. All personal data requested in the context of the newsletter registration will not be passed on to third parties. You can object to the use of your e-mail address for advertising purposes at any time online or by sending an e-mail.')" />
            <div class="form-title" v-text="$t('Subscribe to Newsletter')" />

            <!-- Begin Mailchimp Signup Form
                This Form is for a test Audience!
                 Steps to do to use the real Audience:
                    * Create an embedded Signup Form for your Audience with an email field (required) and datum (not required)
                    * Change the form action url to that one
            -->
            <div id="mc_embed_signup">
                <form
                    id="mc-embedded-subscribe-form"
                    action="//INSERT-YOUR-GENERATED-FORM-ACTION"
                    method="post"
                    name="mc-embedded-subscribe-form"
                    class="validate"
                    target="_blank"
                >
                    <div class="hbl-input-group">
                        <input id="mce-EMAIL" type="email" value="" name="EMAIL" placeholder=" " required />
                        <label for="mce-EMAIL" v-text="$t('Your e-mail address*')" />
                    </div>
                    <div>
                        <label for="mce-MMERGE1-month" v-text="$t('Your date of birth**')" />
                        <div class="datefield hbl-input-group">
                            <span class="subfield dayfield">
                                <input
                                    id="mce-MMERGE1-day"
                                    class="datepart"
                                    type="text"
                                    pattern="[0-9]*"
                                    value=""
                                    placeholder="TT"
                                    size="2"
                                    maxlength="2"
                                    name="MMERGE1[day]"
                                />
                            </span>
                            /
                            <span class="subfield monthfield">
                                <input
                                    id="mce-MMERGE1-month"
                                    class="datepart"
                                    type="text"
                                    pattern="[0-9]*"
                                    value=""
                                    placeholder="MM"
                                    size="2"
                                    maxlength="2"
                                    name="MMERGE1[month]"
                                />
                            </span>
                            /
                            <span class="subfield yearfield">
                                <input
                                    id="mce-MMERGE1-year"
                                    class="datepart-year"
                                    type="text"
                                    pattern="[0-9]*"
                                    value=""
                                    placeholder="JJJJ"
                                    size="4"
                                    maxlength="4"
                                    name="MMERGE1[year]"
                                />
                            </span>
                        </div>
                    </div>
                    <div id="mce-responses" class="clear">
                        <div id="mce-error-response" class="response" style="display: none;" />
                        <div id="mce-success-response" class="response" style="display: none;" />
                    </div>

                    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                    <div style="position: absolute; left: -5000px;" aria-hidden="true">
                        <input type="text" name="b_19ed439094a8b3123e3f7d353_340514885e" tabindex="-1" value="" />
                    </div>
                    <div class="clear subscribe-wrp">
                        <button
                            id="mc-embedded-subscribe"
                            type="submit"
                            value="Subscribe"
                            name="subscribe"
                            class="button button-primary newsletter-button"
                        >
                            {{ $t('Subscribe now') }}
                            <material-ripple />
                        </button>
                    </div>
                </form>

                <div class="indicates-required">
                    <div class="text" v-text="$t('* Mandataroy fields are marked with an asterisk *.')" />
                    <div class="text" v-text="$t('** Please enter your date of birth in this field, if you want to receive your personal birthday newsletter including a personal coupon')" />
                </div>
            </div>

            <!--End mc_embed_signup-->
        </div>
    </div>
</template>

<script>
export default {
    name: 'NewsletterForm',
};
</script>
