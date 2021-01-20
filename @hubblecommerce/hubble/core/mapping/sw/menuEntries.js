import _ from 'lodash';

function menuEntriesMapping (payload){
    let obj = {};

    // SW Shop API
    //obj.parentId = category.parentId;
    //obj.name = category.name;
    //obj.level = category.level;
    //obj.active = category.active;
    //obj.id = category._uniqueIdentifier;
    //
    //// Set url
    //obj.url_path = false;
    //if(!_.isEmpty(category.seoUrls)) {
    //    obj.url_path = category.seoUrls[0].seoPathInfo.toLowerCase();
    //}
    //if(category.type === 'folder') {
    //    obj.url_path = false;
    //}
    //

    obj.name = payload.name;
    obj.level = payload.level;
    obj.id = payload.name;

    if (payload.route.path === '/') {
        obj.request_path = false;
    } else {
        obj.request_path = payload.route.path;
    }
    return obj;
}

export {menuEntriesMapping}