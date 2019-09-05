//
// axios interceptor plugin
// TODO this plugin is added in nuxt.config.js but its not functional, can we remove this?

export default ({ $axios, store }) => {

  $axios.defaults.baseURL = store.state.apiBaseUrl;

  if (process.server) {
    return
  }

  $axios.interceptors.request.use(request => {
    request.baseURL = store.state.apiBaseUrl;

    // Get token from auth.js store
    const token = store.getters.getApiToken;

    console.log("axios interceptor - token: %o", token);

    // Update token axios header
    if (token) {
      request.headers.common['Authorization'] = `Bearer ${token}`
      console.log("axios interceptor - headers: %o", request.headers);
    }

    return request
  })
}
