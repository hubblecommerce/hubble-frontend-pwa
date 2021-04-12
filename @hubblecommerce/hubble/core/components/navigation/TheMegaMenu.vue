<template>
    <div class="mega-menu-wrp container" @mouseleave="hideChildren">
        <div class="level-0-wrp">
            <template v-for="item in dataItems">
                <div
                    v-if="!item.request_path"
                    :key="item.id"
                    class="menu-item"
                    :class="{ active: isActive === item.id }"
                    @mouseenter="showChildren(item)"
                    v-text="item.name"
                />
                <nuxt-link
                    v-else
                    :key="item.id"
                    :ref="item.id"
                    class="menu-item"
                    :name="item.name"
                    :class="{ active: isActive === item.id }"
                    :to="itemUrlPath(item)"
                    @mouseenter.native="showChildren(item)"
                    v-text="item.name"
                />
            </template>
        </div>

        <transition name="fade">
            <div
                v-if="showMenu && activeCategory.children"
                ref="megaMenuLayer"
                :class="'fixed-container ' + activeCategory.url_path"
                :style="`left: ${layerLeft}px;`"
                @mouseleave="hideChildren"
            >
                <div class="max-width-container">
                    <template>
                        <div class="children-wrp">
                            <div v-for="child in activeCategory.children" v-if="showChild(child)" :key="child.id" class="child-wrp">
                                <div v-if="!child.request_path" class="child-item" v-text="child.name" />
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
        </transition>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
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
            layerLeft: 0,
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
        ...mapActions({
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
            showOffcanvasAction: 'modNavigation/showOffcanvasAction',
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
        }),
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
        toggle: function () {
            this.showMenu = !this.showMenu;
            this.toggleOffcanvasAction({ component: this.name });
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
                this.hideOffcanvasAction();

                setTimeout(() => {
                    this.setLayerPosition(this.$refs[item.id][0]);
                }, 1);
            } else {
                this.hideOffcanvasAction();
            }
        },
        setLayerPosition: function (triggerElement) {
            if (this.$refs.megaMenuLayer == null) {
                return;
            }

            const triggerPosition = triggerElement.$el.offsetLeft;
            const parentPosition = triggerElement.$parent.$el.getBoundingClientRect();
            const layerPosition = this.$refs.megaMenuLayer.getBoundingClientRect();

            if (triggerPosition + layerPosition.width > parentPosition.width) {
                this.layerLeft = parentPosition.width - layerPosition.width;
            } else {
                this.layerLeft = triggerPosition;
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
            this.hideOffcanvasAction();
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

            &.active {
                border-bottom: $megamenu-item-highlight-size solid $megamenu-item-highlight-color;
                font-weight: $font-weight-bold;
            }
        }
    }

    .fixed-container {
        position: absolute;
        top: $megamenu-height + $megamenu-item-highlight-size;
        border: 1px solid $border-color;
        background-color: $background;
        z-index: -1;
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
