export default function (ctx) {

    // Create vuex store module
    const modNavigation = {
        namespaced: true,
        state: () => ({
            showMenu: false,
            offcanvas: {
                component: '',
                isActive: false,
                direction: {
                    leftRight: false,
                    rightLeft: false,
                    bottomTop: false,
                    topBottom: false
                },
                sameLayerOpened: false
            }
        }),
        mutations: {
            showMenu: (state) => {
                state.showMenu = true;
            },
            hideMenu: (state) => {
                state.showMenu = false;
            },
            toggleOffcanvas: (state, payload) => {

                // Set component name to identify current active layer
                if(state.offcanvas.component === payload.component) {
                    state.offcanvas.component = '';
                } else {
                    state.offcanvas.component = payload.component;
                }

                // Toggle On | Set or reset layer to active depends on component that is set
                if(state.offcanvas.isActive === true && state.offcanvas.component === '') {
                    state.offcanvas.isActive = false;

                    // Reset direction from which offcanvas layer appears
                    _.forEach(state.offcanvas.direction, function(value, key) {
                        state.offcanvas.direction[key] = false;
                    });
                } else {
                    state.offcanvas.isActive = true;

                    // Toggle Off | Set direction from which offcanvas layer appears
                    _.forEach(state.offcanvas.direction, function(value, key) {
                        if(payload.direction === key) {
                            state.offcanvas.direction[key] = true;
                        } else {
                            state.offcanvas.direction[key] = false;
                        }
                    });

                }
            },
            showOffcanvas: (state, payload) => {
                // Set component name to identify current active layer
                state.offcanvas.component = payload.component;

                // Set state of offcanvas status
                state.offcanvas.isActive = true;

                // Set direction from which offcanvas layer appears
                _.forEach(state.offcanvas.direction, function(value, key) {
                    if(payload.direction === key) {
                        state.offcanvas.direction[key] = true;
                    } else {
                        state.offcanvas.direction[key] = false;
                    }
                });
            },
            hideOffcanvas: (state) => {
                // Set component name to identify current active layer
                state.offcanvas.component = '';

                // Set state of offcanvas status
                state.offcanvas.isActive = false;

                // Set direction from which offcanvas layer appears
                _.forEach(state.offcanvas.direction, function(value, key) {
                    state.offcanvas.direction[key] = false;
                });
            },
            setSameLayerOpened: (state, payload) => {
                // If isActive currently true
                // and direction current is same as target
                // but current component is not target component for example in case of toggle
                // then set transition mode to fade
                // after that, change component name to trigger transition (handled in async actions toggleOffcanvasAction)
                if(state.offcanvas.isActive === true && state.offcanvas.direction[payload.direction] === true && state.offcanvas.component !== payload.component) {
                    state.offcanvas.sameLayerOpened = true;
                } else {
                    state.offcanvas.sameLayerOpened = false;
                }
            },
            resetSameLayerOpened: (state) => {
                state.offcanvas.sameLayerOpened = false;
            }
        },
        actions: {
            async toggleOffcanvasAction({commit, state, dispatch, getters}, payload) {
                return new Promise((resolve, reject) => {

                    dispatch('setSameLayerOpenedAction', {
                        component: payload.component,
                        direction: payload.direction
                    }).then(() => {
                        commit('toggleOffcanvas', {
                            component: payload.component,
                            direction: payload.direction
                        });
                    });

                    resolve('resolved');
                });
            },
            async showOffcanvasAction({commit, state, dispatch, getters}, payload) {
                return new Promise((resolve, reject) => {

                    commit('showOffcanvas', {
                        component: payload.component,
                        direction: payload.direction
                    });

                    resolve('resolved');
                });
            },
            async hideOffcanvasAction({commit, state, dispatch, getters}) {
                return new Promise((resolve, reject) => {

                    dispatch('resetSameLayerOpenedAction').then(() => {
                        commit('hideOffcanvas');
                    });

                    resolve('resolved');
                });
            },
            async setSameLayerOpenedAction({commit, state, dispatch, getters}, payload) {
                return new Promise((resolve, reject) => {

                    commit('setSameLayerOpened', {
                        component: payload.component,
                        direction: payload.direction
                    });

                    resolve('resolved');
                });
            },
            async resetSameLayerOpenedAction({commit, state, dispatch, getters}, payload) {
                return new Promise((resolve, reject) => {

                    commit('resetSameLayerOpened');

                    resolve('resolved');
                });
            }
        }
    };

    // Register vuex store module
    ctx.store.registerModule('modNavigation', modNavigation);
}
