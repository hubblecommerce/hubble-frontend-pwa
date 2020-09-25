require('dotenv').config();
const convert = require('xml-js');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const logger = require('@hubblecommerce/hubble/core/utils/logger');

// Set sandboxmode to url
let sandboxMode = '';
if (process.env.AMAZON_PAY_SANDBOX === 'true') {
    sandboxMode = '_Sandbox';
}

const response = function (req, res, next) {
    // Only accept GET requests
    if (req.method !== 'GET') {
        res.end();
    }

    // Aggregate GET parameters
    let url = require('url');
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;

    let now = new Date();

    // Mandatory fields
    let timestamp = now.toISOString();
    let orderReferenceId = query.orderReferenceId;

    // Optional fields
    let paymentAction = 'ConfirmOrderReference';

    // Getting the MerchantID/sellerID, MWS secret Key, MWS Access Key from the configuration file
    if (typeof process.env.AMAZON_PAY_MERCHANT_ID == 'undefined' || process.env.AMAZON_PAY_MERCHANT_ID === '') {
        res.writeHead(401);
        res.end('merchantId not set in the configuration file');
        return;
    }

    if (typeof process.env.AMAZON_PAY_ACCESS_KEY == 'undefined' || process.env.AMAZON_PAY_ACCESS_KEY === '') {
        res.writeHead(401);
        res.end('accessKey not set in the configuration file');
        return;
    }

    if (typeof process.env.AMAZON_PAY_SECRET_KEY == 'undefined' || process.env.AMAZON_PAY_SECRET_KEY === '') {
        res.writeHead(401);
        res.end('secretKey not set in the configuration file');
        return;
    }

    // Do not change order of this object keys because they have to be sorted alphabetically
    let parameters = {};
    parameters.AWSAccessKeyId = process.env.AMAZON_PAY_ACCESS_KEY; // Mandatory
    parameters.Action = paymentAction; // Mandatory
    parameters.AmazonOrderReferenceId = orderReferenceId; // Mandatory
    parameters.SellerId = process.env.AMAZON_PAY_MERCHANT_ID; // Mandatory
    parameters.SignatureMethod = 'HmacSHA256'; // Mandatory
    parameters.SignatureVersion = '2'; // Mandatory
    parameters.Timestamp = timestamp; // Mandatory
    parameters.Version = '2013-01-01'; // Mandatory

    //call the function to sign the parameters and return the URL encoded signature
    //add the signature to the parameters data structure
    parameters.Signature = urlEncode(signParameters(parameters, process.env.AMAZON_PAY_SECRET_KEY));

    // Call Amazon API
    axios({
        method: 'POST',
        url:
            'https://mws-eu.amazonservices.com/OffAmazonPayments' +
            sandboxMode +
            '/2013-01-01?' +
            'AWSAccessKeyId=' +
            parameters.AWSAccessKeyId +
            '&Action=' +
            parameters.Action +
            '&AmazonOrderReferenceId=' +
            parameters.AmazonOrderReferenceId +
            '&SellerId=' +
            parameters.SellerId +
            '&SignatureMethod=' +
            parameters.SignatureMethod +
            '&SignatureVersion=' +
            parameters.SignatureVersion +
            '&Timestamp=' +
            parameters.Timestamp +
            '&Version=' +
            parameters.Version +
            '&Signature=' +
            parameters.Signature,
    })
        .then(response => {
            // Convert XML Response to JSON
            let result = convert.xml2json(response.data, { compact: true, spaces: 4 });
            res.end(result);
        })
        .catch(error => {
            // Write error response to log file
            logger.logger.error('Amazon API Call Error: %s', error.response);

            // Write status from api to response trigger catch of axios call
            res.writeHead(error.response.status);

            // Cast response data to string to prevent nodejs error
            res.end(error.response.data.toString());
        });
};

const signParameters = function (parameters, key) {
    let stringToSign = calculateStringToSignV2(parameters);
    return sign(stringToSign, key);
};

const calculateStringToSignV2 = function (parameters) {
    let data = 'POST';
    data += '\n';
    data += 'mws-eu.amazonservices.com';
    data += '\n';
    data += '/OffAmazonPayments' + sandboxMode + '/2013-01-01';
    data += '\n';
    data += getParametersAsString(parameters);
    return data;
};

const getParametersAsString = function (parameters) {
    let queryParameters = [];
    for (const [key, value] of Object.entries(parameters)) {
        queryParameters.push(key + '=' + urlEncode(value));
    }
    return queryParameters.join('&');
};

const urlEncode = function (val) {
    let encoded = encodeURIComponent(val);
    return encoded.replace(new RegExp('%7E', 'g'), '~');
};

const sign = function (data, key) {
    let hash = CryptoJS.HmacSHA256(data, key);
    return hash.toString(CryptoJS.enc.Base64);
};

module.exports = {
  path: '/api/amazon-confirm-order-reference',
  handler: response,
};
