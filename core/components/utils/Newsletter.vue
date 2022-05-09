<template>
    <div class="newsletter-box">
        <div class="text-wrp">
            <div class="newsletter-headline headline-1" v-text="'Newsletter'" />
            <div class="newsletter-subline text" v-text="'Ensure regular benefits!'" />
        </div>

        <hbl-input class="input-icon">
            <input id="newsletterEmail" type="text" placeholder=" " required />
            <label for="newsletterEmail" v-text="'E-mail address'" />
            <svg-icon icon="mail" />
        </hbl-input>
    </div>
</template>

<script>
export default {
    name: 'Newsletter',
};
</script>

<style lang="scss">
.newsletter-box {
    .hbl-input-group {
        .icon {
            width: 21px;
            height: 17px;
            right: 15px;
        }
    }
}
</style>