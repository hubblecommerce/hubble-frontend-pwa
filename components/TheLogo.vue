<template>
    <div class="logo-wrp">
        <nuxt-link :to="localePath('index')" class="logo">
            <span class="hidden-link-name">Hubble Logo</span>
            <picture>
                <source media="(min-width: 768px)" srcset="~/assets/images/app/hubble-logo.svg">
                <img src="~/assets/images/app/hubble-logo.svg" alt="Logo">
            </picture>
        </nuxt-link>
    </div>
</template>

<script>
    export default {
        name: "TheLogo",
        data() {
            return {
                hubbleLogo: 'hubble-logo',
            }
        }
    }
</script>
