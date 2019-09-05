//
// route middleware redirecting to dashboard, if logged in
//
import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.authRedirect = function ({ isHMR, store, redirect }) {

    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    let _redirectTo = '/customer/dashboard';

    // check vuex store object first
    if(store.state.modUser.isLoggedIn) {

        // redirect, if auth user
        return redirect(_redirectTo);
    }

    return;

};
