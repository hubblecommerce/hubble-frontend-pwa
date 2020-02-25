//
// api route middleware dispatching 'modApiResponse' to vuex store
//
// - localization: false
// - cacheable: true      (if response contains 'expires_in')
//
import { datetimeUnixNow } from '@hubblecommerce/hubble/core/utils/datetime'
import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.apiCustomerAuthenticate = function ({ isHMR, store, error, redirect, app, route }) {

    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    let _customerAuth = null;

    // Get cookie serverside/clientside to check if user is logged in
    if(process.server) {
        let cookie = app.$cookies.get(store.state.modApiPayment.cookieName);

        if(cookie){
            _customerAuth = cookie.customerAuth;
        }
    } else {
        _customerAuth = store.getters['modApiCustomer/getCustomerAuth'];
    }

    // If cookie exists, check expiration date
    if(! _.isEmpty(_customerAuth)) {

        let expires_at = new Date(_customerAuth.expires_at).getTime() / 1000;

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
