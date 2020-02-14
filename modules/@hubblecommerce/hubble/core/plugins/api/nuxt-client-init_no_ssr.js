export default async (ctx) => {
    await ctx.store.dispatch('modCart/setByForage', ctx);
    await ctx.store.dispatch('modApiPayment/setByCookie', ctx);
    await ctx.store.dispatch('modApiPayment/setOrderByCookie', ctx);
    await ctx.store.dispatch('modWishlist/setByForage', ctx);
    await ctx.store.dispatch('modCookie/setByCookie', ctx);
    await ctx.store.dispatch('modApiPayment/setAddressByCookie', ctx);
}
