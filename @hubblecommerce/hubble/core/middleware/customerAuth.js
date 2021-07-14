import apiClient from '@/utils/api-client';

export default async function ({ app, store, redirect }) {
    // Check for contextToken either as cookie or set in vuex store
    let contextToken = null;

    if (process.server) {
        contextToken = app.$cookies.get(store.state.modSession.cookieName);
    } else {
        contextToken = store.state.modSession.contextToken;
    }

    if (contextToken === null) {
        return redirect('/customer/login');
    }

    // Fetch context for current contextToken to verify customer is logged in and not a guest
    try {
        let response = await new apiClient().apiCall({
            action: 'get',
            endpoint: 'store-api/context',
            contextToken: contextToken,
        });

        if (response.data.customer != null) {
            if (response.data.customer.active && !response.data.customer.guest) {
                return;
            }
        }

        return redirect('/customer/login');
    } catch (e) {
        return redirect('/customer/login');
    }
}
