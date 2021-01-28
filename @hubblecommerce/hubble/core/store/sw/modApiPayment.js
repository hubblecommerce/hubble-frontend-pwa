import _ from 'lodash';

export const state = () => ({
    // Payment
    paymentMethods: {},
    paymentError: null,
    hostedIFrame: null,
    ibanError: null,
    bicError: null,

    // Shipping
    shippingMethods: {},
    shippingError: null,

    // Order
    order: {
        id: '',
        orderComment: '',
        chosenPaymentMethod: {},
        chosenShippingMethod: {},
    },
    cookieNameOrder: 'hubbleOrder',

    // SW
    currentOrder: {},

    // Checkout
    processingCheckout: false,
});

export const mutations = {
    // Payment
    setPaymentMethods(state, payload) {
        state.paymentMethods = payload;
    },
    setPaymentError(state, payload) {
        state.paymentError = payload;
    },
    setHostedIFrame(state, payload) {
        state.hostedIFrame = payload;
    },
    setIbanError(state, payload) {
        state.ibanError = payload;
    },
    setBicError(state, payload) {
        state.bicError = payload;
    },
    // Shipping
    setShippingMethods(state, payload) {
        state.shippingMethods = payload;
    },
    setShippingError(state, payload) {
        state.shippingError = payload;
    },
    // Order
    setOrder(state, payload) {
        state.order = payload;
    },
    setChosenPaymentMethod(state, payload) {
        state.order.chosenPaymentMethod = payload;
    },
    setChosenShippingMethod(state, payload) {
        state.order.chosenShippingMethod = payload;
    },
    setPseudoCardPan(state, payload) {
        state.order.chosenPaymentMethod.payload.pseudoCardPan = payload;
    },
    setCardType(state, payload) {
        state.order.chosenPaymentMethod.payload.cardType = payload;
    },
    setCardExpireDate(state, payload) {
        state.order.chosenPaymentMethod.payload.cardExpireDate = payload;
    },
    // SW
    setCurrentOrder(state, payload) {
        state.currentOrder = payload;
    },
    // Checkout
    setProcessingCheckout(state) {
        state.processingCheckout = true;
    },
    resetProcessingCheckout(state) {
        state.processingCheckout = false;
    },
};

export const getters = {
    getCookieExpires(state) {
        return new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);
    },
    getChosenPaymentMethod(state) {
        return state.order.chosenPaymentMethod;
    },
    getChosenShippingMethod(state) {
        return state.order.chosenShippingMethod;
    },
};

