export default function ({ store, redirect, app }) {
    let cart = [];

    // Get cookie serverside/clientside to check if order object exists
    if (process.server) {
        const cookie = app.$cookies.get(store.state.modCart.cookieName);
        if(cookie != null) {
            cart = cookie.items;
        }
    } else {
        cart = store.state.modCart.items;
    }

    // If cookie exists and qty of cart is bigger 0
    if (cart.length > 0) {
        return;
    }

    return redirect('/cart');
}
