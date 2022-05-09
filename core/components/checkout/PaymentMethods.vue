<template>
    <div>
        <div v-if="!loading && !apiError" class="payment-methods-wrp">
            <div class="headline headline-5" v-text="'Payment'" />

            <!-- Dynamic payment methods from api -->
            <div v-for="method in paymentMethods" v-if="method.active" :key="method.id" class="method-wrp">
                <hbl-checkbox>
                    <input
                        :id="'payment-option-' + method.id"
                        v-model="currentMethod"
                        type="radio"
                        :value="method.id"
                        :disabled="processingCheckout"
                    />
                    <label :for="'payment-option-' + method.id" class="method-label">
                        <span class="name" v-text="method.name" />
                        <span class="description" v-text="method.description" />
                    </label>

                    <plugin-slot name="checkout-payment-methods-method" :events="events" :data="{method: method, contextToken: contextToken, currentMethod: currentMethod, currentMethodObj: currentMethodObj, showModal: showModal}" />
                </hbl-checkbox>
            </div>

            <!-- Error if no payment isset -->
            <div class="validation-msg" v-text="paymentError" />
        </div>

        <div v-else-if="apiError" class="payment-methods-api-error-wrp"> No payment methods found </div>

        <loader v-else />

        <div v-show="showModal" class="payment-methods-modal">
            <plugin-slot name="checkout-payment-methods-after" :events="events" :data="{contextToken: contextToken, currentMethod: currentMethod, currentMethodObj: currentMethodObj, showModal: showModal}" />
        </div>
    </div>
</template>

<script>
import ApiClient from '@/utils/api-client';
import { useContext, ssrRef, useStore, watch, computed } from '@nuxtjs/composition-api';
import PluginSlot from "@/components/utils/PluginSlot";

export default {
    name: 'PaymentMethods',
    components: {PluginSlot},
    props: {
        processingCheckout: {
            type: Boolean,
            required: true,
        },
        sessionPaymentMethod: {
            type: String,
            required: true,
        },
    },

    setup(props, context) {
        const { $config } = useContext();
        const store = useStore();
        let contextToken = computed(() => store.state.modSession.contextToken);
        if (process.server) {
            contextToken = computed(() => context.root.$cookies.get(store.state.modSession.cookieName));
        }

        let currentMethod = ssrRef('');
        let currentMethodObj = ssrRef({});
        let paymentError = ssrRef(null); // Error that could happen on method selection
        let paymentMethods = ssrRef(null);
        let showModal = ssrRef(false);

        const events = ssrRef({
            'update:showModal': (bool) => { showModal.value = bool; },
            'update:currentMethod': (data) => { currentMethod.value = data; },
            'update:currentMethodObj': (data) => { currentMethodObj.value = data; },
            'on:payment-error': (error) => { paymentError.value = error; }
        });

        const setPaymentMethod =  async function (id) {
            return await new ApiClient($config).apiCall({
                action: 'patch',
                endpoint: 'store-api/context',
                contextToken: contextToken.value,
                data: {
                    paymentMethodId: id,
                },
            });
        };

        const getMethodById = async function (id) {
            let obj = {};
            paymentMethods.value.forEach((val) => {
                if (val.id === id) {
                    obj = val;
                }
            });
            return obj;
        };

        watch(currentMethod, async (id) => {
            if (id === '') {
                paymentError.value = 'Please choose a payment method.';
                context.emit('payment-changed', {});
                context.emit('payment-error', true);
                return;
            }

            paymentError.value = null;
            context.emit('processing', true);

            try {
                await setPaymentMethod(id);

                currentMethodObj.value = await getMethodById(id);

                context.emit('processing', false);
                context.emit('payment-error', false);
                context.emit('payment-changed', currentMethodObj.value);
                $nuxt.$emit('checkout-payment-method-changed', {
                    checkout: {
                        actionField: { option: currentMethodObj.value.name }
                    }
                })
            } catch (e) {
                paymentError.value = e.detail;
                context.emit('processing', false);
                context.emit('payment-error', true);
            }
        });

        return {
            currentMethod,
            currentMethodObj,
            paymentError,
            paymentMethods,
            contextToken,
            showModal,
            setPaymentMethod,
            getMethodById,
            events
        }
    },

    data() {
        return {
            loading: false,
            apiError: false, // Error in case of api throws error
        };
    },

    async mounted() {
        this.loading = true;

        try {
            const response = await this.fetchPaymentMethods();
            this.paymentMethods = response.data.elements;

            this.currentMethod = this.sessionPaymentMethod;
            this.currentMethodObj = await this.getMethodById(this.sessionPaymentMethod);
            this.loading = false;
        } catch (e) {
            this.apiError = true;
            this.loading = false;
        }
    },

    methods: {
        fetchPaymentMethods: async function () {
            return await new ApiClient(this.$config).apiCall({
                action: 'post',
                endpoint: 'store-api/payment-method',
                contextToken: this.contextToken.value,
                data: {
                    onlyAvailable: true,
                },
            });
        }
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.loader-wrp {
    width: 100%;
    height: 400px;

    display: flex;
    justify-content: center;
    align-items: center;
}

.payment-methods-wrp {
    margin-bottom: 30px;

    .headline {
        margin-bottom: 10px;
    }

    .method-wrp {
        padding: 0 15px;
        border: 1px solid $border-color;
        margin-bottom: 5px;

        .hbl-checkbox {
            margin: 0;
        }

        .method-label {
            width: 100%;
            padding-top: 20px;
            padding-bottom: 20px;
            padding-right: 130px;
        }

        .name {
            font-size: 16px;
        }

        .description {
            display: none;
        }
    }
}

.payment-methods-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);

    .payment-content-wrp {
        margin: auto;
        max-width: 100%;
        width: 450px;
        background: $white;
        padding: 40px;
    }
}

.payment-methods-placeholder {
    height: 260px;

    display: flex;
    justify-content: center;
    align-items: center;
}

.payment-methods-api-error-wrp {
    color: $error-accent;
    margin: 20px 0;
}

/* Tablet */
@media (min-width: 768px) {
    .payment-methods-wrp {
        .method-wrp {
            .description {
                display: inline;
                margin-left: 20px;
            }
        }
    }

    .payment-methods-modal {
        .payment-content-wrp {
            margin: 40px auto auto;
        }
    }
}
</style>
