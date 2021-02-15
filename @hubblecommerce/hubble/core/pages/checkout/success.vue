<template>
    <div class="container checkout-success">
        <div class="checkout-success-wrp">
            <div class="success-msg-wrp">
                <div class="circle-loader" :class="{ 'load-complete': !loading }">
                    <div v-show="!loading" class="checkmark draw" />
                </div>
                <div class="message headline-3" v-text="'Thank you for your order at hubble!'" />
            </div>
            <transition name="fade">
                <div v-if="!loading">
                    <div class="email-info text-center">
                        <span>{{ 'We have sent you an order confirmation by e-mail' }}</span>
                        <span v-if="$data.order != null">{{ 'at ' + order.orderCustomer.email }}</span>
                    </div>
                    <div v-if="$data.order != null" class="email-info text-center" v-text="'Your order number: ' + order.orderNumber" />
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Success',

    async asyncData({ route }) {
        if(route.params.order != null) {
            return { order: route.params.order.data };
        }
    },

    data() {
        return {
            loading: true
        };
    },

    created() {
        setTimeout(() => {
            this.loading = false;
        }, 500);
    },

    head() {
        return {
            meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX, FOLLOW' }]
        };
    }
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.checkout-success {
    .checkout-success-wrp {
        .success-msg-wrp {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            margin: 10px 0 20px;
            padding: 20px;
            border: 1px solid rgba(61, 238, 142, 1);
            background: rgba(61, 238, 142, 0.1);

            i {
                width: 45px;
                height: 45px;
                line-height: 42px;
                margin-bottom: 20px;
                font-size: 30px;
                color: $success-accent;
                border: 3px solid $success-accent;
                border-radius: 70px;
                text-align: center;
            }

            .message {
                color: $success-accent;
                text-align: center;
                text-transform: uppercase;
            }
        }

        .email-info {
            margin-bottom: 20px;
        }

        button {
            width: 100%;
            margin-bottom: 20px;
        }
    }
}

/* Tablet */
@media (min-width: 768px) {
    .checkout-success {
        .checkout-success-wrp {
            .success-msg-wrp {
                .message {
                    font-size: 22px;
                    line-height: 27px;
                }
            }
            button {
                width: auto;
            }
        }
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .checkout-success {
        max-width: 1080px;
    }
}
</style>
