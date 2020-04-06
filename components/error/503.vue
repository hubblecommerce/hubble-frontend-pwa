<template>
    <div class="container error-wrp">
        <i class="icon icon-frown" />
        <h1>Service unavailable</h1>
        <div v-if="error.message != null" class="error-text" v-text="error.message" />
        <div v-else class="error-text" v-text="'The server is too busy or there\'s maintenance being performed on it.'" />
    </div>
</template>

<script>
    export default {
        name: 'Error503',
        props: {
            error: {
                type: Object,
                default: () => {}
            }
        }
    };
</script>
