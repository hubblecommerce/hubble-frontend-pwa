import base64 from "base-64";

export default function (ctx) {
    const modCookieNotice = {
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
            getCookieEncoded: () => (str) => {
                return base64.encode(str);
            },
            getCookieDecoded: () => (str) => {
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
                return new Promise((resolve, reject) => {
                    commit('setShowCookieNotice', false);

                    // set cookie to enforce lifetime
                    this.$cookies.set(state.cookieName, getters.getCookieEncoded('visited'), {
                        path: state.cookiePath,
                        expires: getters.getCookieExpires
                    });

                    resolve();
                });
            },
            setByCookie({commit, state, getters}) {
                return new Promise((resolve) => {
                    // try to retrieve auth user by cookie
                    let cookie = this.$cookies.get(state.cookieName);

                    if(! cookie) {
                        resolve({
                            success: true,
                            message: 'user has not visited the site'
                        });
                    }

                    let cookieNotice = getters.getCookieDecoded(cookie);

                    if(cookieNotice === 'visited') {
                        commit('setShowCookieNotice', false);
                    }

                    // set cookie to enforce lifetime
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

    ctx.store.registerModule('modCookieNotice', modCookieNotice);
}
