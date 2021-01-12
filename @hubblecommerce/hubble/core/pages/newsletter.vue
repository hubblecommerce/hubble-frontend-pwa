<template>
    <div class="container">
        <breadcrumbs :path="breadcrumbPath" />
        <newsletter-form></newsletter-form>
    </div>
</template>

<script>
import Breadcrumbs from '../components/utils/Breadcrumbs';
import NewsletterForm from '../components/utils/NewsletterForm';

export default {
    name: 'Newsletter',

    components: { NewsletterForm, Breadcrumbs },

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
