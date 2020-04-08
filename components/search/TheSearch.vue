<template>
  <div class="search-wrapper">
    <form v-click-outside="clearQuery" id="search_mini_form" action="#">
      <div class="input-wrp">
        <div class="hbl-input-group">
          <input
            id="autocomplete-search"
            ref="search"
            :placeholder="$t('Search')"
            v-model="query"
            :disabled="queryIsDisabled"
            autocomplete="off"
            type="text"
            name="term"
            value=""
            @keyup.esc="clearQuery"
            @focus="onFocus"
          >

          <span class="highlight"/>

          <label class="hidden-link-name" for="autocomplete-search">{{ $t('Search') }}</label>
        </div>

        <button class="button-icon" type="submit" title="Search" @click.prevent="clearQuery">
          <div class="hidden-link-name">Search</div>

          <i v-if="!focus" class="icon icon-search"/>

          <i v-if="focus" class="icon icon-close"/>

          <material-ripple/>
        </button>
      </div>

      <transition name="fade">
        <div v-if="showResults" class="search-autocomplete" @mouseenter="blurInput">
          <div v-for="(groupItem, groupItemIndex) in groups" :key="groupItemIndex" class="result-col">
            <div v-for="(group, groupIndex) in groupItem.items" id="livesearch-box-wrapper" :key="groupIndex" class="container">
                <div class="row">
                  <div class="col-6 text-left">
                    <div class="group-headline" v-html="$t(group.meta.label)+' (' + group.stats.total + ')'"/>
                  </div>

                  <div class="col-6 text-right">
                    <div v-if="group.meta.name === 'catalog_product'" class="show-result-link" @mousedown="doCatalogSearchGrouped(group)" v-text="$t('Show all results')"></div>
                  </div>
                </div>

                <product-listing v-if="group.meta.name === 'catalog_product'" :data-items="group.items"/>

                <div v-else v-for="(item, itemIndex) in group.items"
                  :key="itemIndex"
                  class="result-item border-bottom d-flex align-items-center pt-3 pb-3 row"
                  @mousedown="selectItem(item, group)">
                  <div v-if="item.image" class="col-4">
                    <div class="image-wrapper border">
                      <img :src="itemImgPath(group, item)" class="img-minicart" >
                    </div>
                  </div>

                  <div class="col-8">
                    <div v-html="highlight(item, 'name')"/>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="showNoResults" class="search-autocomplete md-elevation-2 no-results">
          <div class="search-autocomplete-results">
            <div class="container">
              <div class="row">
                <div class="col-12">
                  <span class="no-results"> {{$t('No search results for:')}} <i>{{ query }}</i></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </form>
  </div>
</template>

