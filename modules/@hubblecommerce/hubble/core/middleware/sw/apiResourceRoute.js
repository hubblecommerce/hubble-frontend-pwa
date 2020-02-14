//
// api route middleware dispatching 'dataMenu' to vuex store
//
import Middleware from './middleware'
import {findCategoryByUrl, findProductByUrl} from '@hubblecommerce/hubble/core/utils/menuHelper';

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.apiResourceRoute = function({app, store, route, error}) {

    // remove leading '/'
    let _path = route.path.slice(1);

    // split '_path' into segments
    let _segments = _path.split('/');

    // drop localization prefix
    if (_segments[0].match(/^(en)$/)) {
        _segments = _.drop(_segments, 1)
    }

    _path = _.join(_segments, '/');

    // Lookup if url matches one of the category urls
    let matchingCategory = findCategoryByUrl(store.getters['modApiResources/getDataMenu'].result.items, _path);

    if(matchingCategory) {

        return new Promise((resolve, reject) => {
            // Get and store category including products from api
            store.dispatch('modApiResources/swGetCategory', matchingCategory.id).then(() => {
                resolve();
            }).catch(() => {
                error({statusCode: 404, message: 'Unknown URL'});
                resolve();
            });
        });

    }

    let matchingProduct = findProductByUrl(store.getters['modApiResources/getDataProductUrls'], _path);
    store.commit('modApiResources/setProductId', matchingProduct.foreignKey);

    if(matchingProduct) {

        let openDetail = store.getters['modApiResources/getOpenDetail'];
        if(openDetail) {
            store.commit('modApiResources/setPageType', 'product');
        } else {
            // dispatch to vuex store by promise
            return new Promise((resolve, reject) => {
                // Get and store category including products from api
                store.dispatch('modApiResources/getProductData', {path: _path}).then(() => {
                    store.commit('modApiResources/setPageType', 'product');
                    resolve();
                }).catch(() => {
                    error({statusCode: 404, message: 'Unknown URL'});
                    resolve();
                });
            });
        }

    }
};
