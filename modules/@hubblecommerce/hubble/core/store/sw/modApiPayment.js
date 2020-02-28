//
// resources module
//
import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime'
import base64 from "base-64";

export default function (ctx) {

    // Create vuex store module
    const modApiPayment = {
        namespaced: true,
        state: () => ({
            cacheTTL: 60,
            apiAuthResponse: {},
            apiAuthToken: null,

            // Customer
            customer: {
                customerAuth: {},
                customerData: {},
                customerAddresses: [],
                billingAddress: {},
                shippingAddress: {}
            },

            countries: null,

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

            // Cookie
            cookieName: 'hubbleAuthUser',
            cookiePath: '/',
            cookieTTL: 360, // minutes

            // Amazon
            amazonPayError: {},

            // SW
            currentOrder: {}
        }),
        mutations: {
            setApiAuthResponse: (state, payload) => {
                state.apiAuthResponse = payload.data;
                state.apiAuthToken = payload.data.access_token;

                if(payload.cacheable) {
                    let _ttl = payload.cacheTTL || state.cacheTTL;

                    state.apiAuthResponse.created_at_unixtime = datetimeUnixNow();
                    state.apiAuthResponse.expires_at_unixtime = datetimeUnixNowAddSecs(_ttl);
                }
            },
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
            setCountries: (state, payload) => {
                // Sort countries by position
                state.countries = payload.sort((a, b) => {
                    return a.position - b.position;
                });
            },
            clearCustomerData: (state) => {
                state.customer = {
                    customerAuth: {},
                    customerData: {},
                    customerAddresses: [],
                    billingAddress: {},
                    shippingAddress: {}
                }
            }
        },
        getters:  {
            getApiAuthToken: state => {
                return state.apiAuthToken;
            },
            getApiAuthResponse: state => {
                return state.apiAuthResponse;
            },
            getCurrentDate: () => {
                return new Date();
            },
            getCookieExpires: (state) => {
                return new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);
            },
            getJsonEncoded: () => (objJsonStr) => {
                return base64.encode(JSON.stringify(objJsonStr));
            },
            getJsonDecoded: () => (objJsonB64) => {
                return JSON.parse(base64.decode(objJsonB64));
            }
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
                        endpoint: _endpoint,
                        params: {
                            limit: 500
                        }
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

                return new Promise((resolve, reject)  => {
                    dispatch('swGuestOrder', {order: order, swtc: payload.swtc}).then((res) => {
                        commit('setCurrentOrder', res.data.data);
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                });

            },
            async setByCookie({commit, state}) {
                return new Promise((resolve) => {

                    // try to retrieve auth user by cookie
                    let _cookie = this.$cookies.get(state.cookieName);

                    // no cookie? ok!
                    if(! _cookie) {
                        resolve({
                            success: true,
                            message: 'customer not known by cookie.'
                        });
                    } else {
                        // Save cookie to store
                        commit('setCustomer', _cookie);

                        resolve({
                            success: true,
                            message: 'customer taken from cookie.',
                            redirect: true
                        });
                    }
                })
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
            async setAddressByCookie({commit, state, getters}) {
                return new Promise((resolve, reject) => {
                    // try to retrieve address data by cookie
                    let cookie = this.$cookies.get(state.cookieNameAddress);

                    // no cookie? ok!
                    if(! cookie) {
                        resolve({
                            success: false,
                            message: 'adress not known by cookie.'
                        });
                    } else {
                        let cookieAddresses = getters.getJsonDecoded(cookie);
                        let billingAddress = cookieAddresses.billingAddress;
                        let shippingAddress = cookieAddresses.shippingAddress;

                        // Save addresses from cookie to store
                        commit('setBillingAddress', billingAddress);
                        commit('setShippingAddress', shippingAddress);

                        // reset address cookie lifetime
                        this.$cookies.set(state.cookieNameAddress, getters.getJsonEncoded({
                            billingAddress: billingAddress,
                            shippingAddress: shippingAddress
                        }) , {
                            path: state.addressCookiePath,
                            expires: new Date(new Date().getTime() + state.addressCookieTTL * 60 * 1000)
                        });

                        resolve({
                            success: true,
                            message: 'order taken from cookie.',
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
