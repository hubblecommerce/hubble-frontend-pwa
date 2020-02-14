import Middleware from './middleware'

Middleware.successValidate = function ({ isHMR, store, redirect, app }) {

    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    // Get cookie serverside/clientside to check if order object exists
    let _order = app.$cookies.get(store.state.modApiPayment.cookieNameOrder);

    // If cookie exists
    if(_.isEmpty(_order)) {
        return;
    }

    // Order cookie isset
    if(!_.isEmpty(_order)) {
        // Payment or shipping is empty
        if(_order.chosenPaymentMethod.id == null || _order.chosenShippingMethod.id == null) {
            return redirect('/checkout/payment');
        }
    }

    return redirect('/checkout/summary');

};
