<template>
    <div>
        <view-catalogsearch />
    </div>
</template>

<script>
import ViewCatalogsearch from '../../components/productlist/ViewCatalogsearch';
import apiResourceRequest from '~/anonymous-middleware/apiResourceRequest';
import apiResourceSearchSw from '~/anonymous-middleware/apiResourceSearch';
import apiResourceSearchApi from '~/anonymous-middleware/apiResourceSearch';

export default {
    name: 'Catalogsearch',

    components: {
        ViewCatalogsearch,
    },

    layout: 'hubble',

    middleware: [
        'apiAuthenticate',
        'apiLocalization',
        'apiResourceMenu',
        process.env.API_TYPE === 'sw' ? apiResourceSearchSw : apiResourceSearchApi,
        apiResourceRequest,
        'trackClickPath',
    ],
};
</script>
