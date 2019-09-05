//
// api route middleware dispatching 'dataMenu' to vuex store
//
import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.apiResourceRoute = function ({ app, store, route, error }) {

  // ignore if called from hot module replacement
  // if (isHMR) {
  //     return;
  // }

  // remove leading '/'
  let _path = route.path.slice(1)
  // console.log("middleware::api-resource-route ... _path: %s", _path);

  // split '_path' into segments
  let _segments = _path.split('/')
  // console.log("middleware::api-resource-route ... _segments: %o", _segments);

  // drop localization prefix
  if (_segments[0].match(/^(en)$/)) {
    _segments = _.drop(_segments, 1)
  }
  // console.log("middleware::api-resource-route ... _segments: %o", _segments);

  // resulting '_path'
  _path = _.join(_segments, '/')

  let _locale = app.i18n.locale

  // console.log("middleware::api-resource-route ... locale: %s", _locale);
  // console.log("middleware::api-resource-route ... route: %o", route);

  // // check vuex store object first
  // if(! _.isEmpty(store.state.modApiResources.dataMenu)) {

  //     // check expiry of cachable object
  //     if(store.state.modApiResources.dataMenu.expires_at_unixtime >= moment().unix()) {
  //         // console.log("middleware::api-resource-route ... dataMenu known to vuex store");

  //         return;
  //     }
  //     // else {
  //     //     console.log("middleware::api-resource-route ... dataMenu known to vuex store, but expired");
  //     // }
  // }

  // dispatch to vuex store by promise
  return new Promise((resolve, reject) => {
    let _outerReject = reject
    let _outerResolve = resolve

    store
        .dispatch('modApiResources/apiGet', {
          endpoint: _.join(['/rocket-api/json/', _locale, '/urls/', _path], '')
        })
        .then(response => {
          // console.log("middleware::api-resource-route ... then response: %o", response);

          if (_.isEmpty(response.data.result.item)) {
            error({ statusCode: 404, message: 'Unknown URL' })
            _outerResolve('UriResolver OK')
            return false
          }

          store
              .dispatch('modApiResources/apiResolveUriData', {
                data: response.data,
                query: route.query
              })
              .then(response => {
                // console.log("middleware::api-resource-route ... apiResolveUriData then response: %o", response);

                // Throw error if url or category is valid but have no items (Filter is not correct)
                // if (response.data.result.stats.count <= 0) {
                //   error({
                //     statusCode: 400,
                //     message:
                //       'Bad Request. No Items for this Category or Filters found'
                //   })
                // }

                _outerResolve('UriResolver OK')
              })
              .catch(response => {
                // console.log("middleware::api-resource-route ... apiResolveUriData reject!")

                _outerReject()
              })

          // resolve('OK');
        })
        .catch(response => {
          // console.log("middleware::api-resource-route ... catch response: %o", response);

          error({ statusCode: 404, message: 'Unknown URL' })
        })
  })

};
