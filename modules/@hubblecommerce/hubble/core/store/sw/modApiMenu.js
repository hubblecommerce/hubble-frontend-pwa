import {sortMenuEntries, unflatten} from "@hubblecommerce/hubble/core/utils/menuHelper";
import {datetimeUnixNow, datetimeUnixNowAddSecs} from "@hubblecommerce/hubble/core/utils/datetime";
import {swMapApiError} from "@hubblecommerce/hubble/core/utils/swHelper";

export default function (ctx) {
    const modApiMenu = {
        namespaced: true,
        state: () => ({
            cacheTTL: 300,
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

                // Set Navigation structure from .env if isset
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
                    state.dataMenu.created_at_unixtime = datetimeUnixNow();
                    state.dataMenu.expires_at_unixtime = datetimeUnixNowAddSecs(state.cacheTTL);
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
            async getMenu({commit, state, dispatch}, payload) {
                return new Promise(function(resolve, reject) {
                    dispatch('apiCall', {
                        action: 'get',
                        tokenType: 'sw',
                        apiType: 'data',
                        endpoint: '/sales-channel-api/v1/category?limit=500&associations[seoUrls][]'
                    }, { root: true })
                        .then(response => {
                            dispatch('mappingMenu', response.data.data).then((res) => {
                                commit('setDataMenu', res);
                            });

                            resolve(response);
                        })
                        .catch(error => {
                            swMapApiError(error, reject);
                        });
                });
            },
            async mappingMenu({commit, state, dispatch}, payload) {
                return new Promise(function(resolve, reject) {
                    let mapped = payload.map((category) => {
                        let obj = {};

                        // Add 0 as value for parentId to root categories to make unflatten function work
                        if(category.parentId === null) {
                            category.parentId = 0;
                        }

                        // Map required properties from sw response to hubble requirements
                        obj.parentId = category.parentId;
                        obj.name = category.name;

                        if(!_.isEmpty(category.seoUrls)) {
                            obj.url_path = category.seoUrls[0].seoPathInfo;
                        } else {
                            obj.url_path = '/';
                        }

                        obj.level = category.level;
                        obj.active = category.is_active;
                        obj.id = category._uniqueIdentifier;

                        return obj;
                    });

                    // Build required parent child relations from flat array
                    resolve( {
                        data: {
                            result: {
                                items: unflatten(mapped)
                            }
                        }
                    });
                });
            },
        }
    };

    ctx.store.registerModule('modApiMenu', modApiMenu);
}
