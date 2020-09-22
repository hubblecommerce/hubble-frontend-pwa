import _ from 'lodash';

export const state = () => ({
            customer: {
                customerAuth: {},
                customerData: {},
                customerAddresses: [],
                billingAddress: {},
                shippingAddress: {},
            },

            // Customer related entities
            countries: null,
            availableCountries: {},
            salutations: null,

            // Cookie
            cookieName: 'hubbleAuthUser',
            cookiePath: '/',
            cookieTTL: 360 // minutes
})

export const mutations = {
            /*
             * Customer mutations
             * */
            setCustomer (state, payload) {
                state.customer = payload;
            },
            setCustomerAuth (state, payload) {
                state.customer.customerAuth = payload;
            },
            setCustomerData (state, payload)  {
                state.customer.customerData = payload;
            },
            clearCustomerData (state) {
                state.customer = {
                    customerAuth: {},
                    customerData: {},
                    customerAddresses: [],
                    billingAddress: {},
                    shippingAddress: {},
                };
            },
            setCustomerAddresses (state, payload) {
                state.customer.customerAddresses = payload;
            },
            setCountries (state, payload) {
                // Sort countries by position
                state.countries = payload.sort((a, b) => {
                    return a.position - b.position;
                });
            },
            setAvailableCountries (state, payload) {
                state.availableCountries = payload;
            },
            setSalutations (state, payload) {
                state.salutations = payload;
            }
}

export const getters = {
            getCookieExpires (state)  {
                return new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);
            },
            getCustomerAuth (state)  {
                return state.customer.customerAuth;
            }
}

