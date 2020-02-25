<style>
    .tree-menu-sub {
        min-width: 250px;
    }
</style>

<template>
    <div class="tree-menu bg-white" :class="{ 'tree-menu-sub': depth > 1 }" @mouseleave="showChildren = false">
        <nuxt-link v-if="depth !== 0" :to="itemUrlPath" class="trigger bg-white m-0 w-100 d-flex align-items-center" @mouseover.native="showChildren = true">
            {{ dataItem.name }}
        </nuxt-link>
        <div v-if="(showChildren || depth === 0 || depth > 1) && hasChildren" class="sub-categories md-elevation-4" :class="{'sub-sub-category': depth > 1}">
            <desktop-categories
                v-for="(node,index) of dataItem.children"
                :key="node.id"
                :data-item="node"
                :depth="depth + 1"
                :first-item="index === 0"
            />
        </div>
    </div>
</template>

<script>
    export default {
        name: "DesktopCategories",
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
                showCurrentCategory: true
            }
        },

        computed: {
            hasChildren() {
                return ! _.isEmpty(this.dataItem.children);
            },
            itemUrlPath() {
                let _locale = this.$store.getters['modApiResources/getApiLocale'];

                if(_locale !== 'de') {
                    return '/' + _locale + '/' + this.dataItem.url_path;
                }

                return '/' + this.dataItem.url_path;
            },
            parentName()
            {
                return this.$parent.dataItem.name;
            },
            parentUrlPath() {
                let _locale = this.$store.getters['modApiResources/getApiLocale'];

                if(_locale !== 'de') {
                    return '/' + _locale + '/' + this.$parent.dataItem.url_path;
                }

                return '/' + this.$parent.dataItem.url_path;
            }
        },

        watch: {
            '$route.path': function() {
                // Close menu layer if route changes
                this.showChildren = false;
            }
        },

        methods: {
            toggleChildren(nodes, target) {
                if(nodes) {
                    this.showChildren = !this.showChildren;
                } else {
                    // Go to target url if no subcategories exists
                    // window.open(target);
                }
            },
            closeSubcategory() {
                if(this.depth != 0) {
                    this.$parent.showChildren = false;
                    this.showChildren = false;
                }
            },
            showChildrenOnHover() {
                this.showChildren = true;
                this.$children.showChildren = true;
            }
        }
    }
</script>
