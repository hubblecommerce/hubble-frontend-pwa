<template>
    <transition name="slide-in">
        <div class="tree-menu w-100 bg-white">
            <div class="back-tigger">
                <button v-if="depth > 1"
                        class="button-icon"
                        @click="closeSubcategory"
                >
                    <i class="icon icon-chevron-left"></i>
                    <span class="hidden-link-name">{{ $t('Back') }}</span>
                    <material-ripple></material-ripple>
                </button>
            </div>

            <nuxt-link v-if="firstItem && $parent.dataItem.url_path"
                       :to="parentUrlPath"
            >
                <button class="button-primary parent-link m-0 w-100">
                    <span v-if="$mq === 'sm'">{{ $t('Show parent', {parent: parentName}) }} </span>
                    <span v-if="$mq === 'md'">{{ $t('Show all parent', {parent: parentName}) }}</span>
                    <material-ripple></material-ripple>
                </button>
            </nuxt-link>

            <nuxt-link v-if="!hasChildren && dataItem.name"
                       :to="itemUrlPath"
            >
                <div v-if="depth !== 0" class="trigger bg-white m-0 w-100 d-flex justify-content-between align-items-center border-bottom">
                    {{ dataItem.name }}
                </div>
            </nuxt-link>

            <nuxt-link v-if="!hasChildren && dataItem.manufacturer_name"
                       :to="manufacturerUrlPath"
            >
                <div v-if="depth !== 0"
                     class="trigger bg-white m-0 w-100 d-flex justify-content-between align-items-center border-bottom"
                >
                    {{ dataItem.manufacturer_name }}
                </div>
            </nuxt-link>

            <div v-if="depth !== 0 && hasChildren"
                 class="trigger bg-white p-3 m-0 w-100 d-flex justify-content-between align-items-center border-bottom"
                 @click="toggleChildren(dataItem)"
            >
                {{ dataItem.name }} <i class="icon icon-chevron-right"></i>
            </div>
            <transition name="slide-in">
                <div v-if="showChildren || depth === 0 || isInCurrentCategoryPath"
                     class="sub-categories"
                >
                    <mobile-categories
                        v-for="(node,index) of dataItem.children"
                        :key="node.id"
                        :data-item="node"
                        :depth="depth + 1"
                        :firstItem="index === 0"
                    >
                    </mobile-categories>

                    <mobile-categories
                        v-for="(node,index) of dataItem.menu_items"
                        :key="node.id"
                        :data-item="node"
                        :depth="depth + 1"
                        :firstItem="index === 0"
                    >
                    </mobile-categories>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "MobileCategories",
        props: {
            dataItem: {
                type: Object,
                required: true
            },
            depth: {
                type: Number,
                required: true
            },
            firstItem: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                showChildren: false,
                currentCategoryPath: [274],
                isInCurrentCategoryPath: false
            }
        },

        computed: {
            ...mapState({
                clickPath: state => state.modClickPath.clickPath
            }),
            hasChildren: function() {
                return ! _.isEmpty(this.dataItem.children) || ! _.isEmpty(this.dataItem.menu_items);
            },
            itemUrlPath: function() {
                return '/' + this.dataItem.url_path;
            },
            manufacturerUrlPath: function() {
                return '/' + this.dataItem.manufacturer_info_url;
            },
            parentName: function() {
                if(this.$parent.dataItem.heading_title) return this.$parent.dataItem.heading_title;
                return this.$parent.dataItem.name;
            },
            parentUrlPath: function() {
                return '/' + this.$parent.dataItem.url_path;
            }
        },

        created() {
            // Get current category path
            let currentPathElement = this.clickPath.slice(-1)[0];
            let currentCategoryPath = currentPathElement.categoryPath;

            // If current category path is set
            if(!_.isEmpty(currentCategoryPath)) {
                // If current data item is set
                // and current data item id is included in category path
                // and current category has children
                _.forEach(currentPathElement.categoryPath, (val, key) => {
                    if(val.id === this.dataItem.id && typeof this.dataItem.id !== "undefined" && this.hasChildren) {

                        // Open current navigation layer
                        this.isInCurrentCategoryPath = true;
                    }
                });
            }
        },

        methods: {
            toggleChildren: function(nodes) {
                if(nodes.children || nodes.menu_items) {
                    this.showChildren = !this.showChildren;
                }
            },
            closeSubcategory: function() {
                this.$parent.showChildren = false;
                this.showChildren = false;

                this.isInCurrentCategoryPath = false;
                this.$parent.isInCurrentCategoryPath = false;
            },
            showChildrenOnHover: function() {
                this.showChildren = true;
                this.$children.showChildren = true;
            }
        }
    }
</script>
