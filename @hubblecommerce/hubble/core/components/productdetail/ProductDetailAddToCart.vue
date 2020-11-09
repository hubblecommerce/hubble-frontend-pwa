<template>
    <button :disabled="loaderState" type="button" :title="$t('add_to_cart')" class="add-to-cart m-0 w-100" @click.prevent="addToCart">
        <i class="icon icon-shopping-bag" aria-hidden="true" />
        <span v-if="!loaderState" class="cart-button-label headline-4">{{ $t('add_to_cart') }}</span>
        <loader v-if="loaderState" appearance="ellipsis" />
        <material-ripple />
    </button>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { clearDataLayer } from '@hubblecommerce/hubble/core/utils/gtmHelper';
import Loader from '../utils/Loader';

export default {
    name: 'ProductDetailAddToCart',

    components: { Loader },

    props: {
        item: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            loaderState: false,
            selectedQty: 1,
        };
    },

    computed: {
        ...mapState({
            priceSwitcherIncludeVat: state => state.modPrices.priceSwitcherIncludeVat,
            selectedVariants: state => state.modApiProduct.selectedVariants,
            dataProduct: state => state.modApiProduct.dataProduct,
            cart: state => state.modCart.cart,
        }),
        ...mapGetters({
            getPriceAndCurrencyDecFmt: 'modPrices/getPriceAndCurrencyDecFmt',
        }),
    },

    methods: {
        ...mapMutations({
            resetSelectedVariants: 'modApiProduct/resetSelectedVariants',
            initiateCartLayer: 'modCart/initiateLayer',
        }),
        ...mapActions({
            flashMessage: 'modFlash/flashMessage',
            addItem: 'modCart/addItem',
            toggleOffcanvasAction: 'modNavigation/toggleOffcanvasAction',
        }),
        addToCart() {
            this.loaderState = true;

            // Add selected variant to item
            this.item.variants = this.selectedVariants;

            // Add item and qty to cart store
            this.addItem({ item: this.item, qty: this.selectedQty })
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
                        this.loaderState = false;

                        // Display Success Message
                        this.flashMessage({
                            flashType: 'success',
                            flashMessage: this.$t('Successfully added item to cart.'),
                        });
                    });

                    this.gtmAddToCart();
                })
                .catch(error => {
                    console.log('addItem error: ', error);

                    this.loaderState = false;

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
