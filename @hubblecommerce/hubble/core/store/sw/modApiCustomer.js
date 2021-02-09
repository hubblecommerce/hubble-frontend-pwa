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
    cookieTTL: 360, // minutes
});

export const mutations = {
    /*
     * Customer mutations
     * */
    setCustomer(state, payload) {
        state.customer = payload;
    },
    setCustomerAuth(state, payload) {
        state.customer.customerAuth = payload;
    },
    setCustomerData(state, payload) {
        // To trigger reactivity
        let temp = _.clone(state.customer);
        state.customer = null;
        state.customer = temp;

        // set customer data
        state.customer.customerData = payload;
    },
    clearCustomerData(state) {
        state.customer = {
            customerAuth: {},
            customerData: {},
            customerAddresses: [],
            billingAddress: {},
            shippingAddress: {},
        };
    },
    setCustomerAddresses(state, payload) {
        state.customer.customerAddresses = payload;
    },
    setCountries(state, payload) {
        // Sort countries by position
        state.countries = payload.sort((a, b) => {
            return a.position - b.position;
        });
    },
    setAvailableCountries(state, payload) {
        state.availableCountries = payload;
    },
    setSalutations(state, payload) {
        state.salutations = payload;
    },
    addCustomerAddress: (state, payload) => {
        state.customer.customerAddresses.push(payload);
    },
    removeCustomerAddress: (state, payload) => {
        if (payload !== null) {
            state.customer.customerAddresses.splice(payload, 1);
        }
    },
};

export const getters = {
    getCookieExpires(state) {
        return new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);
    },
    getCustomerAuth(state) {
        return state.customer.customerAuth;
    },
};

