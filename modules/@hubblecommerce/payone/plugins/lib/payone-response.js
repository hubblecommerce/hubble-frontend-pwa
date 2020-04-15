import axios from 'axios';
import { clearDataLayer } from '@hubblecommerce/hubble/core/utils/gtmHelper';

function gtmPurchase(ctx, order) {
    return new Promise(resolve => {
        // GTM ONLY
        if (ctx.app.$gtm) {
            // Push hubble route to simulate successpage
            ctx.app.$gtm.pushEvent({
                event: 'hubbleRoute',
                pageType: 'PageView',
                pageUrl: '/checkout/success',
            });

            clearDataLayer().then(() => {
                let revenue = order.cart.grand_total;
                let products = [];
                let variant = null;
                let tax = order.cart.tax;

                if (order.cart.discount > 0) {
                    revenue = order.cart.grand_total_with_discount;
                    tax = order.cart.tax_with_discount;
                }

                console.log(order.cart.items);

                _.forEach(order.cart.items, item => {
                    if (!_.isEmpty(item.variants)) {
                        variant = item.variants[0].value_id;
                    }

                    let price = item.final_price_item.display_price_brutto;
                    if (ctx.store.getters['modPrices/productIsSpecial'](item)) {
                        price = item.final_price_item.display_price_brutto_special;
                    }

                    products.push({
                        name: item.name_orig, // Name or ID is required.
                        id: item.id,
                        price: price,
                        brand: item.manufacturer_name,
                        variant: variant,
                        quantity: item.qty,
                    });
                });

                ctx.app.$gtm.pushEvent({
                    event: 'purchase',
                    ecommerce: {
                        purchase: {
                            actionField: {
                                id: order.id, // Transaction ID. Required for purchases and refunds.
                                revenue: revenue, // Total transaction value (incl. tax and shipping)
                                tax: tax,
                                shipping: order.shippingCosts,
                            },
                            products: products,
                        },
                        add: undefined,
                        impressions: undefined,
                        detail: undefined,
                        remove: undefined,
                        click: undefined,
                    },
                });

                resolve();
            });
        }
    });
}

export default async ctx => {
    window.processPayoneResponse = function (paymentResponse) {
        // ERROR RESPONSE PAYMENT METHODS
        if (paymentResponse.status === 'ERROR') {
            ctx.store.commit('modApiPayment/resetProcessingCheckout');
            ctx.store.dispatch('modFlash/flashMessage', {
                flashType: 'error',
                flashMessage: paymentResponse.customermessage,
            });

            axios({
                method: 'POST',
                url: '/api/hubble-logger',
                data: {
                    level: 'error',
                    msg: 'payone-response.js processPayoneResponse error: %o',
                    payload: paymentResponse,
                },
            });
            return;
        }

        // Set payment response to finalOrder state
        let order = _.clone(ctx.store.getters['modApiPayment/getFinalOrder']);
        order.chosenPaymentMethod.payload.paymentResponse = paymentResponse;

        // Send order to api and redirect to success page
        ctx.store
            .dispatch('modApiPayment/placeOrder', {
                order: JSON.stringify(order),
            })
            .then(apiResponse => {
                // On request failure, throw error and keep order data
                if (!apiResponse.data.success) {
                    console.log(apiResponse.data.message);
                    ctx.store.commit('modApiPayment/resetProcessingCheckout');
                    return;
                }

                // REDIRECT PAYMENT METHODS E.G. PAYPAL
                // On request success clear data (order, cart)
                // and redirect to success page
                if (paymentResponse.status === 'REDIRECT') {
                    gtmPurchase(ctx, order).then(() => {
                        ctx.store.dispatch('modCart/clearAll').then(() => {
                            ctx.store.dispatch('modApiPayment/clearOrder').then(() => {
                                window.open(paymentResponse.redirecturl, '_self');
                            });
                        });
                    });
                }

                // JSON RESPONSE PAYMENT METHODS
                // On request success clear data (order, cart)
                // and redirect to success page
                if (paymentResponse.status === 'APPROVED') {
                    ctx.store.commit('modApiPayment/resetProcessingCheckout');
                    gtmPurchase(ctx, order).then(() => {
                        ctx.store.dispatch('modCart/clearAll').then(() => {
                            ctx.store.dispatch('modApiPayment/clearOrder').then(() => {
                                ctx.app.router.push({
                                    path: ctx.app.localePath('checkout-success'),
                                });
                            });
                        });
                    });
                }
            })
            .catch(response => {
                ctx.store.dispatch('modFlash/flashMessage', {
                    flashType: 'error',
                    flashMessage: response.message,
                });

                axios({
                    method: 'POST',
                    url: '/api/hubble-logger',
                    data: {
                        level: 'error',
                        msg: 'payone-response.js modApiPayment/placeOrder error: %o',
                        payload: paymentResponse,
                    },
                });

                ctx.store.commit('modApiPayment/resetProcessingCheckout');
            });
    };
};
