<template>
    <div class="search-context-wrapper">
        <div class="container expand-content">
            <div class="row overlay-header">
                <hbl-button class="button-icon" @click.native="hideOffcanvasAction">
                    <div class="hidden-link-name" v-text="'Close'" />
                    <svg-icon icon="x" />
                </hbl-button>
                <div class="overlay-headline" v-text="'Search'" />
            </div>

            <div class="row">
                <div class="search-input-wrp">
                    <hbl-input>
                        <input
                            id="autocomplete-search"
                            ref="search"
                            v-model="term"
                            placeholder=" "
                            autocomplete="off"
                            type="text"
                            name="term"
                            value=""
                            @keyup.esc="clearQuery"
                            @keydown.enter.prevent="onEnter($event)"
                            @focus="onFocus"
                            @blur="onBlur"
                        />
                        <label for="autocomplete-search">{{ 'Search' }}</label>
                        <svg-icon v-if="!loading" icon="search" @click.native="doCatalogSearch" />
                        <loader v-if="loading" />
                    </hbl-input>
                </div>

                <lazy-the-search-suggest-list v-if="result !== null" :products="result" class="autocomplete-list" />
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import vClickOutside from 'v-click-outside';
import apiClient from '@/utils/api-client';
import { includesSearchSuggest, associations } from '@/utils/api-post-body';
import { mappingSearchSuggestProducts } from '@/utils/api-mapping-helper';

export default {
    name: 'TheSearchContext',

    data() {
        return {
            term: '',
            isTyping: false,
            isSearching: false,
            timeout: null,
            termMinLength: 2,
            typeDelay: 750,
            focus: false,
            loading: false,
            result: null,
        };
    },

    mounted() {
        window.setTimeout(() => {
            this.$refs.search.focus();
        }, 300);
    },

    watch: {
        term: function () {
            this.isTyping = true;
            this.isSearching = false;

            this.searchSuggest();
        },
    },

    created() {
        Vue.use(vClickOutside);
    },

    methods: {
        ...mapActions({
            hideOffcanvasAction: 'modNavigation/hideOffcanvasAction',
        }),
        searchSuggest: async function () {
            try {
                clearTimeout(this.timeout);

                this.timeout = setTimeout(async () => {
                    this.isTyping = false;

                    if (this.term.length < this.termMinLength) {
                        return;
                    }

                    // Only show autocomplete results when user didnt press enter
                    if (!this.isSearching) {
                        this.loading = true;

                        const response = await this.fetchSearchSuggest();
                        this.result = mappingSearchSuggestProducts(response.data.elements);

                        this.loading = false;
                    }
                }, this.typeDelay);
            } catch (e) {
                this.loading = false;

                //this.flashMessage({
                //    flashType: 'error',
                //    flashMessage: e === 'No network connection' ? e : 'An error occurred',
                //});
            }
        },
        fetchSearchSuggest: async function () {
            return new apiClient().apiCall({
                action: 'post',
                endpoint: 'store-api/v3/search-suggest',
                data: {
                    search: this.term,
                    includes: includesSearchSuggest,
                },
            });
        },
        onFocus: function () {
            this.focus = true;
        },
        onEnter: function (event) {
            this.doCatalogSearch();
            event.target.blur();
        },
        onBlur: function () {
            this.focus = false;
        },
        clearQuery: function () {
            this.term = '';
            this.focus = false;
            this.loading = false;
        },
        doCatalogSearch() {
            if (this.term === '' || this.term.length < this.termMinLength) {
                return;
            }

            // stop searching ...
            this.isSearching = true;

            let route = {
                path: '/search',
                query: {
                    term: this.term,
                },
            };

            console.log('%c route: ', 'background:#b6f08d', route);

            // Do not start loader if term is already in use on press enter
            if (this.$router.history.current.query.term !== this.term) {
                this.loading = true;
            }

            // If last route was a search request, then only replace current route to keep history
            // thats how we can do a go(-1) to reach the last non search page
            if (this.$router.history.current.path === '/search') {
                this.$router.replace(route, () => {
                    this.loading = false;
                });
            } else {
                this.$router.push(route, () => {
                    this.loading = false;
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.search-context-wrapper {
    .loader-wrp {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 30px;
        margin: auto;
        height: 30px;
    }

    .search-input-wrp {
        width: 100%;
        padding: 16px;
        background: $light-gray;
    }

    .hbl-input-group {
        margin: 0;
        position: relative;

        .icon {
            right: 30px;
        }
    }
}
</style>
