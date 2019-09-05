//
// session user module
//
import base64 from "base-64";

export default function (ctx) {

    // Create vuex store module
    const modUser = {
        namespaced: true,
        state: () => ({
            authUser: {
                isLoggedIn: false,
                customerOrders: [],
                customerBillingAddresses: [],
                customerShippingAddresses: []
            },
            defaultUser: {
                isLoggedIn: false,
                customerOrders: [],
                customerBillingAddresses: [],
                customerShippingAddresses: []
            },
            isLoggedIn: false,

            dummyUser: {
                username: 'demo',
                password: 'demo',
                firstname: 'John',
                lastname: 'Doe',
                phone: '123-456-9',
                email: 'text@example.com',
                customerOrders: [],
                customerShippingAddresses: [],
                customerBillingAddresses: []
            },

            cookieName: 'rocketAuthUser',
            cookiePath: '/',
            cookieTTL: 360 // minutes
        }),
        getters: {
            getCookieExpires: (state) => {
                return new Date(new Date().getTime() + state.cookieTTL * 60 * 1000);
            },
            getAuthUser: (state) => {
                return state.authUser;
            },
            getUserEncoded: (state, getters) => (objJsonStr) => {
                return base64.encode(JSON.stringify(objJsonStr));
            },
            getUserDecoded: (state, getters) => (objJsonB64) => {
                return JSON.parse(base64.decode(objJsonB64));
            }
        },
        mutations: {
            setAuthUser: (state, payload) => {
                let _user = _.omit(payload.data, ['password']);

                state.authUser = _user;
            },
            setLoggedIn: (state, payload) => {
                state.isLoggedIn = payload.data;
                state.authUser.isLoggedIn = payload.data;
            },
            setCustomerShippingAdress: (state, payload) => {
                state.customerShippingAddresses = payload.data;
            },
            addCustomerShippingAddress: (state, payload) => {
                if(state.authUser.customerShippingAddresses == null) {
                    state.authUser.customerShippingAddresses = [payload.data];
                }
                if(state.authUser.customerShippingAddresses != null) {
                    state.authUser.customerShippingAddresses.push(payload.data)
                }
            },
            updateCustomerShippingAddress: (state, payload) => {
                state.authUser.customerShippingAddresses[payload.data.addressId] = payload.data;
            },
            removeCustomerShippingAddress: (state, payload) => {
                state.authUser.customerShippingAddresses.splice(payload.data.addressId, 1);
            },
            setCustomerBillingAdress: (state, payload) => {
                state.customerBillingAddresses = payload.data;
            },
            addCustomerBillingAddress: (state, payload) => {
                if(state.authUser.customerBillingAddresses == null) {
                    state.authUser.customerBillingAddresses = [payload.data];
                }
                if(state.authUser.customerBillingAddresses != null) {
                    state.authUser.customerBillingAddresses.push(payload.data)
                }
            },
            updateCustomerBillingAddress: (state, payload) => {
                state.authUser.customerBillingAddresses[payload.data.addressId] = payload.data;
            },
            removeCustomerBillingAddress: (state, payload) => {
                state.authUser.customerBillingAddresses.splice(payload.data.addressId, 1);
            },
            addCustomerOrder: (state, payload) => {
                if(state.authUser.customerOrders == null) {
                    state.authUser.customerOrders = [payload.data];
                }
                if(state.authUser.customerOrders != null) {
                    state.authUser.customerOrders.push(payload.data)
                }
            },
        },
        actions: {
            attemptLogin({commit, state, getters}, payload) {

                return new Promise((resolve, reject) => {

                    if(! payload.username) {
                        reject("username required!");
                    }

                    if(! payload.password) {
                        reject("password required!");
                    }

                    if(payload.username !== state.dummyUser.username || payload.password !== state.dummyUser.password) {
                        reject("Sorry, data does not match our credentials!");
                    }

                    // merge new user object (loginDummy + authUser)
                    let _user = _.merge({}, state.dummyUser, state.authUser);

                    commit('setAuthUser', { data: _user });
                    commit('setLoggedIn', { data: true });

                    this.$cookies.set(state.cookieName, getters.getUserEncoded(_user), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve("username & password OK");
                });
            },
            attemptLogout({commit, state}, payload) {

                return new Promise((resolve, reject) => {

                    commit('setAuthUser', { data: state.defaultUser });
                    commit('setLoggedIn', { data: false });

                    this.$cookies.remove(state.cookieName);

                    resolve("OK, logged out!");
                })
            },
            attemptRegistration({commit, state, getters}, payload) {

                return new Promise((resolve, reject) => {

                    // merge new user object (registerDummy + authUser)
                    let _user = _.merge({}, payload, state.authUser);

                    commit('setAuthUser', { data: _user });
                    commit('setLoggedIn', { data: true });

                    this.$cookies.set(state.cookieName, getters.getUserEncoded(_user), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve("user registered!");
                });
            },
            addShippingAddress({commit, state, getters}, payload) {

                return new Promise((resolve, reject) => {

                    let _address = payload;

                    commit('addCustomerShippingAddress', { data: _address });

                    this.$cookies.set(state.cookieName, getters.getUserEncoded(state.authUser), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve("shipping address saved");
                });
            },
            updateShippingAddress({commit, state, getters}, payload) {

                return new Promise((resolve, reject) => {

                    let _address = payload;

                    commit('updateCustomerShippingAddress', { data: _address });

                    this.$cookies.set(state.cookieName, getters.getUserEncoded(state.authUser), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve("shipping address updated");
                });
            },
            removeShippingAddress({commit, state, getters}, payload) {

                return new Promise((resolve, reject) => {

                    let _address = payload;

                    commit('removeCustomerShippingAddress', { data: _address });

                    this.$cookies.set(state.cookieName, getters.getUserEncoded(state.authUser), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve("shipping address updated");
                });
            },
            addBillingAddress({commit, state, getters}, payload) {

                return new Promise((resolve, reject) => {

                    let _address = payload;

                    commit('addCustomerBillingAddress', { data: _address });

                    this.$cookies.set(state.cookieName, getters.getUserEncoded(state.authUser), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve("Billing address saved");
                });
            },
            updateBillingAddress({commit, state, getters}, payload) {

                return new Promise((resolve, reject) => {

                    let _address = payload;

                    commit('updateCustomerBillingAddress', { data: _address });

                    this.$cookies.set(state.cookieName, getters.getUserEncoded(state.authUser), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve("Billing address updated");
                });
            },
            removeBillingAddress({commit, state, getters}, payload) {

                return new Promise((resolve, reject) => {

                    let _address = payload;

                    commit('removeCustomerBillingAddress', { data: _address });

                    this.$cookies.set(state.cookieName, getters.getUserEncoded(state.authUser), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve("Billing address updated");
                });
            },
            setByCookie({commit, state, getters}, payload) {
                // console.log("modUser/setByCookie payload: %o", payload);

                return new Promise((resolve, reject) => {

                    // try to retrieve auth user by cookie
                    let _cookie = this.$cookies.get(state.cookieName);

                    // no cookie? ok!
                    if(! _cookie) {
                        resolve({
                            success: true,
                            message: 'customer not known by cookie.'
                        });
                    }

                    let _user = getters.getUserDecoded(_cookie);

                    commit('setAuthUser', { data: _user });
                    commit('setLoggedIn', { data: _user.isLoggedIn });

                    // set/send cookie to enforce lifetime
                    this.$cookies.set(state.cookieName, getters.getUserEncoded(_user), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve({
                        success: true,
                        message: 'customer taken from cookie.',
                        redirect: true
                    });
                })
            },
            saveOrder({commit, state, getters}, payload) {

                return new Promise((resolve, reject) => {

                    let _data = payload;
                    let _today = new Date();
                    let _total = _data.subTotal.replace('€','');
                    let _order = {
                        id: '00000001',
                        date: _today,
                        total: _total,
                        state: 'open',
                        items: _data.items
                    };

                    commit('addCustomerOrder', { data: _order });

                    this.$cookies.set(state.cookieName, getters.getUserEncoded(state.authUser), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve("order saved");
                });
            },
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modUser', modUser);
}
