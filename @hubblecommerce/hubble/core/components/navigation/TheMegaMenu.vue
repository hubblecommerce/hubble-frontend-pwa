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
            <div v-if="showMenu && activeCategory.children"
                 :class="'fixed-container ' + activeCategory.url_path"
                 ref="megaMenuLayer"
                 @mouseleave="hideChildren"
                 :style="`left: ${layerLeft}px;`"
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
import { mapActions, mapGetters } from 'vuex';
import _ from 'lodash';

export default {
    name: 'TheMegaMenu',

    props: {
        dataItems: {
            type: Array,
            required: true,
        },
    },

    data() {
        return {
            name: 'TheMegaMenu',
            showMenu: false,
            isActive: null,
            activeCategory: {},
            limit: 12,
            layerLeft: 0
        };
    },

    computed: {
        ...mapGetters({
            getApiLocale: 'modApiResources/getApiLocale',
        }),
        rootItem: function () {
            return {
                name: 'root',
                children: this.dataItems,
            };
        },
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
            resetAutoCompleteResults: 'modSearch/resetAutoCompleteResults',
        }),
        toggle: function () {
            this.showMenu = !this.showMenu;
            this.toggleOffcanvasAction({ component: this.name });
        },
        itemUrlPath: function (item) {
            let locale = this.getApiLocale;

            if (locale !== 'de') {
                return '/' + locale + '/' + item.request_path;
            }

            return '/' + item.request_path;
        },
        showChildren: function (item) {
            // Blur background on hover over category with children
            if (this.activeCategory.children !== null) {
                this.showMenu = true;
                this.isActive = item.id;
                this.activeCategory = item;

                this.showOffcanvasAction({ component: this.name });
                this.resetAutoCompleteResults();

                setTimeout(() => {
                    this.setLayerPosition(this.$refs[item.id][0]);
                }, 1);
            } else {
                this.hideOffcanvasAction();
            }
        },
        setLayerPosition: function(triggerElement) {
            const triggerPosition = triggerElement.$el.offsetLeft;
            const parentPosition = triggerElement.$parent.$el.getBoundingClientRect();
            const layerPosition = this.$refs.megaMenuLayer.getBoundingClientRect();

            if((triggerPosition + layerPosition.width) > parentPosition.width) {
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
        }
    },
};
</script>
