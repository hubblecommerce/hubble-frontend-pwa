<template>
    <div class="reviews row" :class="{ 'is-detail': isDetail }">
        <div :class="{ 'col-lg-4': !isDetail, 'col-12': isDetail }">
            <template v-if="reviews.length">
                <div class="reviews-total">
                    <stars :points="ratingAverage" />
                    <div>{{ ratingAverage }} out of 5 stars</div>
                </div>

                <div class="reviews-matrix">
                    <div v-for="(rating, i) in ratingMatrix" :key="i" :class="{ disabled: rating.reviewCount === 0 }" class="matrix-element">
                        <div class="rating-select">
                            <hbl-checkbox>
                                <input
                                    :id="'rating-' + i"
                                    type="checkbox"
                                    :value="i"
                                    :disabled="rating.reviewCount === 0"
                                    @change="selectRating(rating.points)"
                                />
                                <label :for="'rating-' + i">
                                    <svg-icon icon="check" />
                                    <span>{{ rating.label }} ({{ rating.reviewCount }})</span>
                                </label>
                            </hbl-checkbox>
                        </div>

                        <div class="progress-bar-container">
                            <div class="progress-bar" role="progressbar" :style="{ width: `${rating.ratio}%` }" />
                        </div>

                        <div class="rating-ratio">
                            <span>{{ rating.ratio }}%</span>
                        </div>
                    </div>
                </div>
            </template>

            <div class="reviews-toggle">
                <h5>Leave a review</h5>
                <p>Share your experience with other customers.</p>
                <button
                    class="btn btn-primary"
                    @click="isWritingView = !isWritingView"
                    v-text="isWritingView ? 'Show reviews' : 'Write a review!'"
                ></button>
            </div>
        </div>
        <div class="col-right" :class="{ 'col-lg-8': !isDetail, 'col-12': isDetail }">
            <div v-if="isWritingView">
                <div v-if="isLoggedIn">
                    <span>Your rating *</span>
                    <stars :interactive="true" :points="newRating.points" @onClickStar="updateCurrentRating" />

                    <form class="review-form" @submit.prevent="onRatingFormSubmit">
                        <div class="hbl-input-group">
                            <input id="title" v-model="newRating.title" minlength="5" required type="text" name="title" placeholder=" " />
                            <label for="title">Title *</label>
                        </div>
                        <div class="hbl-input-group">
                            <textarea
                                id="content"
                                v-model="newRating.content"
                                required
                                minlength="40"
                                type="text"
                                name="content"
                                placeholder="Your review *"
                            />
                            <label for="content">Your review *</label>
                        </div>

                        <button class="btn btn-primary" type="submit">Send</button>
                    </form>

                    <div v-if="isRatingSend" class="message">
                        <p> Thank you for submitting your review. We will examine the review and eventually unlock it, please be patient. </p>
                    </div>
                </div>
                <div v-else>
                    <p
                        >Reviews can only be submitted while being logged in. Please enter your login details below.
                        <nuxt-link :to="{ name: 'customer-login', query: { tab: 1 } }">New customer?</nuxt-link></p
                    >
                    <lazy-customer-login-form @login-success="isLoggedIn = true" />
                </div>
            </div>
            <div v-else class="reviews-list">
                <p v-if="!reviews.length">No reviews found. Be the first to share your insights.</p>

                <div v-for="review in filteredReviews" :key="review.id" class="review-item">
                    <div>
                        <span v-text="prettifyDate(review.createdAt)"></span>
                    </div>
                    <div class="review-title">
                        <stars :points="review.points" @onClickStar="updateCurrentRating" />
                        <h5 v-text="review.title" />
                    </div>
                    <div v-html="review.content"> </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import ApiClient from '@/utils/api-client';

