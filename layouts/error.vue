<template>
    <div class="container flex-center flex-column">
        <component :is="errorPage" :error="error" />
    </div>
</template>

<style>
    .flex-center {
        align-items: center;
        display: flex;
        justify-content: center;
    }
</style>

<script>
    import error400 from '~/components/error/400.vue';
    import error401 from '~/components/error/401.vue';
    import error404 from '~/components/error/404.vue';
    import error500 from '~/components/error/500.vue';
    import errorDefault from '~/components/error/default.vue';

    export default {
        name: 'LayoutError',

        layout: 'hubble',

        props: {
            error: {
                type: Object,
                default: () => {}
            }
        },

        data() {
            return {
                useDefaultError: process.env.DEFAULT_ERROR_PAGE === 'true'
            }
        },

        computed: {
            errorPage() {
                if(this.useDefaultError) {
                    return errorDefault;
                }
                if(this.error.statusCode === 400) {
                    return error400;
                }

                if(this.error.statusCode === 401) {
                    return error401;
                }

                if(this.error.statusCode === 404) {
                    return error404;
                }

                return error500;
            }
        }
    }
</script>
