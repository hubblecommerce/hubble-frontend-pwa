import { logger } from "@hubblecommerce/hubble/core/utils/logger";
import axios from "axios";

const payloadPayment = () => {

    let _baseUrl = process.env.API_PAYMENT_BASE_URL.replace(/^\/|\/$/g, '');
    let _endpoint = process.env.API_PAYMENT_ENDPOINT_AUTH.replace(/^\/|\/$/g, '');

    let _authUrl = _baseUrl + '/' + _endpoint;

    let _payload = {
        'scope' : '*',
        'grant_type' : 'password',
        'client_id' : process.env.API_PAYMENT_CLIENT_ID,
        'client_secret' : process.env.API_PAYMENT_CLIENT_SECRET,
        'username' : process.env.API_PAYMENT_CLIENT_USERNAME,
        'password' : process.env.API_PAYMENT_CLIENT_PASSWORD
    };

    return {
        baseUrl: _authUrl,
        payload: _payload
    }
}

const payloadResources = () => {

    let _baseUrl = process.env.API_BASE_URL.replace(/^\/|\/$/g, '');
    let _endpoint = process.env.API_ENDPOINT_AUTH.replace(/^\/|\/$/g, '');

    let _authUrl = _baseUrl + '/' + _endpoint;

    let _payload = {
        'scope' : '*',
        'grant_type' : 'password',
        'client_id' : process.env.API_CLIENT_ID,
        'client_secret' : process.env.API_CLIENT_SECRET,
        'username' : process.env.API_CLIENT_USERNAME,
        'password' : process.env.API_CLIENT_PASSWORD
    };

    return {
        baseUrl: _authUrl,
        payload: _payload
    }
}

const payloadWorkhorse = () => {

    let _baseUrl = process.env.API_WORKHORSE_BASE_URL.replace(/^\/|\/$/g, '');
    let _endpoint = process.env.API_WORKHORSE_ENDPOINT_AUTH.replace(/^\/|\/$/g, '');

    let _authUrl = _baseUrl + '/' + _endpoint;

    let _payload = {
        'scope' : '*',
        'grant_type' : 'password',
        'client_id' : process.env.API_WORKHORSE_CLIENT_ID,
        'client_secret' : process.env.API_WORKHORSE_CLIENT_SECRET,
        'username' : process.env.API_WORKHORSE_CLIENT_USERNAME,
        'password' : process.env.API_WORKHORSE_CLIENT_PASSWORD
    };

    return {
        baseUrl: _authUrl,
        payload: _payload
    }
}

const response = function(req, res, next) {

    let _facility = 'server-side-api-auth';

    let _apiTypes = ['payment', 'resources', 'workhorse'];

    let body = '';
    let data = [];

    req.on('data', chunk => {

        body += chunk;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) {
            req.connection.destroy();
        }

        data.push(chunk)
    });

    // handle POST request ...
    if (req.method === 'POST') {
        req.on('end', function () {
            if((typeof data === 'undefined')) {
                return;
            }

            // parse possible data
            data = JSON.parse(data);

            // early out in case of invalid apiType
            if(! _apiTypes.includes(data.apiType)) {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(422);

                res.end(JSON.stringify({message: 'apiType invalid'}));

                return;
            }

            let _params = {};

            if(data.apiType === 'payment') {
                _params = payloadPayment();
            }
            if(data.apiType === 'resources') {
                _params = payloadResources();
            }
            if(data.apiType === 'workhorse') {
                _params = payloadWorkhorse();
            }

            //
            // perform remote api auth request
            axios({
                method: req.method,
                url: _params.baseUrl,
                data: _params.payload
            }).then((response) => {
                res.end(JSON.stringify(response.data));
            }).catch(error => {
                // Write error response to log file
                logger.error("%s: %s", _facility, error.toString());

                // Write status from api to response trigger catch of axios call
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(401);

                // Cast response data to string to prevent nodejs error
                res.end(JSON.stringify({message: error.toString()}));
            });
        });
    }
};

export default {
    path: '/api/client-auth',
    handler: response
};
