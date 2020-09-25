const swMapApiError = function (errorObj, reject) {
    if (errorObj.errors != null) {
        reject({
            statusCode: parseInt(errorObj.errors[0].status),
            message: errorObj.errors[0].detail,
        });
    }

    // If throws error but errors array is not set, the server is probably down or busy
    reject({
        statusCode: 503,
        message: "The server is too busy or because there's maintenance being performed on it.",
    });
};

export { swMapApiError };
