<template>
    <div class="search-wrapper">

        <form id="search_mini_form" action="#">
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
                            @keydown.enter.prevent="onEnter($event)"
                            @keydown.down.prevent="changeSelected($event)" @keydown.up.prevent="changeSelected($event)"
                            @focus="onFocus"
                            @blur="onBlur"
                    >
                    <label class="hidden-link-name" for="autocomplete-search">{{ $t('Search') }}</label>
                </div>
                <button class="button-icon" type="submit" title="Search" @click.prevent="clearQuery">
                    <span class="hidden-link-name">Search</span>
                    <transition name="fade">
                        <i v-if="!focus && !loading" class="icon icon-search" />
                        <i v-if="focus && !loading" class="icon icon-close" />
                        <div v-if="loading" class="loader lds-ring">
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                    </transition>
                    <material-ripple />
                </button>
            </div>
        </form>

        <transition name="fade">
            <autocomplete-list v-if="showAutoCompleteResults"
                               v-click-outside="resetAutoComplete"
                               class="autocomplete-list"
            />
        </transition>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import AutocompleteList from "./AutocompleteList";

    export default {
        name: 'TheSearch',

        components: {
            AutocompleteList
        },

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
                timeout: null,
                loading: false,
            }
        },

        computed: {
            ...mapState({
                locale: state => state.modApiResources.apiLocale,
                selectedItemId: state => state.modSearch.selectedItemId,
                showAutoCompleteResults: state => state.modSearch.showAutoCompleteResults
            }),
            inputIsSelected: function() {
                return _.isNull(this.selectedItemId);
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
                this.queryIsSearching = false;

                //this.doSearch();
                this.doAutocomplete();
            },
            '$route.path': function() {
                if(this.$router.history.current.path !== '/search/catalogsearch') {
                    this.focus = false;
                    this.query = '';
                    this.loading = false;

                    this.resetAutoComplete();
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
            onEnter(event) {
                if(this.inputIsSelected) {
                    this.doCatalogSearch();
                    this.resetAutoComplete();
                } else {
                    this.loading = true;
                    this.$store.dispatch('modSearch/redirectToItem');
                }
                event.target.blur();
            },
            changeSelected(event){
                if(!this.showAutoCompleteResults) {
                    return;
                }
                if(event.key === 'ArrowDown') {
                    this.$store.dispatch('modSearch/changeSelectedItem', 1);
                }
                if(event.key === 'ArrowUp') {
                    this.$store.dispatch('modSearch/changeSelectedItem', -1);
                }
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

                this.resetAutoComplete();

                this.focus = false;
                this.query = '';
                //this.$router.go(-1);
                this.loading = false;
            },
            doAutocomplete: function() {
                clearTimeout(this.timeout);

                this.timeout = setTimeout(() => {
                    // stop typing ...
                    this.queryIsTyping = false;

                    this.getAutocompleteResults();
                }, this.typeDelay);
            },
            getAutocompleteResults: function() {
                // return in case of too short
                if (this.query.length < this.queryMinLength) {
                    this.resetAutoComplete();
                    return;
                }

                // Only show autocomplete results when user didnt press enter
                if(!this.queryIsSearching) {
                    // Loading Animation
                    this.loading = true;

                    //Get autocomplete data from api
                    this.$store.dispatch('modSearch/swSearchProductByTerm', {
                        locale: this.locale,
                        query: this.query
                    })
                    .then(response => {
                        this.loading = false;
                    })
                    .catch(error => {
                        //console.log('error retrieving data!')
                        this.loading = false;
                    });
                }
            },
            resetAutoComplete: function() {
                this.$store.dispatch('modSearch/resetAutoCompleteResults');
            },
            doSearch: function() {
                clearTimeout(this.timeout);

                this.timeout = setTimeout(() => {
                    // stop typing ...
                    this.queryIsTyping = false;

                    this.doCatalogSearch();
                }, this.typeDelay);

            }, // END doSearch
            doCatalogSearch() {
                if (_.isEmpty(this.query)) {
                    return false
                }

                // return in case of too short
                if (this.query.length < this.queryMinLength) {
                    return
                }

                // stop searching ...
                this.queryIsSearching = true;

                let _url = this.localePath('search-catalogsearch');

                let _route = {
                    path: _url,
                    query: {
                        term: this.query
                    }
                };

                // Do not start loader if term is already in use on press enter
                if(this.$router.history.current.query.term !== this.query) {
                    this.loading = true;
                }

                // If last route was a search request, then only replace current route to keep history
                // thats how we can do a go(-1) to reach the last non search page
                if(this.$router.history.current.path === '/search/catalogsearch') {
                    this.$router.replace(_route, () => {
                        this.loading = false;
                    });
                } else {
                    this.$router.push(_route, () => {
                        this.loading = false;
                    });
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
