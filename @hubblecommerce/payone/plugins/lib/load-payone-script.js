export const loadScript = ({ namespace }) => {
    return new Promise((resolve, reject) => {
        if (typeof window.Payone === typeof undefined) {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://secure.pay1.de/client-api/js/v1/payone_hosted.js';
            document.getElementsByTagName('head')[0].appendChild(script);

            script.onload = function () {
                resolve('Payone script successfully loaded');
            };

            script.onerror = function () {
                reject('Payone service is currently not available.');
            };
        } else {
            resolve('Payone script already defined');
        }
    });
};
