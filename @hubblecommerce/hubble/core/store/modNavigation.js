const defaultDirection = {
    sm: "rightLeft",
    md: "rightLeft",
    lg: "rightLeft",
};

export const state = () => ({
    showMenu: false,
    offcanvas: {
        component: '',
        isActive: false,
        direction: defaultDirection,
        sameLayerOpened: false,
    },
});

export const mutations = {
    showMenu(state) {
        state.showMenu = true;
    },
    hideMenu(state) {
        state.showMenu = false;
    },
    toggleOffcanvas(state, payload) {
        // Set component name to identify current active layer
        if (state.offcanvas.component === payload.component) {
            state.offcanvas.component = '';
        } else {
            state.offcanvas.component = payload.component;
        }

        // Set direction from which offcanvas layer appears
        if (state.offcanvas.direction != null) {
            state.offcanvas.direction = payload.direction;
        } else {
            // Set default if not set in payload
            state.offcanvas.direction = defaultDirection;
        }

        // Toggle On | Set or reset layer to active depends on component that is set
        state.offcanvas.isActive = !(
            state.offcanvas.isActive === true &&
            state.offcanvas.component === ""
        );
    },
    showOffcanvas(state, payload) {
        // Set component name to identify current active layer
        state.offcanvas.component = payload.component;

        // Set state of offcanvas status
        state.offcanvas.isActive = true;

        // Set direction from which offcanvas layer appears
        if (state.offcanvas.direction != null) {
            state.offcanvas.direction = payload.direction;
        } else {
            // Set default if not set in payload
            state.offcanvas.direction = defaultDirection;
        }
    },
    hideOffcanvas(state) {
        // Set component name to identify current active layer
        state.offcanvas.component = '';

        // Set state of offcanvas status
        state.offcanvas.isActive = false;

        // DO NOT set direction to make sure layer disapperas the same way it has been appeared
    },
    setSameLayerOpened(state, payload) {
        // If isActive currently true
        // and direction current is same as target
        // but current component is not target component for example in case of toggle
        // then set transition mode to fade
        // after that, change component name to trigger transition (handled in async actions toggleOffcanvasAction)
        if (
            state.offcanvas.isActive === true &&
            state.offcanvas.direction[payload.direction] === true &&
            state.offcanvas.component !== payload.component
        ) {
            state.offcanvas.sameLayerOpened = true;
        } else {
            state.offcanvas.sameLayerOpened = false;
        }
    },
    resetSameLayerOpened: (state) => {
        state.offcanvas.sameLayerOpened = false;
    },
};

export const actions = {
    async toggleOffcanvasAction({ commit }, payload) {
        return new Promise((resolve) => {
            commit('toggleOffcanvas', {
                component: payload.component,
                direction: payload.direction,
            });

            resolve('resolved');
        });
    },
    async showOffcanvasAction({ commit }, payload) {
        return new Promise((resolve) => {
            commit('showOffcanvas', {
                component: payload.component,
                direction: payload.direction,
            });

            resolve('resolved');
        });
    },
    async hideOffcanvasAction({ commit, dispatch }) {
        return new Promise((resolve) => {
            dispatch('resetSameLayerOpenedAction').then(() => {
                commit('hideOffcanvas');
            });

            dispatch('modFlashMessage/unflashMessage', null, { root: true });

            resolve('resolved');
        });
    },
    async setSameLayerOpenedAction({ commit }, payload) {
        return new Promise((resolve) => {
            commit('setSameLayerOpened', {
                component: payload.component,
                direction: payload.direction,
            });

            resolve('resolved');
        });
    },
    async resetSameLayerOpenedAction({ commit }) {
        return new Promise((resolve) => {
            commit('resetSameLayerOpened');

            resolve('resolved');
        });
    },
};
