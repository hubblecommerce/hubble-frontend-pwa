<template>
    <div class="pagination">
        <hbl-button
            class="button-icon"
            :class="{ disabled: paginationPrevDisabled }"
            :disabled="paginationPrevDisabled"
            @click.native="loadPrevPage"
        >
            <svg-icon icon="chevron-left" />
            <span class="hidden-link-name" v-text="'Previous Page'" />
        </hbl-button>
        <div>
            <span v-text="'Page'" />
            <span class="page-number" v-text="curPage" />
            <span v-text="'from'" />
            <span
                class="page-number last-page"
                :class="{ disabled: paginationNextDisabled }"
                @click="loadLastPage"
                v-text="lastPage"
            />
        </div>
        <hbl-button
            class="button-icon"
            :class="{ disabled: paginationNextDisabled }"
            :disabled="paginationNextDisabled"
            @click.native="loadNextPage"
        >
            <svg-icon icon="chevron-right" />
            <span class="hidden-link-name" v-text="'Next Page'" />
        </hbl-button>
    </div>
</template>

<script>
export default {
    name: 'ProductListingPagination',

    scrollToTop: true,

    props: {
        paginationItemsTotal: {
            type: Number,
            required: true
        },
        paginationPerPage: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            paginateMax: 3,
            dotsEnabled: false,
        };
    },

    computed: {
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
            return this.paginationPerPage;
        },
        lastPage: function () {
            let last = this.round(this.paginationItemsTotal / this.curPerPage, 4);

            if (last > Math.round(last)) {
                return Math.round(last) + 1;
            }

            return Math.round(last);
        },
        prevPage: function () {
            return this.curPage - 1;
        },
        nextPage: function () {
            return this.curPage + 1;
        }
    },

    methods: {
        round: function(value, decimals) {
            return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        },
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
        routePagination: function (pageNumber) {
            return new Promise((resolve, reject) => {
                this.$nuxt.$loading.start();

                const omitSingle = (key, { [key]: _, ...obj }) => obj;

                let query = omitSingle('page', this.$route.query);

                let query2 = Object.assign({}, query, {
                    page: pageNumber,
                });

                let route = {
                    path: this.$route.path,
                    query: query2,
                };

                // If last route was a search request, then only replace current route to keep history
                // thats how we can do a go(-1) to reach the last non search page
                if (this.$router.history.current.path === '/search') {
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
        }
    }
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';
@import '~assets/scss/hubble/typography';

$hbl-pagination-line-height: 17px;
$hbl-pagination-font-size: 14px;

.pagination {
    display: flex;
    justify-content: center;
    line-height: $hbl-pagination-line-height;
    font-size: $hbl-pagination-font-size;
    align-items: center;

    button {
        padding: 0;
        i {
            width: 100%;
            height: 100%;
            font-weight: $font-weight-regular;
            cursor: pointer;
        }

        &.disabled {
            i {
                color: $gray;
            }
        }
    }

    .page-number {
        font-weight: $font-weight-bold;
    }

    .last-page {
        cursor: pointer;
    }
}
</style>
