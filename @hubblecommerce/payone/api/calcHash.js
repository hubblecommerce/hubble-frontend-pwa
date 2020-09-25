require('dotenv').config();
import { logger } from '@hubblecommerce/hubble/core/utils/logger';
import md5 from 'js-md5';

const response = function (req, res, next) {
    // Only accept GET requests
    if (req.method !== 'GET') {
        res.end();
    }

    // Aggregate GET parameters
    let url = require('url');
    let url_parts = url.parse(req.url, true);
    let requestData = url_parts.query;
    let key = process.env.PAYONE_KEY;

    buildSortedRequestString(requestData, key)
        .then(sortedRequestString => {
            // Hash the sorted string
            hashString(sortedRequestString).then(response => {
                // Set hash to request data
                requestData.hash = response;

                // IMPORTANT Remove secret key from request data because its only needed to calculate hash and not needed in request to payone
                delete requestData.key;

                res.end(JSON.stringify(requestData));
            });
        })
        .catch(response => {
            logger.error('Could not build sorted request string, check your parameters ' + response);
            res.writeHead(400);
            res.end('Could not build sorted request string, check your parameters ' + response);
            return;
        });
};

const buildSortedRequestString = function (requestData, key) {
    return new Promise((resolve, reject) => {
        if (!('aid' in requestData)) {
            reject('aid is not set');
        }

        if (!('amount' in requestData)) {
            reject('amount is not set');
        }

        if (!('clearingtype' in requestData)) {
            reject('clearingtype is not set');
        }

        if (!('currency' in requestData)) {
            reject('currency is not set');
        }

        if (!('mid' in requestData)) {
            reject('mid is not set');
        }

        if (!('mode' in requestData)) {
            reject('mode is not set');
        }

        if (!('portalid' in requestData)) {
            reject('portalid is not set');
        }

        if (!('reference' in requestData)) {
            reject('reference is not set');
        }

        if (!('request' in requestData)) {
            reject('request is not set');
        }

        if (key === null) {
            reject('key is not set');
        }

        // Only use parameters if on this List:
        // https://docs.payone.com/display/public/PLATFORM/CA+-+Calculation+of+the+HASH+value
        let sortedRequestString =
            requestData.aid +
            requestData.amount +
            requestData.clearingtype +
            requestData.currency +
            requestData.mid +
            requestData.mode +
            requestData.portalid +
            requestData.reference +
            requestData.request +
            key;

        resolve(sortedRequestString);
    });
};

const hashString = function (string) {
    return new Promise(resolve => {
        resolve(md5(string));
    });
};

export default {
    path: '/api/calc-hash',
    handler: response,
};
