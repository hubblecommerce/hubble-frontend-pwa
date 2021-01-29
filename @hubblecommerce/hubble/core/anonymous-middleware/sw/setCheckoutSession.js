import _ from 'lodash';

export default async function ({ store, redirect, app }) {
    let contextToken = null;

    // Get cookie serverside/clientside to check if context token exists
    if (process.server) {
        let cookie = app.$cookies.get(store.state.modCart.swtcCookieName);

        if(cookie) {
            contextToken = cookie;
        }
    } else {
        contextToken = store.state.modCart['swtc'];
    }

    try {
        // Fetch sessioncontext
        const context = await store.dispatch('apiCall',
            {
                action: 'get',
                tokenType: 'sw',
                apiType: 'data',
                endpoint: '/store-api/v3/context',
                swContext: contextToken,
            },
            { root: true }
        );

        // Set current addresses
        if(context.data.customer != null && !_.isEmpty(context.data.customer)) {
            await store.dispatch('modApiCustomer/setCustomerInfo', context.data.customer);
        }

        // Set default/chosen payment and shipping method
        if(context.data.paymentMethod != null && !_.isEmpty(context.data.paymentMethod)) {
            store.commit('modApiPayment/setChosenPaymentMethod', { id: context.data.paymentMethod.id });
        }

        if(context.data.shippingMethod != null && !_.isEmpty(context.data.shippingMethod)) {
            store.commit('modApiPayment/setChosenShippingMethod', { id: context.data.shippingMethod.id });
        }

        return true;
    } catch(e) {
        return redirect('/checkout/cart');
    }
}
