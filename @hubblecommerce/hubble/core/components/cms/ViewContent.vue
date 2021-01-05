<template>
    <div class="container cms">
        <breadcrumbs :path="breadcrumbPath" />
        <div class="cms-container-top">
            <h1 class="headline headline-1" v-text="content.title" />
            <div class="text" v-text="content.heading" />
        </div>
        <div class="cms-container-main row">
            <div class="col-12 col-lg-3 cms-container-sidebar" />
            <div class="col-12 col-lg-9 cms-container-content">
                <div v-html="content.content_rendered" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Breadcrumbs from '../utils/Breadcrumbs';
export default {
    name: 'ViewContent',

    components: { Breadcrumbs },

    data() {
        return {
            content: {},
            breadcrumbPath: [],
        };
    },

    computed: {
        ...mapState({
            stateContent: (state) => state.modApiCms.dataContent.item,
        }),
    },

    created() {
        this.setContentData();
        this.setBreadcrumbs();
    },

    methods: {
        getHeadline: function () {
            return this.content.title;
        },
        getIdentifier: function () {
            return this.content.identifier;
        },
        setContentData: function () {
            this.content = this.stateContent;
        },
        setBreadcrumbs: function () {
            this.breadcrumbPath = [
                {
                    url: this.getIdentifier(),
                    name: this.getHeadline(),
                },
            ];
        },
    },

    head() {
        return {
            title: this.content.meta_title,
            meta: [
                { hid: 'description', name: 'description', content: this.content.meta_description },
                { hid: 'robots', name: 'robots', content: 'INDEX, FOLLOW' },
                { hid: 'keywords', name: 'keywords', content: this.content.meta_keywords },
            ],
        };
    },
};
</script>
