<template>
    <div :class="slotClass">
        <div v-if="hasSidebar" class="sidebar-class col-lg-4 col-xl-3">
            <Block
                v-for="sidebarSlot in sidebarSlots"
                :key="sidebarSlot.id"
                :content="sidebarSlot"
                :style="slotStyles"
            />
        </div>
        <div class="elements">
            <Block
                v-for="cmsSlot in elementsSlots"
                :key="cmsSlot.id"
                :content="cmsSlot"
                :style="slotStyles"
                :class="elementClasses"
            />
        </div>
    </div>
</template>

<script>
import Block from "./Block";


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
              return this.content.blocks && this.content.blocks.length
          },
          cmsSlots() {
              const key = this.isBlock ? 'blocks' : 'slots'
              return this.content && this.content[key] ? this.content[key] : []
          },
          elementsSlots() {
              let elementsSlots = [];
              _.forEach(this.cmsSlots, (slot) => {
                  if(slot.sectionPosition && slot.sectionPosition === 'main') {
                      elementsSlots.push(slot);
                  } else if(!slot.sectionPosition) {
                      elementsSlots.push(slot);
                  }
              });
              return elementsSlots;
          },
          sidebarSlots() {
              let sidebarSlots = [];
              _.forEach(this.cmsSlots, (slot) => {
                  if(slot.sectionPosition && slot.sectionPosition === 'sidebar') {
                      sidebarSlots.push(slot);
                  }
              });
              return sidebarSlots;
          },
          slotStyles() {
              const {
                  marginTop,
                  marginBottom,
                  marginLeft,
                  marginRight,
                  backgroundColor
              } = this.content
              return {
                  marginTop,
                  marginBottom,
                  marginLeft,
                  marginRight,
                  backgroundColor
              }
          },
          hasSidebar() {
              return this.content && this.content.type === 'sidebar'
          },
          slotClass() {
              return {
                  'sw-blocks': this.isBlock,
                  'sw-slots': !this.isBlock,
                  'has-sidebar': this.hasSidebar
              }
          },
          // elemt classes if element has sidebar, same bootstrap col as shopware
          elementClasses() {
              return {
                  'col-lg-8': this.hasSidebar,
                  'col-xl-9': this.hasSidebar
              }
          }
      }

  }
</script>

<style lang="scss">
    .sidebar-class {
        display: flex;
        width: 100%;
        justify-content: center;
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
    }

    @media(min-width: 1024px) {
        /*.sw-blocks {
            &:nth-child(2) > div:nth-child(1) {
                min-height: 50vh;
                margin-top: 20px;
                //border-right: 1px solid black; // change to border color
            }
        }*/
        .has-sidebar {
            flex-direction: row;
        }
    }
</style>
