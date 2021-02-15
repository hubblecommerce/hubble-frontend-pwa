<template>
    <div class="newsletter-box">
        <div class="text-wrp">
            <div class="newsletter-headline headline-1" v-text="'Newsletter'" />
            <div class="newsletter-subline text" v-text="'Ensure regular benefits!'" />
        </div>

        <hbl-input class="input-icon">
            <input id="newsletterEmail" type="text" placeholder=" " required />
            <label for="newsletterEmail" v-text="'E-mail address'" />
        </hbl-input>
    </div>
</template>

<script>
export default {
    name: 'Newsletter',
};
</script>
