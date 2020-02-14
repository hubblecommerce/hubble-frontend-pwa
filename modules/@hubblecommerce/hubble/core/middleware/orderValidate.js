import Middleware from './middleware'

Middleware.orderValidate = function ({ isHMR, store, redirect, app }) {

    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    let _order = null;

    // Get cookie serverside/clientside to check if order object exists
    if(process.server) {
        _order = app.$cookies.get(store.state.modApiPayment.cookieNameOrder);
    } else {
        _order = store.getters['modApiPayment/getOrder'];
    }

    // If payment and shipping method are set
    if(!_.isEmpty(_order.chosenPaymentMethod) || !_.isEmpty(_order.chosenShippingMethod)) {
        return;
    }

    return redirect('/checkout/payment');

};
