<template>
    <hbl-button
        :disabled="isLoading"
        type="button"
        :title="'Add to cart'"
        class="add-to-cart button-primary"
        @click.native="addToCart"
    >
        <span v-if="!isLoading" class="cart-button-label" v-text="'Add to cart'" />
        <loader v-if="isLoading" />
    </hbl-button>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import apiClient from '@/utils/api-client';

export default {
    name: 'ProductDetailAddToCart',

    props: {
        dataProduct: {
            type: Object,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
        },
    },

    computed: {
        ...mapState({
            isLoading: (state) => state.modCart.isLoading,
            contextToken: (state) => state.modSession.contextToken,
            cartItems: (state) => state.modCart.items,
            cartQty: (state) => state.modCart.qty,
        }),
    },

    methods: {
        ...mapMutations({
            setIsLoading: 'modCart/setState',
            setContextToken: 'modSession/setContextToken',
            setCart: 'modCart/setCart',
        }),
        ...mapActions({
            flashMessage: 'modFlashMessage/flashMessage',
            addItem: 'modCart/addItem',
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
        }),
        addToCart: async function () {
            this.setIsLoading({ name: 'isLoading', state: true });

            // Return if qty is not in stock
            if (!this.dataProduct.stock_item.is_in_stock) {
                this.setIsLoading({ name: 'isLoading', state: false });

                return false;
            }

            try {
                if (this.contextToken === null) {
                    await this.initCart();
                }

                await this.addItem(this.dataProduct, this.qty);

                this.toggleOffcanvasAction({
                    component: 'TheCartContext',
                    direction: 'bottomTop',
                }).then(() => {
                    this.setIsLoading({ name: 'isLoading', state: false });

                    // Display Success Message
                    this.flashMessage({
                        type: 'success',
                        text: 'Successfully added item to cart.',
                    });
                });
            } catch (e) {
                this.setIsLoading({ name: 'isLoading', state: false });

                throw e;
            }
        },
        initCart: async function () {
            try {
                let response = await new apiClient().apiCall({
                    action: 'post',
                    endpoint: 'store-api/v3/checkout/cart',
                });

                this.setContextToken(response.data['token']);
            } catch (e) {
                throw e;
            }
        },
        addItem: async function (item, qty) {
            try {
                // Check if item already in cart
                let inCart = false;
                this.cartItems.forEach((cartItem) => {
                    if (cartItem.referencedId === item.id) {
                        inCart = cartItem;
                    }
                });

                // Not in cart yet: add item to cart
                if (!inCart) {
                    let response = await new apiClient().apiCall({
                        action: 'post',
                        endpoint: 'store-api/v3/checkout/cart/line-item',
                        contextToken: this.contextToken,
                        data: {
                            items: [
                                {
                                    type: 'product',
                                    referencedId: item.id,
                                    quantity: qty,
                                },
                            ],
                        },
                    });

                    this.setCart(response);
                }

                // Already in cart: raise item qty
                if (inCart) {
                    let updatedQty = inCart.qty + qty;

                    let response = await new apiClient().apiCall({
                        action: 'patch',
                        endpoint: 'store-api/v3/checkout/cart/line-item',
                        contextToken: this.contextToken,
                        data: {
                            items: [
                                {
                                    id: inCart.id,
                                    quantity: updatedQty,
                                },
                            ],
                        },
                    });

                    this.setCart(response);
                }
            } catch (e) {
                throw e;
            }
        },
    },
};
</script>

<style lang="scss">
@import '~assets/scss/hubble/variables';

.lds-ring {
    div {
        border-color: $secondary transparent transparent transparent !important;
    }
}
</style>
