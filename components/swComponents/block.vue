<template>
    <component :is="getComponent" :content="content" :style="slotStyles" />
</template>

<script>
import {sectionMixins} from './helper'
  export default {
      name: 'Block',

      mixins: [sectionMixins],

      props: {
          content: {
              type: Object,
              default: () => ({})
          }
      },

      computed: {
          getComponent() {
              if(!this.content) return;
              return this.getBlockByType(this.content.type);
          },
          backgroundMediaMode() {
              return this.content.backgroundMediaMode;
          },
          slotStyles() {
              const {
                  backgroundMedia,
              } = this.content;
              return {
                  backgroundImage: backgroundMedia ? `url(${backgroundMedia.url})` : null,
              };
          },
      }

  }
</script>

<style scoped>

</style>
