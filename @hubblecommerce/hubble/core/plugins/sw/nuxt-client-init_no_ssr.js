export default async (context) => {
    if (!process.server) {
        await context.store.dispatch('modCart/setByForage', context);
        await context.store.dispatch('modCart/setSwtcByCookie', context);
        await context.store.dispatch('modApiCustomer/setByCookie', context);
        await context.store.dispatch('modApiPayment/setOrderByCookie', context);
        await context.store.dispatch('modWishlist/setByForage', context);
        await context.store.dispatch('modCookieNotice/setByCookie', context);
    }
};
