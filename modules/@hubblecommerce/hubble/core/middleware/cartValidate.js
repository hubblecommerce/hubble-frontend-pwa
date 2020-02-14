import Middleware from './middleware'
import base64 from "base-64";

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.cartValidate = function ({ isHMR, store, redirect, app }) {

    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    let _cart = null;

    // Get cookie serverside/clientside to check if order object exists
    if(process.server) {
        // Check if cookie isset
        if(app.$cookies.get(store.state.modCart.cookieName)) {
            _cart = JSON.parse(base64.decode(app.$cookies.get(store.state.modCart.cookieName)));
        } else {
            return redirect('/checkout/cart');
        }
    } else {
        _cart = store.state.modCart.cart;
    }

    // If cookie exists and qty of cart is bigger 0
    if(_cart.items_qty > 0) {
        return;
    }

    return redirect('/checkout/cart');

};
