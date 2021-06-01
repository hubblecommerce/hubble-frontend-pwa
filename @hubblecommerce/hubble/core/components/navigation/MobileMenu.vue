<template>
    <transition name="slide-in">
        <div class="tree-menu">
            <div
                v-if="depth > 1"
                class="back-trigger"
                @click="closeSubcategory"
            >
                <svg-icon icon="chevron-left" />
            </div>

            <nuxt-link v-if="firstItem && $parent.dataItem.request_path" :to="parentUrlPath">
                <hbl-button class="button-primary parent-link">
                    <span>{{ `Show all ${parentName}` }}</span>
                </hbl-button>
            </nuxt-link>

            <nuxt-link v-if="!hasChildren && dataItem.name" :to="itemUrlPath">
                <div v-if="depth !== 0" class="trigger">
                    {{ dataItem.name }}
                </div>
            </nuxt-link>

            <nuxt-link v-if="!hasChildren && dataItem.manufacturer_name" :to="manufacturerUrlPath">
                <div v-if="depth !== 0" class="trigger">
                    {{ dataItem.manufacturer_name }}
                </div>
            </nuxt-link>

            <div v-if="depth !== 0 && hasChildren" class="trigger" @click="toggleChildren(dataItem)">
                {{ dataItem.name }} <svg-icon icon="chevron-right" />
            </div>

            <transition name="slide-in">
                <div v-if="showChildren || depth === 0 || isInCurrentCategoryPath" class="sub-categories">
                    <mobile-menu
                        v-for="(node, index) of dataItem.children"
                        :key="node.id"
                        :data-item="node"
                        :depth="depth + 1"
                        :first-item="index === 0"
                    />

                    <mobile-menu
                        v-for="(node, index) of dataItem.menu_items"
                        :key="node.id"
                        :data-item="node"
                        :depth="depth + 1"
                        :first-item="index === 0"
                    />
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'MobileMenu',

    props: {
        dataItem: {
            type: Object,
            required: true,
        },
        depth: {
            type: Number,
            required: true,
        },
        firstItem: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            showChildren: false,
            isInCurrentCategoryPath: false,
        };
    },

    computed: {
        hasChildren: function () {
            return this.dataItem.children != null || this.dataItem.menu_items != null;
        },
        itemUrlPath: function () {
            return '/' + this.dataItem.request_path;
        },
        manufacturerUrlPath: function () {
            return '/' + this.dataItem.manufacturer_info_url;
        },
        parentName: function () {
            if (this.$parent.dataItem.heading_title) {
                return this.$parent.dataItem.heading_title;
            }
            return this.$parent.dataItem.name;
        },
        parentUrlPath: function () {
            return '/' + this.$parent.dataItem.request_path;
        },
    },

    created() {},

    methods: {
        toggleChildren: function (nodes) {
            if (nodes.children || nodes.menu_items) {
                this.showChildren = !this.showChildren;
            }
        },
        closeSubcategory: function () {
            this.$parent.showChildren = false;
            this.showChildren = false;

            this.isInCurrentCategoryPath = false;
            this.$parent.isInCurrentCategoryPath = false;
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.menu-wrapper {
    > .container {
        > .tree-wrp {
            > .tree-menu {
                > .sub-categories {
                    position: absolute;
                    top: 0;
                }
            }
        }
    }
}

.tree-menu {
    width: 100%;
    margin-left: 0;
}

.trigger {
    position: relative;
    z-index: 1;
    cursor: pointer;
    font-size: 14px;
    font-weight: $font-weight-bold;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    padding: 16px 16px;
    border-bottom: 1px solid $border-color;
    display: flex;

    img {
        vertical-align: top;
        margin-left: auto;
    }

    .icon {
        margin-left: auto;
    }
}

.parent-link {
    width: 100%;
}

.sub-categories {
    position: fixed;
    width: 100%;
    height: calc(100vh - 56px);
    top: 56px;
    z-index: 6;
    overflow-y: scroll;
    background-color: $background;

    .parent-link {
        color: white;
        height: 54px;
    }

    .back-trigger {
        img {
            vertical-align: middle;
        }
    }
}

.sub-categories:before {
    content: '';
    width: 100%;
    height: 100%;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

.back-trigger {
    position: fixed;
    top: 0;
    right: 15px;
    z-index: 1;
    height: 56px;
    display: flex;

    .button-icon {
        font-size: 25px;
    }
}

.slide-in-enter-active,
.slide-in-leave-active {
    transition: all 0.2s ease;
}

.slide-in-enter,
.slide-in-leave-to {
    left: 100%;
}

.slide-in-enter-to,
.slide-in-leave {
    left: 0;
}

@media (min-width: 768px) {
    .tree-menu {
        position: static;

        .back-tigger {
            top: 20px;
        }
    }

    .menu-wrapper {
        > .container {
            > .tree-wrp {
                > .tree-menu {
                    height: calc(100vh - 81px);

                    > .sub-categories {
                        position: absolute;
                        top: 0;
                        width: 100%;
                    }
                }
            }
        }
    }

    .sub-categories {
        position: absolute;
        top: 51px;
        width: 100%;
        height: calc(100vh - 81px);
    }
}

@media (min-width: 1024px) {
    .tree-wrp {
        /* First Level Menu */
        > .tree-menu {
            > .sub-categories {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;
                position: relative;
                height: auto;
                top: 0;
                margin-left: auto;
                width: 100%;
                background-color: #fff;

                box-shadow: none;
                border: none;

                > .tree-menu {
                    width: auto;
                    flex: 1;
                    // min-width: 150px;

                    > .trigger {
                        border: none;
                        text-transform: uppercase;
                        background-color: #fff !important;
                        padding: 12px !important;
                        justify-content: center !important;
                    }
                }
            }
        }
    }

    .tree-menu {
        display: flex;
        flex-direction: column;
        height: auto;
        opacity: 1;
        width: auto;
    }

    .trigger {
        padding: 12px !important;
        font-size: 16px;
        color: $accent !important;
        font-weight: $font-weight-medium;
        text-transform: none;

        &:hover {
            text-decoration: none !important;
            color: $primary !important;
        }
    }

    .sub-categories {
        width: 100%;
        height: auto;
        max-height: 500px;

        display: flex;
        justify-content: space-around;
        flex-direction: row;
        flex-wrap: wrap;

        top: 45px;
        left: 0;

        background-color: #f5f5f5;
        border: 1px solid $border-color;
        box-shadow: 1px 6px 17px -5px rgba(0, 0, 0, 0.38);

        &:before {
            display: none;
        }

        > .tree-menu {
            width: auto;
            flex: 1;
            flex-wrap: wrap;
            // min-width: 250px;

            > .trigger {
                background-color: #f5f5f5 !important;
                padding: 20px 12px !important;
                transition: all 0.2s ease-in-out;
                justify-content: center;

                &:hover {
                    background-color: #fff !important;
                }
            }
        }
    }

    .sub-sub-category {
        display: none;
        position: relative;
        flex-direction: column;
        top: 0;
        border: none;
        padding-left: 30px;

        .trigger {
            padding: 0 !important;
            font-size: 12px !important;
        }
    }

    .slide-in-enter,
    .slide-in-leave-to {
        margin-left: 0;
        opacity: 0;
    }

    .slide-in-enter-to,
    .slide-in-leave {
        margin-left: 0;
        opacity: 1;
    }
}
</style>
