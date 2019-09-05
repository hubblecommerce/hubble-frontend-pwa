<template>
  <div class="img-lazy-wrp">
    <img
        :data-src="dataSrc"
        :data-srcset="srcSet"
        :style="style"
        class="LazyImage"
        :class="compClasses"
        ref="productImage"
        :alt="altInfo"
    >
    <transition name="fade">
      <div class="loader lds-ellipsis" v-if="loading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </transition>
  </div>
</template>

<script>
//
// https://markus.oberlehner.net/blog/lazy-loading-responsive-images-with-vue/
//
import lozad from 'lozad';

export default {
  name: 'LazyImage',
  props: {
    backgroundColor: {
      type: String,
      default: '#fff',
    },
    height: {
      type: Number,
      default: null,
    },
    width: {
      type: Number,
      default: null,
    },
    classes: {
      type: String,
      default: ''
    },
    src: {
      type: String,
      default: null,
      required: true
    },
    srcSet: {
      type: String,
      default: null,
    },
    altInfo: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      loading: true,
      dataSrc: ''
    };
  },
  watch: {
    // Refresh image if src changes in case of dynamic image components like product swatches
    src: function(src) {
        this.dataSrc = src;
        this.$refs.productImage.src = src;
    }
  },
  created() {
    this.dataSrc = this.src;
  },
  computed: {
    aspectRatio() {
      // Calculate the aspect ratio of the image
      // if the width and the height are given.
      if (!this.width || !this.height) return null;

      return (this.height / this.width) * 100;
    },
    style() {
      // The background color is used as a
      // placeholder while loading the image.
      // You can use the dominant color of the
      // image to improve perceived performance.
      // See: https://manu.ninja/dominant-colors-for-lazy-loading-images/
      const style = { backgroundColor: this.backgroundColor };

      if (this.width) style.width = `${this.width}px`;

      // If the image is still loading and an
      // aspect ratio could be calculated, we
      // apply the calculated aspect ratio by
      // using padding top.
      const applyAspectRatio = this.loading && this.aspectRatio;
      if (applyAspectRatio) {
        // Prevent flash of unstyled image
        // after the image is loaded.
        style.height = 0;
        // Scale the image container according
        // to the aspect ratio.
        style.paddingTop = `${this.aspectRatio}%`;
      }

      return style;
    },
    compClasses: function() {

      if(this.loading) {
        return this.classes + ' loading';
      }

      return this.classes;
    }
  },
  mounted() {
    // As soon as the <img> element triggers
    // the `load` event, the loading state is
    // set to `false`, which removes the apsect
    // ratio we've applied earlier.

    const setLoadingState = () => {
      this.loading = false;
    };
    this.$refs.productImage.addEventListener('load', setLoadingState);
    // We remove the event listener as soon as
    // the component is destroyed to prevent
    // potential memory leaks.
    this.$once('hook:destroyed', () => {
      if(this.$refs.productImage) {
        this.$refs.productImage.removeEventListener('load', setLoadingState);
      }
    });

    // We initialize Lozad.js on the root
    // element of our component.
    const observer = lozad(this.$refs.productImage, {
      rootMargin: '200px 0px'
    });
    observer.observe();
  },
};
</script>
