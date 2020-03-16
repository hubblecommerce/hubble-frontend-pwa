<template>
    <div :class="sectionClasses" class="container">
        <div v-if="hasSidebar" class="sidebar-class col-lg-4 col-xl-3">
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
</template>

<script>
import Block from './block';

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
        sectionClasses() {
            return {
                'sw-blocks': this.isBlock,
                'sw-slots': !this.isBlock,
                'has-sidebar': this.hasSidebar,
                'cms-section-sidebar': this.hasSidebar,
                'row': this.hasSidebar
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

<style lang="scss" scoped>
/*.sidebar-class {
    display: flex;
    width: 100%;
    height: 100%;
    //justify-content: center;
    flex-direction: column;
}

.has-sidebar {
    display: flex;
    flex-direction: column;
    position: relative;
}

.sw-blocks {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
}

@media (min-width: 1024px) {
    !*.sw-blocks {
            &:nth-child(2) > div:nth-child(1) {
                min-height: 50vh;
                margin-top: 20px;
                //border-right: 1px solid black; // change to border color
            }
        }*!
    .has-sidebar {
        flex-direction: row;
    }
}*/
</style>
