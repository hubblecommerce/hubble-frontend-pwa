import _ from 'lodash';

export default function (ctx) {
    const modFlash = {
        namespaced: true,
        state: () => ({
            flashVisible: false,
            flashMessage: '',
            flashType: 'info',
            keepOnRouteChange: false,
            listOfFlashMessages: []
        }),

        mutations: {
            showFlash: (state) => {
                state.flashVisible = true;
            },
            hideFlash: (state) => {
                state.flashVisible = false;
            },
            setKeepOnRouteChange: (state, val) => {
                state.keepOnRouteChange = !!val;
            },
            setFlashMessage: (state, message) => {
                state.flashMessage = message;
            },
            setFlashType: (state, type) => {
                state.flashType = type;
            },
            addFlashMessageToList: (state, messageObject) => {
                // max 3 messages can be displayed at a time, older ones get pushed out: FIFO
                if (state.listOfFlashMessages.length > 2) {
                    // step 1: delete first message in array which corresponds to the oldest message
                    state.listOfFlashMessages.splice(0, 1)

                    // step 2: add new message at the end of the array
                    state.listOfFlashMessages.push(messageObject)
                } else {
                    state.listOfFlashMessages.push(messageObject)
                }
            },
            deleteMessageFromListOfFlashMessages: (state, id) => {
                state.listOfFlashMessages = state.listOfFlashMessages.filter(message => message.id !== id)
            },
        },

        actions: {
            flashMessage({ commit, state }, payload) {
                return new Promise((resolve) => {
                    commit('showFlash');

                    let newMessageID = 0;

                    if (state.listOfFlashMessages.length !== 0) {
                        const flashMessages = _.cloneDeep(state.listOfFlashMessages);

                        const lastMessage = flashMessages.pop();

                        newMessageID = lastMessage.id + 1;

                        commit('addFlashMessageToList', {
                            flashMessage: payload.flashMessage,
                            flashType: payload.flashType,
                            keepOnRouteChange: !!payload.keepOnRouteChange,
                            id: newMessageID,
                            timeoutTime: 5000
                        });
                    } else {
                        commit('addFlashMessageToList', {
                            flashMessage: payload.flashMessage,
                            flashType: payload.flashType,
                            keepOnRouteChange: !!payload.keepOnRouteChange,
                            id: newMessageID,
                            timeoutTime: 5000
                        });
                    }

                    resolve('Message flashed');
                })
            },
            resetMessage({ commit }) {
                return new Promise((resolve) => {
                    commit('hideFlash');


                    commit('setFlashMessage', '');
                    commit('setFlashType', 'info');
                    resolve('Message resetted');
                })
            },
            deleteMessage({ commit }, idOfElementToDelete) {
                return new Promise((resolve) => {
                    commit('deleteMessageFromListOfFlashMessages', idOfElementToDelete)


                    commit('setFlashMessage', '');
                    commit('setFlashType', 'info');
                    resolve('Message deleted');
                })
            },
            resetKeepOnRouteChange({ commit }) {
                commit('setKeepOnRouteChange', false);
            }
        }
    };

    ctx.store.registerModule('modFlash', modFlash);
}
