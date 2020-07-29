export default async (context) => {
    await context.store.dispatch('modLastViewed/setByForage', context);
}
