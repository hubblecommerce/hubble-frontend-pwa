<template>
    <div class="menu-context-wrapper">
        <div class="container expand-content">
            <div class="row overlay-header">
                <hbl-button class="button-icon" @click.native="hideOffcanvasAction">
                    <div class="hidden-link-name" v-text="'Close'" />
                    <svg-icon icon="x" />
                </hbl-button>
                <div class="overlay-headline" v-text="'Navigation'" />
            </div>
            <div class="row">
                <mobile-menu v-if="menu !== null && !isLoading" :data-item="{ name: 'root', children: menu }" :depth="0" />
                <loader v-if="isLoading" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import apiClient from '@/utils/api-client';
import { mappingMenu } from '@/utils/api-mapping-helper';

export default {
    name: 'TheMenuContext',

    data() {
        return {
            isLoading: null,
            menu: null,
        };
    },

    async mounted() {
        try {
            this.isLoading = true;
            let response = await this.fetchMenu();
            this.menu = mappingMenu(response.data);
            this.isLoading = false;
        } catch (e) {
            this.isLoading = false;
            throw e;
        }
    },

    methods: {
        ...mapActions({
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
        }),
        hideMenu: function () {
            this.hideOffcanvasAction();
        },
        fetchMenu: async function () {
            return await new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/v3/navigation/main-navigation/main-navigation',
                data: {
                    includes: {
                        category: ['id', 'parentId', 'name', 'level', 'active', '_uniqueIdentifier', 'seoUrls', 'type', 'children'],
                    },
                    buildTree: true,
                    depth: 5,
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.loader-wrp {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70vh;
}
</style>
