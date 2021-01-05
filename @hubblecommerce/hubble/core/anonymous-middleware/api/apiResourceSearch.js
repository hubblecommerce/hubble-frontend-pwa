export default function ({ store, route }) {
    return new Promise((resolve, reject) => {
        store
            .dispatch('modSearch/apiCatalogsearch', {
                query: route.query,
            })
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
