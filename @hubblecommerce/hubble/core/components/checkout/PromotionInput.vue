<template>
    <div class="promotion-wrp">
        <h5 class="promotion-headline">Coupon</h5>

        <form @submit.prevent="addPromotionCode()">
            <hbl-input>
                <input id="promotionCode" v-model="promotionCode" type="text" name="promotionCode" placeholder="Promotion Code" />
                <hbl-button @click="addPromotionCode()">Save</hbl-button>
            </hbl-input>
        </form>

        <template v-if="promotionErrors.length > 0" v-for="error in promotionErrors">
            <div class="promotion-error-message" v-text="error" />
        </template>
    </div>
</template>

<script>
import ApiClient from '@/utils/api-client';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            promotionErrors: [],
            promotionCode: '',
        };
    },
    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
    },
    methods: {
        addPromotionCode: async function () {
            this.promotionErrors = [];

            try {
                let code = this.promotionCode.trim();

                if (code === '') {
                    return;
                }

                const response = await new ApiClient(this.$config).apiCall({
                    action: 'post',
                    endpoint: 'store-api/checkout/cart/line-item',
                    headers: [{ 'sw-include-seo-urls': true }],
                    contextToken: this.contextToken,
                    data: {
                        items: [
                            {
                                type: 'promotion',
                                referencedId: this.promotionCode,
                            },
                        ],
                    },
                });

                console.log(response);
                this.$emit('promotion-code-added', response);
            } catch (e) {
                console.log(e);
                this.promotionErrors.push(e.detail);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';

.transition-expand-wrp {
    .promotion-wrp {
        padding: 30px 40px 10px;
    }
}

.promotion-wrp {
    padding-top: 30px;
    width: 100%;
    .hbl-input-group {
        display: flex;
        flex-direction: column;

        input {
            margin-right: 10px;
            margin-bottom: 5px;
        }

        button {
            flex-shrink: 0;
        }
    }
}

@media (min-width: 1024px) {
    .promotion-wrp {
        .hbl-input-group {
            display: flex;
            flex-direction: row;

            input {
                margin-bottom: 0px;
            }
        }
    }
}

.promotion-headline {
    margin-bottom: 15px;
}

.promotion-error-message {
    color: $error-accent;
    padding: 10px;
    border: 1px solid $error-accent;
    background: lighten($error-accent, 60%);
    margin-bottom: 20px;
}
</style>
