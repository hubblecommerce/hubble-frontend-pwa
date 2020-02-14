import { logger } from "@hubblecommerce/hubble/core/utils/logger";
import axios from "axios";

const response = function(req, res, next) {

    if (req.method === 'POST') {
        let body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                req.connection.destroy();
            }
        });

        req.on('end', function () {

            let data = JSON.parse(body);

            axios({
                method: 'POST',
                url: data.baseUrl,
                data: {
                    'grant_type' : data['grant_type'],
                    'client_id' : data['client_id'],
                    'client_secret' : data['client_secret'],
                    'scope' : data['scope']
                }
            }).then((response) => {
                res.end(JSON.stringify(response.data));
            }).catch((response) => {
                // Write error response to log file
                logger.error("Amazon API Call Error: %s", response );

                // Write status from api to response trigger catch of axios call
                res.writeHead(400);

                // Cast response data to string to prevent nodejs error
                res.end(response.toString());
            });
        });

    }

};

export default {
    path: '/api/server-side-api-auth-call',
    handler: response
};
