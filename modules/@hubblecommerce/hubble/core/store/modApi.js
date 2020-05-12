import {getAccessToken} from "@hubblecommerce/hubble/core/utils/auth";
import {datetimeUnixNow, datetimeUnixNowAddSecs} from "@hubblecommerce/hubble/core/utils/datetime";
import axios from 'axios'

export default function (ctx) {

    const modApi = {
        namespaced: true,
        state: () => ({
            // Data API
            apiResourcesAuthToken: null,
            apiResourcesAuthResponse: {},
            apiResourcesCacheTTL: 600, // secs
            apiResourcesLocale: null,

            // Payment API
            apiPaymentAuthToken: null,
            apiPaymentAuthResponse: {},
            apiPaymentCacheTTL: 120, // secs
        }),
        getters: {
            getApiResourcesAuthResponse: state => {
                return state.apiResourcesAuthResponse;
            },
        },
        mutations: {
            setApiResourcesAuthResponse: (state, payload) => {
                state.apiResourcesAuthResponse = payload.data;
                state.apiResourcesAuthToken = payload.data.access_token;

                if(payload.cacheable) {
                    let _ttl = payload.apiResourcesCacheTTL || state.apiResourcesCacheTTL;

                    state.apiResourcesAuthResponse.created_at_unixtime = datetimeUnixNow();
                    state.apiResourcesAuthResponse.expires_at_unixtime = datetimeUnixNowAddSecs(_ttl);
                }
            },
            setApiPaymentAuthResponse: (state, payload) => {
                state.apiPaymentAuthResponse = payload.data;
                state.apiPaymentAuthToken = payload.data.access_token;

                if(payload.cacheable) {
                    let _ttl = payload.apiPaymentCacheTTL || state.apiPaymentCacheTTL;

                    state.apiPaymentAuthResponse.created_at_unixtime = datetimeUnixNow();
                    state.apiPaymentAuthResponse.expires_at_unixtime = datetimeUnixNowAddSecs(_ttl);
                }
            }
        },
        actions: {
            async getServerSideApiAuth({commit}, payload) {
                return new Promise(function(resolve, reject) {
                    let _baseUrl = _.trim(payload.baseUrl, '/');
                    let _endpoint = payload.endpoint;

                    let _route = _.join([_baseUrl, _endpoint], '/');

                    // Serverside api call for no cors error
                    axios({
                        method: 'POST',
                        url: '/api/server-side-api-auth-call',
                        data: {
                            baseUrl: _route,
                            'grant_type' : 'client_credentials',
                            'client_id' : payload.clientId,
                            'client_secret' : payload.clientSecret,
                            'scope' : '*',
                        }
                    }).then((response) => {

                        commit('setApiResourcesAuthResponse', {
                            data: response.data,
                            cacheable: !! response.data.expires_in || false,
                            cacheTTL: response.data.expires_in || null
                        });

                        resolve('OK');

                    }).catch((response) => {
                        console.log(response);
                        reject(response);
                    });
                });
            },
            async apiResourcesGetAuth({commit}) {
                return new Promise(function(resolve, reject) {
                    getAccessToken(
                        process.env.API_BASE_URL,
                        process.env.API_ENDPOINT_AUTH,
                        process.env.API_CLIENT_ID,
                        process.env.API_CLIENT_SECRET
                    )
                        .then(response => {

                            commit('setApiResourcesAuthResponse', {
                                data: response.data,
                                cacheable: !! response.data.expires_in || false,
                                cacheTTL: response.data.expires_in || null
                            });

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log(response);
                            reject('apiResourcesGetAuth failed!');
                        })
                });
            },
            async apiPaymentGetAuth({commit}) {
                return new Promise(function(resolve, reject) {
                    getAccessToken(
                        process.env.API_PAYMENT_BASE_URL,
                        process.env.API_PAYMENT_ENDPOINT_AUTH,
                        process.env.API_PAYMENT_CLIENT_ID,
                        process.env.API_PAYMENT_CLIENT_SECRET
                    )
                        .then(response => {
                            commit('setApiPaymentAuthResponse', {
                                data: response.data,
                                cacheable: !! response.data.expires_in || false,
                                cacheTTL: response.data.expires_in || null
                            });

                            resolve('OK');
                        })
                        .catch(response => {
                            console.log(response);
                            reject('apiPaymentGetAuth failed!');
                        })
                });
            },
            /**
             * @apiCall
             *
             * @param {Object} state
             * @param {Object} payload
             * @param payload.action Axios method e.g. 'get', 'post', 'patch', 'delete'
             * @param payload.endpoint Endpoint of api e.g '/api/login'
             * @param payload.tokenType Choose between type 'api' and 'customer'
             * @param payload.apiType Choose between type 'data' and 'payment'
             *
             * returns {Promise}
             */
            apiCall: {
                root: true,
                async handler ({state, rootState}, payload) {

                    // Set token depending on tokentype
                    // Set correct token type of api by apiType
                    let authToken;
                    if(payload.tokenType === 'api') {
                        if(payload.apiType === 'data') {
                            authToken = state.apiResourcesAuthToken
                        }
                        if(payload.apiType === 'payment') {
                            authToken = state.apiPaymentAuthToken
                        }
                    }
                    if(payload.tokenType === 'customer') {
                        authToken = rootState.modApiCustomer.customer.customerAuth.token
                    }
                    if(payload.tokenType === 'sw') {
                        authToken = process.env.API_SW_ACCESS_KEY
                    }


                    // Set custom headers depending on api type including authToken
                    let headers = {
                        'Authorization': 'Bearer ' + authToken
                    };

                    if(process.env.API_TYPE === 'sw') {
                        headers = {
                            'sw-access-key': authToken,
                            'Content-Type': 'application/json'
                        };
                    }

                    if(payload.swContext != null) {
                        _.assign(headers, {['sw-context-token']: payload.swContext});
                    }

                    // Set data if data isset
                    let payloadData = {};
                    if(!_.isEmpty(payload.data)) {
                        payloadData = payload.data;
                    }

                    // Set params if params isset
                    let payloadParams = {};
                    if(!_.isEmpty(payload.params)) {
                        payloadParams = payload.params;
                    }

                    if(process.env.API_TYPE === 'api') {
                        // Set Store ID to request data
                        if(!_.isEmpty(process.env.STORE_ID) && payloadData !== null) {
                            _.assign(payloadData, {storeId: process.env.STORE_ID});
                        }

                        // Set Store ID to request params
                        if(!_.isEmpty(process.env.STORE_ID) && payloadParams !== null) {
                            _.assign(payloadParams, {storeId: process.env.STORE_ID});
                        }
                    }

                    // Reset params if action is post
                    if(payload.action === 'post' || payload.action === 'patch') {
                        payloadParams = '';
                    }


                    // Set base url depending on api type
                    let baseUrl;
                    if(payload.apiType === 'data') {
                        baseUrl = process.env.API_BASE_URL;
                    }
                    if(payload.apiType === 'payment') {
                        baseUrl = process.env.API_PAYMENT_BASE_URL;
                    }


                    return new Promise(function(resolve, reject) {
                        axios({
                            method: payload.action,
                            url: baseUrl + payload.endpoint,
                            headers: headers,
                            params: payloadParams, // GET params
                            data: payloadData // POST data
                        }).then((response) => {
                            //console.log("API request  %o to %o finished: %o", payload.action, payload.endpoint, response);

                            // Check if 200 response data has error the flag true
                            // And if true, reject the errors
                            if(response.status === 200 && response.data.error) {
                                reject(response.data)
                            }

                            resolve(response);
                        }).catch((error) => {
                            let rejection = error;

                            if (error.response) {
                                // The request was made and the server responded with a status code
                                // that falls out of the range of 2xx

                                // reject errors
                                rejection = error.response.data;
                            } else if (error.request) {
                                // The request was made but no response was received
                                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                                // http.ClientRequest in node.js

                                rejection = error.request;
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                rejection = error.message;
                            }
                            //console.log("API request %o to %o failed: %o", payload.action, payload.endpoint, response);
                            reject(rejection)
                        });
                    });
                }
            }
        }
    };

    ctx.store.registerModule('modApi', modApi);
}
