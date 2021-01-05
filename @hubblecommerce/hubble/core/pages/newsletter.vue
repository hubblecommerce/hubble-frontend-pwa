<template>
    <div class="container">
        <breadcrumbs :path="breadcrumbPath" />
        <div class=""> Sorry newsletter is currently deactivated. </div>
    </div>
</template>

<script>
import Breadcrumbs from '../components/utils/Breadcrumbs';

export default {
    name: 'Newsletter',

    components: { Breadcrumbs },

    layout: 'hubble',

    middleware: ['apiAuthenticate', 'apiLocalization', 'apiResourceMenu', 'trackClickPath'],

    data() {
        return {
            breadcrumbPath: [
                {
                    url: 'Newsletter',
                    name: 'Newsletter',
                },
            ],
        };
    },
};
</script>
