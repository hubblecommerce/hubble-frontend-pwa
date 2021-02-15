export default async (context) => {
    if (!process.server) {
        await context.store.commit('modCart/setByCookie');
        await context.store.commit('modSession/setByCookie');
    }
};
