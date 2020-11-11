<template>
    <div class="newsletter-box">
        <div class="text-wrp">
            <div class="newsletter-headline headline-1" v-text="$t('Newsletter')" />
            <div class="newsletter-subline text" v-text="$t('Ensure regular benefits!')" />
        </div>

        <div class="hbl-input-group input-icon">
            <input id="newsletterEmail" type="text" placeholder=" " required />
            <label for="newsletterEmail" v-text="$t('E-mail address')" />
            <i class="icon icon-mail"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: "Newsletter"
}
</script>
