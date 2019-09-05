<template>
    <div>
        <component :is="curComponent" v-if="pageType !== null"></component>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        name: "catalogsearch",

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
