//
// api route middleware dispatching 'dataMenu' to vuex store
//
import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.apiResourceRoute = function({app, store, route, error}) {

    // remove leading '/'
    let _path = route.path.slice(1);
    // console.log("middleware::api-resource-route ... _path: %s", _path);

    // split '_path' into segments
    let _segments = _path.split('/');
    // console.log("middleware::api-resource-route ... _segments: %o", _segments);

    // drop localization prefix
    if (_segments[0].match(/^(en)$/)) {
        _segments = _.drop(_segments, 1)
    }
    // console.log("middleware::api-resource-route ... _segments: %o", _segments);

    _path = _.join(_segments, '/');

    let openDetail = store.getters['modApiProduct/getOpenDetail'];

    if(openDetail) {
        store.commit('modApiResources/setPageType', 'product');
    } else {
        // dispatch to vuex store by promise
        return new Promise((resolve, reject) => {
            let _outerReject = reject;
            let _outerResolve = resolve;

            store.dispatch('apiCall', {
                action: 'get',
                tokenType: 'api',
                apiType: 'data',
                endpoint: _.join(['/api/json/urls/', _path], '')
            }, {root: true})
                .then(response => {

                    // Throw 404 page if url is not known
                    if (_.isEmpty(response.data.result.item)) {
                        error({statusCode: 404, message: 'Unknown URL'});
                        _outerResolve('UriResolver OK');
                        return false;
                    }

                    // Get resource by id from api and set matching pageview component
                    store.dispatch('modApiResources/apiResolveUriData', {
                        data: response.data,
                        query: route.query
                    })
                        .then(() => {
                            _outerResolve('UriResolver OK')
                        })
                        .catch(() => {
                            _outerReject()
                        })
                })
                .catch(() => {
                    error({statusCode: 404, message: 'Unknown URL'})
                })
        })

    }

};
