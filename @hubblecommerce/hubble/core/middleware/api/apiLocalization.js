export default function ({ app, store }) {
    // set api locale, if unset or update, if it has changed
    if (store.getters['modApiResources/getApiLocale'] !== app.i18n.locale) {
        store.commit('modApiResources/setApiLocale', app.i18n.locale);
    }
}
