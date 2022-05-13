<template>
    <div class="search-wrapper">
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

        <lazy-the-search-suggest-list v-if="result !== null" :products="result" :total="total" class="autocomplete-list" />
    </div>
</template>

<script>
import ApiClient from '@/utils/api-client';
import { includesSearchSuggest } from '@/utils/api-post-body';
import { mappingSearchSuggestProducts } from '@/utils/api-mapping-helper';

export default {
    name: 'TheSearch',

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
            total: 0,
        };
    },

     watch: {
        term: function () {
            this.isTyping = true;
            this.isSearching = false;

            this.searchSuggest();
        },
    },

    mounted() {
        window.setTimeout(() => {
            this.$refs.search.focus();
        }, 300);
    },

    methods: {
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
                        this.total = response.data.total;

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
            return new ApiClient(this.$config).apiCall({
                action: 'post',
                endpoint: 'store-api/search-suggest',
                data: {
                    search: this.term,
                    includes: includesSearchSuggest,
                },
                headers: [{ 'sw-include-seo-urls': true }],
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

            this.isSearching = true;

            let route = {
                path: '/search',
                query: {
                    term: this.term,
                },
            };

            // Do not start loader if term is already in use on press enter
            if (this.$router.history.current.query.term !== this.term) {
                this.loading = true;
            }

            // If current route is search request, reload the page to flush filters
            if (this.$router.history.current.path === '/search') {
                this.$router.replace(route, () => {
                    this.loading = false;
                    location.reload();
                });
            } else {
                this.$router.push(route, () => {
                    this.loading = false;
                });
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

.search-wrapper {
    .loader-wrp {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 30px;
        margin: auto;
        height: 30px;

        width: auto;
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
