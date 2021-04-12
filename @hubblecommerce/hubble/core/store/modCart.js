export const state = () => ({
    isLoading: false,
    items: [],
    qty: 0,
    cookieName: 'cart',
    cookiePath: '/',
    cookieLifetime: 1, // hours
});

export const mutations = {
    setState(state, payload) {
        state[payload.name] = payload.state;
    },
    // Save important data from cart response to state and cookie
    setCart(state, payload) {
        let items = [];
        let qty = 0;

        // Get items and count them
        payload.data.lineItems.forEach((lineItem) => {
            items.push({
                id: lineItem.id,
                referencedId: lineItem.referencedId,
                qty: lineItem.quantity,
            });

            qty = qty + parseInt(lineItem.quantity);
        });

        state.items = items;
        state.qty = qty;

        // Save to Cookie
        this.$cookies.set(
            state.cookieName,
            {
                items: state.items,
                qty: state.qty,
            },
            {
                path: state.cookiePath,
                expires: new Date(new Date().getTime() + state.cookieLifetime * 60 * 60 * 1000),
            }
        );
    },
    resetCart(state) {
        state.items = [];
        state.qty = 0;
        this.$cookies.remove(state.cookieName);
    },
    setByCookie: function (state) {
        let cart = this.$cookies.get(state.cookieName);

        if (cart != null) {
            state.items = cart.items;
            state.qty = cart.qty;
        }
    },
};
