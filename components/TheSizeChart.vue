<template>
  <div class="size-chart">
    <div class="size-chart-link link-primary" @click="toggle()"> {{ $t('Open size chart') }} </div>

    <transition-expand-layer :rightLeft="true">
      <div v-if="showLayer" class="transition-expand-wrp">
        <div class="container expand-content">

          <div class="row overlay-header">
            <button class="button-icon button-close-menu" @click="toggle()">
              <i class="icon icon-close" aria-hidden="true"></i>
              <material-ripple></material-ripple>
            </button>
            <div class="overlay-headline" v-text="$t('Size chart')"></div>
          </div>

          <tabs class="category-tabs md-elevation-2" :defaultTab="setCategoryId">
            <tab v-for="(item, id) in this.table"
                 :key="id"
                 class="category-item"
                 :name="item.name"
                 >
              <div class="size-table-container tab-content p-3" >
                <table v-for="section in item.sections">
                  <tr v-for="row in section.rows">
                    <td>
                      <img class="country-flag-img" :src="routeUrlFlag(row.country_flag)" :alt="row.country_flag"/>
                    </td>
                    <td v-if="row.logo">
                      <img class="company-logo" :src="routeUrlLogo(row.logo)" :alt="row.logo"/>
                    </td>
                    <td v-else> <span class="country-size-label headline-4"> {{ row.label }} </span> </td>
                    <td v-for="key in row.values"> <span class="size-value"> {{ key.label}} <sup> {{ key.label_sup}} </sup> </span> </td>
                  </tr>
                </table>
              </div>
            </tab>
          </tabs>

        </div>
      </div>
    </transition-expand-layer>
  </div>
</template>

<script>
    import { mapState } from 'vuex'
    import Tabs from "./Tabs";
    import Tab from "./Tab";

    export default {
        components: {
            Tab,
            Tabs,
        },

        data() {
            return {
                name: 'TheSizeChart',
                table: [],
            }
        },

        created() {
            //console.log(this.productData.facets.category_facets[0]['value_id']);
          fetch('/sizeTable.json')
              .then(response => response.json())
              .then( data => {
                  this.table = data;
              });
        },

        computed: {
            ...mapState({
                dataProduct: state => state.modApiResources.dataProduct,
                offcanvas: state => state.modNavigation.offcanvas,
            }),
            productData() {
                if(_.isEmpty(this.dataProduct)) {
                    return this.dataProduct;
                }

                return this.dataProduct.result.item;
            },
            showLayer: function() {
                if(this.offcanvas.component === this.name) {
                    return true;
                }
                return false;
            },
            currentId() {
                return this.productData.facets.category_facets[0]['value_id'];
            },
            setCategoryId() {
                switch(this.currentId) {
                    case 254:
                        return 0;
                        break;
                    case 274:
                        return 1;
                        break;
                    case 292:
                        return 2;
                        break;
                    default:
                        return null;
                }
            }
        },

        methods: {
            toggle: function() {
                this.$store.dispatch('modNavigation/toggleOffcanvasAction', {
                    component: this.name,
                    direction: 'rightLeft'
                });
            },
            routeUrlFlag(image) {

                // If customer domain isset get live images
                if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {

                    //let _letters = _.split(image, '', 2)
                    let _reference = _.join([
                        process.env.CUSTOMER_DOMAIN,
                        'images/size_table',
                        // 'media/catalog/product',
                        // _letters[0],
                        // _letters[1],
                        image
                    ], '/');
                    return _reference;
                }

                // If no customer domain isset get images from api
                // let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                // return _path + '/images/catalog/product/180x/' + image;
            },
            routeUrlLogo(image) {

                // If customer domain isset get live images
                if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {

                    //let _letters = _.split(image, '', 2)
                    let _reference = _.join([
                        process.env.CUSTOMER_DOMAIN,
                        'images/size_table',
                        // 'media/catalog/product',
                        // _letters[0],
                        // _letters[1],
                        image
                    ], '/');
                    return _reference;
                }

                // If no customer domain isset get images from api
                // let _path = _.trim(process.env.config.IMG_BASE_URL, '/');
                // return _path + '/images/catalog/product/180x/' + image;
            },
        },
    }
</script>
