<template>
    <div class="mega-menu-wrp container">
        <div class="level-0-wrp">
            <template v-for="item in dataItems">
                <div @mouseenter="showChildren(item)" @mouseleave="hideChildren" class="menu-item">
                    <a
                        v-if="isExternalUrl(item)"
                        :href="itemUrlPath(item)"
                        target="_blank"
                        class="menu-item-link"
                        rel="noopener nofollow"
                        v-text="item.name"
                    />
                    <nuxt-link
                        v-else
                        :key="item.id"
                        :ref="item.id"
                        class="menu-item-link"
                        :name="item.name"
                        :class="{ active: isActive === item.id }"
                        :to="itemUrlPath(item)"
                        v-text="item.name"
                    />

                    <transition name="fade">
                        <div
                            v-show="isActive === item.id"
                            ref="megaMenuLayer"
                            :class="'mega-menu-flyout ' + activeCategory.url_path"
                        >
                            <div class="mega-menu-flyout-inner">
                                <div class="max-width-container">
                                    <template>
                                        <div class="children-wrp">
                                            <div v-for="child in activeCategory.children" v-if="showChild(child)" :key="child.id" class="child-wrp">
                                                <a
                                                    v-if="isExternalUrl(child)"
                                                    :href="itemUrlPath(child)"
                                                    target="_blank"
                                                    class="mega-menu-item-link"
                                                    rel="noopener nofollow"
                                                    v-text="child.name"
                                                />
                                                <nuxt-link v-else :to="itemUrlPath(child)" class="child-item" v-text="child.name" />

                                                <template v-for="subchild in child.children">
                                                    <div v-if="!subchild.request_path" :key="subchild.id" class="subchild-item" v-text="subchild.name" />
                                                    <nuxt-link v-else :key="subchild.id" class="subchild-item" :to="itemUrlPath(subchild)" v-text="subchild.name" />
                                                </template>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import apiClient from '@/utils/api-client';
import { mappingMenu } from '@/utils/api-mapping-helper';

export default {
    name: 'TheMegaMenu',

    data() {
        return {
            name: 'TheMegaMenu',
            dataItems: [],
            showMenu: false,
            isActive: null,
            activeCategory: {},
        };
    },

    async mounted() {
        try {
            let response = await this.fetchMenu();
            this.dataItems = mappingMenu(response.data);
        } catch (e) {
            throw e;
        }
    },

    watch: {
        '$route.path': function () {
            // Close menu layer if route changes
            this.showMenu = false;
        },
    },

    methods: {
        fetchMenu: async function () {
            return await new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/v3/navigation/main-navigation/main-navigation',
                headers: [{ 'sw-include-seo-urls': true }],
                data: {
                    includes: {
                        category: ['id', 'parentId', 'name', 'level', 'active', '_uniqueIdentifier', 'seoUrls', 'type', 'children', 'externalLink'],
                    },
                    buildTree: true,
                    depth: 5,
                },
            });
        },

        toggle: function () {
            this.showMenu = !this.showMenu;
        },

        isExternalUrl(item) {
            if (item.request_path.includes('https') || item.request_path.includes('http')) return true;
            return false;
        },

        itemUrlPath: function (item) {
            return '/' + item.request_path;
        },

        showChildren: function (item) {
            // Blur background on hover over category with children
            if (item.children != null) {
                this.showMenu = true;
                this.isActive = item.id;
                this.activeCategory = item;
            }
        },
        // Check if child should be displayed
        // always display if it is a manufacturer
        // else display if child is active
        showChild: function (child) {
            if (!('is_active' in child)) {
                return true;
            }

            return child.is_active;
        },

        hideChildren: function () {
            this.showMenu = false;
            this.isActive = null;
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

$megamenu-height: $header-navigation-height-desktop;
$megamenu-background: $darkest-gray;

$megamenu-item-text-transform: none;
$megamenu-item-font-size: 16px;
$megamenu-item-color: $white;
$megamenu-item-line-height: 19px;
$megamenu-item-highlight-size: 0;
$megamenu-item-highlight-color: $primary;

nav {
    background-color: $megamenu-background;
}

.mega-menu-wrp {
    position: relative;
    height: $megamenu-height + $megamenu-item-highlight-size;

    .level-0-wrp {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: $megamenu-height + $megamenu-item-highlight-size;

        .menu-item {
            position: relative;
        }

        .menu-item-link {
            height: $megamenu-item-line-height + $megamenu-item-highlight-size;
            text-transform: $megamenu-item-text-transform;
            font-size: $megamenu-item-font-size;
            line-height: $megamenu-item-line-height;
            margin: 0 45px 0 0;
            border: $megamenu-item-highlight-size solid transparent;
            color: $megamenu-item-color;

            /* Display only one line and cut with '...' */
            -moz-hyphens: auto;
            -ms-hyphens: auto;
            -webkit-hyphens: auto;
            display: block;
            display: -webkit-box;
            hyphens: auto;
            word-wrap: break-word;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;

            &:last-child {
                margin: 0;
            }

            &:after {
                display: block;
                content: attr(name);
                font-weight: bold;
                visibility: hidden;
                overflow: hidden;
                height: 0;

                text-transform: $megamenu-item-text-transform;
                font-size: $megamenu-item-font-size;
                line-height: $megamenu-item-line-height;
            }

            &.active,
            &.nuxt-link-active {
                border-bottom: $megamenu-item-highlight-size solid $megamenu-item-highlight-color;
                font-weight: $font-weight-bold;
            }
        }
    }

    .mega-menu-flyout {
        position: absolute;
        top: $megamenu-item-line-height;
        padding-top: 30px;
        z-index: 20;
        pointer-events: initial;
    }

    .mega-menu-flyout-inner {
        background-color: $background;
        border: 1px solid $border-color;
    }

    .max-width-container {
        max-width: map_get($container-max-widths, xl);
        display: flex;
        margin: 0 auto;
        padding: 15px 20px;
    }

    .children-wrp {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .child-wrp {
        min-width: 200px;
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .child-item {
        width: 100%;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        text-transform: uppercase;
        line-height: 20px;
    }

    .subchild-item {
        width: 100%;
        display: inline-block;
        font-size: 16px;
        line-height: 15px;
    }

    .slide-top-bottom-enter-active,
    .slide-top-bottom-leave-active {
        transition: all 0.1s ease;
    }

    .slide-top-bottom-enter,
    .slide-top-bottom-leave-to {
        top: -500px;
        opacity: 0;
    }

    .slide-top-bottom-enter-to,
    .slide-top-bottom-leave {
        top: $header-height-desktop + 1px;
        opacity: 1;
    }
}
</style>
