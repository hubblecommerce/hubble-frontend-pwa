import axios from 'axios';
import _ from 'lodash';

function getAccessToken(apiBaseUrl, apiEndpointAuth, apiClientId, apiClientSecret) {
    return new Promise(function (resolve, reject) {
        let _outerReject = reject;
        let _outerResolve = resolve;

        let _baseUrl = _.trim(apiBaseUrl, '/');
        let _endpoint = apiEndpointAuth;

        let _route = _.join([_baseUrl, _endpoint], '/');

        axios
            .post(_route, {
                grant_type: 'client_credentials',
                client_id: apiClientId,
                client_secret: apiClientSecret,
                scope: '*',
            })
            .then(function (response) {
                //console.log("api auth response: %o", response);
                _outerResolve(response);
            })
            .catch(response => {
                //console.error("Post request auth token failed: %o", response);
                _outerReject(response);
            });
    });
}

export { getAccessToken };
