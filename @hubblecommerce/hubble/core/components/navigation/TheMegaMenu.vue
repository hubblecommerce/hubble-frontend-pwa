<template>
    <div class="mega-menu-wrp container">
        <div class="level-0-wrp">
            <template v-for="(item, i) in dataItems">
                <div
                    :key="i"
                    @mouseenter="showChildren(item, $event, i)"
                    @mouseleave="hideChildren"
                    class="menu-item">
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

                    <div v-if="isActive === item.id" class="mega-menu-flyout-indicator" />

                    <transition name="fade">
                        <div
                            v-show="isActive === item.id"
                            ref="megaMenuLayer"
                            :style="{width: `${flyoutDesktopWidth}px`}"
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

                                                <ul v-if="child.children != null" class="subchild-list">
                                                    <template v-for="subchild in child.children">
                                                        <li :key="subchild.id">
                                                            <div v-if="!subchild.request_path" class="subchild-item" v-text="subchild.name" />
                                                            <nuxt-link v-else class="subchild-item" :to="itemUrlPath(subchild)" v-text="subchild.name" />
                                                        </li>
                                                    </template>
                                                </ul>
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
import ApiClient from '@/utils/api-client';
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
            flyoutDesktopWidth: 860
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
            return await new ApiClient(this.$config).apiCall({
                action: 'post',
                endpoint: 'store-api/navigation/main-navigation/main-navigation',
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

        showChildren: function (item, e, i) {
            // Blur background on hover over category with children
            if (item.children != null) {
                this.showMenu = true;
                this.isActive = item.id;
                this.activeCategory = item;
            }

             // Check if flyout would overflow and set transform value to it
            const { target } = e;
            const offsetLeft = target.getBoundingClientRect().left;
            const overflow = (this.flyoutDesktopWidth + offsetLeft) - window.innerWidth;

            if (overflow > 0) this.$refs.megaMenuLayer[i].style.transform = `translateX(-${overflow + 30}px)`;
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
$megamenu-item-font-size: $font-size-base;
$megamenu-item-color: $white;
$megamenu-item-line-height: 19px;
$megamenu-item-highlight-size: 0;
$megamenu-item-highlight-color: $primary;
$megamenu-level-0-margin: 30px;

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
            margin: 0 $megamenu-level-0-margin;
            border: $megamenu-item-highlight-size solid transparent;
            color: $megamenu-item-color;

            text-align: center;
            display: block;
            white-space: nowrap;
            position: relative;

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

            &:hover,
            &.active,
            &.nuxt-link-active {
                border-bottom: $megamenu-item-highlight-size solid $megamenu-item-highlight-color;
                font-weight: $font-weight-bold;
            }

            &.nuxt-link-active {
                color: $primary;

                &::before {
                    content: '';
                    position: absolute;
                    height: 2px;
                    width: 100%;
                    background-color: $megamenu-item-highlight-color;
                    bottom: -13px;
                }
            }
        }

        .menu-item:first-child {
            .menu-item-link {
                margin-left: 0;
            }

            .mega-menu-flyout-indicator {
                transform: translateX(calc(-50% - 10px)) rotate(45deg);
            }
        }

        .menu-item:last-child {
            .menu-item-link {
                margin-right: 0;
            }

            .mega-menu-flyout-indicator {
                transform: translateX(calc(-50% + 10px)) rotate(45deg);
            }
        }

        .mega-menu-flyout-indicator {
            width: 15px;
            height: 15px;
            background-color: white;
            position: absolute;
            bottom: -38px;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            z-index: 101;
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
        box-shadow: $box-shadow;
        box-shadow: $box-shadow, 0 -10px 10px 0 rgba(27,27,36,0.01);
    }

    .max-width-container {
        max-width: map_get($container-max-widths, xl);
        display: flex;
        margin: 0 auto;
        padding: 48px 40px 20px;
    }

    .children-wrp {
        display: flex;
        flex-direction: row;
        width: 100%;
        flex-wrap: wrap;
        overflow-y: hidden;
    }

    .child-wrp {
        width: 33.333%;
        padding-right: 60px;
        margin-bottom: 20px;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            height: 200%;
            width: 1px;
            background: $light-gray;
            top: 0;
            right: 40px;
        }

        &:nth-child(3n) {
            &::after {
                display: none;
            }
        }
    }

    .child-item {
        font-size: $megamenu-item-font-size;
        font-weight: bold;
        line-height: $megamenu-item-line-height;
    }

    .subchild-list {
        margin-top: 12px;
        padding: 0;
        list-style: none;
    }

    .subchild-item {
        display: block;
        font-size: calc(#{$megamenu-item-font-size} - 2px);
        line-height: 24px;
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
