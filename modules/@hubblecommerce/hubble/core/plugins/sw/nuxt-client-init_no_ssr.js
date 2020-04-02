export default async (ctx) => {
    await ctx.store.dispatch('modCart/setByForage', ctx);
    await ctx.store.dispatch('modCart/setSwtcByCookie', ctx);
    await ctx.store.dispatch('modApiCustomer/setByCookie', ctx);
    await ctx.store.dispatch('modApiPayment/setOrderByCookie', ctx);
    await ctx.store.dispatch('modWishlist/setByForage', ctx);
    await ctx.store.dispatch('modCookieNotice/setByCookie', ctx);
}
