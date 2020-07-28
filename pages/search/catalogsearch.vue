<template>
    <div>
        <view-catalogsearch />
    </div>
</template>

<script>
    import ViewCatalogsearch from "../../components/productlist/ViewCatalogsearch";
    import apiResourceRequest from '@hubblecommerce/hubble/core/anonymous-middleware/apiResourceRequest';
    import apiResourceSearchSw from '@hubblecommerce/hubble/core/anonymous-middleware/sw/apiResourceSearch';
    import apiResourceSearchApi from '@hubblecommerce/hubble/core/anonymous-middleware/api/apiResourceSearch';

    export default {
        name: "Catalogsearch",

        components: {
            ViewCatalogsearch
        },

        layout: 'hubble',

        middleware: [
            'apiAuthenticate',
            'apiLocalization',
            'apiResourceMenu',
            process.env.API_TYPE === 'sw' ? apiResourceSearchSw : apiResourceSearchApi,
            apiResourceRequest,
            'trackClickPath'
        ]
    }
</script>