export default {
    name: 'Reviews',

    props: {
        isDetail: {
            type: Boolean,
            default: false,
        },
        reviews: {
            type: Array,
            default: () => [],
        },
        productId: {
            type: String,
            default: '',
        },
        ratingAverage: {
            type: Number,
            default: 0,
        },
    },

    data() {
        return {
            customer: null,
            isLoggedIn: false,
            isWritingView: false,
            isRatingSend: false,
            selectedRatings: [],
            ratingMatrix: [
                { label: 'Excellent', points: 5, reviewCount: 0, ratio: 0 },
                { label: 'Very good', points: 4, reviewCount: 0, ratio: 0 },
                { label: 'Good', points: 3, reviewCount: 0, ratio: 0 },
                { label: 'Acceptable', points: 2, reviewCount: 0, ratio: 0 },
                { label: 'Unsatisfactory', points: 1, reviewCount: 0, ratio: 0 },
            ],
            newRating: {
                title: '',
                content: '',
                points: 5,
            },
        };
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
        filteredReviews() {
            return (
                this.reviews &&
                this.reviews.filter((rev) => {
                    if (!this.selectedRatings.length) return true;

                    return this.selectedRatings.includes(rev.points);
                })
            );
        },
    },

    watch: {
        contextToken(newValue) {
            if (newValue) {
                this.getCustomerContext();
            } else {
                this.isLoggedIn = false;
                this.customer = null;
            }
        },
    },

    mounted() {
        this.getCustomerContext();

        if (this.reviews) this.calculateValues();
    },

    methods: {
        async getCustomerContext() {
            let response = await new ApiClient(this.$config).apiCall({
                action: 'get',
                endpoint: 'store-api/context',
                contextToken: this.contextToken,
            });

            if (response.data.customer != null) {
                this.isLoggedIn = response.data.customer.active;
                this.customer = response.data.customer;
            }
        },
        calculateValues() {
            // define review count per rating level
            this.reviews.forEach((r) => {
                this.ratingMatrix.forEach((m, i) => {
                    if (r.points === m.points) this.ratingMatrix[i].reviewCount++;
                });
            });

            // define ratio of count to total
            this.ratingMatrix.forEach((m, i) => {
                const ratio = Math.round((m.reviewCount / this.reviews.length) * 100);
                this.ratingMatrix[i].ratio = ratio;
            });
        },
        selectRating(points) {
            if (this.selectedRatings.includes(points)) {
                this.selectedRatings = this.selectedRatings.filter((el) => el !== points);
            } else {
                this.selectedRatings.push(points);
            }
        },
        prettifyDate(date) {
            date = new Date(date);

            const leadingZero = function (number) {
                if (number < 10) return '0' + number;
                return number;
            };

            return `${date.getFullYear()}-${leadingZero(date.getMonth() + 1)}-${leadingZero(date.getDate())} ${leadingZero(
                date.getHours()
            )}:${leadingZero(date.getMinutes())}`;
        },
        updateCurrentRating(points) {
            this.newRating.points = points;
        },
        async onRatingFormSubmit() {
            const formData = Object.assign(this.newRating, {
                name: `${this.customer.firstName} ${this.customer.lastName}`,
                email: this.customer.email,
            });

            const formPost = await new ApiClient(this.$config).apiCall({
                action: 'post',
                endpoint: `store-api/product/${this.productId}/review`,
                contextToken: this.contextToken,
                data: formData,
            });

            if ([200, 204].includes(formPost.status)) {
                this.isRatingSend = true;

                // reset form
                this.newRating.points = 5;
                this.newRating.title = '';
                this.newRating.content = '';
            }
        },
    },
};
</script>

<style lang="scss">
.reviews {
    .reviews-total {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .reviews-matrix {
        margin-bottom: 20px;
    }

    .matrix-element {
        display: flex;
        margin-bottom: 10px;
        justify-content: space-between;
        align-items: center;
        margin-left: -10px;
        margin-right: -10px;

        &.disabled {
            opacity: 0.5;
            pointer-events: none;
        }

        .hbl-checkbox {
            margin: 0;
        }

        > div {
            margin: 0 10px;
        }
    }

    .rating-select {
        width: 50%;
    }

    .progress-bar-container {
        overflow: hidden;
        background-color: #eee;
        border-radius: 3px;
        height: 14px;
        flex-grow: 1;
        max-width: 40%;
    }

    .rating-ratio {
        flex-grow: 1;
        max-width: 10%;
        text-align: right;
    }

    .progress-bar {
        height: 100%;
        background-color: #fedc70;
    }

    .col-right {
        @media (max-width: 1023px) {
            margin-top: 20px;
        }
    }

    &.is-detail .col-right {
        margin-top: 20px;
    }

    .review-item {
        border-bottom: 1px solid #bcc1c7;
        padding: 1rem 0;

        &:first-child {
            padding-top: 0;
        }

        > *:not(:last-child) {
            margin-bottom: 10px;
        }
    }

    .review-title {
        display: flex;
        align-items: center;
    }

    .login-form {
        max-width: none;
    }

    .review-form {
        margin: 20px 0;
    }
}
</style>
