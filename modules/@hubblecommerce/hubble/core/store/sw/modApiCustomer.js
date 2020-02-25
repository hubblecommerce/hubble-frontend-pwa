import { datetimeUnixNow, datetimeUnixNowAddSecs } from '@hubblecommerce/hubble/core/utils/datetime'
import base64 from "base-64";

/**
 *
 * modApiCustomer
 * Shopware store for customer data
 *
 */
export default function (ctx) {
    const modApiCustomer = {
        namespaced: true,
        state: () => ({
            cacheTTL: 60,
            apiAuthResponse: {},
            apiAuthToken: null,

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
        }
    };
    ctx.store.registerModule('modApiCustomer', modApiCustomer);
}
