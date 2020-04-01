export default function (ctx) {
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
            currentOrder: {},
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
            /*
            * Order mutations
            * */
            setChosenPaymentMethod: (state, payload) => {
                state.order.chosenPaymentMethod = payload;
            },
            setChosenShippingMethod: (state, payload) => {
                state.order.chosenShippingMethod = payload;
            },
            setPaymentError: (state, payload) => {
                state.paymentError = payload;
            },
            setShippingError: (state, payload) => {
                state.shippingError = payload;
            },
            setOrder: (state, payload) => {
                state.order = payload;
            },
            setPaymentMethods: (state, payload) => {
                state.paymentMethods = payload;
            },
            setShippingMethods: (state, payload) => {
                state.shippingMethods = payload;
            }
        },
        getters:  {
            getChosenPaymentMethod: state => {
                return state.order.chosenPaymentMethod;
            },
            getChosenShippingMethod: state => {
                return state.order.chosenShippingMethod;
            },
            getCookieExpires: (state) => {
                return new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);
            }
        },
        actions: {
            async swGuestOrder({commit, state, dispatch, rootState, getters}, payload) {
                return new Promise((resolve, reject) => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: payload.swtc,
                        endpoint: '/sales-channel-api/v1/checkout/guest-order',
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
            async placeGuestOrder({dispatch, commit}, payload) {

                let order = payload.order;

                // Set salutation uuid
                order.billingAddress.salutationId = order.salutationId;

                return new Promise((resolve, reject)  => {
                    dispatch('swGuestOrder', {order: order, swtc: payload.swtc}).then((res) => {
                        dispatch('modCart/clearAll', {}, {root:true}).then(() => {

                            dispatch('clearOrder').then(() => {

                                commit('setCurrentOrder', res.data.data);

                                commit('modApiCustomer/setCustomerAuth', {token: res.data['sw-context-token']}, { root: true });

                                resolve(res);

                            })
                        });
                    }).catch((error) => {
                        reject(error);
                    });
                });

            },
            async swPlaceOrder({dispatch, rootState}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: rootState.modApiCustomer.customer.customerAuth.token,
                        endpoint: '/sales-channel-api/v1/checkout/order',
                    }, { root: true })
                        .then((response) => {
                            resolve(response);
                        })
                        .catch(response => {
                            console.log("API post request failed: %o", response);
                            reject(response);
                        });
                });
            },
            async swStartPayment({dispatch, state, rootState}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: rootState.modApiCustomer.customer.customerAuth.token,
                        endpoint: `/sales-channel-api/v1/checkout/order/${payload}/pay`,
                    }, { root: true })
                        .then((response) => {
                            resolve(response);
                        })
                        .catch(response => {
                            console.log("API post request failed: %o", response);
                            reject(response);
                        });
                });
            },
            async validateOrder({dispatch, commit, state}, payload) {
                return new Promise((resolve, reject)  => {
                    // Reset payment error
                    commit('setPaymentError', null);

                    // Reject with error message if payment method is not set
                    if(_.isEmpty(state.order.chosenPaymentMethod)) {
                        commit('setPaymentError', 'Please choose a payment method first');
                        reject('Please choose a payment method first');
                    }

                    // Reset shipping error
                    commit('setShippingError', null);

                    // Reject with error message if payment method is not set
                    if(_.isEmpty(state.order.chosenShippingMethod)) {
                        commit('setShippingError', 'Please choose a shipping method first');
                        reject('Please choose a shipping method first');
                    }

                    resolve();
                });
            },
            async placeOrder({dispatch, commit, state}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('swPlaceOrder').then((response) => {

                        dispatch('modCart/clearAll', {}, {root:true}).then(() => {

                            dispatch('clearOrder').then(() => {

                                commit('setCurrentOrder', response.data.data);

                                resolve(response);

                            })
                        });

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
            },
            /*
            * Checkout Actions
            */
            async getPaymentMethods({commit, dispatch, rootState, state}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: '/sales-channel-api/v1/payment-method',
                        params: {
                            limit: 500
                        }
                    }, { root: true })
                        .then(response => {
                            // Map Payone Keys to Payment Methods od Payone
                            // No other way to set those keys at the moment
                            // Need payone keys to call payone api
                            // TODO: Implement payone key via api
                            let mappedPayments = [];

                            _.forEach(response.data.data, (val) => {

                                if(val.name === 'Payone PayPal') {
                                    val.key = 'payone_wlt'
                                }

                                if(val.name === 'Payone Credit Card') {
                                    val.key = 'payone_cc'
                                }

                                if(val.name === 'Payone Paysafe Pay Later Invoice') {
                                    val.key = 'payone_rec'
                                }

                                if(val.name === 'Paid in advance') {
                                    val.key = 'payone_vor'
                                }

                                mappedPayments.push(val);
                            });

                            // Save payment methods to store
                            commit('setPaymentMethods', mappedPayments);
                            resolve('OK');
                        })
                        .catch(response => {
                            console.log('getPaymentMethods failed: %o', response);
                            reject('getPaymentMethods failed!');
                        });
                });
            },
            async getShippingMethods({commit, dispatch, rootState, state}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: '/sales-channel-api/v1/shipping-method'
                    }, { root: true })
                        .then(response => {
                            // Save payment methods to store
                            commit('setShippingMethods', response.data.data);
                            resolve('OK');
                        })
                        .catch(response => {
                            console.log('getShippingMethods failed: %o', response);
                            reject('getShippingMethods failed!');
                        });
                });
            },
            async swSetPaymentMethod({commit, dispatch, rootState, state}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'patch',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: rootState.modApiCustomer.customer.customerAuth.token,
                        endpoint: '/sales-channel-api/v1/context',
                        data: {
                            paymentMethodId: payload.id
                        }
                    }, { root: true })
                        .then(response => {
                            // Save payment methods to store
                            resolve('OK');
                        })
                        .catch(response => {
                            console.log('swSetPaymentMethod failed: %o', response);
                            reject('swSetPaymentMethod failed!');
                        });
                });
            },
            async storeChosenPaymentMethod({commit, state, getters, dispatch}, payload) {
                return new Promise((resolve) => {

                    dispatch('swSetPaymentMethod', payload).then(() => {
                        commit('setChosenPaymentMethod', payload);

                        // Save order from store to cookie
                        this.$cookies.set(state.cookieNameOrder, state.order, {
                            path: state.cookiePath,
                            expires: getters.getCookieExpires
                        });

                        resolve();
                    })

                })
            },
            async swSetShippingMethod({commit, dispatch, rootState, state}, payload) {
                return new Promise((resolve, reject)  => {

                    if(_.isEmpty(payload)) {
                        resolve();
                    }

                    dispatch('apiCall', {
                        action: 'patch',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: rootState.modApiCustomer.customer.customerAuth.token,
                        endpoint: '/sales-channel-api/v1/context',
                        data: {
                            shippingMethodId: payload.id
                        }
                    }, { root: true })
                        .then(response => {
                            // Save payment methods to store
                            resolve('OK');
                        })
                        .catch(response => {
                            console.log('swSetShippingMethod failed: %o', response);
                            reject('swSetShippingMethod failed!');
                        });
                });
            },
            async storeChosenShippingMethod({commit, state, getters, dispatch}, payload) {
                return new Promise((resolve) => {

                    dispatch('swSetShippingMethod', payload).then(() => {
                        commit('setChosenShippingMethod', payload);

                        // Save order from store to cookie
                        this.$cookies.set(state.cookieNameOrder, state.order, {
                            path: state.cookiePath,
                            expires: getters.getCookieExpires
                        });

                        resolve();
                    });

                })
            },
            async clearOrder({commit, state}) {
                return new Promise((resolve) => {
                    commit('setChosenPaymentMethod', {});
                    commit('setChosenShippingMethod', {});

                    // Clear order cookie
                    this.$cookies.remove(state.cookieNameOrder);

                    resolve();
                })
            },
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modApiPayment', modApiPayment);
}
