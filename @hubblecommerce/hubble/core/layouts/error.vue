<template>
    <div class="container d-flex flex-column align-self-center justify-content-center">
        <div class="container error-wrp">
            <i class="icon icon-frown" />
            <h1 v-if="error.statusCode != null" v-text="error.statusCode" />
            <div v-if="error.title != null" class="error-text" v-text="error.title" />
            <div v-if="error.detail != null" class="error-text" v-text="error.detail" />
            <nuxt-link :to="'index'">
                <button class="button-primary" v-text="'Discover our products'" />
            </nuxt-link>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'Default',

    props: {
        error: {
            type: Object,
            default: () => {},
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.error-wrp {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: $background-light;
    padding: 60px;
    margin: 20px 0;
    border: 1px solid $border-color;
    width: 100%;

    i {
        width: 70px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        color: $border-color;
        font-size: 70px;
        margin-bottom: 20px;
    }

    h1,
    .headline-1 {
        margin-bottom: 10px;
        text-align: center;
    }

    button {
        margin-top: 20px;
    }
}

.error-listing {
    padding: 40px;

    .error-no-items {
        margin-bottom: 40px;
    }
}
</style>
