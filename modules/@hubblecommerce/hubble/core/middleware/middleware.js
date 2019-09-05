import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.hubbleware = function ({ store, params, query }) {

    //console.log("custom middleware by hubble");

};
