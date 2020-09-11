<template>
    <div class="container error-wrp">
        <i class="icon icon-frown" />
        <h1 v-text="$t('Internal Server Error')" />
        <div v-if="error.message != null" class="error-text" v-text="error.message" />
        <div v-else class="error-text" v-text="'Something has gone wrong on the website\'s server'" />
    </div>
</template>

<script>
export default {
    name: 'Error500',
    props: {
        error: {
            type: Object,
            default: () => {},
        },
    },
};
</script>
