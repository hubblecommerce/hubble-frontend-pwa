<template>
    <div class="container error-wrp">
        <i class="icon icon-frown" />
        <h1>API authorisation failed</h1>
        <div v-if="error.message != null" class="error-text" v-text="error.message" />
        <div v-else class="error-text" v-text="'Please check your configuration or contact your service provider.'" />
    </div>
</template>

<script>
export default {
    name: 'Error401',
    props: {
        error: {
            type: Object,
            default: () => {},
        },
    },
};
</script>
