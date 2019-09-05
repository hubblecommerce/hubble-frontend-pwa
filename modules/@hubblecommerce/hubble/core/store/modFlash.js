export default function (ctx) {

    // Create vuex store module
    const modFlash = {
        namespaced: true,
        state: () => ({
            flashVisible: false,
            flashMessage: '',
            flashType: 'info',
        }),
        mutations: {
            showFlash: (state) => {
                state.flashVisible = true;
            },
            hideFlash: (state) => {
                state.flashVisible = false;
            },
            setFlashMessage: (state, message) => {
                state.flashMessage = message;
            },
            setFlashType: (state, type) => {
                state.flashType = type;
            }
        },
        actions: {
            flashMessage({commit, state}, payload) {
                return new Promise((resolve, reject) => {
                    commit('showFlash');
                    commit('setFlashMessage', payload.flashMessage);
                    commit('setFlashType', payload.flashType);
                    resolve('Message flashed');
                })
            },
            resetMessage({commit, state}) {
                return new Promise((resolve, reject) => {
                    commit('hideFlash');
                    commit('setFlashMessage', '');
                    commit('setFlashType', 'info');
                    resolve('Message resetted');
                })
            }
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modFlash', modFlash);
}