export const actions = {
    async register({ dispatch, commit, state, rootState, getters }, payload) {
        // Map customer data to fit SW6 headless API
        let customer = {
            guest: payload.guest,
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
            storefrontUrl: process.env.API_BASE_URL,
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

        let response = await dispatch(
            'apiCall',
            {
                action: 'post',
                tokenType: 'sw',
                apiType: 'data',
                endpoint: '/store-api/v3/account/register',
                swContext: rootState.modCart.swtc,
                data: customer,
            },
            { root: true }
        );

        // Clear customer data
        commit('clearCustomerData');
        commit('setCustomerData', response.data);

        if (!response.data.guest) {
            return await dispatch('logIn', payload);
        } else {
            // preperation for store-api v4
            // Remove cookies
            this.$cookies.remove(state.cookieName);
            this.$cookies.remove(state.cookieNameOrder);
            this.$cookies.remove(state.cookieNameAddress);

            // save customer auth as guest and their addresses in store and cookie
            let authData = {
                created_at: new Date(),
                expires_at: getters.getCookieExpires,
                expires_in: 86400,
                token: response.data.extensions.guest['sw-context-token'],
                token_name: 'swtc',
                token_type: 'context',
                updated_at: '',
                guest: true,
            };

            const customerData = {
                guest: response.data.guest,
                name: `${response.data.firstName} ${response.data.lastName}`,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                salutationId: response.data.salutationId,
                title: response.data.title,
                birthDay: response.data.birthday,
                email: response.data.email,
                defaultBillingAddressId: response.data.defaultBillingAddressId,
                defaultShippingAddressId: response.data.defaultShippingAddressId,
            };

            // Clear order Data
            commit('modApiPayment/setChosenPaymentMethod', {}, { root: true });
            commit('modApiPayment/setChosenShippingMethod', {}, { root: true });

            commit('setCustomerData', customerData);
            commit('setCustomerAuth', authData);

            let mappedAddresses = await dispatch('mapAddresses', response.data.addresses);
            commit('setCustomerAddresses', mappedAddresses);

            this.$cookies.set(state.cookieName, state.customer, {
                path: state.cookiePath,
                expires: getters.getCookieExpires,
            });

            // If you log in with cart context token, Shopware merges cart automatically.
            // You only have to use the returned context token for all future requests (cart/customer/checkout)
            await dispatch('modCart/saveSwtc', response.data.extensions.guest['sw-context-token'], { root: true });
            await dispatch('modCart/refreshCart', {}, { root: true });

            return response;
        }
    },
    async setGuestSession({ commit, dispatch, state, getters }, contextToken) {
        let authData = {
            created_at: new Date(),
            expires_at: getters.getCookieExpires,
            expires_in: 86400,
            token: contextToken,
            token_name: 'swtc',
            token_type: 'context',
            updated_at: '',
            guest: true,
        };

        commit('setCustomerAuth', authData);

        this.$cookies.set(state.cookieName, state.customer, {
            path: state.cookiePath,
            expires: getters.getCookieExpires,
        });

        // If you log in with cart context token, Shopware merges cart automatically.
        // You only have to use the returned context token for all future requests (cart/customer/checkout)
        await dispatch('modCart/saveSwtc', contextToken, { root: true });
        await dispatch('modCart/refreshCart', {}, { root: true });
    },
    async logIn({ commit, state, dispatch, rootState, getters }, payload) {
        const loginCreds = {
            username: payload.email,
            password: payload.password,
        };

        let loginResponse = await dispatch(
            'apiCall',
            {
                action: 'post',
                tokenType: 'sw',
                apiType: 'data',
                swContext: rootState.modCart.swtc,
                endpoint: '/store-api/v3/account/login',
                data: loginCreds,
            },
            { root: true }
        );

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
            token: loginResponse.data['contextToken'],
            token_name: 'swtc',
            token_type: 'context',
            updated_at: '',
            guest: false,
        };

        // Save auth data to store
        commit('setCustomerAuth', authData);

        // Only save customer auth to cookie, fetch customer data if needed fresh from api
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

        // Get customer info and save to cookie
        await dispatch('getCustomerInfo');

        // If you log in with cart context token, Shopware merges cart automatically.
        // You only have to use the returned context token for all future requests (cart/customer/checkout)
        await dispatch('modCart/saveSwtc', loginResponse.data['contextToken'], { root: true });
        await dispatch('modCart/refreshCart', {}, { root: true });

        return loginResponse;
    },
    async logOut({ commit, state, dispatch }) {
        const response = await dispatch(
            'apiCall',
            {
                action: 'post',
                tokenType: 'sw',
                apiType: 'data',
                swContext: state.customer.customerAuth.token,
                endpoint: '/store-api/v3/account/logout',
            },
            { root: true }
        );

        // Clear customer data
        commit('clearCustomerData');

        // Clear order data
        commit('modApiPayment/setChosenPaymentMethod', {}, { root: true });
        commit('modApiPayment/setChosenShippingMethod', {}, { root: true });

        // Remove cookies
        this.$cookies.remove(state.cookieName);
        this.$cookies.remove(state.cookieNameOrder);
        this.$cookies.remove(state.cookieNameAddress);

        return await dispatch('modCart/saveSwtc', response.data['contextToken'], { root: true });
    },
    async logOutGuest({ commit, state, dispatch }) {
        // Clear customer data
        commit('clearCustomerData');

        // Clear order data
        commit('modApiPayment/setChosenPaymentMethod', {}, { root: true });
        commit('modApiPayment/setChosenShippingMethod', {}, { root: true });

        // Remove cookies
        this.$cookies.remove(state.cookieName);
        this.$cookies.remove(state.cookieNameOrder);
        this.$cookies.remove(state.cookieNameAddress);

        // Remove cart cookie / local storage
        await dispatch('modCart/initCart', {}, { root: true });
        await dispatch('modCart/refreshCart', {}, { root: true });
    },
    async setByCookie({ commit, state }) {
        let _cookie = this.$cookies.get(state.cookieName);

        // no cookie? ok!
        if (!_cookie) {
            return {
                success: true,
                message: 'customer not known by cookie.',
            };
        } else {
            // Save cookie to store
            commit('setCustomerAuth', _cookie.customerAuth);

            return {
                success: true,
                message: 'customer taken from cookie.',
                redirect: true,
            };
        }
    },
    async setActiveAddress({ dispatch, rootState }, payload) {
        let context = await dispatch(
            'apiCall',
            {
                action: 'patch',
                tokenType: 'sw',
                apiType: 'data',
                swContext: rootState.modApiCustomer.customer.customerAuth.token,
                endpoint: '/store-api/v3/context',
                data: payload,
            },
            { root: true }
        );

        await dispatch('modCart/saveSwtc', context.data['contextToken'], { root: true });

        context = await dispatch(
            'apiCall',
            {
                action: 'get',
                tokenType: 'sw',
                apiType: 'data',
                endpoint: '/store-api/v3/context',
                swContext: context.data['contextToken'],
            },
            { root: true }
        );

        // only data that changed is address data, so set current active addresses
        if (context.data.customer != null && !_.isEmpty(context.data.customer)) {
            await dispatch('setCustomerInfo', context.data.customer);
        }
    },
    async mapAddresses({ state }, addresses) {
        let mappedAddresses = [];

        _.forEach(addresses, (address) => {
            mappedAddresses.push(mapAddress(address));
        });

        return mappedAddresses;
    },
    async setCustomerInfo({ commit, state, dispatch }, customer) {
        try {
            const customerData = {
                guest: customer.guest,
                name: `${customer.firstName} ${customer.lastName}`,
                firstName: customer.firstName,
                lastName: customer.lastName,
                salutationId: customer.salutationId,
                title: customer.title,
                birthDay: customer.birthday,
                email: customer.email,
                defaultBillingAddressId: customer.defaultBillingAddressId,
                defaultShippingAddressId: customer.defaultShippingAddressId,
                activeBillingAddress: mapAddress(customer.activeBillingAddress),
                activeShippingAddress: mapAddress(customer.activeShippingAddress),
            };

            commit('setCustomerData', customerData);

            return customerData;
        } catch (e) {
            console.log('setCustomerInfo failed: %o', e);
        }
    },
    async getCustomerInfo({ commit, state, dispatch }) {
        try {
            const response = await dispatch(
                'apiCall',
                {
                    action: 'get',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: state.customer.customerAuth.token,
                    endpoint: '/store-api/v3/account/customer',
                },
                { root: true }
            );

            const customerData = {
                guest: false,
                name: `${response.data.firstName} ${response.data.lastName}`,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                salutationId: response.data.salutationId,
                title: response.data.title,
                birthDay: response.data.birthday,
                email: response.data.email,
                defaultBillingAddressId: response.data.defaultBillingAddressId,
                defaultShippingAddressId: response.data.defaultShippingAddressId,
            };

            commit('setCustomerData', customerData);
            return customerData;
        } catch (e) {
            console.log('getCustomerInfo failed: %o', e);
            throw e;
        }
    },
    async getCustomerAddresses({ commit, state, dispatch }) {
        const response = await dispatch(
            'apiCall',
            {
                action: 'get',
                tokenType: 'sw',
                apiType: 'data',
                swContext: state.customer.customerAuth.token,
                endpoint: '/store-api/v3/account/list-address',
            },
            { root: true }
        );
        // Get customerinfo to know which addresses are set as default
        await dispatch('getCustomerInfo');

        const mappedAddresses = await dispatch('mapAddresses', response.data.elements);
        commit('setCustomerAddresses', mappedAddresses);
    },
    async storeCustomerAddress({ state, dispatch }, address) {
        let requestBody = {
            salutationId: address.gender,
            firstName: address.firstName,
            lastName: address.lastName,
            street: address.street,
            zipcode: address.postal,
            city: address.city,
            countryId: address.country,
        };

        const response = await dispatch(
            'apiCall',
            {
                action: 'post',
                tokenType: 'sw',
                apiType: 'data',
                swContext: state.customer.customerAuth.token,
                endpoint: '/store-api/v3/account/address',
                data: requestBody,
            },
            { root: true }
        );

        return response;
    },
    async editAddress({ state, dispatch }, address) {
        let requestBody = {
            salutationId: address.gender,
            firstName: address.firstName,
            lastName: address.lastName,
            street: address.street,
            zipcode: address.postal,
            city: address.city,
            countryId: address.country,
        };

        return await dispatch(
            'apiCall',
            {
                action: 'patch',
                tokenType: 'sw',
                apiType: 'data',
                swContext: state.customer.customerAuth.token,
                endpoint: `/store-api/v3/account/address/${address.id}`,
                data: requestBody,
            },
            { root: true }
        );
    },
    async editGuestAddress({ commit, state, getters }, payload) {
        let keyToRemove = null;
        _.forEach(state.customer.customerAddresses, (val, key) => {
            if (val.id === payload.id) {
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
            expires: getters.getCookieExpires,
        });
    },
    async deleteCustomerAddress({ state, dispatch }, payload) {
        if (payload.is_billing_default || payload.is_shipping_default) {
            throw 'You cant delete any default address';
        } else {
            return await dispatch(
                'apiCall',
                {
                    action: 'delete',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: state.customer.customerAuth.token,
                    endpoint: `/store-api/v3/account/address/${payload.id}`,
                },
                { root: true }
            );
        }
    },
    async mapOrders({ dispatch }, orders) {
        let mappedOrders = [];

        _.forEach(orders, (order) => {
            mappedOrders.push({
                orderNumber: order.orderNumber,
                id: order.id,
                createdAt: order.createdAt,
                status_label: order.stateMachineState.name,
                totals: order.positionPrice,
            });
        });
        return mappedOrders;
    },
    async setDefaultBillingAddress({ dispatch, state }, payload) {
        return await dispatch(
            'apiCall',
            {
                action: 'patch',
                tokenType: 'sw',
                apiType: 'data',
                swContext: state.customer.customerAuth.token,
                endpoint: `/store-api/v3/account/address/default-billing/${payload}`,
            },
            { root: true }
        );
    },
    async setDefaultShippingAddress({ dispatch, state }, payload) {
        return await dispatch(
            'apiCall',
            {
                action: 'patch',
                tokenType: 'sw',
                apiType: 'data',
                swContext: state.customer.customerAuth.token,
                endpoint: `/store-api/v3/account/address/default-shipping/${payload}`,
            },
            { root: true }
        );
    },
    async getOrders({ dispatch, state }) {
        const response = await dispatch(
            'apiCall',
            {
                action: 'get',
                tokenType: 'sw',
                apiType: 'data',
                swContext: state.customer.customerAuth.token,
                endpoint: '/store-api/v3/order',
                params: {
                    limit: 500,
                },
            },
            { root: true }
        );

        return await dispatch('mapOrders', response.data.orders.elements);
    },
    async passwordUpdate({ dispatch, state, commit, getters }, payload) {
        const response = await dispatch(
            'apiCall',
            {
                action: 'post',
                tokenType: 'sw',
                apiType: 'data',
                swContext: state.customer.customerAuth.token,
                endpoint: '/store-api/v3/account/change-password',
                data: {
                    password: payload.password_old,
                    newPassword: payload.password,
                    newPasswordConfirm: payload.password_confirm,
                },
            },
            { root: true }
        );

        let authData = {
            created_at: new Date(),
            expires_at: getters.getCookieExpires,
            expires_in: 86400,
            token: response.data['contextToken'],
            token_name: 'swtc',
            token_type: 'context',
            updated_at: '',
        };
        commit('setCustomerAuth', authData);

        await dispatch('modCart/saveSwtc', response.data['contextToken'], { root: true });

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
    },
    async swGetSalutations({ dispatch }) {
        return await dispatch(
            'apiCall',
            {
                action: 'get',
                tokenType: 'sw',
                apiType: 'data',
                endpoint: '/store-api/v3/salutation',
            },
            { root: true }
        );
    },
    async swGetCountries({ dispatch }) {
        return await dispatch(
            'apiCall',
            {
                action: 'post',
                tokenType: 'sw',
                apiType: 'data',
                endpoint: '/store-api/v3/country',
                data: {
                    limit: 500,
                    filter: [
                        {
                            type: 'equals',
                            field: 'active',
                            value: true,
                        },
                        {
                            type: 'equals',
                            field: 'shippingAvailable',
                            value: true,
                        },
                    ],
                    sort: [
                        {
                            field: 'position',
                            order: 'ASC',
                        },
                    ],
                },
            },
            { root: true }
        );
    },
    async getAvailableCountries({ commit, dispatch }) {
        const response = await dispatch('swGetCountries');
        let mappedCountries = [];

        _.forEach(response.data.elements, (country) => {
            mappedCountries.push({
                name: country.name,
                iso_code_2: country.id,
            });
        });

        commit('setAvailableCountries', mappedCountries);
    },
    async postWishlist({ dispatch }) {
        // Saving wishlist to customeraccount is currently not implemented in SW6 headless API
    },
    async getWishlist({ dispatch }) {
        // Getting wishlist from customer is currently not implemented in SW6 headless API
        return {
            data: {
                item: {},
            },
        };
    },
    async updateWishlist({ dispatch }) {
        // Updating wishlist from customer is currently not implemented in SW6 headless API
    },
    async deleteWishlist({ dispatch }) {
        // Removing wishlist from customer is currently not implemented in SW6 headless API
    },
    async updateCustomerInfo({ dispatch, state }, payload) {
        let editedCustomerData = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            salutationId: payload.salutationId,
        };

        await dispatch(
            'apiCall',
            {
                action: 'post',
                tokenType: 'sw',
                swContext: state.customer.customerAuth.token,
                apiType: 'data',
                endpoint: '/store-api/v3/account/change-profile',
                data: editedCustomerData,
            },
            { root: true }
        );

        await dispatch('getCustomerInfo');
    },
    async updateCustomerEmail({ dispatch, state }, payload) {
        await dispatch(
            'apiCall',
            {
                action: 'post',
                tokenType: 'sw',
                swContext: state.customer.customerAuth.token,
                apiType: 'data',
                endpoint: '/store-api/v3/account/change-email',
                data: {
                    email: payload.email,
                    emailConfirmation: payload.emailRepeat,
                    password: payload.password,
                },
            },
            { root: true }
        );

        return await dispatch('getCustomerInfo');
    },
    async passwordForgot({ dispatch }, payload) {
        return await dispatch(
            'apiCall',
            {
                action: 'post',
                tokenType: 'sw',
                apiType: 'data',
                endpoint: '/store-api/v3/account/recovery-password',
                data: {
                    email: payload.email,
                    storefrontUrl: process.env.API_BASE_URL,
                },
            },
            { root: true }
        );
    },
};

function mapAddress(address) {
    return {
        id: address.id,
        gender: address.salutationId,
        firstName: address.firstName,
        lastName: address.lastName,
        street: address.street,
        houseNo: '',
        postal: address.zipcode,
        city: address.city,
        country: address.countryId,
        company: address.company,
    };
}
