import {sortMenuEntries} from "@hubblecommerce/hubble/core/utils/menuHelper";
import {datetimeUnixNow, datetimeUnixNowAddSecs} from "@hubblecommerce/hubble/core/utils/datetime";

export default function (ctx) {

    const modApiMenu = {
        namespaced: true,
        state: () => ({
            dataMenu: {},
            dataMenuCacheable: true,
        }),
        mutations: {
            clearDataMenu: (state) => {
                state.dataMenu = {};
            },
            setDataMenu: (state, payload) => {

                // Set menu data from payload
                state.dataMenu = payload.data;

                // local copy of menu items before resetting object for mapping
                state.menuItems = payload.data.result.items;

                // Override menu with menu structure from config
                if(process.env.menu) {
                    let map = process.env.menu;

                    // Clear menu structure of api get to set structure of mapping
                    state.dataMenu.result.items = [];

                    _.forEach(map, (val, key) => {

                        // Use menu item from api result by category id when it is set in config
                        if(val.id !== null) {
                            // Get menu item from payload by id
                            _.forEach(state.menuItems, (v, k) =>  {
                                if(v.id === val.id) {
                                    state.dataMenu.result.items[key] = v;
                                    state.dataMenu.result.items[key].name = val.name;
                                }
                            });
                        }

                        // Build menu from virtual entries without id or real category
                        if(typeof val.id === "undefined") {

                            // configure store as source for child elements
                            let childFromConfig = [];
                            if(typeof val.childrenStore !== "undefined") {
                                childFromConfig = state[val.childrenStore];
                            }
                            // Set virtual menu items through config
                            state.dataMenu.result.items[key] = {
                                id: 'virtual'+key,
                                name: val.name,
                                url_path: val.url_path,
                                children: childFromConfig
                            }
                        }

                        // Add custom children to category if set
                        _.forEach(val.children, (child) => {
                            state.dataMenu.result.items[key].children.push(child);
                        });

                        // Sort menu entry and children of entry alphabetically if flag is set
                        if(val.sortAlphabetically && !_.isEmpty(state.dataMenu.result.items[key].children)) {
                            state.dataMenu.result.items[key].children = sortMenuEntries(state.dataMenu.result.items[key].children);
                        }
                    });
                }

                state.dataMenu.locale = state.apiLocale;

                if(state.dataMenuCacheable) {
                    let _ttl = state.dataMenuCacheableTTL || state.cacheTTL;

                    state.dataMenu.created_at_unixtime = datetimeUnixNow();
                    state.dataMenu.expires_at_unixtime = datetimeUnixNowAddSecs(_ttl);

                    // state.dataMenu.created_at_datetime = moment.unix(state.dataMenu.created_at_unixtime).format('YYYY-MM-DDTHH:mm:ss');
                    // state.dataMenu.expires_at_datetime = moment.unix(state.dataMenu.expires_at_unixtime).format('YYYY-MM-DDTHH:mm:ss');
                }
            },
        },
        getters:  {
            getDataMenu: state => {
                return state.dataMenu;
            },
            getDataMenuItems: state => {
                return state.dataMenu.items ? state.dataMenu.items : null;
            },
            getDataMenuStats: state => {
                return state.dataMenu.stats ? state.dataMenu.stats : null;
            },

        },
        actions: {
            async apiGetMenu({commit, state, dispatch}, payload) {
                // console.log("store apiGetMenu called! payload: %o", payload);

                return new Promise(function(resolve, reject) {

                    let _endpoint = '/api/json/menu/children';

                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'api',
                        apiType: 'data',
                        endpoint: _endpoint,
                        params: {
                            _size: 30
                        }
                    }, { root: true })
                    .then(response => {

                        commit('setDataMenu', {
                            data: response.data
                        });

                        resolve('OK');
                    })
                    .catch(response => {
                        console.log("API get request failed: %o", response);

                        reject('API request failed!');
                    });

                });
            },

        }
    };

    ctx.store.registerModule('modApiMenu', modApiMenu);
}
