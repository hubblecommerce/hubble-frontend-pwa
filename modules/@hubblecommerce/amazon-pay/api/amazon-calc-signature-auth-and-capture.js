require('dotenv').config();
const CryptoJS = require("crypto-js");

const response = function(req, res, next) {
    // Only accept GET requests
    if (req.method !== 'GET') {
        res.end();
    }

    // Aggregate GET parameters
    let url = require('url');
    let url_parts = url.parse(req.url, true);
    let query = url_parts.query;

    // Mandatory fields
    let amount = query.amount;

    // Optional fields
    let currencyCode = query.currencyCode;
    let sellerNote = query.sellerNote;
    let sellerOrderId = query.sellerOrderId;
    let shippingAddressRequired = "true";
    let paymentAction = "AuthorizeAndCapture";

    // Getting the MerchantID/sellerID, MWS secret Key, MWS Access Key from the configuration file
    if(typeof process.env.AMAZON_PAY_MERCHANT_ID == "undefined" || process.env.AMAZON_PAY_MERCHANT_ID === "") {
        res.writeHead(401);
        res.end('merchantId not set in the configuration file');
        return;
    }

    if(typeof process.env.AMAZON_PAY_ACCESS_KEY == "undefined" || process.env.AMAZON_PAY_ACCESS_KEY === "") {
        res.writeHead(401);
        res.end('accessKey not set in the configuration file');
        return;
    }

    if(typeof process.env.AMAZON_PAY_SECRET_KEY == "undefined" || process.env.AMAZON_PAY_SECRET_KEY === "") {
        res.writeHead(401);
        res.end('secretKey not set in the configuration file');
        return;
    }

    if(typeof process.env.LOGIN_WITH_AMAZON_CLIENT_ID == "undefined" || process.env.LOGIN_WITH_AMAZON_CLIENT_ID === "") {
        res.writeHead(401);
        res.end('Login With Amazon ClientID is not set in the configuration file');
        return;
    }

    if(typeof process.env.AMAZON_PAY_RETURN_URL == "undefined" || process.env.AMAZON_PAY_RETURN_URL === "") {
        res.writeHead(401);
        res.end('Return URL is not set in the configuration file');
        return;
    }

    if(typeof process.env.AMAZON_PAY_CANCEL_RETURN_URL == "undefined" || process.env.AMAZON_PAY_CANCEL_RETURN_URL === "") {
        res.writeHead(401);
        res.end('Cancel Return URL is not set in the configuration file');
        return;
    }

    // Do not change order of this object keys because they have to be sorted alphabetically
    let parameters = {};
    parameters.accessKey = process.env.AMAZON_PAY_ACCESS_KEY; // Mandatory
    parameters.amount = amount; // Mandatory
    parameters.cancelReturnURL = process.env.AMAZON_PAY_CANCEL_RETURN_URL;
    //parameters.currencyCode = currencyCode; // Optional only include this parameter if not default
    parameters.lwaClientId = process.env.LOGIN_WITH_AMAZON_CLIENT_ID; // Mandatory
    parameters.paymentAction = paymentAction;
    parameters.returnURL = process.env.AMAZON_PAY_RETURN_URL; // Mandatory
    parameters.sellerId = process.env.AMAZON_PAY_MERCHANT_ID; // Mandatory
    parameters.sellerNote = sellerNote; // Optional only include this parameter if not default
    parameters.sellerOrderId = sellerOrderId; // Optional only include this parameter if not default
    parameters.shippingAddressRequired = shippingAddressRequired; // Optional only include this parameter if not default

    //call the function to sign the parameters and return the URL encoded signature
    //add the signature to the parameters data structure
    parameters.signature = urlEncode(signParameters(parameters, process.env.AMAZON_PAY_SECRET_KEY));

    //response send the parameters will be picked up by the ajax success function in the front end
    res.end(JSON.stringify(parameters));
};

const signParameters = function(parameters, key) {
    let stringToSign = calculateStringToSignV2(parameters);
    return sign(stringToSign, key);
};

const calculateStringToSignV2 = function(parameters) {
    let data = 'POST';
    data += "\n";
    data += "payments.amazon.com";
    data += "\n";
    data += "/";
    data += "\n";
    data += getParametersAsString(parameters);
    return data;
};

const getParametersAsString = function(parameters) {
    let queryParameters = [];
    for(const [key, value] of Object.entries(parameters)) {
        queryParameters.push(key + '=' + urlEncode(value))
    }
    return queryParameters.join('&');
};

const urlEncode = function(val) {
    let encoded = encodeURIComponent(val);
    return encoded.replace(new RegExp('%7E', 'g'), '~');
};

const sign = function(data, key) {
    let hash = CryptoJS.HmacSHA256(data, key);
    return hash.toString(CryptoJS.enc.Base64);
};

export default {
    path: '/api/amazon-calc-signature-auth-and-capture',
    handler: response
}
