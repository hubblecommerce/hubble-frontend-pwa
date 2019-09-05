<template>
  <div class="search-wrapper">

    <form id="search_mini_form" action="#">
      <div class="input-wrp">
        <div class="hbl-input-group">
          <input
            id="autocomplete-search"
            ref="search"
            :placeholder="$t('Find your favorite Shoes')"
            v-model="query"
            :disabled="queryIsDisabled"
            autocomplete="off"
            type="text"
            name="term"
            value=""
            @keyup.esc="clearQuery"
            @keydown.enter.prevent="onEnter"
            @focus="onFocus"
            @blur="onBlur"
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
    </form>

  </div>
</template>

<script>
export default {
  name: 'TheSearch',

  data() {
    return {
      query: '',
      queryMinLength: 2,
      queryIsTyping: false,
      queryIsDisabled: false,
      queryIsSearching: false,
      stats: false,
      focus: false,
      typeDelay: 750,
      timeout: null
    }
  },

  computed: {
    locale() {
      return this.$store.getters['modApiResources/getApiLocale'];
    },
    searchIndicator: function() {
      if (this.queryIsSearching) {
        return '⟳ Fetching new results';
      } else if (this.queryIsTyping) {
        return '... Typing';
      } else {
        return '✓ Done';
      }
    }
  },

  watch: {
    query: function() {
      this.queryIsTyping = true;
      this.doSearch();
    },
    '$route.path': function() {
      if(this.$router.history.current.path !== '/search/catalogsearch') {
        this.focus = false;
        this.query = '';
      }
    }
  },

  methods: {
    onFocus() {
      this.$store.commit('modNavigation/hideOffcanvas');
      if (this.queryIsDisabled) {
        return;
      }

      this.focus = true;
    },
    onEnter() {
      return;
    },
    onBlur: function() {
      if(this.query === '') {
        this.focus = false;
      }
    },
    clearQuery() {
      if(_.isEmpty(this.query) ){
        this.query = '';
        return;
      }

      this.focus = false;
      this.query = '';
      this.$router.go(-1)
    },
    doSearch: function() {

      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        // stop typing ...
        this.queryIsTyping = false;

        // return in case of too short
        if (this.query.length < this.queryMinLength) {
          return
        }

        // stop searching ...
        this.queryIsSearching = true;

        this.doCatalogSearch();
      }, this.typeDelay);

    }, // END doSearch
    doCatalogSearch() {
      if (_.isEmpty(this.query)) {
        return false
      }

      let _url = this.localePath('search-catalogsearch');

      let _route = {
        path: _url,
        query: {
          term: this.query
        }
      };

      // If last route was a search request, then only replace current route to keep history
      // thats how we can do a go(-1) to reach the last non search page
      if(this.$router.history.current.path === '/search/catalogsearch') {
        this.$router.replace(_route);
      } else {
        this.$router.push(_route);
      }

    },
    sendStats(data) {
      let _vue = this;

      let _route = route('utilities.stats');

      return new Promise(function(resolve, reject) {
        _vue.$http
          .post(_route, data)
          .then(response => {
            resolve('stats OK')
          })
          .catch(error => {
            reject('stats not OK')
          })
      });
    }
  }
};
</script>
