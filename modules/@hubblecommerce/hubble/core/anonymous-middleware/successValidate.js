import _ from 'lodash';

export default function ({ isHMR, store, redirect, app }) {
    // ignore if called from hot module replacement
    if (isHMR) {
        return;
    }

    // Get cookie serverside/clientside to check if order object exists
    let order = app.$cookies.get(store.state.modApiPayment.cookieNameOrder);

    // If cookie exists
    if(_.isEmpty(order)) {
        return;
    }

    // Order cookie isset
    if(!_.isEmpty(order)) {
        // Payment or shipping is empty
        if(order.chosenPaymentMethod.id == null || order.chosenShippingMethod.id == null) {
            return redirect('/checkout/payment');
        }
    }

    return redirect('/checkout/summary');
};
