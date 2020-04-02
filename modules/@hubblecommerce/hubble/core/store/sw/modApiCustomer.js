export default function (ctx) {
    const modApiCustomer = {
        namespaced: true,
        state: () => ({
            customer: {
                customerAuth: {},
                customerData: {},
                customerAddresses: [],
                billingAddress: {},
                shippingAddress: {}
            },

            // Customer related entities
            countries: null,
            availableCountries: {},
            salutations: null,

            // Cookie
            cookieName: 'hubbleAuthUser',
            cookiePath: '/',
            cookieTTL: 360, // minutes
        }),
        mutations: {
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
            setCountries: (state, payload) => {
                // Sort countries by position
                state.countries = payload.sort((a, b) => {
                    return a.position - b.position;
                });
            },
            setAvailableCountries: (state, payload) => {
                state.availableCountries = payload;
            },
            setSalutations: (state, payload) => {
                state.salutations = payload;
            },
        },
        getters:  {
            getCookieExpires: (state) => {
                return new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);
            },
            getCustomerAuth: state => {
                return state.customer.customerAuth;
            },
        },
        actions: {
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

                            dispatch('logIn', payload).then(() => {
                                resolve(response);
                            })
                        })
                        .catch(response => {
                            console.log("API post request failed: %o", response);
                            reject(response);
                        });
                });
            },
            async logIn({commit, state, dispatch, rootState, getters}, payload) {
                const loginCreds = {
                    username: payload.email,
                    password: payload.password
                };

                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: '/sales-channel-api/v1/customer/login',
                        data: loginCreds
                    }, { root: true })
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
                                token_name: "swtc",
                                token_type: "context",
                                updated_at: ""
                            };
                            // Save response to store
                            commit('setCustomerAuth', authData);

                            // Override / Set Cart Context Token
                            // because otherwise there would be two different context tokens (one for cart, one for customer) without
                            // any relation to each other
                            dispatch('modCart/saveSwtc', response.data['sw-context-token'], {root:true}).then(() => {
                                // Clear current cart
                                // Get cart of logged in user
                                // save cart to forage
                                // TODO: merge cart items instead of removing them
                                dispatch('modCart/clearAll', {}, {root:true}).then(() => {
                                    // Get customer info and save to cookie
                                    dispatch('getCustomerInfo').then(() => {
                                        resolve(response);

                                        // Save store to cookie
                                        this.$cookies.set(state.cookieName, state.customer, {
                                            path: state.cookiePath,
                                            expires: getters.getCookieExpires
                                        });
                                    });
                                })
                            });
                        })
                        .catch(response => {
                            reject(response);
                        });
                });
            },
            async logOut({commit, state, dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'post',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: state.customer.customerAuth.token,
                        endpoint: '/sales-channel-api/v1/customer/logout',
                    }, { root: true })
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
            async mapAddresses({commit, state, getters, dispatch}, addresses) {
                return new Promise((resolve, reject)  => {
                    let mappedAddresses = [];

                    _.forEach(addresses, (address) => {
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
                                company: address.company
                            }
                        };

                        if(address.id === state.customer.customerData.defaultBillingAddressId) {
                            addressMap.is_billing_default = true;
                        }

                        if(address.id === state.customer.customerData.defaultShippingAddressId) {
                            addressMap.is_shipping_default = true;
                        }

                        mappedAddresses.push(addressMap)
                    });

                    resolve(mappedAddresses);
                });
            },
            async mapDefaultAddresses({commit, state, getters, dispatch}, addresses) {
                return new Promise((resolve, reject)  => {
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
                            company: billingDefault.company
                        }
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
                            company: shippingDefault.company
                        }
                    });

                    resolve(mappedAddresses);
                });
            },
            async getCustomerInfo({commit, state, getters, dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: state.customer.customerAuth.token,
                        endpoint: '/sales-channel-api/v1/customer'
                    }, { root: true })
                        .then(response => {
                            const baseData = {
                                name: `${response.data.data.firstName} ${response.data.data.lastName}`,
                                email: response.data.data.email,
                                defaultBillingAddressId: response.data.data.defaultBillingAddressId,
                                defaultShippingAddressId: response.data.data.defaultShippingAddressId
                            };

                            commit('setCustomerData', baseData);

                            const addresses = {
                                billingDefault: response.data.data.defaultBillingAddress,
                                shippingDefault: response.data.data.defaultShippingAddress
                            };

                            dispatch('mapDefaultAddresses', addresses).then((mappedAddresses) => {
                                commit('setCustomerAddresses', mappedAddresses);
                                resolve('OK');
                            });
                        })
                        .catch(response => {
                            console.log('getCustomerInfo failed: %o', response);
                            reject('getCustomerInfo failed!');
                        });
                });
            },
            async getCustomerAddresses({commit, state, getters, dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: state.customer.customerAuth.token,
                        endpoint: '/sales-channel-api/v1/customer/address'
                    }, { root: true })
                        .then(response => {
                            // Get customerinfo to know which addresses are set as default
                            dispatch('getCustomerInfo').then(() => {
                                dispatch('mapAddresses', response.data.data).then((mappedAddresses) => {
                                    commit('setCustomerAddresses', mappedAddresses);
                                    resolve('OK');
                                });
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
                            if(address.is_billing_default) {
                                dispatch('setDefaultBillingAddress', response.data.data)
                            }

                            if(address.is_shipping_default) {
                                dispatch('setDefaultShippingAddress', response.data.data)
                            }

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

                    if(payload.is_billing_default) {
                        dispatch('setDefaultBillingAddress', payload.id).then(() => {
                            resolve();
                        })
                    }

                    if(payload.is_shipping_default) {
                        dispatch('setDefaultShippingAddress', payload.id).then(() => {
                            resolve();
                        })
                    }
                });
            },
            async deleteCustomerAddress({state, getters, dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    if(payload.is_billing_default || payload.is_shipping_default) {
                        reject('You cant delete any default address');
                    } else {
                        dispatch('apiCall', {
                            action: 'delete',
                            tokenType: 'sw',
                            apiType: 'data',
                            swContext: state.customer.customerAuth.token,
                            endpoint: `/sales-channel-api/v1/customer/address/${payload.id}`
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
            async mapOrders({commit, state, getters, dispatch}, orders) {
                return new Promise((resolve, reject)  => {
                    let mappedOrders= [];

                    _.forEach(orders, (order) => {
                        mappedOrders.push({
                            orderNumber: order.orderNumber,
                            id: order.id,
                            createdAt: order.createdAt,
                            status_label: order.stateMachineState.name,
                            totals: order.positionPrice
                        })
                    });

                    resolve(mappedOrders);
                });
            },
            async setDefaultBillingAddress({dispatch, getters, state}, payload) {
                return new Promise((resolve, reject) => {
                    dispatch('apiCall', {
                        action: 'patch',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: state.customer.customerAuth.token,
                        endpoint: `/sales-channel-api/v1/customer/address/${payload}/default-billing`
                    }, { root: true })
                        .then(response => {
                            resolve(response);
                        })
                        .catch(response => {
                            console.log('setDefaultBillingAddress failed: %o', response);
                            reject('setDefaultBillingAddress failed!');
                        });
                })
            },
            async setDefaultShippingAddress({dispatch, getters, state}, payload) {
                return new Promise((resolve, reject) => {
                    dispatch('apiCall', {
                        action: 'patch',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: state.customer.customerAuth.token,
                        endpoint: `/sales-channel-api/v1/customer/address/${payload}/default-shipping`
                    }, { root: true })
                        .then(response => {
                            resolve(response);
                        })
                        .catch(response => {
                            console.log('setDefaultBillingAddress failed: %o', response);
                            reject('setDefaultBillingAddress failed!');
                        });
                })
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
            async passwordUpdate({dispatch, getters, state}, payload) {
                return new Promise((resolve, reject)  => {
                    dispatch('apiCall', {
                        action: 'patch',
                        tokenType: 'sw',
                        apiType: 'data',
                        swContext: state.customer.customerAuth.token,
                        endpoint: '/sales-channel-api/v1/customer/password',
                        data: {
                            password: payload.password_old,
                            newPassword: payload.password,
                            newPasswordConfirm: payload.password_confirm
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
            async swGetSalutations({commit, state, dispatch, rootState, getters}, payload) {
                return new Promise((resolve, reject) => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: '/sales-channel-api/v1/salutation'
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
                return new Promise((resolve, reject) => {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: '/sales-channel-api/v1/country',
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
            async postWishlist({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    // Saving wishlist to customeraccount is currently not implemented in SW6 headless API
                    reject();
                    resolve();
                });
            },
            async getWishlist({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    // Getting wishlist from customer is currently not implemented in SW6 headless API
                    resolve({
                        data: {
                            item: {}
                        }
                    });
                });
            },
            async updateWishlist({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    // Updating wishlist from customer is currently not implemented in SW6 headless API
                    resolve();
                });
            },
            async deleteWishlist({dispatch}, payload) {
                return new Promise((resolve, reject)  => {
                    // Removing wishlist from customer is currently not implemented in SW6 headless API
                    resolve();
                });
            },
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modApiCustomer', modApiCustomer);
}
