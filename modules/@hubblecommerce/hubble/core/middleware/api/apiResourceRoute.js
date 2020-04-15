import Middleware from './middleware';

Middleware.apiResourceRoute = function ({ store, route, error }) {
    // remove leading '/'
    let path = route.path.slice(1);

    // split 'path' into segments
    let segments = path.split('/');

    // drop localization prefix
    if (segments[0].match(/^(en)$/)) {
        segments = _.drop(segments, 1);
    }

    path = _.join(segments, '/');

    let openDetail = store.getters['modApiProduct/getOpenDetail'];

    if (openDetail) {
        store.commit('modApiResources/setPageType', 'product');
    } else {
        return new Promise((resolve, reject) => {
            store
                .dispatch(
                    'apiCall',
                    {
                        action: 'get',
                        tokenType: 'api',
                        apiType: 'data',
                        endpoint: _.join(['/api/json/urls/', path], ''),
                    },
                    { root: true }
                )
                .then(response => {
                    // Throw 404 page if url is not known
                    if (_.isEmpty(response.data.result.item)) {
                        error({ statusCode: 404, message: 'Unknown URL' });
                        resolve('UriResolver OK');
                        return false;
                    }

                    // Get resource by id from api and set matching pageview component
                    store
                        .dispatch('modApiResources/apiResolveUriData', {
                            data: response.data,
                            query: route.query,
                        })
                        .then(() => {
                            resolve('UriResolver OK');
                        })
                        .catch(() => {
                            reject();
                        });
                })
                .catch(() => {
                    error({ statusCode: 404, message: 'Unknown URL' });
                });
        });
    }
};
