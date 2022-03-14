const reqKeyMapping = [
    {
        reqParam: 'limit',
        postKey: 'limit',
    },
    {
        reqParam: 'sorting',
        postKey: 'order',
    },
    {
        reqParam: 'page',
        postKey: 'p',
    },
    {
        reqParam: 'manufacturer',
        postKey: 'manufacturer',
    },
    {
        reqParam: 'price_from',
        postKey: 'min-price',
    },
    {
        reqParam: 'price_to',
        postKey: 'max-price',
    },
    {
        reqParam: 'rating',
        postKey: 'rating',
    },
    {
        reqParam: 'shipping-free',
        postKey: 'shipping-free',
    },
    {
        reqParam: 'properties',
        postKey: 'properties',
    },
    {
        reqParam: 'term',
        postKey: 'search',
    },
];

/**
 * @setReqParamFromRoute
 * Set request param to post data if isset in url
 *
 * @param {Object} route VueRouter object
 * @param {Object} postData Post Databag to ship with api call
 *
 * returns {Object}
 */
function setReqParamFromRoute(route, postData) {
    reqKeyMapping.forEach((o) => {
        if (route.query[o.reqParam] != null) {
            // Add comma separated options as array
            let arrOfValues = route.query[o.reqParam].split(',');
            if (arrOfValues.length > 1) {
                Object.assign(postData, {
                    [o.postKey]: arrOfValues,
                });
            } else {
                Object.assign(postData, {
                    [o.postKey]: arrOfValues[0],
                });
            }
        }
    });

    return postData;
}

function buildUriWithParamsFromObject(route, postData) {
    let params = [];

    // Set parameters with keys from mapping
    Object.keys(postData).forEach((key) => {
        reqKeyMapping.forEach((o) => {
            if(key === o.postKey) {
                if(typeof postData[key] === 'string' && postData[key] !== '') {
                    params.push(`${encodeURIComponent(o.reqParam)}=${encodeURIComponent(postData[key])}`);
                }

                if(typeof postData[key] === 'number') {
                    params.push(`${encodeURIComponent(o.reqParam)}=${encodeURIComponent(postData[key])}`);
                }

                if(typeof postData[key] === 'object' && postData[key].length > 0) {
                    params.push(`${encodeURIComponent(o.reqParam)}=${postData[key].join(',')}`);
                }

                if(typeof postData[key] === 'boolean' && postData[key] === true) {
                    params.push(`${encodeURIComponent(o.reqParam)}=${encodeURIComponent(postData[key])}`);
                }
            }
        });
    });

    // Keep foreign get parameters if exists
    Object.keys(route.currentRoute.query).forEach((existingParam) => {
        let exists = false;

        reqKeyMapping.forEach((o) => {
            if(existingParam === o.reqParam) {
                exists = true;
            }
        });

        if(!exists) {
            params.push(`${encodeURIComponent(existingParam)}=${encodeURIComponent(route.currentRoute.query[existingParam])}`);
        }
    });

    return `${route.currentRoute.path}?${params.join('&')}`;
}

export { setReqParamFromRoute, buildUriWithParamsFromObject };
