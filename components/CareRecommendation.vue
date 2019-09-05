<template>
  <div class="care-products">
    <div class="product-carousel" v-if="!empty(careProductsArr)">
      <div class="wide-container">
        <product-listing :responsive="responsive" :data-items="careProductsArr" :is-slider="true"></product-listing>
      </div>
    </div>
  </div>
</template>

<script>
  import ProductListing from "./ProductListing";

  export default {
      components: {
          ProductListing
      },

      data() {
          return {
              name: 'CareRecommendation',
              careProductsArr: [],
              responsive: {
                  0: {
                      items: 4,
                      mouseDrag: true,
                      controls: false
                  },
                  500: {
                      items: 7,
                      controls: false,
                      mouseDrag: true
                  },
                  1000: {
                      items: 4,
                      controls: true,
                      mouseDrag: false
                  },
                  1400: {
                      items: 6,
                      controls: true,
                      mouseDrag: false
                  }
              },
          }
      },

      props: {
          productId: {
              type: Number,
              required: true
          }
      },

      created() {
          this.$store.dispatch('modApiResources/getCareProducts', {
              data: this.productId
          }).then(response => {
              this.careProductsArr = response.result.items;
          });
      },

      methods: {
          empty: function(p) {
              return _.isEmpty(p);
          }
      }
  };

</script>
