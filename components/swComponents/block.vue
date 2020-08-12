<template>
    <div class="cms-block" :class="[blockClass, backgroundImageExists, cssClass]" :style="backgroundStyles">
        <div class="cms-block-container" :style="paddingStyles">
            <component :is="getComponent" :content="content" class="cms-block-container-row row cms-row" />
        </div>
    </div>
</template>

<script>
import {sectionMixins} from './helper'
import _ from 'lodash';

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
              return this.getBlockByType(this.content.type);
          },
          paddingStyles() {
              const padding = {
                  top: this.content.marginTop ? this.content.marginTop : 0,
                  right: this.content.marginRight ? this.content.marginRight : 0,
                  bottom: this.content.marginBottom ? this.content.marginBottom : 0,
                  left: this.content.marginLeft ? this.content.marginLeft : 0,
              }

              return {
                  padding: padding.top + ' ' + padding.right + ' ' + padding.bottom + ' ' + padding.left
              };
          },
          cssClass() {
              return this.content.cssClass != null ? this.content.cssClass : '';
          },
          backgroundStyles() {
              const {
                  backgroundColor,
                  backgroundMedia,
                  backgroundMediaMode
              } = this.content;

              return {
                  backgroundColor,
                  backgroundImage: backgroundMedia ? `url(${backgroundMedia.url})` : null,
                  backgroundSize: backgroundMediaMode ? backgroundMediaMode : null,
              };
          },
          backgroundImageExists() {
              const { backgroundMedia } = this.content;

              return backgroundMedia ? 'bg-image' : ''
          }
      },

      created() {
          if (_.includes(this.cssClass, 'revealOnRequest')) {
              this.$store.commit('modCustomComponent/setShowCustomComponentInstead', true)
          }
      }
  }
</script>
