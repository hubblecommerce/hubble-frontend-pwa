<template>
    <div class="container error-wrp">
        <i class="icon icon-frown" />
        <h1>Bad Request</h1>
        <div v-if="error.message != null" class="error-text" v-text="error.message" />
        <div v-else class="error-text" v-text="'The server was unable to process the request due to invalid syntax.'" />
    </div>
</template>

<script>
export default {
    name: 'Error400',
    props: {
        error: {
            type: Object,
            default: () => {},
        },
    },
};
</script>
