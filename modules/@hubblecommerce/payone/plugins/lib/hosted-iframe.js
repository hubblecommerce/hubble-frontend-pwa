import axios from 'axios';

export default async (ctx) => {
    // Callback to be called on check cc information via hosted iFrame
    window.hostedIFramePayCallback = function(response) {

        // Save pseudopan to store and redirect to checkout summary page
        if (response.status === "VALID") {

            ctx.store.commit('modApiPayment/setPseudoCardPan', response.pseudocardpan);
            ctx.store.commit('modApiPayment/setCardType', response.cardtype);
            ctx.store.commit('modApiPayment/setCardExpireDate', response.cardexpiredate);

            // Get uuid from api
            ctx.store.dispatch('modApiPayment/getUuid').then((response) => {

                // Store uuid as orderId to order in store
                ctx.store.commit('modApiPayment/setOrderId', response.data.substring(0, 20));

                ctx.store.dispatch('modApiPayment/createOrder').then(() => {
                    ctx.app.router.push({
                        path: ctx.app.localePath('checkout-summary')
                    });
                });
            });
        }

        // Error is displayed directly in iFrame (see PayoneChannelClientHostediFrame.vue)
        if (response.status === "ERROR") {
            axios({
                method: 'POST',
                url: '/api/hubble-logger',
                data: {
                    level: "error",
                    msg: "payone-response.js hostedIFramePayCallback error: %o",
                    payload: response
                }
            });
            console.debug(response);
        }
    }
}
