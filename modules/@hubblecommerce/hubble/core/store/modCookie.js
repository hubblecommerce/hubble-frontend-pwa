//
// cookie module
//

import base64 from "base-64";

export default function (ctx) {

    // Create vuex store module
    const modCookie = {
        namespaced: true,
        state: () => ({
            showCookieNotice: true,

            cookieName: 'hubbleCookie',
            cookiePath: '/',
            cookieTTL: 30 // days
        }),
        getters:  {
            getCookieExpires: (state) => {
                return new Date(new Date().getTime() + state.cookieTTL * 24 * 60 * 60 * 1000);
            },
            getShowCookieNotice: (state) => {
                return state.showCookieNotice;
            },
            getCookieEncoded: (state, getters) => (str) => {
                return base64.encode(str);
            },
            getCookieDecoded: (state, getters) => (str) => {
                return base64.decode(str);
            },

        },
        mutations: {
            setShowCookieNotice: (state, item) => {
                state.showCookieNotice = item;
            },
        },
        actions: {
            async acceptCookieNotice({getters, commit, state}) {
                // console.log("store showCookie called! payload: %o", payload);

                return new Promise((resolve, reject) => {
                    commit('setShowCookieNotice', false);

                    // set/send cookie to enforce lifetime
                    this.$cookies.set(state.cookieName, getters.getCookieEncoded('visited'), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve();
                });

            },
            setByCookie({commit, state, getters, dispatch}, payload) {
                // console.log("setCookieCart payload: %o", payload);

                return new Promise((resolve) => {

                    // try to retrieve auth user by cookie
                    let _cookie = this.$cookies.get(state.cookieName);

                    // no cookie? ok!
                    if(! _cookie) {
                        resolve({
                            success: true,
                            message: 'user has not visited the site'
                        });
                    }

                    let _cookieNotice = getters.getCookieDecoded(_cookie);

                    if(_cookieNotice === 'visited') {
                        commit('setShowCookieNotice', false);
                    }

                    // set/send cookie to enforce lifetime
                    this.$cookies.set(state.cookieName, getters.getCookieEncoded('visited'), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve({
                        success: true,
                        message: 'user visited the site already',
                    });
                })
            },

        }
    };

    // Register vuex store module
    ctx.store.registerModule('modCookie', modCookie);
}
