<template>
    <div>
        <component :is="curComponent" v-if="pageType !== null"></component>
    </div>
</template>

<script>
    import ViewCatalogsearch from "../../components/productlist/ViewCatalogsearch";

    export default {
        name: "Catalogsearch",

        components: {
            ViewCatalogsearch
        },

        layout: 'hubble',

        data() {
            return {
                pageType: true,
                curComponent: 'view-catalogsearch'
            }
        },

        middleware: [
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            'apiResourceSearch',
            'apiResourceRequest',
            'trackClickPath'
        ]
    }
</script>
