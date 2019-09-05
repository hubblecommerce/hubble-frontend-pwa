<template>
    <transition name="slide-in">
        <div class="tree-menu w-100 bg-white">
            <div class="back-tigger">
                <button class="button-icon" v-if="depth > 1" @click="closeSubcategory">
                    <i class="icon icon-chevron-left"></i>
                    <span class="hidden-link-name">{{$t('Back')}}</span>
                    <material-ripple></material-ripple>
                </button>
            </div>

            <nuxt-link :to="parentUrlPath" v-if="firstItem && $parent.dataItem.url_path">
                <button class="button-primary parent-link m-0 w-100">
                    <span>{{ parentName }} anzeigen</span>
                    <material-ripple></material-ripple>
                </button>
            </nuxt-link>

            <nuxt-link :to="itemUrlPath" v-if="!hasChildren && dataItem.name">
                <div v-if="depth !== 0" class="trigger bg-white m-0 w-100 d-flex justify-content-between align-items-center border-bottom">
                    {{ dataItem.name }}
                </div>
            </nuxt-link>

            <div v-if="depth !== 0 && hasChildren" @click="toggleChildren(dataItem.children)" class="trigger bg-white p-3 m-0 w-100 d-flex justify-content-between align-items-center border-bottom">
                {{ dataItem.name }} <i class="icon icon-chevron-right"></i>
            </div>
            <transition name="slide-in">
                <div class="sub-categories" v-if="showChildren || depth === 0 || isInCurrentCategoryPath">
                    <mobile-categories
                        v-for="(node,index) of dataItem.children"
                        :data-item="node"
                        :depth="depth + 1"
                        :key="node.id"
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
            toggleChildren(nodes) {
                if(nodes) {
                    this.showChildren = !this.showChildren;
                }
            },
            closeSubcategory() {
                this.$parent.showChildren = false;
                this.showChildren = false;

                this.isInCurrentCategoryPath = false;
                this.$parent.isInCurrentCategoryPath = false;
            },
            showChildrenOnHover() {
                this.showChildren = true;
                this.$children.showChildren = true;
            }
        },

        computed: {
            ...mapState({
                clickPath: state => state.modClickPath.clickPath
            }),
            hasChildren() {
                return ! _.isEmpty(this.dataItem.children);
            },
            itemUrlPath() {
                return '/' + this.dataItem.url_path;
            },
            parentName() {
                return this.$parent.dataItem.name;
            },
            parentUrlPath() {
                return '/' + this.$parent.dataItem.url_path;
            }
        }
    }
</script>
