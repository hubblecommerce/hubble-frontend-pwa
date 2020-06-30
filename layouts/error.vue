<template>
    <div class="container d-flex flex-column align-self-center justify-content-center">
        <component :is="errorPage" :error="error" />
    </div>
</template>

<script>
    import error400 from '~/components/error/400.vue';
    import error401 from '~/components/error/401.vue';
    import error404 from '~/components/error/404.vue';
    import error500 from '~/components/error/500.vue';
    import error503 from '~/components/error/503.vue';
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

        computed: {
            errorPage() {
                if(this.error.statusCode === 400) {
                    return error400;
                }

                if(this.error.statusCode === 401) {
                    return error401;
                }

                if(this.error.statusCode === 404) {
                    return error404;
                }

                if(this.error.statusCode === 503) {
                    return error503;
                }

                if(process.env.DEFAULT_ERROR_PAGE === 'true') {
                    return errorDefault;
                }

                return error500;
            }
        }
    }
</script>
