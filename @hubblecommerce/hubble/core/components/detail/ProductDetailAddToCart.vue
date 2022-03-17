<template>
    <div class="product-detail-add-to-cart-wrp">
        <hbl-button :disabled="isLoading" type="button" :title="'Add to cart'" class="add-to-cart button-primary" @click.native="addToCart">
            <span v-if="!isLoading" class="cart-button-label" v-text="'Add to cart'" />
            <loader v-if="isLoading" />
        </hbl-button>

        <flash-message />
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import ApiClient from '@/utils/api-client';

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

    beforeDestroy() {
        this.setIsLoading({ name: 'isLoading', state: false });
    },

    methods: {
        ...mapMutations({
            setIsLoading: 'modCart/setState',
            setContextToken: 'modSession/setContextToken',
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
                    direction: {
                        sm: 'bottomTop',
                        md: 'rightLeft',
                        lg: 'rightLeft',
                    },
                }).then(() => {
                    this.setIsLoading({ name: 'isLoading', state: false });

                    // Display Success Message
                    this.flashMessage({
                        type: 'success',
                        text: 'Successfully added item to cart.',
                    });
                });

                $nuxt.$emit('product-add-to-cart', {
                    product: {
                        name: this.dataProduct.name_orig != null ? this.dataProduct.name_orig : this.dataProduct.name,
                        id: this.dataProduct.id,
                        sku: this.dataProduct.sku != null ? this.dataProduct.sku : 'undefined',
                        price: this.dataProduct.calculatedPrice.unitPrice,
                        brand: this.dataProduct.manufacturer_name != null ? this.dataProduct.manufacturer_name : 'undefined',
                        quantity: this.qty,
                    },
                });
                
            } catch (e) {
                this.setIsLoading({ name: 'isLoading', state: false });

                this.flashMessage({
                    type: 'error',
                    text: e.title + ' - ' + e.detail,
                });
            }
        },
        initCart: async function () {
            try {
                let response = await new ApiClient(this.$config).apiCall({
                    action: 'post',
                    endpoint: 'store-api/checkout/cart',
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
                    await new ApiClient(this.$config).apiCall({
                        action: 'post',
                        endpoint: 'store-api/checkout/cart/line-item',
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
                }

                // Already in cart: raise item qty
                if (inCart) {
                    let updatedQty = inCart.qty + qty;

                    await new ApiClient(this.$config).apiCall({
                        action: 'patch',
                        endpoint: 'store-api/checkout/cart/line-item',
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

.product-detail-add-to-cart-wrp {
    width: 100%;
    height: 100%;

    .add-to-cart {
        width: 100%;
        height: 100%;
    }

    .loader-wrp {
        height: 25px;
    }

    .flash-message-wrp {
        &.error {
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 100000;
            width: 100%;
        }

        &.success {
            display: none;
        }
    }

    .lds-ring {
        div {
            border-color: $secondary transparent transparent transparent !important;
        }
    }
}

@media (min-width: 768px) {
    .product-detail-add-to-cart-wrp {
        .flash-message-wrp {
            &.error {
                width: 50%;
                height: 20vh;
                top: 0;
                right: 0;
                margin: auto;
            }
        }
    }
}
</style>
