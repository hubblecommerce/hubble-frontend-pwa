<template>
    <div>
        <view-catalogsearch />
    </div>
</template>

<script>
import ViewCatalogsearch from '../../components/productlist/ViewCatalogsearch';
import apiResourceRequest from '~/anonymous-middleware/apiResourceRequest';
import apiResourceSearch from '~/anonymous-middleware/apiResourceSearch';

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
        apiResourceSearch,
        apiResourceRequest,
        'trackClickPath',
    ],
};
</script>
