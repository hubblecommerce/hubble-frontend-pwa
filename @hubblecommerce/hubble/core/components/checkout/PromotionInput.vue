<template>
    <div class="container">
        <div class="promotion-wrp">
            <h5 class="promotion-headline">Gutschein</h5>

            <form @submit.prevent="addPromotionCode()">
                <hbl-input>
                    <input id="promotionCode" v-model="promotionCode" type="text" name="promotionCode" placeholder="Promotion Code" />
                    <hbl-button @click="addPromotionCode()">Speichern</hbl-button>
                </hbl-input>
            </form>

            <template v-if="promotionErrors.length > 0" v-for="error in promotionErrors">
                <div class="promotion-error-message" v-text="error" />
            </template>
        </div>
    </div>
</template>

<script>
import apiClient from '@/utils/api-client';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            promotionErrors: [],
            promotionCode: ''
        }
    },
    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
    },
    methods: {
        addPromotionCode: async function() {
            this.promotionErrors = [];

            try {
                let code = this.promotionCode.trim();

                if (code === '') {
                    return;
                }

                const response = await new apiClient().apiCall({
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

                console.log(response)
                this.$emit('promotion-code-added', response);
            } catch (e) {
                console.log(e);
                this.promotionErrors.push(e.detail);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/hubble/variables';

.promotion-wrp {
    padding: 30px 0 10px;

    .hbl-input-group {
        display: flex;

        input {
            margin-right: 10px;
        }

        button {
            flex-shrink: 0;
        }
    }
}

.promotion-headline{
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
