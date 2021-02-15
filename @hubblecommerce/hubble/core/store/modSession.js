export const state = () => ({
    contextToken: null,
    cookieName: 'contextToken',
    cookiePath: '/',
    cookieLifetime: 1 // hours
});

export const mutations = {
    setContextToken(state, payload) {
        state.contextToken = payload;

        // Save to Cookie
        this.$cookies.set(state.cookieName, payload, {
            path: state.cookiePath,
            expires: new Date(new Date().getTime() + state.cookieLifetime * 60 * 60 * 1000)
        });
    },
    resetContextToken(state) {
        state.contextToken = null;
        this.$cookies.remove(state.cookieName);
    },
    setByCookie: async function(state) {
        try {
            let session = this.$cookies.get(state.cookieName);
            if(session != null) {
                state.contextToken = this.$cookies.get(state.cookieName);
            }
        } catch (e) {
            throw e;
        }
    }
};
