<template>
    <div class="error-no-items flex-column">
        <h1>{{ $t('Something went wrong.') }}</h1>
        <p v-text="error.message" />
    </div>
</template>

<script>
    export default {
        name: 'ErrorNoItems',
        props: {
            error: {
                type: Object,
                default: () => {}
            }
        }
    }
</script>
