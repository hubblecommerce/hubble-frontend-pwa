<template>
    <div :class="[sectionType, sectionPadding, background]" class="container cms-section" :style="getBackgroundStyles">
        <div :class="[sectionClasses, sectionType, mobileSidebarBehavior, sizingMode]">
            <div v-if="hasSidebar" class="cms-section-sidebar-sidebar-content col-lg-4 col-xl-3">
                <Block
                    v-for="sidebarSlot in sidebarSlots"
                    :key="sidebarSlot.id"
                    :content="sidebarSlot"
                />
            </div>

            <div class="" :class="elementClasses">
                <Block
                    v-for="cmsSlot in elementsSlots"
                    :key="cmsSlot.id"
                    :content="cmsSlot"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Block from './block';
import _ from 'lodash';

export default {
    name: 'Section',

    components: {
        Block
    },

    props: {
        content: {
            type: Object,
            default: () => ({})
        }
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
            _.forEach(this.cmsSlots, slot => {
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
            _.forEach(this.cmsSlots, slot => {
                if (
                    slot.sectionPosition &&
                    slot.sectionPosition === 'sidebar'
                ) {
                    sidebarSlots.push(slot);
                }
            });
            return sidebarSlots;
        },
        hasSidebar() {
            return this.content && this.content.type === 'sidebar';
        },
        getSizingMode () {
            return this.content.sizingMode;
        },
        getMobileBehavior () {
            return this.content.mobileBehavior;
        },
        getBackgroundMediaUrl () {
            if (_.isEmpty(this.content.backgroundMedia)) return null;
            return this.content.backgroundMedia.url;
        },
        getBackgroundMedia () {
            return this.content.backgroundMedia;
        },
        getBackgroundMediaMode () {
            return this.content.backgroundMediaMode;
        },
        getBackgroundColor () {
            if (!this.content.backgroundColor) return null;
            return this.content.backgroundColor;
        },
        backgroundImageExists() {
            const { backgroundMedia } = this.content;

            return backgroundMedia ? 'bg-image' : ''
        },
        getBackgroundStyles () {
            return {
                backgroundColor: this.getBackgroundColor ? this.getBackgroundColor : null,
                backgroundImage: this.getBackgroundMediaUrl  ? `url(${this.getBackgroundMediaUrl})` : null,
                backgroundSize: this.getBackgroundMediaMode ? this.getBackgroundMediaMode : null
            }
        },
        mobileSidebarBehavior () {
            return {
                'cms-section-sidebar-mobile-hidden': this.getMobileBehavior === 'hidden',
                'cms-section-sidebar-mobile-wrap': this.getMobileBehavior === 'wrap'
            }
        },
        sizingMode () {
            return {
                'boxed': this.getSizingMode === 'boxed',
                'full-width': this.getSizingMode === 'full_width'
            }
        },
        sectionType () {
            return {
                'cms-section-sidebar': this.hasSidebar,
                'cms-section-default': !this.hasSidebar,
            }
        },
        sectionPadding () {
            return {
                'cms-section__padding': true
            }
        },
        background () {
          return {
              'bg-image': this.getBackgroundMediaUrl  !== null,
              'bg-color': this.getBackgroundColor !== null
          }
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
                'col-lg-8': this.hasSidebar,
                'col-xl-9': this.hasSidebar,
                'cms-section-sidebar-main-content': this.hasSidebar,

                'cms-section-default': !this.hasSidebar
            };
        }
    }
};
</script>

<style lang="scss">
    .cms-section__padding {
        padding-bottom: 50px;
        padding-top: 50px;
    }

    @media(max-width: 768px) {
        .cms-section-sidebar-mobile-hidden {
            .cms-section-sidebar-sidebar-content {
                display: none;
            }
        }
    }
</style>