export const actions = {
            async register({ dispatch, commit }, payload) {
                return new Promise((resolve, reject) => {
                    // Map customer data to fit SW6 headless API
                    let customer = {
                        salutationId: payload.address.gender,
                        email: payload.email,
                        firstName: payload.address.firstName,
                        lastName: payload.address.lastName,
                        billingAddress: {
                            street: payload.address.street,
                            zipcode: payload.address.postal,
                            city: payload.address.city,
                            countryId: payload.address.country,
                        },
                        password: payload.password,
                    };

                    if (payload.shippingAddress !== null) {
                        customer.shippingAddress = {
                            salutationId: payload.shippingAddress.gender,
                            firstName: payload.shippingAddress.firstName,
                            lastName: payload.shippingAddress.lastName,
                            street: payload.shippingAddress.street,
                            zipcode: payload.shippingAddress.postal,
                            city: payload.shippingAddress.city,
                            countryId: payload.shippingAddress.country,
                        };
                    }

                    dispatch(
                        'apiCall',
                        {
                            action: 'post',
                            tokenType: 'sw',
                            apiType: 'data',
                            endpoint: '/sales-channel-api/v1/customer',
                            data: customer,
                        },
                        { root: true }
                    )
                        .then(response => {
                            // Clear customer data
                            commit('clearCustomerData');

                            commit('setCustomerData', {
                                id: response.data.data,
                            });

                            dispatch('logIn', payload).then(() => {
                                resolve(response);
                            });
                        })
                        .catch(response => {
                            console.log('register - API post request failed: %o', response);

                            reject(response);
                        });
                });
            },
            async logIn({ commit, state, dispatch, rootState, getters }, payload) {
                const loginCreds = {
                    username: payload.email,
                    password: payload.password,
                };

                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'post',
                            tokenType: 'sw',
                            apiType: 'data',
                            swContext: rootState.modCart.swtc,
                            endpoint: '/sales-channel-api/v1/customer/login',
                            data: loginCreds,
                        },
                        { root: true }
                    )
                        .then(response => {
                            // Clear order Data
                            commit('modApiPayment/setChosenPaymentMethod', {}, { root: true });
                            commit('modApiPayment/setChosenShippingMethod', {}, { root: true });

                            // Remove cookies
                            this.$cookies.remove(state.cookieName);
                            this.$cookies.remove(state.cookieNameOrder);
                            this.$cookies.remove(state.cookieNameAddress);

                            let authData = {
                                created_at: new Date(),
                                expires_at: getters.getCookieExpires,
                                expires_in: 86400,
                                token: response.data['sw-context-token'],
                                token_name: 'swtc',
                                token_type: 'context',
                                updated_at: '',
                            };
                            // Save response to store
                            commit('setCustomerAuth', authData);

                            // Override / Set Cart Context Token
                            // because otherwise there would be two different context tokens (one for cart, one for customer) without
                            // any relation to each other
                            dispatch('modCart/saveSwtc', response.data['sw-context-token'], { root: true }).then(() => {
                                // Clear current cart
                                // Get cart of logged in user
                                // save cart to forage
                                // TODO: merge cart items instead of removing them
                                dispatch('modCart/clearAll', {}, { root: true })
                                    .then(() => {
                                        // Get customer info and save to cookie
                                        dispatch('getCustomerInfo')
                                            .then(() => {
                                                resolve(response);

                                                // Save store to cookie
                                                this.$cookies.set(
                                                    state.cookieName,
                                                    {
                                                        customerAuth: state.customer.customerAuth,
                                                        customerData: {},
                                                        customerAddresses: [],
                                                        billingAddress: {},
                                                        shippingAddress: {},
                                                    },
                                                    {
                                                        path: state.cookiePath,
                                                        expires: getters.getCookieExpires,
                                                    }
                                                );
                                            })
                                            .catch(err => {
                                                reject(err);
                                            });
                                    })
                                    .catch(err => {
                                        console.log('clearAll failed', err);
                                    });
                            });
                        })
                        .catch(response => {
                            reject(response);
                        });
                });
            },
            async logOut({ commit, state, dispatch }) {
                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'post',
                            tokenType: 'sw',
                            apiType: 'data',
                            swContext: state.customer.customerAuth.token,
                            endpoint: '/sales-channel-api/v1/customer/logout',
                        },
                        { root: true }
                    )
                        .then(() => {
                            // Clear customer data
                            commit('clearCustomerData');

                            // Clear order data
                            commit('modApiPayment/setChosenPaymentMethod', {}, { root: true });
                            commit('modApiPayment/setChosenShippingMethod', {}, { root: true });

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
            async setByCookie({ commit, state }) {
                return new Promise(resolve => {
                    // try to retrieve auth user by cookie
                    let _cookie = this.$cookies.get(state.cookieName);

                    // no cookie? ok!
                    if (!_cookie) {
                        resolve({
                            success: true,
                            message: 'customer not known by cookie.',
                        });
                    } else {
                        // Save cookie to store
                        commit('setCustomer', _cookie);

                        resolve({
                            success: true,
                            message: 'customer taken from cookie.',
                            redirect: true,
                        });
                    }
                });
            },
            async mapAddresses({ state }, addresses) {
                return new Promise((resolve, reject) => {
                    let mappedAddresses = [];

                    _.forEach(addresses, address => {
                        let addressMap = {
                            id: address.id,
                            is_billing: true,
                            is_billing_default: false,
                            is_shipping: true,
                            is_shipping_default: false,
                            payload: {
                                gender: address.salutationId,
                                firstName: address.firstName,
                                lastName: address.lastName,
                                street: address.street,
                                houseNo: '',
                                postal: address.zipcode,
                                city: address.city,
                                country: address.countryId,
                                company: address.company,
                            },
                        };

                        if (address.id === state.customer.customerData.defaultBillingAddressId) {
                            addressMap.is_billing_default = true;
                        }

                        if (address.id === state.customer.customerData.defaultShippingAddressId) {
                            addressMap.is_shipping_default = true;
                        }

                        mappedAddresses.push(addressMap);
                    });

                    resolve(mappedAddresses);
                });
            },
            async mapDefaultAddresses({ dispatch }, addresses) {
                return new Promise((resolve, reject) => {
                    let mappedAddresses = [],
                        billingDefault = addresses.billingDefault,
                        shippingDefault = addresses.shippingDefault;

                    mappedAddresses.push({
                        id: billingDefault.id,
                        is_billing: true,
                        is_billing_default: true,
                        is_shipping: false,
                        is_shipping_default: false,
                        payload: {
                            gender: billingDefault.salutationId,
                            firstName: billingDefault.firstName,
                            lastName: billingDefault.lastName,
                            street: billingDefault.street,
                            houseNo: '',
                            postal: billingDefault.zipcode,
                            city: billingDefault.city,
                            country: billingDefault.countryId,
                            company: billingDefault.company,
                        },
                    });

                    mappedAddresses.push({
                        id: shippingDefault.id,
                        is_billing: false,
                        is_billing_default: false,
                        is_shipping: true,
                        is_shipping_default: true,
                        payload: {
                            gender: shippingDefault.salutationId,
                            firstName: shippingDefault.firstName,
                            lastName: shippingDefault.lastName,
                            street: shippingDefault.street,
                            houseNo: '',
                            postal: shippingDefault.zipcode,
                            city: shippingDefault.city,
                            country: shippingDefault.countryId,
                            company: shippingDefault.company,
                        },
                    });

                    resolve(mappedAddresses);
                });
            },
            async getCustomerInfo({ commit, state, dispatch }) {
                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'get',
                            tokenType: 'sw',
                            apiType: 'data',
                            swContext: state.customer.customerAuth.token,
                            endpoint: '/sales-channel-api/v1/customer',
                        },
                        { root: true }
                    )
                        .then(response => {
                            const customerData = {
                                name: `${response.data.data.firstName} ${response.data.data.lastName}`,
                                firstName: response.data.data.firstName,
                                lastName: response.data.data.lastName,
                                salutationId: response.data.data.salutationId,
                                title: response.data.data.title,
                                birthDay: response.data.data.birthday,
                                email: response.data.data.email,
                                defaultBillingAddressId: response.data.data.defaultBillingAddressId,
                                defaultShippingAddressId: response.data.data.defaultShippingAddressId,
                            };

                            commit('setCustomerData', customerData);

                            const addresses = {
                                billingDefault: response.data.data.defaultBillingAddress,
                                shippingDefault: response.data.data.defaultShippingAddress,
                            };

                            dispatch('mapDefaultAddresses', addresses).then(mappedAddresses => {
                                commit('setCustomerAddresses', mappedAddresses);
                                resolve('OK');
                            });
                        })
                        .catch(response => {
                            console.log('getCustomerInfo failed: %o', response);

                            reject(response);
                        });
                });
            },
            async getCustomerAddresses({ commit, state, dispatch }) {
                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'get',
                            tokenType: 'sw',
                            apiType: 'data',
                            swContext: state.customer.customerAuth.token,
                            endpoint: '/sales-channel-api/v1/customer/address',
                        },
                        { root: true }
                    )
                        .then(response => {
                            // Get customerinfo to know which addresses are set as default
                            dispatch('getCustomerInfo')
                                .then(() => {
                                    dispatch('mapAddresses', response.data.data).then(mappedAddresses => {
                                        commit('setCustomerAddresses', mappedAddresses);
                                        resolve('OK');
                                    });
                                })
                                .catch(err => {
                                    reject(err);
                                });
                        })
                        .catch(response => {
                            console.log('getCustomerAddresses failed: %o', response);

                            reject(response);
                        });
                });
            },
            async storeCustomerAddress({ state, dispatch }, address) {
                return new Promise((resolve, reject) => {
                    let requestBody = {
                        salutationId: address.payload.gender,
                        firstName: address.payload.firstName,
                        lastName: address.payload.lastName,
                        street: address.payload.street,
                        zipcode: address.payload.postal,
                        city: address.payload.city,
                        countryId: address.payload.country,
                    };

                    dispatch(
                        'apiCall',
                        {
                            action: 'post',
                            tokenType: 'sw',
                            apiType: 'data',
                            swContext: state.customer.customerAuth.token,
                            endpoint: '/sales-channel-api/v1/customer/address',
                            data: requestBody,
                        },
                        { root: true }
                    )
                        .then(response => {
                            if (address.is_billing_default) {
                                dispatch('setDefaultBillingAddress', response.data.data);
                            }

                            if (address.is_shipping_default) {
                                dispatch('setDefaultShippingAddress', response.data.data);
                            }

                            resolve(response);
                        })
                        .catch(err => {
                            console.log('storeCustomerAddress failed: %o', err);

                            reject(err);
                        });
                });
            },
            async editAddress({ dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    // TODO: Edit Address not implemented in SW6 headless API yet

                    if (payload.is_billing_default) {
                        dispatch('setDefaultBillingAddress', payload.id)
                            .then(response => {
                                resolve(response);
                            })
                            .catch(err => {
                                console.log('setDefaultBillingAddress failed: ', err);

                                reject(err);
                            });
                    }

                    if (payload.is_shipping_default) {
                        dispatch('setDefaultShippingAddress', payload.id)
                            .then(response => {
                                resolve(response);
                            })
                            .catch(err => {
                                console.log('setDefaultShippingAddress failed: ', err);

                                reject(err);
                            });
                    }
                });
            },
            async deleteCustomerAddress({ state, dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    if (payload.is_billing_default || payload.is_shipping_default) {
                        reject('You cant delete any default address');
                    } else {
                        dispatch(
                            'apiCall',
                            {
                                action: 'delete',
                                tokenType: 'sw',
                                apiType: 'data',
                                swContext: state.customer.customerAuth.token,
                                endpoint: `/sales-channel-api/v1/customer/address/${payload.id}`,
                            },
                            { root: true }
                        )
                            .then(() => {
                                resolve('OK');
                            })
                            .catch(err => {
                                console.log('deleteCustomerAddress failed: %o', err);

                                reject(err);
                            });
                    }
                });
            },
            async mapOrders({ dispatch }, orders) {
                return new Promise((resolve, reject) => {
                    let mappedOrders = [];

                    _.forEach(orders, order => {
                        mappedOrders.push({
                            orderNumber: order.orderNumber,
                            id: order.id,
                            createdAt: order.createdAt,
                            status_label: order.stateMachineState.name,
                            totals: order.positionPrice,
                        });
                    });

                    resolve(mappedOrders);
                });
            },
            async setDefaultBillingAddress({ dispatch, state }, payload) {
                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'patch',
                            tokenType: 'sw',
                            apiType: 'data',
                            swContext: state.customer.customerAuth.token,
                            endpoint: `/sales-channel-api/v1/customer/address/${payload}/default-billing`,
                        },
                        { root: true }
                    )
                        .then(response => {
                            resolve(response);
                        })
                        .catch(err => {
                            console.log('setDefaultBillingAddress failed: %o', err);

                            reject(err);
                        });
                });
            },
            async setDefaultShippingAddress({ dispatch, state }, payload) {
                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'patch',
                            tokenType: 'sw',
                            apiType: 'data',
                            swContext: state.customer.customerAuth.token,
                            endpoint: `/sales-channel-api/v1/customer/address/${payload}/default-shipping`,
                        },
                        { root: true }
                    )
                        .then(response => {
                            resolve(response);
                        })
                        .catch(err => {
                            console.log('setDefaultBillingAddress failed: %o', err);

                            reject(err);
                        });
                });
            },
            async getOrders({ dispatch, state }, payload) {
                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'get',
                            tokenType: 'sw',
                            apiType: 'data',
                            swContext: state.customer.customerAuth.token,
                            endpoint: '/sales-channel-api/v1/customer/order',
                            params: {
                                limit: 500,
                            },
                        },
                        { root: true }
                    )
                        .then(response => {
                            dispatch('mapOrders', response.data.data).then(mappedOrders => {
                                resolve(mappedOrders);
                            });
                        })
                        .catch(err => {
                            console.log('getOrders failed: %o', err);

                            reject(err);
                        });
                });
            },
            async passwordUpdate({ dispatch, state }, payload) {
                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'patch',
                            tokenType: 'sw',
                            apiType: 'data',
                            swContext: state.customer.customerAuth.token,
                            endpoint: '/sales-channel-api/v1/customer/password',
                            data: {
                                password: payload.password_old,
                                newPassword: payload.password,
                                newPasswordConfirm: payload.password_confirm,
                            },
                        },
                        { root: true }
                    )
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            console.log('passwordUpdate failed: %o', error);

                            reject(error);
                        });
                });
            },
            async swGetSalutations({ dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'get',
                            tokenType: 'sw',
                            apiType: 'data',
                            endpoint: '/sales-channel-api/v1/salutation',
                        },
                        { root: true }
                    )
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            console.log('swGetSalutations failed: %o', error);

                            reject(error);
                        });
                });
            },
            async swGetCountries({ dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    dispatch(
                        'apiCall',
                        {
                            action: 'get',
                            tokenType: 'sw',
                            apiType: 'data',
                            endpoint: '/sales-channel-api/v1/country',
                            params: {
                                limit: 500,
                            },
                        },
                        { root: true }
                    )
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            console.log('swGetCountries failed: %o', error);

                            reject(error);
                        });
                });
            },
            async getAvailableCountries({ commit, dispatch }) {
                return new Promise(function (resolve, reject) {
                    dispatch('swGetCountries')
                        .then(response => {
                            let mappedCountries = [];

                            _.forEach(response.data.data, country => {
                                mappedCountries.push({
                                    name: country.name,
                                    iso_code_2: country.id,
                                });
                            });

                            commit('setAvailableCountries', mappedCountries);

                            resolve('OK');
                        })
                        .catch(res => {
                            reject(res);
                        });
                });
            },
            async postWishlist({ dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    // Saving wishlist to customeraccount is currently not implemented in SW6 headless API
                    reject();
                    resolve();
                });
            },
            async getWishlist({ dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    // Getting wishlist from customer is currently not implemented in SW6 headless API
                    resolve({
                        data: {
                            item: {},
                        },
                    });
                });
            },
            async updateWishlist({ dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    // Updating wishlist from customer is currently not implemented in SW6 headless API
                    resolve();
                });
            },
            async deleteWishlist({ dispatch }, payload) {
                return new Promise((resolve, reject) => {
                    // Removing wishlist from customer is currently not implemented in SW6 headless API
                    resolve();
                });
            },
            async updateCustomerInfo({ dispatch, state }, payload) {
                return new Promise((resolve, reject) => {
                    // Map customer data to fit SW6 headless API

                    let editedCustomerData = {
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                        salutationId: payload.salutationId,
                    };

                    dispatch(
                        'apiCall',
                        {
                            action: 'patch',
                            tokenType: 'sw',
                            swContext: state.customer.customerAuth.token,
                            apiType: 'data',
                            endpoint: '/sales-channel-api/v1/customer',
                            data: editedCustomerData,
                        },
                        { root: true }
                    )
                        .then(() => {
                            dispatch('getCustomerInfo').then(() => {
                                resolve();
                            });
                        })
                        .catch(response => {
                            console.log('API patch request to update user profile information failed: %o', response);

                            reject(response);
                        });
                });
            },
            async updateCustomerEmail({ dispatch, state }, payload) {
                return new Promise((resolve, reject) => {
                    // Map email customer data to fit SW6 headless API

                    dispatch(
                        'apiCall',
                        {
                            action: 'patch',
                            tokenType: 'sw',
                            swContext: state.customer.customerAuth.token,
                            apiType: 'data',
                            endpoint: '/sales-channel-api/v1/customer/email',
                            data: {
                                email: payload.email,
                                emailConfirmation: payload.emailRepeat,
                                password: payload.password,
                            },
                        },
                        { root: true }
                    )
                        .then(() => {
                            dispatch('getCustomerInfo')
                                .then(response => {
                                    resolve(response);
                                })
                                .catch(err => {
                                    console.log('getCustomerInfo failed : %o', err);

                                    reject(err);
                                });
                        })
                        .catch(response => {
                            console.log('API patch request to update user email information failed: %o', response);

                            reject(response);
                        });
                });
            }
}
