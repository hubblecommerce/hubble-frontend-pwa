<template>
    <div v-if="!loading && !apiError" class="shipping-methods-wrp">
        <div class="headline headline-5" v-text="'Shipping methods'" />

        <hbl-checkbox v-for="method in shippingMethods" v-if="method.active" :key="method.id" class="method-wrp">
            <input :id="'shipping-option-' + method.id" v-model="currentMethod" type="radio" :value="method.id" :disabled="processingCheckout" />
            <label :for="'shipping-option-' + method.id" class="method-label">
                <span class="name" v-text="method.translated.name" />
                <span class="description" v-text="method.translated.description" />
            </label>
        </hbl-checkbox>

        <div v-if="shippingError != null" class="validation-msg" v-text="shippingError" />
    </div>

    <div v-else-if="apiError" class="shipping-methods-api-error-wrp"> No shipping methods found </div>

    <loader v-else class="shipping-methods-placeholder" />
</template>

<script>
import { mapState } from 'vuex';
import ApiClient from '@/utils/api-client';

export default {
    name: 'ShippingMethods',

    props: {
        processingCheckout: {
            type: Boolean,
            required: true,
        },
        sessionShippingMethod: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            loading: false,
            apiError: false, // Error in case of api throws error
            shippingError: null, // Error that could happen on method selection
            shippingMethods: null,
            currentMethod: null,
        };
    },

    computed: {
        ...mapState({
            contextToken: (state) => state.modSession.contextToken,
        }),
    },

    watch: {
        currentMethod: async function (id) {
            if (id === null) {
                this.shippingError = 'Please choose a shipping method.';
                this.$emit('shipping-error', true);
                return;
            }

            this.shippingError = null;
            this.$emit('processing', true);

            try {
                await this.setShippingMethod(id);
                this.$emit('processing', false);
                this.$emit('shipping-error', false);
                this.$emit('shipping-changed');
            } catch (e) {
                this.shippingError = e.detail;
                this.$emit('processing', false);
                this.$emit('shipping-error', true);
            }
        },
    },

    async mounted() {
        this.loading = true;

        try {
            const response = await this.fetchShippingMethods();
            this.shippingMethods = response.data.elements;

            this.currentMethod = this.sessionShippingMethod;
            this.loading = false;
        } catch (e) {
            this.apiError = true;
            this.loading = false;
        }
    },

    methods: {
        fetchShippingMethods: async function () {
            return await new ApiClient(this.$config).apiCall({
                action: 'post',
                endpoint: 'store-api/shipping-method',
                contextToken: this.contextToken,
                data: {
                    onlyAvailable: true,
                },
            });
        },
        setShippingMethod: async function (id) {
            return await new ApiClient(this.$config).apiCall({
                action: 'patch',
                endpoint: 'store-api/context',
                contextToken: this.contextToken,
                data: {
                    shippingMethodId: id,
                },
            });
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.shipping-methods-wrp {
    margin-bottom: 30px;

    .headline {
        margin-bottom: 10px;
    }

    .method-wrp {
        padding: 0 15px;
        border: 1px solid $border-color;
        margin-bottom: 5px;

        .method-label {
            width: 100%;
            padding-top: 20px;
            padding-bottom: 20px;
        }

        .name {
            font-size: 16px;
        }

        .description {
            display: none;
        }
    }
}

.shipping-methods-placeholder {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.shipping-methods-api-error-wrp {
    color: $error-accent;
    margin: 20px 0;
}

/* Tablet */
@media (min-width: 768px) {
    .shipping-methods-wrp {
        .method-wrp {
            .description {
                display: inline;
                margin-left: 20px;
            }
        }
    }
}
</style>
