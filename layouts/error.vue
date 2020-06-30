<template>
    <div class="container d-flex flex-column align-self-center justify-content-center">
        <component :is="errorPage" :error="error" />
    </div>
</template>

<script>
    export default {
        name: 'LayoutError',

        components: {
            error400: () => import('~/components/error/400.vue'),
            error401: () => import('~/components/error/401.vue'),
            error404: () => import('~/components/error/404.vue'),
            error500: () => import('~/components/error/500.vue'),
            error503: () => import('~/components/error/503.vue'),
            ErrorDefault: () => import('~/components/error/default.vue'),
        },

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
                    return 'error-400';
                }

                if(this.error.statusCode === 401) {
                    return 'error-401';
                }

                if(this.error.statusCode === 404) {
                    return 'error-404';
                }

                if(this.error.statusCode === 503) {
                    return 'error-503';
                }

                if(process.env.DEFAULT_ERROR_PAGE === 'true') {
                    return 'error-default';
                }

                return 'error-500';
            }
        }
    }
</script>
