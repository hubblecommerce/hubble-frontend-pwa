<template>
    <div>
        about to view a DUMMY page ...
        <br>pageType: <span v-text="pageType"></span>
        <br>apiLocale: <span v-text="apiLocale"></span>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {

        computed: {
            ...mapState({
                pageType: state => state.modApiResources.pageType,
                apiLocale: state => state.modApiResources.apiLocale
            })
        },
    }
</script>