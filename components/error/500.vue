<template>
    <div class="error-wrp flex-center flex-column">
        <h1 v-text="$t('Oops, something went wrong')" />
        <p v-text="$t('The link you clicked on may be broken or no longer exist.')" />
    </div>
</template>

<script>
    export default {
        name: 'Error500',
        props: {
            error: {
                type: Object,
                default: () => {}
            }
        }
    };
</script>
