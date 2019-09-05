<template>
    <div class="container full-height flex-center flex-column">
        <component :is="errorPage" :error="error" />
        <nuxt-link to="/">
            <button class="rct-button-primary">
                Back to Home
                <material-ripple></material-ripple>
            </button>
        </nuxt-link>
    </div>
</template>

<style>
    .full-height {
        height: 100vh;
    }
    .flex-center {
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .position-ref {
        position: relative;
    }
    .content {
        text-align: center;
    }
    .error_code {
        font-size: 10rem;
        padding: 1rem;
    }
    .error_message {
        font-size: 1.75rem;
        padding: 1rem;
        max-width: 75vw;
        text-align: center;
    }
</style>

<script>
    import error400 from '~/components/error/400.vue';
    import error401 from '~/components/error/401.vue';
    import error404 from '~/components/error/404.vue';
    import error500 from '~/components/error/500.vue';

    export default {
        name: 'LayoutError',

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

                return error500;
            }
        }
    }
</script>
