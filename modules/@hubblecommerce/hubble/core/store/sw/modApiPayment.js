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

            // availableCountries
            availableCountries: [],

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
            currentOrder: {},
            swtc: null
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
            setAvailableCountries: (state, payload) => {
                state.availableCountries = payload;
            },
            setSwtc: (state, payload) => {
                state.swtc = payload;
            },
            /*
            * Customer mutations
            * */
            setCustomer: (state, payload) => {
                state.customer = payload;
            },
            setCustomerAuth: (state, payload) => {
                state.customer.customerAuth = payload;
            },
            setCustomerData: (state, payload) => {
                state.customer.customerData = payload;
            },
            setCustomerId: (state, payload) => {
                _.assign(state.customer.customerData, {id: payload} );
                console.log(state.customer.customerData);
            },
            clearCustomerData: (state) => {
                state.customer = {
                    customerAuth: {},
                    customerData: {},
                    customerAddresses: [],
                    billingAddress: {},
                    shippingAddress: {}
                }
            },
            setCustomerAddresses: (state, payload) => {
                state.customer.customerAddresses = payload;
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
            getCustomerAuth: state => {
                return state.customer.customerAuth;
            },
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
            },
            async getAvailableCountries({commit, dispatch}) {
                return new Promise(function(resolve, reject) {
                    dispatch('swGetCountries').then((response) => {

                        let mappedCountries = [];

                        _.forEach(response.data.data, (country) => {
                            mappedCountries.push({
                                name: country.name,
                                iso_code_2: country.id
                            })
                        });

                        commit('setAvailableCountries', mappedCountries);
                        resolve('OK');
                    });
                });
            },
            /*
            * Customer Actions
            */
            async register({dispatch, commit, state, getters}, payload) {
                return new Promise((resolve, reject)  => {

                    // Map customer data to fit SW6 headless API
                    const customer = {
                        salutationId: payload.address.gender,
                        email: payload.email,
                        firstName: payload.address.firstName,
                        lastName: payload.address.lastName,
                        billingAddress: {
                            street: payload.address.street,
                            zipcode: payload.address.postal,
                            city: payload.address.city,
                            countryId: payload.address.country
                        },
                        password: payload.password
                    };

                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: '/sales-channel-api/v1/customer',
                        data: customer
                    }, { root: true })
                        .then((response) => {

                            // Clear customer data
                            commit('clearCustomerData');

                            commit('setCustomerData', {
                                id: response.data.data
                            });

                            const loginCreds = {
                                username: payload.email,
                                password: payload.password
                            };

                            dispatch('logIn', loginCreds).then(() => {
                                resolve(response);
                            })

                        })
                        .catch(response => {
                            console.log("API post request failed: %o", response);
                            reject(response);
                        });
                });
            },
            async logIn({commit, state, dispatch, getters}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: '/sales-channel-api/v1/customer/login',
                        data: payload
                    }, { root: true })
                        .then(response => {

                            // Clear order Data
                            commit('setChosenPaymentMethod', {});
                            commit('setChosenShippingMethod', {});

                            // Remove cookies
                            this.$cookies.remove(state.cookieName);
                            this.$cookies.remove(state.cookieNameOrder);
                            this.$cookies.remove(state.cookieNameAddress);

                            let authData = {
                                created_at: getters.getCurrentDate,
                                expires_at: getters.getCookieExpires,
                                expires_in: 86400,
                                token: response.data['sw-context-token'],
                                token_name: "swtc",
                                token_type: "context",
                                updated_at: ""
                            };

                            // Save response to store
                            commit('setCustomerAuth', authData);

                            // Save store to cookie
                            this.$cookies.set(state.cookieName, state.customer, {
                                path: state.cookiePath,
                                expires: getters.getCookieExpires
                            });

                            resolve(response);
                        })
                        .catch(response => {
                            //console.log('logIn failed: %o', response);
                            reject(response);
                        });
                });
            },
            async mapAddresses({commit, state, getters, dispatch}, addresses) {
                return new Promise((resolve, reject)  => {
                    let mappedAddresses = [];

                    _.forEach(addresses, (address) => {
                        mappedAddresses.push({
                            is_billing: true,
                            is_billing_default: true,
                            is_shipping: true,
                            is_shipping_default: true,
                            payload: {
                                gender: address.salutationId,
                                firstName: address.firstName,
                                lastName: address.lastName,
                                street: address.street,
                                houseNo: '',
                                postal: address.zipcode,
                                city: address.city,
                                country: address.countryId,
                                company: address.company
                            }
                        })
                    });

                    resolve(mappedAddresses);
                });
            },
            async getCustomerAddresses({commit, state, getters, dispatch}, payload) {

                let _endpoint = '/sales-channel-api/v1/customer/address';

                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: state.customer.customerAuth.token,
                        endpoint: _endpoint
                    }, { root: true })
                        .then(response => {
                            console.log(response);
                            dispatch('mapAddresses', response.data.data).then((mappedAddresses) => {
                                commit('setCustomerAddresses', mappedAddresses);
                                resolve('OK');
                            });
                        })
                        .catch(response => {
                            console.log('getCustomerAddresses failed: %o', response);
                            reject('getCustomerAddresses failed!');
                        });
                });
            },
            async storeCustomerAddress({state, getters, dispatch}, address) {
                return new Promise((resolve, reject)  => {

                    let requestBody = {
                        salutationId: address.payload.gender,
                        firstName: address.payload.firstName,
                        lastName: address.payload.lastName,
                        street: address.payload.street,
                        zipcode: address.payload.postal,
                        city: address.payload.city,
                        countryId: address.payload.country
                    };

                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: state.customer.customerAuth.token,
                        endpoint: '/sales-channel-api/v1/customer/address',
                        data: requestBody
                    }, { root: true })
                        .then((response) => {
                            resolve(response);
                        })
                        .catch(response => {
                            console.log('storeCustomerAddress failed: %o', response);
                            reject(response);
                        });
                });
            },
            async editAddress({dispatch, state, getters}, payload) {
                return new Promise((resolve, reject)  => {
                    // TODO: Edit Address not implemented in SW6 headless API yet
                    resolve('OK');
                });
            },
            async mapOrders({commit, state, getters, dispatch}, orders) {
                return new Promise((resolve, reject)  => {
                    let mappedOrders= [];

                    _.forEach(orders, (order) => {
                        // TODO: set correct data when you can recieve order data
                        mappedOrders.push({
                            id: order.id,
                            created_at: order.id,
                            status_label: order.id,
                            payload: order.id
                        })
                    });

                    resolve(mappedOrders);
                });
            },
            async getOrders({dispatch, getters, state}, payload) {
                return new Promise((resolve, reject) => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: state.customer.customerAuth.token,
                        endpoint: '/sales-channel-api/v1/customer/order',
                        params: {
                            limit: 500
                        }
                    }, { root: true })
                        .then(response => {
                            dispatch('mapOrders', response.data.data).then((mappedOrders) => {
                                resolve(mappedOrders);
                            });
                        })
                        .catch(response => {
                            console.log('getOrders failed: %o', response);
                            reject('getOrders failed!');
                        });
                })
            },
            async postWishlist({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    // Saving wishlist to customeraccount is currently not implemented in SW6 headless API
                    reject();
                    resolve();
                });
            },
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modApiPayment', modApiPayment);
}
