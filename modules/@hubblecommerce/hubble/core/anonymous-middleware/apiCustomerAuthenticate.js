import { datetimeUnixNow } from '@hubblecommerce/hubble/core/utils/datetime'
import _ from 'lodash';

export default function ({ isHMR, store, redirect, app, route }) {
    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    let customerAuth = null;

    // Get cookie serverside/clientside to check if user is logged in
    if(process.server) {
        let cookie = app.$cookies.get(store.state.modApiCustomer.cookieName);

        if(cookie){
            customerAuth = cookie.customerAuth;
        }
    } else {
        customerAuth = store.getters['modApiCustomer/getCustomerAuth'];
    }

    // If cookie exists, check expiration date
    if(! _.isEmpty(customerAuth)) {
        let expires_at = new Date(customerAuth.expires_at).getTime() / 1000;

        // check expiry of cachable object
        if(expires_at >= datetimeUnixNow()) {
            return;
        }
    }

    // Checks where to redirect depending on which route someone is trying to access
    if(_.includes(route.path, '/checkout')){
        return redirect('/checkout/login');
    }
    return redirect('/customer/login');
};
