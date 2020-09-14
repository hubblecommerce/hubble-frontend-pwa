import { logger } from '@hubblecommerce/hubble/core/utils/logger';

const response = function (req, res) {
    console.log("running the hubble logger");
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
            let json = JSON.parse(body);

            let level = 'error';
            let message = 'Missing log error message: %s';
            let meta = 'No meta info provided for log entry';

            if (json.level !== null) {
                level = json.level;
            }

            if (json.message !== null) {
                message = json.msg;
            }

            if (json.meta !== null) {
                meta = json.payload;
            }

            logger.log(level, message, meta);

            res.end();
        });
    }
};

export default {
    path: '/api/hubble-logger',
    handler: response,
};
console.log("inside hubble-logger.js - everything is commented out");
