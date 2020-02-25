import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime'
import base64 from "base-64";

/**
 *
 * Shopware store for handling payments
 *
 */
export default function (ctx) {

    // Create vuex store module
    const modApiPayment = {
        namespaced: true,
        state: () => ({
            // Payment
            paymentMethods: {},
            paymentError: null,
            hostedIFrame: null,
            ibanError: null,
            bicError: null,

            // Shipping
            shippingMethods: {},
            shippingError: null,

            // Shipping Country Error
            shippingCountryError: null,

            // Order
            order: {
                id: '',
                orderComment: '',
                chosenPaymentMethod: {},
                chosenShippingMethod: {}
            },
            cookieNameOrder: 'hubbleOrder',
            expressOrderReferenceId: null,

            // Checkout
            beforePlaceOrder: '',
            finalOrder: '',
            processingCheckout: false,


            // Amazon
            amazonPayError: {},

            // SW
            currentOrder: {}
        }),
        mutations: {
            setPseudoCardPan: (state, payload) => {
                state.order.chosenPaymentMethod.payload.pseudoCardPan = payload;
            },
            setCardType: (state, payload) => {
                state.order.chosenPaymentMethod.payload.cardType = payload;
            },
            setCardExpireDate: (state, payload) => {
                state.order.chosenPaymentMethod.payload.cardExpireDate = payload;
            },
            setHostedIFrame: (state, payload) => {
                state.hostedIFrame = payload;
            },
            setProcessingCheckout: (state) => {
                state.processingCheckout = true;
            },
            resetProcessingCheckout: (state) => {
                state.processingCheckout = false;
            },
            setIbanError: (state, payload) => {
                state.ibanError = payload;
            },
            setBicError: (state, payload) => {
                state.bicError = payload;
            },
            setExpressOrderReferenceId: (state, payload) => {
                state.expressOrderReferenceId = payload;
            },
            setAmazonPayError: (state, payload) => {
                state.amazonPayError[payload.key] = payload.msg;
            },
            resetAmazonPayError: (state, payload) => {
                delete state.amazonPayError[payload.key];
            },
            setCurrentOrder: (state, payload) => {
                state.currentOrder = payload;
            },
        },
        getters:  {
        },
        actions: {
            async swGetSalutations({commit, state, dispatch, rootState, getters}, payload) {
                const _endpoint = `/sales-channel-api/v1/salutation`;

                return new Promise((resolve, reject) => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: _endpoint
                    }, { root: true })
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            },
            async swGetCountries({commit, state, dispatch, rootState, getters}, payload) {
                const _endpoint = `/sales-channel-api/v1/country`;

                return new Promise((resolve, reject) => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: _endpoint
                    }, { root: true })
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            },
            swGuestOrder({commit, state, dispatch, rootState, getters}, payload) {
                const _endpoint = `/sales-channel-api/v1/checkout/guest-order`;

                return new Promise((resolve, reject) => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: payload.swtc,
                        endpoint: _endpoint,
                        data: payload.order
                    }, { root: true })
                        .then(response => {
                            console.log(response);
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                });
            },
            async placeOrder({dispatch, commit}, payload) {

                let order = payload.order;

                // Get salutation uuid
                const salutations = await dispatch('swGetSalutations');
                const salutation = _.find(salutations.data.data, function(o) { return o.salutationKey === 'not_specified'; });

                // Set salutation uuid
                order.salutationId = salutation.id;
                order.billingAddress.salutationId = salutation.id;

                // Get country uuid
                const countries = await dispatch('swGetCountries');
                const country = _.find(countries.data.data, function(o) { return o.iso === 'DE'; });

                // Set country uuid
                order.billingAddress.countryId = country.id;

                return new Promise((resolve, reject)  => {
                    dispatch('swGuestOrder', {order: order, swtc: payload.swtc}).then((res) => {
                        commit('setCurrentOrder', res.data.data);
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                });

            },
            async setOrderByCookie({commit, state}) {
                return new Promise((resolve) => {

                    // try to retrieve auth user by cookie
                    let _cookie = this.$cookies.get(state.cookieNameOrder);

                    // no cookie? ok!
                    if(! _cookie) {
                        resolve({
                            success: true,
                            message: 'order not known by cookie.'
                        });
                    } else {
                        // Save cookie to store
                        commit('setOrder', _cookie);

                        resolve({
                            success: true,
                            message: 'order taken from cookie.',
                            redirect: true
                        });
                    }
                })
            },
            async applyCoupon({commit, dispatch, rootState, state}, payload) {
                return new Promise((resolve, reject)  => {
                    reject('Sorry, coupons are currently not available.');
                });
            }
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modApiPayment', modApiPayment);
}
