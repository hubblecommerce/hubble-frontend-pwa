<template>
    <div class="search-wrapper">
        <form id="search_mini_form" v-click-outside="clearQuery" action="#">
            <div class="input-wrp">
                <div class="hbl-input-group">
                    <input
                        id="autocomplete-search"
                        ref="search"
                        v-model="query"
                        :placeholder="$t('Search')"
                        :disabled="queryIsDisabled"
                        autocomplete="off"
                        type="text"
                        name="term"
                        value=""
                        @keyup.esc="clearQuery"
                        @focus="onFocus"
                    />

                    <span class="highlight" />

                    <label class="hidden-link-name" for="autocomplete-search">{{ $t('Search') }}</label>
                </div>

                <button class="button-icon" type="submit" title="Search" @click.prevent="clearQuery">
                    <div class="hidden-link-name">Search</div>

                    <i v-if="!focus" class="icon icon-search" />

                    <i v-if="focus" class="icon icon-close" />

                    <material-ripple />
                </button>
            </div>

            <transition name="fade">
                <div v-if="showResults" class="search-autocomplete" @mouseenter="blurInput">
                    <div v-for="(groupItem, groupItemIndex) in groups" :key="groupItemIndex" class="result-col">
                        <div v-for="(group, groupIndex) in groupItem.items" id="livesearch-box-wrapper" :key="groupIndex" class="container">
                            <div class="row">
                                <div class="col-6 text-left">
                                    <div class="group-headline" v-html="$t(group.meta.label) + ' (' + group.stats.total + ')'" />
                                </div>

                                <div class="col-6 text-right">
                                    <div
                                        v-if="group.meta.name === 'catalog_product'"
                                        class="show-result-link"
                                        @mousedown="doCatalogSearchGrouped(group)"
                                        v-text="$t('Show all results')"
                                    />
                                </div>
                            </div>

                            <product-listing v-if="group.meta.name === 'catalog_product'" :data-items="group.items" />

                            <div
                                v-for="(item, itemIndex) in group.items"
                                v-else
                                :key="itemIndex"
                                class="result-item border-bottom d-flex align-items-center pt-3 pb-3 row"
                                @mousedown="selectItem(item)"
                            >
                                <div v-if="item.image" class="col-4">
                                    <div class="image-wrapper border">
                                        <img :src="itemImgPath(group, item)" class="img-minicart" />
                                    </div>
                                </div>

                                <div class="col-8">
                                    <div v-html="highlight(item, 'name')" />
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
                                    <span class="no-results">
                                        {{ $t('No search results for:') }} <i>{{ query }}</i></span
                                    >
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
import { mapGetters, mapMutations } from 'vuex';
import Vue from 'vue';
import vClickOutside from 'v-click-outside';
import _ from 'lodash';

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
            focus: false,
        };
    },

    computed: {
        ...mapGetters({
            getApiLocale: 'modApiResources/getApiLocale',
        }),
        locale: function () {
            return this.getApiLocale;
        },
        imgFilter: function () {
            return this.dataImageFilter ? this.dataImageFilter : this.origImageFilter;
        },
        showResults: function () {
            // should also count items!
            return this.queryShowResults && (this.stats && this.stats.total ? true : false);
        },
        showNoResults: function () {
            // should also count items!
            return this.queryShowResults && (this.stats && this.stats.total ? false : true);
        },
        queryShowReset: function () {
            return this.query.length >= this.queryMinLength || this.queryShowResults;
        },
        searchIndicator: function () {
            if (this.queryIsSearching) {
                return '⟳ Fetching new results';
            } else if (this.queryIsTyping) {
                return '... Typing';
            } else {
                return '✓ Done';
            }
        },
    },

    watch: {
        query: function () {
            this.queryIsTyping = true;
            this.doSearch();
        },
    },

    created() {
        Vue.use(vClickOutside);
    },

    methods: {
        ...mapMutations({
            hideOffcanvas: 'modNavigation/hideOffcanvas',
        }),
        bye: function () {
            this.showSearch = false;
            this.queryShowResults = false;
            this.query = '';
        },
        toggle: function () {
            this.showSearch = !this.showSearch;

            // Set focus on search input after component is opened
            if (this.showSearch) {
                this.$nextTick(() => this.$refs.search.focus());
            }
        },
        onFocus: function () {
            this.hideOffcanvas();
            if (this.queryIsDisabled) {
                return;
            }

            this.focus = true;

            if (this.query.length) {
                this.queryShowResults = true;
            }
        },
        clearQuery: function () {
            this.focus = false;
            this.query = '';
            this.queryShowResults = false;
        },
        itemUrl: function (item) {
            let url = '';

            // cms_pages (simplified)
            if (item.identifier) {
                url = item.identifier;
            }
            // product or category items url
            else {
                url = item.url_pds ? item.url_pds : item.url_path;
            }

            if (this.locale !== 'de') {
                return '/' + this.locale + '/' + url;
            }

            return '/' + url;
        },
        itemImgPath: function (group, item) {
            // If customer domain isset get live images
            if (!_.isEmpty(process.env.CUSTOMER_DOMAIN)) {
                let path = _.trim(process.env.config.IMG_BASE_URL, '/');

                if (group.meta.name === 'catalog_product') {
                    let image = item.image;

                    return _.join([process.env.CUSTOMER_DOMAIN, 'images/catalog/thumbnails/cache/400', image], '/');
                }

                if (group.meta.name === 'catalog_category') {
                    let image = item.image;

                    return _.join([process.env.CUSTOMER_DOMAIN, 'images/catalog/thumbnails/cache/400', image], '/');
                }

                return path;
            }

            // If no customer domain isset get images from api
            let path = _.trim(process.env.config.IMG_BASE_URL, '/');

            if (group.meta.name === 'catalog_product') path += '/images/catalog/product/' + this.imgFilter + '/' + item.image;

            if (group.meta.name === 'catalog_category') path += '/images/catalog/category/' + this.imgFilter + '/' + item.image;

            return path;
        },
        selectItem: function (item) {
            let route = {
                path: this.itemUrl(item),
            };

            this.bye();

            this.$router.push(route);
        },
        doSearch: _.debounce(function () {
            let endpoint = '/search/autocomplete';

            // stop typing ...
            this.queryIsTyping = false;

            // return in case of too short
            if (this.query.length < this.queryMinLength) {
                return;
            }

            // stop searching ...
            this.queryIsSearching = true;

            //Insert axios get call here
            this.$store
                .dispatch(
                    'apiCall',
                    {
                        action: 'get',
                        tokenType: 'api',
                        apiType: 'data',
                        endpoint: endpoint,
                        params: {
                            _term: this.query,
                        },
                    },
                    { root: true }
                )
                .then(response => {
                    this.queryIsSearching = false;

                    //let data = {}

                    this.items = response.data.result.groups;
                    this.stats = response.data.result.stats;
                    this.queryShowResults = true;

                    this.groupResults();
                })
                .catch(() => {
                    console.log('error retrieving data!');
                });
        }, 350), // END doSearch
        doCatalogSearch: function () {
            if (_.isEmpty(this.query)) {
                return false;
            }

            let url = this.localePath('search-catalogsearch');

            let route = {
                path: url,
                query: {
                    term: this.query,
                },
            };

            // bye search
            this.bye();

            this.$router.push(route);
        },
        doCatalogSearchGrouped: function (group) {
            // only if
            if (group.meta.name == 'catalog_product') {
                // do catalog search
                this.doCatalogSearch();
            }
        },
        highlight: function (item, field) {
            if (!this.query) {
                return item[field];
            }

            // elasticsearch highlight (1st field only)
            if (!_.isEmpty(item.highlighted)) {
                return _.values(item.highlighted)[0][0];
            }

            // try javascript highlighning on query string
            return item[field].replace(new RegExp(this.query, 'gi'), match => {
                return '<span class="highlight">' + match + '</span>';
            });
        },
        getGroupHeadline: function (item) {
            // assemble headline content
            let headline = '<h3>' + this.$t(item.meta.label) + ' (' + item.stats.total + ')</h3>';

            // in case of group products, link to catalog search with term
            if (item.meta.name === 'catalog_product') {
                headline = "<span class='livesearch-link'>" + headline + '</span>';
            }

            return headline;
        },
        groupResults: function () {
            let group_l = { name: 'left', items: [], count: 0 };
            let group_r = { name: 'right', items: [], count: 0 };

            // group categories
            let groupCategories = this.items.filter(item => item.meta.name === 'catalog_category');

            if (!_.isEmpty(groupCategories)) {
                let _cnt_items_group = _.size(groupCategories[0].items);
                group_l.count += _cnt_items_group;

                group_l.items.push(groupCategories[0]);
            }

            // group pages
            let groupPages = this.items.filter(item => item.meta.name === 'cms_page');

            if (!_.isEmpty(groupPages)) {
                let cnt_items_group = _.size(groupPages[0].items);
                group_l.count += cnt_items_group;

                group_l.items.push(groupPages[0]);
            }

            // group products
            let groupProducts = this.items.filter(item => item.meta.name === 'catalog_product');

            if (!_.isEmpty(groupProducts)) {
                let cnt_items_group = _.size(groupProducts[0].items);
                group_r.count += cnt_items_group;

                group_r.items.push(groupProducts[0]);
            }

            let myGroups = [];
            myGroups.push(group_l);
            myGroups.push(group_r);

            this.groups = myGroups;
        },
        sendStats: function (data) {
            let route = route('utilities.stats');

            return new Promise(function (resolve, reject) {
                this.$http
                    .post(route, data)
                    .then(() => {
                        resolve('stats OK');
                    })
                    .catch(() => {
                        reject('stats not OK');
                    });
            });
        },
        blurInput: function () {
            document.getElementById('autocomplete-search').blur();
        },
    },
};
</script>
