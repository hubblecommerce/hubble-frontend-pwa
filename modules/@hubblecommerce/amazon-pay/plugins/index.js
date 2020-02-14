// plugins/index.js
import * as helpers from './lib/index.js'
// get the options out using lodash templates
const options = JSON.parse(`<%= JSON.stringify(options) %>`);
// extract the namespace from the options
const { namespace, sandbox } = options;
// create the plugin
export default ({ store }, inject) => {
    // get a reference to the vuex store's state
    const { state } = store;
    // inject an object of functions into the app
    inject(namespace, {
        loadAmazonScript() {
            return helpers.loadScript({ state, namespace, sandbox })
        }
    })
}
