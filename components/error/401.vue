<template>
    <div class="error-wrp flex-center flex-column">
        <h1>API authorisation failed</h1>
        <p>Please check your configuration or contact your service provider.</p>
        <div class="text-small">
            {{ error.message }}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Error401',
        props: {
            error: {
                type: Object,
                default: () => {}
            }
        }
    };
</script>
