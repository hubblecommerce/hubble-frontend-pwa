<template>
    <button
        :disabled="isLoading"
        type="button"
        :title="$t('add_to_cart')"
        class="add-to-cart button-primary"
        @click.prevent="addToCart"
    >
        <i v-if="!isLoading" class="icon icon-shopping-bag" aria-hidden="true" />
        <span v-if="!isLoading" class="cart-button-label" v-text="$t('add_to_cart')" />
        <loader v-if="isLoading" :appearance="loaderDisplay" />
        <material-ripple />
    </button>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { clearDataLayer } from '@hubblecommerce/hubble/core/utils/gtmHelper';

export default {
    name: 'ProductDetailAddToCart',

    components: {
        Loader: () => import('../utils/Loader'),
    },

    props: {
        item: {
            type: Object,
            required: true,
        },
        qty: {
            type: Number,
            required: false,
        },
        loaderDisplay: {
            type: String,
        },
    },

    data() {
        return {
            selectedQty: 1,
        };
    },

    computed: {
        ...mapState({
            priceSwitcherIncludeVat: (state) => state.modPrices.priceSwitcherIncludeVat,
            selectedVariants: (state) => state.modApiProduct.selectedVariants,
            dataProduct: (state) => state.modApiProduct.dataProduct,
            cart: (state) => state.modCart.cart,
            isLoading: (state) => state.modCart.isLoading
        }),
        ...mapGetters({
            getPriceAndCurrencyDecFmt: 'modPrices/getPriceAndCurrencyDecFmt',
        }),
    },

    methods: {
        ...mapMutations({
            resetSelectedVariants: 'modApiProduct/resetSelectedVariants',
            initiateCartLayer: 'modCart/initiateLayer',
            setIsLoading: 'modCart/setIsLoading'
        }),
        ...mapActions({
            flashMessage: 'modFlash/flashMessage',
            addItem: 'modCart/addItem',
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
        }),
        addToCart() {
            this.setIsLoading(true);

            // Add selected variant to item
            this.item.variants = this.selectedVariants;

            // Add item and qty to cart store
            let qty = this.qty != null ? this.qty : this.selectedQty;

            // Return if qty is not in stock
            if(!this.dataProduct.result.item.stock_item.is_in_stock) {
                this.setIsLoading(false);

                // Display Error Message (eg. Qty of item is at maxQty)
                this.flashMessage({
                    flashType: 'error',
                    flashMessage: 'Not enough Products in stock.',
                });

                return false;
            }

            this.addItem({ item: this.item, qty: qty })
                .then(() => {
                    if (process.env.API_TYPE === 'api') {
                        this.resetSelectedVariants();
                    }

                    // Load and open Minicart Context
                    this.initiateCartLayer();
                    this.toggleOffcanvasAction({
                        component: 'TheMiniCart',
                        direction: 'rightLeft',
                    }).then(() => {
                        this.setIsLoading(false);

                        // Display Success Message
                        this.flashMessage({
                            flashType: 'success',
                            flashMessage: this.$t('Successfully added item to cart.'),
                        });
                    });

                    this.gtmAddToCart();
                })
                .catch((error) => {
                    console.log('addItem error: ', error);

                    this.setIsLoading(false);

                    // Display Error Message (eg. Qty of item is at maxQty)
                    this.flashMessage({
                        flashType: 'error',
                        flashMessage:
                            error === 'No network connection' || error === 'Product could not be saved to cart'
                                ? this.$t(error)
                                : this.$t('An error occurred'),
                    });
                });
        },
        gtmAddToCart: function () {
            if (this.$gtm) {
                clearDataLayer().then(() => {
                    let price = this.getPriceAndCurrency('display_price_brutto', this.priceSwitcherIncludeVat);

                    if (this.itemIsSpecial) {
                        price = this.getPriceAndCurrency('display_price_brutto_special', this.priceSwitcherIncludeVat);
                    }

                    this.$gtm.pushEvent({
                        event: 'addToCart',
                        ecommerce: {
                            currencyCode: 'EUR',
                            add: {
                                products: [
                                    {
                                        name: this.item.name,
                                        id: this.item.id,
                                        price: price,
                                        brand: this.item.manufacturer_name,
                                        variant: this.item.variants,
                                        quantity: this.selectedQty,
                                    },
                                ],
                            },
                            impressions: undefined,
                            detail: undefined,
                            remove: undefined,
                            click: undefined,
                            purchase: undefined,
                        },
                    });
                });
            }
        },
        getPriceAndCurrency(key, addVat) {
            return this.getPriceAndCurrencyDecFmt(this.item.final_price_item[key], addVat, this.itemTaxClass);
        },
    },
};
</script>
