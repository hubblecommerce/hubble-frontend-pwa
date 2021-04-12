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

export { setReqParamFromRoute };
