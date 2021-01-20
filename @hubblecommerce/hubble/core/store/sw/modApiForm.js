export const actions = {
    async subscribeNewsletter({ dispatch }, payload) {
        const data = {
            email: payload.email,
            salutationId: payload.salutationId,
            firstName: payload.firstName,
            lastName: payload.lastName,
            street: payload.street,
            city: payload.city,
            zipCode: payload.zipCode,
            option: 'subscribe',
            storefrontUrl: process.env.API_BASE_URL,
        };
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    endpoint: '/store-api/v3/newsletter/subscribe',
                    data: data,
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response.individualSuccessMessage);
                })
                .catch((err) => {
                    console.log('signUpToNewsletter error: ', err);
                    reject(err);
                });
        });
    },
    async unsubscribeNewsletter({ dispatch, rootState }, payload) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    endpoint: '/store-api/v3/newsletter/unsubscribe',
                    data: payload,
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response.individualSuccessMessage);
                })
                .catch((err) => {
                    console.log('signUpToNewsletter error: ', err);
                    reject(err);
                });
        });
    },
    async submitContactForm({ dispatch, rootState }, payload) {
        return new Promise((resolve, reject) => {
            dispatch(
                'apiCall',
                {
                    action: 'post',
                    tokenType: 'sw',
                    apiType: 'data',
                    swContext: rootState.modCart.swtc,
                    endpoint: '/store-api/v3/contact-form',
                    data: payload,
                },
                { root: true }
            )
                .then((response) => {
                    resolve(response.individualSuccessMessage);
                })
                .catch((err) => {
                    //console.log('signUpToNewsletter error: ', err);
                    reject(err);
                });
        });
    },
};