export const actions = {
    async swGuestOrder({ dispatch }, payload) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: payload.swtc,
                    endpoint: '/sales-channel-api/v3/checkout/guest-order',
                    data: payload.order,
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    console.log('swGuestOrder error: ', error);

                    reject(error);
                });
        });
    },
    async placeGuestOrder({ dispatch, commit, rootState }) {
        const customerData = rootState.modApiCustomer.customer.customerData;
        let order = {
            guest: customerData.guest,
            salutationId: customerData.salutationId,
            email: customerData.email,
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            password: customerData.password,
            storefrontUrl: process.env.API_BASE_URL + '/',
        };

        _.forEach(rootState.modApiCustomer.customer.customerAddresses, (address) => {
            if (address.is_billing_default) {
                order.billingAddress = {
                    salutationId: address.payload.gender,
                    firstName: address.payload.firstName,
                    lastName: address.payload.lastName,
                    street: address.payload.street,
                    zipcode: address.payload.postal,
                    city: address.payload.city,
                    countryId: address.payload.country,
                };
            }
            if (address.is_shipping_default) {
                order.shippingAddress = {
                    salutationId: address.payload.gender,
                    firstName: address.payload.firstName,
                    lastName: address.payload.lastName,
                    street: address.payload.street,
                    zipcode: address.payload.postal,
                    city: address.payload.city,
                    countryId: address.payload.country,
                };
            }
        });

        return new Promise((resolve, reject) => {
            dispatch('swGuestOrder', { order: order, swtc: rootState.modCart.swtc })
                .then((res) => {
                    dispatch('modCart/refreshCart', {}, { root: true })
                        .then(() => {
                            dispatch('clearOrder').then(() => {
                                commit('setCurrentOrder', res.data.data);

                                commit(
                                    'modApiCustomer/setCustomerAuth',
                                    { token: res.data['sw-context-token'] },
                                    { root: true }
                                );

                                resolve(res.data);
                            });
                        })
                        .catch((err) => {
                            console.log('clearAll error: ', err);

                            reject(err);
                        });
                })
                .catch((error) => {
                    console.log('swGuestOrder error: ', error);

                    reject(error);
                });
        });
    },
    async swPlaceOrder({ dispatch, rootState }) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: rootState.modApiCustomer.customer.customerAuth.token,
                    endpoint: '/store-api/v3/checkout/order',
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response);
                })
                .catch((response) => {
                    console.log('swPlaceOrder - API post request failed: %o', response);

                    reject(response);
                });
        });
    },
    async swStartPayment({ dispatch, rootState }, payload) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: rootState.modApiCustomer.customer.customerAuth.token,
                    endpoint: 'store-api/v3/handle-payment',
                    data: {
                        orderId: payload,
                        finishUrl: process.env.SW_PAYMENT_FINISH_URL+'?orderId='+payload,
                        errorUrl: process.env.SW_PAYMENT_ERROR_URL+'?orderId='+payload
                    }
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response);
                })
                .catch((response) => {
                    console.log('swStartPayment - API post request failed: %o', response);

                    reject(response);
                });
        });
    },
    async swResetPayment({ dispatch, rootState }, payload) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: rootState.modApiCustomer.customer.customerAuth.token,
                    endpoint: 'store-api/v3/order/payment',
                    data: payload
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response);
                })
                .catch((response) => {
                    console.log('swResetPayment - API post request failed: %o', response);

                    reject(response);
                });
        });
    },
    async swSetPaymentMethodSettings({ dispatch, rootState }, payload) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'patch',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: rootState.modApiCustomer.customer.customerAuth.token,
                    endpoint: 'stripe-payment/payment-method-settings',
                    data: payload
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response);
                })
                .catch((response) => {
                    console.log('swSetPaymentMethodSettings - API post request failed: %o', response);

                    reject(response);
                });
        });
    },
    async validateOrder({ commit, state }) {
        return new Promise((resolve, reject) => {
            // Reset payment error
            commit('setPaymentError', null);

            // Reject with error message if payment method is not set
            if (_.isEmpty(state.order.chosenPaymentMethod)) {
                commit('setPaymentError', 'Please choose a payment method first');
                reject('Please choose a payment method first');
            }

            // Reset shipping error
            commit('setShippingError', null);

            // Reject with error message if payment method is not set
            if (_.isEmpty(state.order.chosenShippingMethod)) {
                commit('setShippingError', 'Please choose a shipping method first');
                reject('Please choose a shipping method first');
            }

            resolve();
        });
    },
    async placeOrder({ dispatch }) {
        return new Promise((resolve, reject) => {
            dispatch('swPlaceOrder')
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    console.log('placeOrder error: ', err);
                    reject(err);
                });
        });
    },
    async setOrderByCookie({ commit, state }) {
        return new Promise((resolve) => {
            // try to retrieve auth user by cookie
            let _cookie = this.$cookies.get(state.cookieNameOrder);

            // no cookie? ok!
            if (!_cookie) {
                resolve({
                    success: true,
                    message: 'order not known by cookie.',
                });
            } else {
                // Save cookie to store
                commit('setOrder', _cookie);

                resolve({
                    success: true,
                    message: 'order taken from cookie.',
                    redirect: true,
                });
            }
        });
    },
    async applyCoupon() {
        return new Promise((resolve, reject) => {
            reject('Sorry, coupons are currently not available.');
        });
    },
    async getPaymentMethods({ commit, dispatch, rootState }) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: rootState.modApiCustomer.customer.customerAuth.token,
                    endpoint: '/store-api/v3/payment-method',
                    data: {
                        onlyAvailable: true
                    },
                },
                { root: true }
            )
                .then((response) => {
                    // Save payment methods to store
                    commit('setPaymentMethods', response.data);

                    resolve('OK');
                })
                .catch((response) => {
                    console.log('getPaymentMethods failed: %o', response);

                    reject('getPaymentMethods failed!');
                });
        });
    },
    async getShippingMethods({ commit, dispatch, rootState }) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: rootState.modApiCustomer.customer.customerAuth.token,
                    endpoint: '/store-api/v3/shipping-method',
                    data: {
                        onlyAvailable: true
                    }
                },
                { root: true }
            )
                .then((response) => {
                    // Save payment methods to store
                    commit('setShippingMethods', response.data);

                    resolve('OK');
                })
                .catch((response) => {
                    console.log('getShippingMethods failed: %o', response);

                    reject(response);
                });
        });
    },
    async swSetPaymentMethod({ dispatch, rootState }, payload) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'patch',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: rootState.modApiCustomer.customer.customerAuth.token,
                    endpoint: '/store-api/v3/context',
                    data: {
                        paymentMethodId: payload.id,
                    },
                },
                { root: true }
            )
                .then(() => {
                    // Save payment methods to store
                    resolve('OK');
                })
                .catch((response) => {
                    console.log('swSetPaymentMethod failed: %o', response);

                    reject(response);
                });
        });
    },
    async storeChosenPaymentMethod({ commit, state, getters, dispatch }, payload) {
        return new Promise((resolve, reject) => {
            dispatch('swSetPaymentMethod', payload)
                .then(() => {
                    commit('setChosenPaymentMethod', payload);

                    // Save order from store to cookie
                    this.$cookies.set(state.cookieNameOrder, state.order, {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires,
                    });

                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    async swSetShippingMethod({ dispatch, rootState }, payload) {
        return new Promise((resolve, reject) => {
            if (_.isEmpty(payload)) {
                resolve();
            }

            dispatch(
                'apiCall',
                {
                    action: 'patch',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: rootState.modApiCustomer.customer.customerAuth.token,
                    endpoint: '/store-api/v3/context',
                    data: {
                        shippingMethodId: payload.id,
                    },
                },
                { root: true }
            )
                .then(() => {
                    // Save payment methods to store
                    resolve('OK');
                })
                .catch((response) => {
                    console.log('swSetShippingMethod failed: %o', response);

                    reject(response);
                });
        });
    },
    async storeChosenShippingMethod({ commit, state, getters, dispatch }, payload) {
        return new Promise((resolve, reject) => {
            dispatch('swSetShippingMethod', payload)
                .then(() => {
                    commit('setChosenShippingMethod', payload);

                    // Save order from store to cookie
                    this.$cookies.set(state.cookieNameOrder, state.order, {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires,
                    });

                    resolve();
                })
                .catch((err) => {
                    console.log('storeChosenShippingMethod failed: ', err);

                    reject(err);
                });
        });
    },
    async clearOrder({ commit, state }) {
        return new Promise((resolve) => {
            commit('setChosenPaymentMethod', {});

            commit('setChosenShippingMethod', {});

            // Clear order cookie
            this.$cookies.remove(state.cookieNameOrder);

            resolve();
        });
    },
};
