<template>
    <div class="logo-wrp">
        <nuxt-link :to="logoUrl" class="logo" aria-label="Hubble Logo" title="Hubble Logo">
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
    props: {
        logoUrl: {
            type: String,
            required: false,
            default: "/",
        },
    },
    computed: {
        logoPath: function () {
            return require(`~/assets/images/${this.$config.theme}/logo.svg`);
        },
    },
};
</script>

<style lang="scss">
$hbl-logo-wrp-height: 55px;
$hbl-logo-width: 92px;
$hbl-logo-width-desktop: 115px;

.logo-wrp {
    height: $hbl-logo-wrp-height;
    display: flex;
    align-items: center;
    text-align: center;
    width: 100%;
}

.logo {
    margin: 0 auto;
    display: block;
    overflow: hidden;
    vertical-align: middle;
    height: auto;

    picture {
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            position: relative;
            width: $hbl-logo-width;
        }
    }
}

/* Tablet */
@media (min-width: 768px) {
    .logo-wrp {
        margin-right: 0;
        width: auto;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .logo {
        img {
            width: $hbl-logo-width-desktop;
        }
    }
}
</style>
