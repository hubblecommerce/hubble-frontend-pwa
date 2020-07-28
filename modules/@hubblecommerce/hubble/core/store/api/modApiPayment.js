//
// resources module
//
import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime'
import base64 from "base-64";
import _ from 'lodash';

export default function (ctx) {

    // Create vuex store module
    const modApiPayment = {
        namespaced: true,
        state: () => ({
            cacheTTL: 60,
            apiAuthResponse: {},
            apiAuthToken: null,

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


            cookiePath: '/',
            cookieTTL: 360, // minutes

            // Amazon
            amazonPayError: {}
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
            setOrderId: (state, payload) => {
                state.order.id = payload;
            },
            setPaymentMethods: (state, payload) => {
                state.paymentMethods = payload;
            },
            setChosenPaymentMethod: (state, payload) => {
                state.order.chosenPaymentMethod = payload;
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
            setPaymentError: (state, payload) => {
                state.paymentError = payload;
            },
            setOrder: (state, payload) => {
                state.order = payload;
            },
            setOrderComment: (state, payload) => {
                state.order.orderComment = payload;
            },
            setShippingMethods: (state, payload) => {
                state.shippingMethods = payload;
            },
            setChosenShippingMethod: (state, payload) => {
                state.order.chosenShippingMethod = payload;
            },
            setShippingError: (state, payload) => {
                state.shippingError = payload;
            },
            setHostedIFrame: (state, payload) => {
                state.hostedIFrame = payload;
            },
            setBeforePlaceOrder: (state) => {
                state.beforePlaceOrder = Date.now();
            },
            setFinalOrder: (state, payload) => {
                state.finalOrder = payload;
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
            setShippingCountryError: (state, payload) => {
                state.shippingCountryError = payload;
            },
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
            },
            getPaymentMethods: state => {
                return state.paymentMethods;
            },
            getChosenPaymentMethod: state => {
                return state.order.chosenPaymentMethod;
            },
            getShippingMethods: state => {
                return state.shippingMethods;
            },
            getChosenShippingMethod: state => {
                return state.order.chosenShippingMethod;
            },
            getOrder: state => {
                return state.order;
            },
            getOrderComment: state => {
                return state.order.orderComment;
            },
            getFinalOrder: state => {
                return state.finalOrder;
            }
        },
        actions: {
            async getUuid({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'api',
                        apiType: 'payment',
                        endpoint: '/api/uuid',
                        data: payload
                    }, { root: true })
                        .then(response => {
                            resolve(response);
                        })
                        .catch(() => {
                            reject('getUuid failed!');
                        });
                });
            },
            async getPaymentMethods({commit, dispatch, rootState, state}, payload) {

                let order = _.clone(rootState.modApiPayment.order);

                order.cart = rootState.modCart.cart;

                let customerId = rootState.modApiCustomer.customer.customerData.id;
                let customerType = customerId === undefined ? 'GUEST' : 'REG';
                order.customer = {
                    customerId: customerId,
                    customerType: customerType,
                    email: rootState.modApiCustomer.customer.customerData.email,
                    firstName: rootState.modApiCustomer.customer.customerData.firstname,
                    lastName: rootState.modApiCustomer.customer.customerData.lastname,
                };

                _.assign(order, {addresses: []});
                order.addresses = rootState.modApiCustomer.customer.customerAddresses;

                let object = {
                    order: JSON.stringify(order),
                    coupon: ""
                };

                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'api',
                        apiType: 'payment',
                        endpoint: '/api/cart/allowed_payments',
                        data: object
                    }, { root: true })
                        .then(response => {
                            // Save payment methods to store
                            commit('setPaymentMethods', response.data.allowed_payments);
                            resolve('OK');
                        })
                        .catch(response => {
                            console.log('getPaymentMethods failed: %o', response);
                            reject('getPaymentMethods failed!');
                        });
                });
            },
            async storeChosenPaymentMethod({commit, state, getters}, payload) {
                return new Promise((resolve) => {

                    commit('setChosenPaymentMethod', payload);

                    // Save order from store to cookie
                    this.$cookies.set(state.cookieNameOrder, state.order, {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve();
                })
            },
            async getShippingMethods({commit, dispatch, rootState, state}, payload) {

                let order = _.clone(rootState.modApiPayment.order);

                order.cart = rootState.modCart.cart;

                let customerId = rootState.modApiCustomer.customer.customerData.id;
                let customerType = customerId === undefined ? 'GUEST' : 'REG';
                order.customer = {
                    customerId: customerId,
                    customerType: customerType,
                    email: rootState.modApiCustomer.customer.customerData.email,
                    firstName: rootState.modApiCustomer.customer.customerData.firstname,
                    lastName: rootState.modApiCustomer.customer.customerData.lastname,
                };

                _.assign(order, {addresses: []});
                order.addresses = rootState.modApiCustomer.customer.customerAddresses;

                let object = {
                    order: JSON.stringify(order),
                    coupon: ""
                };

                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'api',
                        apiType: 'payment',
                        endpoint: '/api/cart/allowed_shippings',
                        data: object
                    }, { root: true })
                        .then(response => {
                            // Save payment methods to store
                            commit('setShippingMethods', response.data.allowed_shippings);
                            resolve('OK');
                        })
                        .catch(response => {
                            console.log('getShippingMethods failed: %o', response);
                            reject('getShippingMethods failed!');
                        });
                });
            },
            async storeChosenShippingMethod({commit, state, getters}, payload) {
                return new Promise((resolve) => {

                    commit('setChosenShippingMethod', payload);

                    // Save order from store to cookie
                    this.$cookies.set(state.cookieNameOrder, state.order, {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve();
                })
            },
            async applyCoupon({commit, dispatch, rootState, state}, payload) {

                let order = _.clone(rootState.modApiPayment.order);

                order.cart = rootState.modCart.cart;

                let customerId = rootState.modApiCustomer.customer.customerData.id;
                let customerType = customerId === undefined ? 'GUEST' : 'REG';
                order.customer = {
                    customerId: customerId,
                    customerType: customerType,
                    email: rootState.modApiCustomer.customer.customerData.email,
                    firstName: rootState.modApiCustomer.customer.customerData.firstname,
                    lastName: rootState.modApiCustomer.customer.customerData.lastname,
                };

                order.addresses = rootState.modApiCustomer.customer.customerAddresses;

                order.coupon_to_apply = payload.coupon;

                let object = {
                    order: JSON.stringify(order)
                };

                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'api',
                        apiType: 'payment',
                        endpoint: '/api/cart/apply_coupon',
                        data: object
                    }, { root: true })
                        .then((response) => {
                            resolve(response.data);
                        })
                        .catch(response => {
                            console.log('applyCoupon failed: %o', response);
                            reject(response.message);
                        });
                });
            },
            // Order Actions
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
            async createOrder({commit, state, rootState, getters}) {
                return new Promise((resolve, reject) => {

                    // Reset payment error
                    commit('setPaymentError', null);

                    // Reject with error message if payment method is not set
                    if(_.isEmpty(state.order.chosenPaymentMethod)) {
                        commit('setPaymentError', 'Please choose a payment method first');
                        reject('Please choose a payment method first');
                    }


                    // set address error
                    commit('setShippingCountryError', null);

                    if(!_.isEmpty(rootState.modApiCustomer.customer.shippingAddress)) {
                        _.forEach(rootState.modApiCustomer.availableCountries, country => {
                            if(rootState.modApiCustomer.customer.shippingAddress.payload.country === country.iso_code_2 && ! country.shipping_status) {
                                commit('setShippingCountryError', 'delivery_notice');
                                reject('delivery_notice');
                            }
                        });
                    }

                    // Reset shipping error
                    commit('setShippingError', null);

                    // Reject with error message if payment method is not set
                    if(_.isEmpty(state.order.chosenShippingMethod)) {
                        commit('setShippingError', 'Please choose a shipping method first');
                        reject('Please choose a shipping method first');
                    }

                    // Save order from store to cookie
                    this.$cookies.set(state.cookieNameOrder, state.order, {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve();
                })
            },
            async placeOrder({dispatch}, payload) {
                return new Promise((resolve, reject) => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'api',
                        apiType: 'payment',
                        endpoint: '/api/orders',
                        data: payload
                    }, { root: true })
                        .then(response => {
                            resolve(response);
                        })
                        .catch(response => {
                            console.log('placeOrder failed: %o', response);
                            reject(response);
                        });
                })
            },
            async asyncSetFinalOrder({commit}, payload) {
                return new Promise(function(resolve, reject) {
                    commit('setFinalOrder', payload);
                    resolve();
                });
            },
            async getOrders({dispatch, getters}, payload) {
                return new Promise((resolve, reject) => {
                    let _endpoint = '/api/customer/orders';

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'customer',
                        apiType: 'payment',
                        endpoint: _endpoint,
                        data: payload
                    }, { root: true })
                        .then(response => {
                            resolve(response.data.items);
                        })
                        .catch(response => {
                            console.log('getOrders failed: %o', response);
                            reject('getOrders failed!');
                        });
                })
            },
            async getOrderById({dispatch, getters}, payload) {

                return new Promise((resolve, reject) => {
                    let _endpoint = _.join([
                        '/api/customer/orders',
                        payload.id
                    ], '/');

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'customer',
                        apiType: 'payment',
                        endpoint: _endpoint,
                        data: payload
                    }, { root: true })
                        .then(response => {
                            resolve(response);
                        })
                        .catch(response => {
                            console.log('getOrderById failed: %o', response);
                            reject('getOrderById failed!');
                        });
                })
            },
            async clearOrder({commit, state}) {
                return new Promise((resolve) => {
                    commit('setOrderComment', '');
                    commit('setChosenPaymentMethod', {});
                    commit('setChosenShippingMethod', {});

                    // Clear order cookie
                    this.$cookies.remove(state.cookieNameOrder);

                    resolve();
                })
            },
            async postForm({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'api',
                        apiType: 'payment',
                        endpoint: '/api/form',
                        data: payload
                    }, { root: true })
                        .then(() => {
                            resolve('OK');
                        })
                        .catch(response => {
                            console.log('postForm failed: %o', response);
                            reject('postForm failed!');
                        });
                });
            },
            async postFormRecaptcha({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'api',
                        apiType: 'payment',
                        endpoint: '/api/form_recaptcha',
                        data: payload
                    }, { root: true })
                        .then(() => {
                            resolve('OK');
                        })
                        .catch(response => {
                            console.log('postFormRecaptcha failed: %o', response);
                            reject('postFormRecaptcha failed!');
                        });
                });
            },
            async postWishlist({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'customer',
                        apiType: 'payment',
                        endpoint: '/api/customer/wishlists',
                        data: payload
                    }, { root: true })
                        .then(() => {
                            dispatch('getWishlist').then(response => {
                                resolve(response);
                            })
                        })
                        .catch(response => {
                            console.log('postWishlist failed: %o', response);
                            reject('postWishlist failed!');
                        });
                });
            },
            async updateWishlist({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'put',
                        tokenType: 'customer',
                        apiType: 'payment',
                        endpoint: '/api/customer/wishlists/' + payload.id,
                        data: payload
                    }, { root: true })
                        .then(() => {
                            resolve('OK');
                        })
                        .catch(response => {
                            console.log('updateWishlist failed: %o', response);
                            reject('updateWishlist failed!');
                        });
                });
            },
            async getWishlist({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'customer',
                        apiType: 'payment',
                        endpoint: '/api/customer/wishlists',
                        params: payload
                    }, { root: true })
                        .then(response => {
                            resolve(response);
                        })
                        .catch(response => {
                            console.log('getWishlist failed: %o', response);
                            reject('getWishlist failed!');
                        });
                });
            },
            async deleteWishlist({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'delete',
                        tokenType: 'customer',
                        apiType: 'payment',
                        endpoint: '/api/customer/wishlists/' + payload.id,
                        params: payload
                    }, { root: true })
                        .then(response => {
                            resolve(response);
                        })
                        .catch(response => {
                            console.log('deleteWishlist failed: %o', response);
                            reject('deleteWishlist failed!');
                        });
                });
            },

        }
    };

    // Register vuex store module
    ctx.store.registerModule('modApiPayment', modApiPayment);
}
