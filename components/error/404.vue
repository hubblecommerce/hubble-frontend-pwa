<template>
    <div class="container error-wrp">
        <i class="icon icon-frown" />
        <div class="headline-1" v-text="$t('This page doesn’t exist')" />
        <div class="error-text" v-text="$t('The link you clicked on may be broken or no longer exist.')" />
        <div class="error-text" v-text="$t('You may have followed an outdated link or mistyped.')" />
        <nuxt-link :to="localePath('index')">
            <button class="button-primary">
                {{ $t('Discover our products') }}
                <material-ripple />
            </button>
        </nuxt-link>
    </div>
</template>

<script>
    export default {
        name: 'Error404',
        props: {
            error: {
                type: Object,
                default: () => {},
            },
        },
    };
</script>
