<template>
    <div class="search-context-wrapper">
        <div class="container expand-content">
            <div class="row overlay-header">
                <hbl-button class="button-icon" @click.native="hideOffcanvasAction">
                    <div class="hidden-link-name" v-text="'Close'" />
                    <svg-icon icon="x" />
                </hbl-button>
                <div class="overlay-headline" v-text="'Search'" />
            </div>

            <div class="row">
                <div class="col-12 overlay-body">
                    <plugin-slot name="search-widget">
                        <the-search />
                    </plugin-slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import vClickOutside from 'v-click-outside';

export default {
    name: 'TheSearchContext',

    created() {
        Vue.use(vClickOutside);
    },

    methods: {
        ...mapActions({
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
        }),
    },
};
</script>

<style lang="scss" scoped>
.search-context-wrapper {
    .overlay-body {
        padding: 0;
    }
}

@media (min-width: 1024px) {
    .search-context-wrapper {
        .expand-content {
            height: calc(100vh - 78px);
        }
    }
}
</style>
