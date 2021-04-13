<template>
    <div :class="[sectionType, sectionPadding, background]" class="cms-section" :style="getBackgroundStyles">
        <div :class="[sectionClasses, sectionType, mobileSidebarBehavior, sizingMode]">
            <div class="cms-section-sidebar-sidebar-content">
                <client-only>
                    <div v-if="hasSidebar && $mq === 'lg'">
                        <block v-for="sidebarSlot in sidebarSlots" :key="sidebarSlot._uniqueIdentifier" :content="sidebarSlot" />
                    </div>
                </client-only>
            </div>

            <div :class="elementClasses">
                <intersection-wrapper v-for="cmsSlot in elementsSlots" :key="cmsSlot._uniqueIdentifier" :count="count" :cms-slot="cmsSlot" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SwSection',

    props: {
        content: {
            type: Object,
            default: () => ({}),
        },
        count: {
            type: Number,
            required: false,
            default: null,
        },
    },

    computed: {
        isBlock() {
            return this.content.blocks && this.content.blocks.length;
        },
        cmsSlots() {
            const key = this.isBlock ? 'blocks' : 'slots';
            return this.content && this.content[key] ? this.content[key] : [];
        },
        elementsSlots() {
            let elementsSlots = [];
            this.cmsSlots.forEach((slot) => {
                if (slot.sectionPosition && slot.sectionPosition === 'main') {
                    elementsSlots.push(slot);
                } else if (!slot.sectionPosition) {
                    elementsSlots.push(slot);
                }
            });
            return elementsSlots;
        },
        sidebarSlots() {
            let sidebarSlots = [];
            this.cmsSlots.forEach((slot) => {
                if (slot.sectionPosition && slot.sectionPosition === 'sidebar') {
                    sidebarSlots.push(slot);
                }
            });
            return sidebarSlots;
        },
        hasSidebar() {
            return this.content && this.content.type === 'sidebar';
        },
        getSizingMode() {
            return this.content.sizingMode;
        },
        getMobileBehavior() {
            return this.content.mobileBehavior;
        },
        getBackgroundMediaUrl() {
            if (this.content.backgroundMedia === null) {
                return null;
            }
            return this.content.backgroundMedia.url;
        },
        getBackgroundMedia() {
            if (this.content.backgroundMedia === null) {
                return null;
            }
            return this.content.backgroundMedia;
        },
        getBackgroundMediaMode() {
            return this.content.backgroundMediaMode;
        },
        getBackgroundColor() {
            if (!this.content.backgroundColor) return null;
            return this.content.backgroundColor;
        },
        backgroundImageExists() {
            const { backgroundMedia } = this.content;

            return backgroundMedia ? 'bg-image' : '';
        },
        getBackgroundStyles() {
            return {
                backgroundColor: this.getBackgroundColor ? this.getBackgroundColor : null,
                backgroundImage: this.getBackgroundMediaUrl ? `url(${this.getBackgroundMediaUrl})` : null,
                backgroundSize: this.getBackgroundMediaMode ? this.getBackgroundMediaMode : null,
            };
        },
        mobileSidebarBehavior() {
            return {
                'cms-section-sidebar-mobile-hidden': this.getMobileBehavior === 'hidden',
                'cms-section-sidebar-mobile-wrap': this.getMobileBehavior === 'wrap',
            };
        },
        sizingMode() {
            return {
                'boxed': this.getSizingMode === 'boxed',
                'full-width': this.getSizingMode === 'full_width',
            };
        },
        sectionType() {
            return {
                'cms-section-sidebar': this.hasSidebar,
                'cms-section-default': !this.hasSidebar,
            };
        },
        sectionPadding() {
            return {
                'cms-section__padding': true,
            };
        },
        background() {
            return {
                'bg-image': this.getBackgroundMediaUrl !== null,
                'bg-color': this.getBackgroundColor !== null,
            };
        },
        sectionClasses() {
            return {
                'sw-blocks': this.isBlock,
                'sw-slots': !this.isBlock,

                'row': this.hasSidebar,
            };
        },

        // elementClasses if element has sidebar, same bootstrap col as shopware
        elementClasses() {
            return {
                'cms-section-sidebar-main-content': this.hasSidebar,

                'cms-section-default': !this.hasSidebar,
            };
        },
    },
};
</script>

<style lang="scss">
/*
CMS sections
==============================================
General styling for cms sections
*/
@import '~assets/scss/hubble/variables';

.cms-section {
    overflow: hidden;

    &.bg-image {
        background-repeat: no-repeat;
        background-position: 50%;
    }

    .cms-section-sidebar {
        display: flex;
    }
}

.cms-section__padding {
    padding-bottom: 0;
    padding-top: 0;
}

.cms-section-sidebar-sidebar-content {
    width: 100%;
    padding: 0 15px;
}

.cms-section-sidebar-main-content {
    width: 100%;
    padding: 0 15px;
}

@media (min-width: 1024px) {
    .cms-section-sidebar-sidebar-content {
        width: 285px;
    }

    .cms-section-sidebar-main-content {
        width: calc(100% - 285px);
    }
}

@media (max-width: 1024px) {
    .cms-section-sidebar-mobile-hidden {
        .cms-section-sidebar-sidebar-content {
            display: none;
        }
    }
}
</style>
