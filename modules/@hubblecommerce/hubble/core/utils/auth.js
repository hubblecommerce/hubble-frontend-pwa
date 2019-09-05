import axios from 'axios'

function getAccessToken() {
    return new Promise(function(resolve, reject) {

        let _outerReject = reject;
        let _outerResolve = resolve;

        let _baseUrl = _.trim(process.env.API_BASE_URL, '/');
        let _endpoint = process.env.API_ENDPOINT_AUTH;

        let _route = _.join([_baseUrl, _endpoint], '/');

        axios.post(_route, {
            'grant_type' : 'client_credentials',
            'client_id' : process.env.API_CLIENT_ID,
            'client_secret' : process.env.API_CLIENT_SECRET,
            'scope' : '*',
        })
        .then(function (response) {
            // console.log("api auth response: %o", response);
            _outerResolve(response);
        })
        .catch(response => {
            // console.error("Post request auth token failed: %o", response);
            _outerReject(response);
        });
    });
}

export { getAccessToken };