export const loadScript = ({ namespace, sandbox }) => {
    return new Promise((resolve, reject) => {
        // Set sandboxmode to url
        let sandboxMode = '';
        if (sandbox) {
            sandboxMode = '/sandbox';
        }

        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://static-eu.payments-amazon.com/OffAmazonPayments/eur' + sandboxMode + '/lpa/js/Widgets.js';
        document.getElementsByTagName('head')[0].appendChild(script);

        script.onload = function () {
            resolve('Amazon script successfully loaded');
        };

        script.onerror = function () {
            reject('Amazon service is currently not available.');
        };
    });
};
