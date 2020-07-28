import Middleware from './middleware'
import _ from 'lodash';

Middleware.trackClickPath = function ({ store, route }) {
    // Set page type to cms if route is known (CMS Page) or dynamic and keep record from api (Category, Product, ...)
    if(route.path === route.matched[0].path || route.path === '/') {
        // Set page type to cms
        store.commit('modApiResources/setPageType', null);
    }

    // Get page type and init clickPath
    let pageType = store.state.modApiResources.pageType;
    let categoryPath = [];
    let clickPath = {
        "pageType": pageType,
        "categoryPath": {}
    };

    // If current page is type of category, set category path info to clickPath
    if(pageType === 'category') {
        // Get category info => category path
        let category = store.state.modApiCategory.dataCategory;

        // Extract necessary info for display breadcrumbs
        if( !_.isEmpty(category)) {
            let pathIds = category.result.item.path_ids;
            let pathNames = category.result.item.path_names;
            let pathUrls = category.result.item.path_urls;

            pathIds.forEach((val, key) => {
                categoryPath.push({
                    id: pathIds[key],
                    name: pathNames[key],
                    url: pathUrls[key],
                });
            });

            clickPath['categoryPath'] = categoryPath;
        }
    }

    // If current page is a search result page
    if(route.path === '/search/catalogsearch') {

        clickPath.pageType = 'search';

        categoryPath.push({
            id: '/search/catalogsearch',
            name: route.query.term,
            url: route.fullPath,
        });

        clickPath['categoryPath'] = categoryPath;
    }

    store.commit('modClickPath/appendToClickPath', clickPath);
};
