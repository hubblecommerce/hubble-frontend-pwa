<template>
    <div class="cms-block" :class="blockClass" :style="backgroundStyles">
        <div class="cms-block-container" :style="paddingStyles">
                <component :is="getComponent" :content="content" class="cms-block-container-row row cms-row"/>

        </div>
    </div>
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
          paddingStyles() {
              const {
                  marginTop,
                  marginBottom,
                  marginLeft,
                  marginRight,
              } = this.content;
              return {
                  padding: marginTop + ' ' + marginRight + ' ' + marginBottom + ' ' + marginLeft
              }
          },
          backgroundStyles() {
              const {
                  backgroundColor,
                  backgroundMedia,
              } = this.content;
              return {
                  backgroundColor,
                  backgroundImage: backgroundMedia ? `url(${backgroundMedia.url})` : null,
              };
          }
      }

  }
</script>

<style scoped>

</style>
