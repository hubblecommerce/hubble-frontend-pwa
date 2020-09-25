<template>
    <div class="logo-wrp">
        <nuxt-link :to="localePath('index')" class="logo">
            <span class="hidden-link-name">Hubble Logo</span>
            <picture>
                <source media="(min-width: 768px)" :srcset="logoPath" />
                <img :src="logoPath" alt="Logo" title="Logo" />
            </picture>
        </nuxt-link>
    </div>
</template>

<script>
export default {
    name: 'TheLogo',
    computed: {
        logoPath: function () {
            return require(`~/assets/images/${process.env.THEME}/logo.svg`);
        },
    }
};
</script>