<script>

    import { mapGetters, mapMutations } from'vuex';
    export default {
  name: 'TheSearch',

  data() {
    return {
      showSearch: false,
      query: '',
      queryMinLength: 2,
      queryIsTyping: false,
      queryIsDisabled: false,
      queryIsSearching: false,
      queryShowResults: false,
      items: false,
      groups: false,
      stats: false,
      dataImageFilter: null,
      origImageFilter: '60x',
      focus: false
    }
  },

  computed: {
      ...mapGetters({
          getApiLocale: 'modApiResources/getApiLocale'
      }),
    locale() {
      return this.getApiLocale;
    },
    imgFilter() {
      return this.dataImageFilter ? this.dataImageFilter : this.origImageFilter
    },
    showResults() {
      // should also count items!
      return (
        this.queryShowResults && (this.stats && this.stats.total ? true : false)
      )
    },
    showNoResults() {
      // should also count items!
      return (
        this.queryShowResults && (this.stats && this.stats.total ? false : true)
      )
    },
    queryShowReset() {
      return this.query.length >= this.queryMinLength || this.queryShowResults
    },
    searchIndicator: function() {
      if (this.queryIsSearching) {
        return '⟳ Fetching new results'
      } else if (this.queryIsTyping) {
        return '... Typing'
      } else {
        return '✓ Done'
      }
    }
  },

  watch: {
    query: function() {
      this.queryIsTyping = true;

      this.doSearch();
    }
  },

  methods: {
      ...mapMutations({
          hideOffcanvas: 'modNavigation/hideOffcanvas'
      }),
    bye() {
      this.showSearch = false;

      this.queryShowResults = false;

      this.query = '';
    },
    toggle() {
      this.showSearch = !this.showSearch;

      // Set focus on search input after component is opened
      if (this.showSearch) {
        this.$nextTick(() => this.$refs.search.focus());
      }
    },
    onFocus() {
      this.hideOffcanvas();
      if (this.queryIsDisabled) {
        return
      }

      this.focus = true;

      if (this.query.length) {
        this.queryShowResults = true;
      }
    },
    clearQuery() {
      this.focus = false;
      this.query = '';
      this.queryShowResults = false;
    },
    itemUrl(item) {
      let _url = '';

      // cms_pages (simplified)
      if (item.identifier) {
        _url = item.identifier;
      }
      // product or category items url
      else {
        _url = item.url_pds ? item.url_pds : item.url_path;
      }

      if (this.locale !== 'de') {
        return '/' + this.locale + '/' + _url;
      }

      return '/' + _url;
    },
    itemImgPath(group, item) {
      // If customer domain isset get live images
      if(!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
        let _path = _.trim(process.env.config.IMG_BASE_URL, '/');

        if (group.meta.name === 'catalog_product') {
          let image = item.image;

          return _.join(
              [
                  process.env.CUSTOMER_DOMAIN,
                  'images/catalog/thumbnails/cache/400',
                  image
              ],
              '/'
          )
        }

        if (group.meta.name === 'catalog_category') {
          let image = item.image;

          return _.join(
              [
                  process.env.CUSTOMER_DOMAIN,
                  'images/catalog/thumbnails/cache/400',
                  image
              ],
              '/'
          );
        }

        return _path;
      }

      // If no customer domain isset get images from api
      let _path = _.trim(process.env.config.IMG_BASE_URL, '/');

      if(group.meta.name === 'catalog_product')
        _path += '/images/catalog/product/'+ this.imgFilter +'/' + item.image;

      if(group.meta.name === 'catalog_category')
        _path += '/images/catalog/category/'+ this.imgFilter +'/' + item.image;

      return _path;
    },
    selectItem(item, group) {
      let _route = {
        path: this.itemUrl(item)
      };

      // bye search
      this.bye();

      // push target to vuex router
      this.$router.push(_route);
    },
    doSearch: _.debounce(function() {
      let _vue = this;

      let _endpoint = '/api/json/search/autocomplete';

      // stop typing ...
      _vue.queryIsTyping = false;

      // return in case of too short
      if (_vue.query.length < _vue.queryMinLength) {
        return;
      }

      // stop searching ...
      _vue.queryIsSearching = true;

      //Insert axios get call here
      _vue.$store.dispatch('apiCall', {
          action: 'get',
          tokenType: 'api',
          apiType: 'data',
          endpoint: _endpoint,
          params: {
              _term: _vue.query
          }
      }, { root: true })
        .then(response => {
          _vue.queryIsSearching = false;

          //let data = {}

          _vue.items = response.data.result.groups;
          _vue.stats = response.data.result.stats;
          _vue.queryShowResults = true;

          _vue.groupResults()
        })
        .catch(error => {
          console.log('error retrieving data!')
        })
    }, 350), // END doSearch
    doCatalogSearch() {
      if (_.isEmpty(this.query)) {
        return false;
      }

      let _url = this.localePath('search-catalogsearch');

      let _route = {
        path: _url,
        query: {
          term: this.query
        }
      };

      // bye search
      this.bye();

      this.$router.push(_route)
    },
    doCatalogSearchGrouped(group) {
      // only if
      if (group.meta.name == 'catalog_product') {
        // do catalog search
        this.doCatalogSearch();
      }
    },
    highlight(item, field) {
      if (!this.query) {
        return item[field]
      }

      // elasticsearch highlight (1st field only)
      if (!_.isEmpty(item.highlighted)) {
        return _.values(item.highlighted)[0][0];
      }

      // try javascript highlighning on query string
      return item[field].replace(new RegExp(this.query, 'gi'), match => {
        return '<span class="highlight">' + match + '</span>';
      })
    },
    getGroupHeadline(item) {
      // assemble headline content
      let _headline =
        '<h3>' + this.$t(item.meta.label) + ' (' + item.stats.total + ')</h3>';

      // in case of group products, link to catalog search with term
      if (item.meta.name == 'catalog_product') {
        _headline = "<span class='livesearch-link'>" + _headline + '</span>'
      }

      return _headline
    },
    groupResults() {
      let _group_l = { name: 'left', items: [], count: 0 };
      let _group_r = { name: 'right', items: [], count: 0 };

      // group categories
      let _group_categories = this.items.filter(
        item => item.meta.name === 'catalog_category'
      );

      if (!_.isEmpty(_group_categories)) {
        let _cnt_items_group = _.size(_group_categories[0].items);
        _group_l.count += _cnt_items_group;

        _group_l.items.push(_group_categories[0]);
      }

      // group pages
      let _group_pages = this.items.filter(
        item => item.meta.name === 'cms_page'
      );

      if (!_.isEmpty(_group_pages)) {
        let _cnt_items_group = _.size(_group_pages[0].items);
        _group_l.count += _cnt_items_group;

        _group_l.items.push(_group_pages[0]);
      }

      // group products
      let _group_products = this.items.filter(
        item => item.meta.name === 'catalog_product'
      );

      if (!_.isEmpty(_group_products)) {
        let _cnt_items_group = _.size(_group_products[0].items);
        _group_r.count += _cnt_items_group;

        _group_r.items.push(_group_products[0]);
      }

      let _my_groups = [];
      _my_groups.push(_group_l);
      _my_groups.push(_group_r);

      this.groups = _my_groups;
    },
    sendStats(data) {
      let _vue = this;

      let _route = route('utilities.stats');

      return new Promise(function(resolve, reject) {
        _vue.$http
          .post(_route, data)
          .then(response => {
            resolve('stats OK');
          })
          .catch(error => {
            reject('stats not OK');
          })
      })
    },
    blurInput() {
      document.getElementById('autocomplete-search').blur();
    }
  }
};
</script>
