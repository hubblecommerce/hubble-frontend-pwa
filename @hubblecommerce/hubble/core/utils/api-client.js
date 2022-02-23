'use strict';

import axios from 'axios';

class ApiClient {
    constructor(config) {
        this.apiBaseUrl = config.apiBaseUrl;
        this.apiType = config.apiType;
        this.apiSwAccessKey = config.apiSwAccessKey;
    }

    /**
     * @apiCall
     *
     * @param {Object} payload
     * @param payload.action Axios method e.g. 'get', 'post', 'patch', 'delete'
     * @param payload.endpoint Endpoint of api e.g '/api/login'
     * @param payload.contextToken Token that identifies call with a session
     * @param payload.params Parameters for a GET request
     * @param payload.data Data for a POST/PATCH request
     *
     * returns {Promise}
     */
    async apiCall(payload) {
        // Set data if data isset
        let payloadData = {};
        if (payload.data != null) {
            payloadData = payload.data;
        }

        // Set data if data isset
        let payloadParams = {};
        if (payload.params != null) {
            payloadParams = payload.params;
        }

        // Reset params if action is post
        if (payload.action === 'post' || payload.action === 'patch') {
            payloadParams = '';
        }

        // Set custom headers depending on api type including authToken
        let _headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        // Set optional headers
        if (payload.headers != null) {
            payload.headers.forEach((header) => {
                Object.assign(_headers, header);
            });
        }

        if (this.apiType === 'sw') {
            Object.assign(_headers, { 'sw-access-key': this.apiSwAccessKey });

            if (payload.contextToken != null) {
                Object.assign(_headers, { 'sw-context-token': payload.contextToken });
            }
        }

        try {
            return await axios({
                method: payload.action,
                url: [this.apiBaseUrl, payload.endpoint.trim()].join('/'),
                headers: _headers,
                params: payloadParams, // GET params
                data: payloadData, // POST data
            });
        } catch (error) {
            let rejection = error;

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx

                // reject errors
                if (error.response.data.errors != null) {
                    rejection = error.response.data.errors[0];
                } else {
                    rejection = error.response;
                }
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js

                if (this.apiType === 'sw') {
                    rejection = 'No network connection';
                } else {
                    rejection = error.request;
                }
            } else {
                // Something happened in setting up the request that triggered an Error
                rejection = error.message;
            }

            throw rejection;
        }
    }
}

export default ApiClient;
