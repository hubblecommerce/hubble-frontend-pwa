export default async (ctx) => {
    await ctx.store.dispatch('modCart/setByCookie', ctx);
    await ctx.store.dispatch('modUser/setByCookie', ctx);
    await ctx.store.dispatch('modWishlist/setByCookie', ctx);
}
