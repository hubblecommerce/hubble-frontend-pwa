<template>
    <ul class="pagination">
        <li class="page-item">
            <button :class="{ disabled: paginationPrevDisabled }" @click="loadFirstPage" :disabled="paginationPrevDisabled">
                <i class="icon icon-chevrons-left"></i>
                <span class="hidden-link-name">First Page</span>
                <material-ripple></material-ripple>
            </button>
        </li>
        <li class="page-item">
            <button :class="{ disabled: paginationPrevDisabled }" @click="loadPrevPage" :disabled="paginationPrevDisabled">
                <i class="icon icon-chevron-left"></i>
                <span class="hidden-link-name">Previous</span>
                <material-ripple></material-ripple>
            </button>
        </li>
        <template v-for="(link, index) in linksPages">
            <li class="page-item" :key="index">
                <template v-if="link.dotted">
                    <span class="dots disabled hidden-xs"><i class="icon"></i></span>
                </template>
                <template v-else>
                    <button class="current" disabled="disabled" v-if="link.page === curPage">
                        {{ link.page }}
                        <material-ripple></material-ripple>
                    </button>
                    <button @click="loadNumberedPage(link.page)" v-else>
                        <span>{{ link.page }}</span>
                        <material-ripple></material-ripple>
                    </button>
                </template>
            </li>
        </template>
        <li class="page-item">
            <button :class="{ disabled: paginationNextDisabled }" @click="loadNextPage" :disabled="paginationNextDisabled">
                <i class="icon icon-chevron-right"></i>
                <span class="hidden-link-name">Next Page</span>
                <material-ripple></material-ripple>
            </button>
        </li>
        <li class="page-item">
            <button :class="{ disabled: paginationNextDisabled }" @click="loadLastPage" :disabled="paginationNextDisabled">
                <i class="icon icon-chevrons-right"></i>
                <span class="hidden-link-name">Last Page</span>
                <material-ripple></material-ripple>
            </button>
        </li>
    </ul>
</template>

<script>
    import { mapState } from 'vuex';

    export default {

        name: 'Pagination',

        data() {
            return {
                paginateMax: 3,
                dotsEnabled: false
            }
        },

        scrollToTop: true,

        computed: {
            ...mapState({
                dataCategoryProducts: state => state.modApiResources.dataCategoryProducts,
                paginationPerPage: state => state.modApiRequests.paginationPerPage
            }),
            categoryProductItems() {
                return this.dataCategoryProducts.result.items;
            },
            categoryProductStats() {
                return this.dataCategoryProducts.result.stats;
            },
            paginationItemsTotal() {
                return this.categoryProductStats.total || 0;
            },
            paginationNextDisabled() {
                return this.curPage === this.lastPage;
            },
            paginationPrevDisabled() {
                return this.curPage === 1;
            },
            curPage() {
                // If page isset to url take it, otherwise set to first page
                let currentPage = 1;

                if(this.$route.query.page) {
                    currentPage = parseInt(this.$route.query.page);
                }

                return currentPage;
            },
            curPerPage() {
                return parseInt(this.paginationPerPage);
            },
            firstPage() {
                return 1;
            },
            lastPage() {
                let _last = _.round(this.paginationItemsTotal / this.curPerPage, 4);

                if(_last > _.round(_last)) {
                    return _.round(_last) + 1;
                }

                return _.round(_last);
            },
            prevPage() {
                return this.curPage - 1;
            },
            nextPage() {
                return this.curPage + 1;
            },
            linksPages: function() {

                var links = [];

                var _beg = 1;
                var _end = null;

                var _paginate = false;

                if(this.lastPage >= this.paginateMax + 2)
                    _paginate = true;

                if(_paginate) {
                    /* on first page */
                    if(this.curPage === 1) {
                        _beg = 1;
                    }
                    /* on last page */
                    else if(this.curPage === this.lastPage) {
                        _beg = this.lastPage - this.paginateMax;
                    }
                    /* somewhere in between */
                    else {
                        /* +1 from first page */
                        if(this.curPage - 1 === 1) {
                            _beg = this.curPage;
                        }
                        /* -1 from last page */
                        else if(this.curPage + 1 === this.lastPage) {
                            _beg = this.lastPage - this.paginateMax;
                        }
                        /* somewhere in between */
                        else {
                            _beg = this.curPage - Math.floor(this.paginateMax / 2);

                            /* at least 2 */
                            if(_beg < 2)
                                _beg = 2;

                            /* close to the end */
                            if(this.lastPage - this.curPage <= Math.floor(this.paginateMax / 2)) {
                                _beg = this.lastPage - this.paginateMax;
                            }
                        }

                        /* _end -1, cause dotted appended */
                        _end = _beg + this.paginateMax - 1;
                    }

                    if(!_end)
                        _end = _beg + this.paginateMax;
                }

                if(! _end)
                    _end = this.lastPage;

                /* prepend dotted, if not on first page and not all */
                if(this.dotsEnabled && _paginate && this.curPage !== 1 && _beg > 1) {
                    links.push({ dotted: true });
                }

                /* numbered links */
                var _cnt = _beg;
                while(_cnt <= _end) {
                    links.push({ page: _cnt });
                    _cnt++;
                }

                /* append dotted, if not on last page and not all */
                if(this.dotsEnabled && _paginate && this.curPage !== this.lastPage && _end < this.lastPage) {
                    links.push({ dotted: true });
                }

                return links;
            }
        },

        methods: {
            loadPrevPage() {
                if(this.paginationPrevDisabled) {
                    return;
                }

                this.routePagination(this.prevPage);
            },
            loadNextPage() {
                if(this.paginationNextDisabled) {
                    return;
                }

                this.routePagination(this.nextPage);
            },
            loadLastPage() {
                if(this.paginationNextDisabled) {
                    return;
                }

                this.routePagination(this.lastPage);
            },
            loadFirstPage() {
                if(this.paginationPrevDisabled) {
                    return;
                }

                this.routePagination(this.firstPage);
            },
            loadNumberedPage(pageNumber) {
                if(this.curPage === pageNumber) {
                    return;
                }

                this.routePagination(pageNumber);
            },
            routePagination(pageNumber) {

                let _vue = this;

                return new Promise((resolve, reject) => {

                    this.$nuxt.$loading.start();

                    let _query = _.omit(this.$route.query, 'page');

                    let _query2 = _.merge(
                        {},
                        _query,
                        {
                            page: pageNumber
                        });

                    let _route = {
                        path: _vue.$route.path,
                        query: _query2
                    };

                    // If last route was a search request, then only replace current route to keep history
                    // thats how we can do a go(-1) to reach the last non search page
                    if(this.$router.history.current.path === '/search/catalogsearch') {
                        _vue.$router.replace(_route, () => {
                            // Scroll to top after change route
                            window.scrollTo(0, 0);
                        });
                    } else {
                        _vue.$router.push(_route, () => {
                            // Scroll to top after change route
                            window.scrollTo(0, 0);
                        });
                    }



                    resolve();
                })
            }
        }
    }
</script>
