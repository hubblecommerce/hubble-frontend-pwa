import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime'
import base64 from "base-64";

/**
 *
 * modApiCustomer
 * API store for customer data and authentication
 *
 */
export default function (ctx) {

    // Create vuex store module
    const modApiCustomer = {
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

            // Cookie
            cookieName: 'hubbleAuthUser',
            cookiePath: '/',
            cookieTTL: 360, // minutes
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
            setCustomer: (state, payload) => {
                state.customer = payload;
            },
            setCustomerAuth: (state, payload) => {
                state.customer.customerAuth = payload;
            },
            setCustomerData: (state, payload) => {
                state.customer.customerData = payload;
            },
            setCustomerAddresses: (state, payload) => {
                state.customer.customerAddresses = payload;
            },
            addCustomerAddress: (state, payload) => {
                state.customer.customerAddresses.push(payload);
            },
            removeCustomerAddress: (state, payload) => {
                if(payload !== null) {
                    state.customer.customerAddresses.splice(payload, 1);
                }
            },
            setAvailableCountries: (state, payload) => {
                state.availableCountries = payload;
            },
            setBillingAddress: (state, payload) => {
                state.customer.billingAddress = payload;
            },
            setShippingAddress: (state, payload) => {
                state.customer.shippingAddress = payload;
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
            getCustomerId: state => {
                return state.customer.customerData.id;
            },
            getCustomerCid: state => {
                return state.customer.customerData.cid;
            },
            getCustomerAuth: state => {
                return state.customer.customerAuth;
            },
            getCustomerData: state => {
                return state.customer.customerData;
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
        },
        actions: {
            async logIn({commit, state, dispatch, getters}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'api',
                        apiType: 'payment',
                        endpoint: '/api/login',
                        data: payload
                    }, { root: true })
                    .then(response => {
                        // Clear customer data
                        commit('clearCustomerData');

                        // Clear order Data
                        commit('setChosenPaymentMethod', {});
                        commit('setChosenShippingMethod', {});

                        // Remove cookies
                        this.$cookies.remove(state.cookieName);
                        this.$cookies.remove(state.cookieNameOrder);
                        this.$cookies.remove(state.cookieNameAddress);

                        // Save response to store
                        commit('setCustomerAuth', response.data.auth);
                        commit('setCustomerData', response.data.user);

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
            async logOut({commit, state, dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'customer',
                        apiType: 'payment',
                        endpoint: '/api/logout',
                    }, { root: true })
                    .then(() => {
                        // Clear customer data
                        commit('clearCustomerData');

                        // Clear order data
                        commit('setChosenPaymentMethod', {});
                        commit('setChosenShippingMethod', {});

                        // Remove cookies
                        this.$cookies.remove(state.cookieName);
                        this.$cookies.remove(state.cookieNameOrder);
                        this.$cookies.remove(state.cookieNameAddress);

                        resolve('OK');
                    })
                    .catch(response => {
                        console.log('logOut failed: %o', response);
                        reject('logOut failed');
                    });
                });
            },
            async register({dispatch, commit, state, getters}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'api',
                        apiType: 'payment',
                        endpoint: '/api/register',
                        data: payload
                    }, { root: true })
                    .then((response) => {
                        // Clear customer data
                        commit('clearCustomerData');

                        // Clear order Data
                        commit('setChosenPaymentMethod', {});
                        commit('setChosenShippingMethod', {});

                        // Remove cookies
                        this.$cookies.remove(state.cookieName);
                        this.$cookies.remove(state.cookieNameOrder);
                        this.$cookies.remove(state.cookieNameAddress);

                        // Save response to store
                        commit('setCustomerAuth', response.data.auth);
                        commit('setCustomerData', response.data.user);

                        // Save store to cookie
                        this.$cookies.set(state.cookieName, state.customer, {
                            path: state.cookiePath,
                            expires: getters.getCookieExpires
                        });

                        resolve(response);
                    })
                    .catch(response => {
                        console.log("API post request failed: %o", response);
                        reject(response);
                    });
                });
            },
            async registerGuest({commit, state, dispatch, getters}, payload) {
                return new Promise((resolve)  => {

                    // Clear customer data
                    commit('clearCustomerData');

                    // Clear order Data
                    commit('setChosenPaymentMethod', {});
                    commit('setChosenShippingMethod', {});

                    // Remove cookies
                    this.$cookies.remove(state.cookieName);
                    this.$cookies.remove(state.cookieNameOrder);
                    this.$cookies.remove(state.cookieNameAddress);

                    let guestAuthData = {
                        created_at: getters.getCurrentDate,
                        expires_at: getters.getCookieExpires,
                        expires_in: 86400,
                        token: "guest",
                        token_name: "",
                        token_type: "",
                        updated_at: ""
                    };

                    commit('setCustomerAuth', guestAuthData);
                    commit('setCustomerData', payload.baseData);
                    commit('setCustomerAddresses', payload.addresses);

                    // Save store to cookie
                    this.$cookies.set(state.cookieName, state.customer, {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve('OK');
                });
            },
            async editAddress({dispatch, state, getters}, payload) {

                let _endpoint = _.join([
                    '/api/customer/addresses',
                    payload.id
                ], '/');

                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'patch',
                        tokenType: 'customer',
                        apiType: 'payment',
                        endpoint: _endpoint,
                        data: payload
                    }, { root: true })
                    .then(() => {
                        resolve('OK');
                    })
                    .catch(response => {
                        console.log('editAddress failed: %o', response);
                        reject(response);
                    });
                });
            },
            async editGuestAddress({commit, state, getters}, payload) {
                return new Promise((resolve)  => {

                    let keyToRemove = null;
                    _.forEach(state.customer.customerAddresses, (val, key) => {
                        if(val.id === payload.id) {
                            keyToRemove = key;
                        }
                    });

                    // remove old address by id
                    commit('removeCustomerAddress', keyToRemove);

                    // set new address from payload
                    commit('addCustomerAddress', payload);

                    // Save store to cookie
                    this.$cookies.set(state.cookieName, state.customer, {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve('OK');
                });
            },
            async getCustomerAddresses({commit, state, getters, dispatch}, payload) {

                let _endpoint = '/api/customer/addresses';

                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'customer',
                        apiType: 'payment',
                        endpoint: _endpoint,
                        data: payload
                    }, { root: true })
                    .then(response => {
                        commit('setCustomerAddresses', response.data.items);
                        resolve('OK');
                    })
                    .catch(response => {
                        console.log('getCustomerAddresses failed: %o', response);
                        reject('getCustomerAddresses failed!');
                    });
                });
            },
            async storeCustomerAddress({state, getters, dispatch}, payload) {

                let _endpoint = '/api/customer/addresses';

                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'customer',
                        apiType: 'payment',
                        endpoint: _endpoint,
                        data: payload
                    }, { root: true })
                    .then((response) => {
                        resolve(response.data.item);
                    })
                    .catch(response => {
                        console.log('storeCustomerAddress failed: %o', response);
                        reject(response);
                    });
                });
            },
            async deleteCustomerAddress({state, getters, dispatch}, payload) {

                let _endpoint = _.join([
                    '/api/customer/addresses',
                    payload.id
                ], '/');

                return new Promise((resolve, reject)  => {
                    if(payload.is_billing_default || payload.is_shipping_default) {
                        reject('You cant delete any default address');
                    } else {
                        dispatch('apiCall', {
                            action: 'delete',
                            tokenType: 'customer',
                            apiType: 'payment',
                            endpoint: _endpoint,
                            data: payload
                        }, { root: true })
                        .then(() => {
                            resolve('OK');
                        })
                        .catch(response => {
                            console.log('deleteCustomerAddress failed: %o', response);
                            reject('API request failed!');
                        });
                    }
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
            async setAddressCookie({commit, state, getters}, payload) {
                return new Promise((resolve, reject) => {

                    // set address cookie
                    this.$cookies.set(state.cookieNameAddress, getters.getJsonEncoded(payload) , {
                        path: state.addressCookiePath,
                        expires: new Date(new Date().getTime() + state.addressCookieTTL * 60 * 1000)
                    });

                    // Save addresses from cookie to store
                    commit('setBillingAddress', payload.billingAddress);
                    commit('setShippingAddress', payload.shippingAddress);

                    resolve();
                })
            },
            async passwordForgot({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'api',
                        apiType: 'payment',
                        endpoint: '/api/password/forgot',
                        data: payload
                    }, { root: true })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        console.log('passwordForgot failed: %o', error);
                        reject(error);
                    });
                });
            },
            async passwordUpdate({dispatch, getters}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'customer',
                        apiType: 'payment',
                        endpoint: '/api/password/reset',
                        data: payload
                    }, { root: true })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                });
            },
            async getAvailableCountries({commit, dispatch}) {
                return new Promise(function(resolve, reject) {
                    let _endpoint = _.join([
                        '/api/countries'
                    ], '');

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'api',
                        apiType: 'payment',
                        endpoint: _endpoint
                    }, { root: true })
                    .then(response => {
                        commit('setAvailableCountries', response.data.items);
                        resolve('OK');
                    })
                    .catch(error => {
                        reject(error);
                    });
                });
            }
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modApiCustomer', modApiCustomer);
}
