<template>
    <div class="container error-wrp">
        <i class="icon icon-frown" />
        <h1 v-text="$t('This page doesn’t exist')" />
        <div v-if="error.message != null" class="error-text" v-text="error.message" />
        <template v-else>
            <div class="error-text" v-text="$t('The link you clicked on may be broken or no longer exist.')" />
            <div class="error-text" v-text="$t('You may have followed an outdated link or mistyped.')" />
        </template>
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
