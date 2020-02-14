<template>
    <div class="container">
        <breadcrumbs :path="breadcrumbPath" />
        <div class="">
            Sorry newsletter is currently deactivated.
        </div>
<!--        <newsletter-form title="Hubble  Newsletter" slogan="Tolle Angebote und Aktionen, immer aktuell!" />-->
    </div>
</template>

<script>
    import NewsletterForm from "../components/utils/NewsletterForm";
    import Breadcrumbs from "../components/utils/Breadcrumbs";

    export default {
        name: "Newsletter",

        components: {NewsletterForm, Breadcrumbs},

        layout: 'hubble',

        middleware: [
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'trackClickPath'
        ],

        data() {
            return {
                breadcrumbPath: [
                    {
                        'url': 'Newsletter',
                        'name': 'Newsletter'
                    }
                ]
            }
        }
    }
</script>

