<template>
    <div class="pagination">
        <button class="button-icon" :class="{ disabled: paginationPrevDisabled }" :disabled="paginationPrevDisabled" @click="loadPrevPage">
            <i class="icon icon-chevron-left" />
            <span class="hidden-link-name">Previous</span>
            <material-ripple />
        </button>
        <div>
            <span v-text="$t('Page')" />
            <span class="page-number" v-text="curPage" />
            <span v-text="$t('pagination_from')" />
            <span v-text="lastPage" class="page-number last-page" :class="{ disabled: paginationNextDisabled }" @click="loadLastPage" />
        </div>
        <button class="button-icon" :class="{ disabled: paginationNextDisabled }" :disabled="paginationNextDisabled" @click="loadNextPage">
            <i class="icon icon-chevron-right" />
            <span class="hidden-link-name">Next Page</span>
            <material-ripple />
        </button>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
    name: 'Pagination',

    data() {
        return {
            paginateMax: 3,
            dotsEnabled: false,
        };
    },

    scrollToTop: true,

    computed: {
        ...mapState({
            dataCategoryProducts: state => state.modApiCategory.dataCategoryProducts,
            paginationPerPage: state => state.modApiRequests.paginationPerPage,
        }),
        categoryProductItems: function () {
            return this.dataCategoryProducts.result.items;
        },
        categoryProductStats: function () {
            return this.dataCategoryProducts.result.stats;
        },
        paginationItemsTotal: function () {
            if (this.dataCategoryProducts.result.stats != null) {
                return this.dataCategoryProducts.result.stats.total;
            }

            return 0;
        },
        paginationNextDisabled: function () {
            return this.curPage === this.lastPage;
        },
        paginationPrevDisabled: function () {
            return this.curPage === 1;
        },
        curPage: function () {
            // If page isset to url take it, otherwise set to first page
            let currentPage = 1;

            if (this.$route.query.page) {
                currentPage = parseInt(this.$route.query.page);
            }

            return currentPage;
        },
        curPerPage: function () {
            return parseInt(this.paginationPerPage);
        },
        firstPage: function () {
            return 1;
        },
        lastPage: function () {
            let last = _.round(this.paginationItemsTotal / this.curPerPage, 4);

            if (last > _.round(last)) {
                return _.round(last) + 1;
            }

            return _.round(last);
        },
        prevPage: function () {
            return this.curPage - 1;
        },
        nextPage: function () {
            return this.curPage + 1;
        },
        linksPages: function () {
            let links = [];

            let beg = 1;
            let end = null;

            let paginate = false;

            if (this.lastPage >= this.paginateMax + 2) paginate = true;

            if (paginate) {
                /* on first page */
                if (this.curPage === 1) {
                    beg = 1;
                } else if (this.curPage === this.lastPage) {
                    /* on last page */
                    beg = this.lastPage - this.paginateMax;
                } else {
                    /* somewhere in between */
                    /* +1 from first page */
                    if (this.curPage - 1 === 1) {
                        beg = this.curPage;
                    } else if (this.curPage + 1 === this.lastPage) {
                        /* -1 from last page */
                        beg = this.lastPage - this.paginateMax;
                    } else {
                        /* somewhere in between */
                        beg = this.curPage - Math.floor(this.paginateMax / 2);

                        /* at least 2 */
                        if (beg < 2) beg = 2;

                        /* close to the end */
                        if (this.lastPage - this.curPage <= Math.floor(this.paginateMax / 2)) {
                            beg = this.lastPage - this.paginateMax;
                        }
                    }

                    /* end -1, cause dotted appended */
                    end = beg + this.paginateMax - 1;
                }

                if (!end) end = beg + this.paginateMax;
            }

            if (!end) end = this.lastPage;

            /* prepend dotted, if not on first page and not all */
            if (this.dotsEnabled && paginate && this.curPage !== 1 && beg > 1) {
                links.push({ dotted: true });
            }

            /* numbered links */
            let cnt = beg;
            while (cnt <= end) {
                links.push({ page: cnt });
                cnt++;
            }

            /* append dotted, if not on last page and not all */
            if (this.dotsEnabled && paginate && this.curPage !== this.lastPage && end < this.lastPage) {
                links.push({ dotted: true });
            }

            return links;
        },
    },

    methods: {
        loadPrevPage: function () {
            if (this.paginationPrevDisabled) {
                return;
            }

            this.routePagination(this.prevPage);
        },
        loadNextPage: function () {
            if (this.paginationNextDisabled) {
                return;
            }

            this.routePagination(this.nextPage);
        },
        loadLastPage: function () {
            if (this.paginationNextDisabled) {
                return;
            }

            this.routePagination(this.lastPage);
        },
        loadFirstPage: function () {
            if (this.paginationPrevDisabled) {
                return;
            }

            this.routePagination(this.firstPage);
        },
        loadNumberedPage: function (pageNumber) {
            if (this.curPage === pageNumber) {
                return;
            }

            this.routePagination(pageNumber);
        },
        routePagination: function (pageNumber) {
            return new Promise((resolve, reject) => {
                this.$nuxt.$loading.start();

                let query = _.omit(this.$route.query, 'page');

                let query2 = _.merge({}, query, {
                    page: pageNumber,
                });

                let route = {
                    path: this.$route.path,
                    query: query2,
                };

                // If last route was a search request, then only replace current route to keep history
                // thats how we can do a go(-1) to reach the last non search page
                if (this.$router.history.current.path === '/search/catalogsearch') {
                    this.$router.replace(route, () => {
                        // Scroll to top after change route
                        window.scrollTo(0, 0);
                    });
                } else {
                    this.$router.push(route, () => {
                        // Scroll to top after change route
                        window.scrollTo(0, 0);
                    });
                }

                resolve();
            });
        },
    },
};
</script>
