//
// route middleware redirecting to login, if not logged in
//
import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.authRequired = function ({ isHMR, store, redirect }) {

    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    let _redirectTo = '/customer/login';

    // check vuex store object first
    if(! store.state.modUser.isLoggedIn) {

        // redirect, if no auth user
        return redirect(_redirectTo);
    }

    return;

};
